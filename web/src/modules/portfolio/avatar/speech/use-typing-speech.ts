"use client"

import { useCallback, useSyncExternalStore } from "react"
import {
  getTypingSpeechSnapshot,
  skipTypingSpeech,
  startTypingSpeech,
  stopTypingSpeech,
  subscribeTypingSpeech,
} from "./typing-speech-state"

export interface UseTypingSpeechResult {

  typingMessageId: number | null
  isTyping: boolean
  startTypingSpeech: (messageId: number, text: string) => void
  stopTypingSpeech: () => void
  skipTypingSpeech: () => void
}

function getServerSnapshot() {
  return getTypingSpeechSnapshot()
}

export function useTypingSpeech(): UseTypingSpeechResult {
  const snapshot = useSyncExternalStore(subscribeTypingSpeech, getTypingSpeechSnapshot, getServerSnapshot)

  const start = useCallback((messageId: number, text: string) => {
    startTypingSpeech(messageId, text)
  }, [])

  const stop = useCallback(() => {
    stopTypingSpeech()
  }, [])

  const skip = useCallback(() => {
    skipTypingSpeech()
  }, [])

  return {
    typingMessageId: snapshot.isTyping ? snapshot.messageId : null,
    isTyping: snapshot.isTyping,
    startTypingSpeech: start,
    stopTypingSpeech: stop,
    skipTypingSpeech: skip,
  }
}
