import { getAudioGraph } from "./audio-graph"
import { onAudioUnlockGesture } from "./audio-unlock"
import { startLipSyncAnalyser, stopLipSyncAnalyser } from "./lip-sync-analyser"

export type SpeechPlaybackState = "idle" | "preparing" | "playing"

export interface SpeechPlayerSnapshot {
  state: SpeechPlaybackState
  /** Has a real user gesture unlocked the shared `<audio>` element THIS page load. Never persisted - see module doc comment. */
  unlocked: boolean
}

type Listener = (snapshot: SpeechPlayerSnapshot) => void

// Fade the gain down before pausing on `stop()` instead of a hard cut, so
// the lip-sync analyser (downstream of gain, see `audio-graph.ts`) reads a
// decaying signal and the mouth eases shut over this window rather than
// snapping open->closed on the exact interrupt frame.
const FADE_OUT_SECONDS = 0.12

let playbackState: SpeechPlaybackState = "idle"
// Per-page-load only - deliberately never read from or written to
// localStorage. A stale "unlocked" flag from a previous load is meaningless:
// the `<audio>` element itself isn't unlocked again until a fresh gesture
// happens on THIS load, iOS's autoplay policy is tied to the page's
// lifetime, not to anything durable.
let unlocked = false
let initialized = false
const listeners = new Set<Listener>()

// Guards against `stop()`'s deferred pause landing after a *subsequent*
// `play()` has already started a new sound - without this, interrupting
// and immediately re-speaking within the ~120ms fade window would have the
// stale timeout pause the new playback out from under it.
// Uses the bare (not `window.`-prefixed) `setTimeout`/`clearTimeout` so its
// type stays self-consistent regardless of which global declaration (DOM's
// vs `@types/node`'s) this project's ambient types happen to resolve to -
// same convention `engine/avatar-engine.ts`'s `resizeTimeout` already uses.
let fadeTimeoutId: ReturnType<typeof setTimeout> | null = null

function clearPendingFade(): void {
  if (fadeTimeoutId !== null) {
    clearTimeout(fadeTimeoutId)
    fadeTimeoutId = null
  }
}

function snapshot(): SpeechPlayerSnapshot {
  return { state: playbackState, unlocked }
}

function emit(): void {
  const current = snapshot()
  listeners.forEach((listener) => listener(current))
}

function setPlaybackState(next: SpeechPlaybackState): void {
  if (playbackState === next) return
  playbackState = next
  emit()
}

/** `use-speech-player.ts` is the only intended subscriber, but this stays a plain pub/sub in case a second consumer ever needs it. */
export function subscribeSpeechPlayer(listener: Listener): () => void {
  listeners.add(listener)
  listener(snapshot())
  return () => {
    listeners.delete(listener)
  }
}

export function getSpeechPlayerSnapshot(): SpeechPlayerSnapshot {
  return snapshot()
}

function handleUnlockGesture(): void {
  unlocked = true
  emit()

  const { audioElement, audioContext } = getAudioGraph()

  if (audioContext.state === "suspended") {
    void audioContext.resume().catch(() => {
      // Best-effort - a later real `play()` call will try resuming again anyway.
    })
  }

  // Throwaway unlock play: on iOS, an element must be `.play()`'d from
  // within a real user gesture at least once per page load before a later
  // programmatic `src` swap + `.play()` (from `play()` below, arriving
  // asynchronously once `/api/tts` responds, well outside any gesture) is
  // allowed to actually produce sound.
  const playResult = audioElement.play()
  if (playResult && typeof playResult.then === "function") {
    playResult
      .then(() => {
        audioElement.pause()
        audioElement.currentTime = 0
      })
      .catch(() => {
        // Rejecting here (e.g. no `src` yet) is expected and harmless - the
        // gesture itself is what iOS's unlock policy cares about, not this
        // particular call resolving.
      })
  }
}

/**
 * Wires the shared `<audio>` element's lifecycle events once. Safe to call
 * repeatedly - only the first call does anything. Called both from
 * `use-speech-player.ts`'s mount effect (so the unlock listeners are
 * attached "as soon as the audio module initializes", per this phase's
 * plan) and defensively from `play()`.
 */
export function initSpeechPlayer(): void {
  if (initialized) return
  initialized = true

  const { audioElement } = getAudioGraph()

  audioElement.addEventListener("playing", () => {
    setPlaybackState("playing")
    startLipSyncAnalyser()
  })

  const handleStopped = () => {
    stopLipSyncAnalyser()
    setPlaybackState("idle")
  }

  audioElement.addEventListener("pause", handleStopped)
  audioElement.addEventListener("ended", handleStopped)
  audioElement.addEventListener("error", handleStopped)
  audioElement.addEventListener("abort", handleStopped)

  onAudioUnlockGesture(handleUnlockGesture)
}

/**
 * Starts playing `url` through the shared element. Does not check
 * `unlocked` itself - `use-speech-player.ts`'s `speak()` is the gate that
 * decides whether calling this at all makes sense (voice preference off, or
 * no gesture yet this load); this stays a plain mechanical "play this url"
 * primitive so it behaves predictably no matter who calls it.
 */
export function play(url: string): void {
  initSpeechPlayer()
  clearPendingFade()
  const { audioElement, audioContext, gainNode } = getAudioGraph()

  if (audioContext.state === "suspended") {
    void audioContext.resume().catch(() => {})
  }

  gainNode.gain.cancelScheduledValues(audioContext.currentTime)
  gainNode.gain.setValueAtTime(1, audioContext.currentTime)

  setPlaybackState("preparing")

  audioElement.src = url
  audioElement.load()

  const playResult = audioElement.play()
  if (playResult && typeof playResult.catch === "function") {
    playResult.catch((error) => {
      console.error("[avatar] speech playback failed:", error)
      stopLipSyncAnalyser()
      setPlaybackState("idle")
    })
  }
}

/**
 * Stops whatever's currently playing (or preparing). A safe no-op when
 * nothing is active - callers (panel close, a new message arriving) call
 * this unconditionally, so it must never throw or do anything observable
 * when there's nothing to stop.
 */
export function stop(): void {
  if (playbackState === "idle") return

  clearPendingFade()
  const { audioElement, audioContext, gainNode } = getAudioGraph()

  const now = audioContext.currentTime
  gainNode.gain.cancelScheduledValues(now)
  gainNode.gain.setValueAtTime(gainNode.gain.value, now)
  gainNode.gain.linearRampToValueAtTime(0, now + FADE_OUT_SECONDS)

  fadeTimeoutId = setTimeout(() => {
    fadeTimeoutId = null
    audioElement.pause()
    audioElement.currentTime = 0
    gainNode.gain.cancelScheduledValues(audioContext.currentTime)
    gainNode.gain.setValueAtTime(1, audioContext.currentTime)
  }, FADE_OUT_SECONDS * 1000)

  // The analyser keeps riding the fade for these last ~120ms (so the mouth
  // eases shut instead of snapping) - `audioElement`'s own "pause" listener
  // (wired in `initSpeechPlayer`) stops it once the timeout above fires.
  setPlaybackState("idle")
}
