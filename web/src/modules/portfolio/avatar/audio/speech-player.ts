import { getAudioGraph } from "./audio-graph"
import { onAudioUnlockGesture } from "./audio-unlock"
import { startLipSyncAnalyser, stopLipSyncAnalyser } from "./lip-sync-analyser"

export type SpeechPlaybackState = "idle" | "preparing" | "playing"

export interface SpeechPlayerSnapshot {
  state: SpeechPlaybackState

  unlocked: boolean
}

type Listener = (snapshot: SpeechPlayerSnapshot) => void

const FADE_OUT_SECONDS = 0.12

let playbackState: SpeechPlaybackState = "idle"

let unlocked = false
let initialized = false
const listeners = new Set<Listener>()

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

    })
  }

  const playResult = audioElement.play()
  if (playResult && typeof playResult.then === "function") {
    playResult
      .then(() => {
        audioElement.pause()
        audioElement.currentTime = 0
      })
      .catch(() => {

      })
  }
}

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

  setPlaybackState("idle")
}
