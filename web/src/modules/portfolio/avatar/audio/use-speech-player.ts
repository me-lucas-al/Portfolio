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

  }
}

export interface UseSpeechPlayerResult {

  voiceEnabled: boolean
  setVoiceEnabled: (value: boolean) => void
  isSpeaking: boolean

  isPreparingVoice: boolean

  needsUnlock: boolean
  speak: (url: string) => void
  stopSpeaking: () => void
}

export function useSpeechPlayer(): UseSpeechPlayerResult {
  const [voiceEnabled, setVoiceEnabledState] = useState(DEFAULT_VOICE_ENABLED)
  const [snapshot, setSnapshot] = useState<SpeechPlayerSnapshot>(getSpeechPlayerSnapshot)

  useEffect(() => {
    setVoiceEnabledState(loadVoiceEnabled())

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
