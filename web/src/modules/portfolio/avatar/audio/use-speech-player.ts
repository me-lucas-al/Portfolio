"use client"

import { useCallback, useEffect, useState } from "react"
import {
  getSpeechPlayerSnapshot,
  initSpeechPlayer,
  play,
  stop,
  subscribeSpeechPlayer,
  type SpeechPlayerSnapshot,
} from "./speech-player"

const VOICE_ENABLED_STORAGE_KEY = "assistant_voice_enabled"

// Opt-in, matches this project's "starts muted" decision elsewhere (the
// mini-dock's own CTA bubble is similarly dismissible/off by default).
const DEFAULT_VOICE_ENABLED = false

function loadVoiceEnabled(): boolean {
  try {
    return window.localStorage.getItem(VOICE_ENABLED_STORAGE_KEY) === "1"
  } catch {
    return DEFAULT_VOICE_ENABLED
  }
}

function persistVoiceEnabled(value: boolean): void {
  try {
    if (value) window.localStorage.setItem(VOICE_ENABLED_STORAGE_KEY, "1")
    else window.localStorage.removeItem(VOICE_ENABLED_STORAGE_KEY)
  } catch {
    // localStorage unavailable (private browsing, quota) - the toggle just won't stick across visits
  }
}

export interface UseSpeechPlayerResult {
  /** User preference, persisted in localStorage - independent of the per-page-load `unlocked` gesture flag. */
  voiceEnabled: boolean
  setVoiceEnabled: (value: boolean) => void
  isSpeaking: boolean
  /** True from `speak()` until the `<audio>` element actually fires `playing` (or errors/aborts) - covers `/api/tts`'s tens-of-seconds unary synthesis wait. */
  isPreparingVoice: boolean
  /** Voice is on but no user gesture has unlocked the audio element yet this load - `speak()` no-ops in this state; surface a "tap to enable" affordance. */
  needsUnlock: boolean
  speak: (url: string) => void
  stopSpeaking: () => void
}

/**
 * The React binding a component actually uses. Renders no UI itself - just
 * exposes the voice on/off preference plus the current playback state,
 * backed by `speech-player.ts`'s module-scope singleton.
 */
export function useSpeechPlayer(): UseSpeechPlayerResult {
  const [voiceEnabled, setVoiceEnabledState] = useState(DEFAULT_VOICE_ENABLED)
  const [snapshot, setSnapshot] = useState<SpeechPlayerSnapshot>(getSpeechPlayerSnapshot)

  useEffect(() => {
    setVoiceEnabledState(loadVoiceEnabled())
    // Attaches the iOS-unlock gesture listeners "as soon as the audio
    // module initializes" (this mount), well before any `speak()` call.
    initSpeechPlayer()
    return subscribeSpeechPlayer(setSnapshot)
  }, [])

  const setVoiceEnabled = useCallback((value: boolean) => {
    setVoiceEnabledState(value)
    persistVoiceEnabled(value)
    if (!value) stop()
  }, [])

  const speak = useCallback(
    (url: string) => {
      if (!voiceEnabled || !snapshot.unlocked) return
      play(url)
    },
    [voiceEnabled, snapshot.unlocked]
  )

  const stopSpeaking = useCallback(() => {
    stop()
  }, [])

  return {
    voiceEnabled,
    setVoiceEnabled,
    isSpeaking: snapshot.state === "playing",
    isPreparingVoice: snapshot.state === "preparing",
    needsUnlock: voiceEnabled && !snapshot.unlocked,
    speak,
    stopSpeaking,
  }
}
