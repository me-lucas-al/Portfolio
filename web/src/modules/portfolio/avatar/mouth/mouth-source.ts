import { setMouthOpen } from "../state/avatar-signal-bus"

/**
 * Arbitrates which of the two things that can want to move the avatar's
 * mouth actually gets to right now: the typing engine's synthetic tick
 * (`../speech/typing-engine.ts`), or real TTS audio amplitude
 * (`../audio/lip-sync-analyser.ts`). `AvatarSprite` only ever reads the
 * resulting `mouthOpen` value off the signal bus - it has no idea which
 * source produced it, exactly like the old `viseme-layer.ts` didn't either.
 *
 * `audio` always wins over `typing`: today the two are mutually exclusive in
 * practice (TTS is dormant, see `../README.md`), but this rule is what lets
 * TTS be re-enabled per-message later without touching this file, the
 * signal bus, or `AvatarSprite` at all - just call `activateMouthSource("audio")`
 * around playback, same as `lip-sync-analyser.ts` already does.
 */
export type MouthSourceName = "typing" | "audio"

const PRIORITY: Record<MouthSourceName, number> = {
  typing: 0,
  audio: 1,
}

let activeSource: MouthSourceName | null = null

export function activateMouthSource(name: MouthSourceName): void {
  if (activeSource !== null && PRIORITY[activeSource] > PRIORITY[name]) return
  activeSource = name
}

/** No-ops if `name` isn't the currently active source. Forces `mouthOpen` to `0` if it was. */
export function deactivateMouthSource(name: MouthSourceName): void {
  if (activeSource !== name) return
  activeSource = null
  setMouthOpen(0)
}

/** Writes from an inactive source are silently discarded. */
export function writeMouthOpen(name: MouthSourceName, value: number): void {
  if (activeSource !== name) return
  setMouthOpen(value)
}

export function getActiveMouthSource(): MouthSourceName | null {
  return activeSource
}
