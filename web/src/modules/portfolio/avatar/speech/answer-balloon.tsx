"use client"

import { useSyncExternalStore } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { getAvatarSignalSnapshot, subscribeAvatarSignal } from "../state/avatar-signal-bus"
import { TypedText } from "./typed-text"
import { getTypingSpeechSnapshot, skipTypingSpeech, subscribeTypingSpeech } from "./typing-speech-state"

function getServerAvatarSnapshot() {
  return getAvatarSignalSnapshot()
}

function getServerTypingSnapshot() {
  return getTypingSpeechSnapshot()
}

interface AnswerBalloonProps {
  skipLabel: string
  thinkingLabel: string
}

/**
 * Persistent "answer" text for the assistant dialogue bar's open state
 * (mounted by `../../assistant/assistant-stage.tsx`). Unlike
 * `speech-balloon.tsx` (`fixed`-positioned, its own bubble chrome, auto-hides
 * ~6s after typing ends, visible only while the bar is closed) this one is a
 * normal block sitting directly on the dialogue bar's own surface - no
 * nested bubble - and keeps showing the last answer until the next question
 * replaces it - `stopTypingSpeech()` (called from `assistant-widget.tsx`'s
 * `onBeforeSend`) clears `fullText` right as a new question goes out.
 */
export function AnswerBalloon({ skipLabel, thinkingLabel }: AnswerBalloonProps) {
  const avatarSignal = useSyncExternalStore(subscribeAvatarSignal, getAvatarSignalSnapshot, getServerAvatarSnapshot)
  const typingSnapshot = useSyncExternalStore(subscribeTypingSpeech, getTypingSpeechSnapshot, getServerTypingSnapshot)

  // Only while there's nothing typed/typing yet - once `fullText` lands, the
  // reveal itself is enough feedback, no need for a separate "thinking" state.
  const isThinking = avatarSignal.thinking && !typingSnapshot.fullText
  if (isThinking) {
    return (
      <div role="status" aria-live="polite" className="flex w-full flex-col gap-2">
        <span className="sr-only">{thinkingLabel}</span>
        <Skeleton className="h-3 w-32 bg-surface-2" />
        <Skeleton className="h-3 w-48 bg-surface-2" />
      </div>
    )
  }

  if (!typingSnapshot.fullText) return null

  return (
    <button
      type="button"
      onClick={skipTypingSpeech}
      aria-label={skipLabel}
      title={skipLabel}
      aria-live="polite"
      className="w-full text-left text-sm leading-relaxed text-fg transition-opacity hover:opacity-80"
    >
      <TypedText fullText={typingSnapshot.fullText} isTyping={typingSnapshot.isTyping} />
    </button>
  )
}
