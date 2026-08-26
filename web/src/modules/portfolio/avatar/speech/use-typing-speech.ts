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
  /** The message currently being typed out, or `null` if none. */
  typingMessageId: number | null
  isTyping: boolean
  startTypingSpeech: (messageId: number, text: string) => void
  stopTypingSpeech: () => void
  skipTypingSpeech: () => void
}

function getServerSnapshot() {
  return getTypingSpeechSnapshot()
}

/** React binding over `typing-speech-state.ts`'s module-scope store - see that file's doc comment for why it isn't plain `useState`. */
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
