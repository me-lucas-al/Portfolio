"use client"

import { useEffect, useState, useSyncExternalStore } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getAvatarSignalSnapshot, subscribeAvatarSignal } from "../state/avatar-signal-bus"
import { TypedText } from "./typed-text"
import { getTypingSpeechSnapshot, skipTypingSpeech, subscribeTypingSpeech } from "./typing-speech-state"

const LINGER_MS = 6000

function getServerAvatarSnapshot() {
  return getAvatarSignalSnapshot()
}

function getServerTypingSnapshot() {
  return getTypingSpeechSnapshot()
}

interface SpeechBalloonProps {
  skipLabel: string
}

export function SpeechBalloon({ skipLabel }: SpeechBalloonProps) {
  const avatarSignal = useSyncExternalStore(subscribeAvatarSignal, getAvatarSignalSnapshot, getServerAvatarSnapshot)
  const typingSnapshot = useSyncExternalStore(subscribeTypingSpeech, getTypingSpeechSnapshot, getServerTypingSnapshot)
  const [lingering, setLingering] = useState(false)

  useEffect(() => {
    if (typingSnapshot.isTyping) {
      setLingering(false)
      return
    }
    if (!typingSnapshot.fullText) return

    setLingering(true)
    if (typingSnapshot.persistent) return

    const timeoutId = setTimeout(() => setLingering(false), LINGER_MS)
    return () => clearTimeout(timeoutId)
  }, [typingSnapshot.isTyping, typingSnapshot.fullText, typingSnapshot.persistent])

  const visible = !avatarSignal.overlayOpen && (typingSnapshot.isTyping || lingering)
  if (!visible) return null

  return (
    <button
      type="button"
      onClick={skipTypingSpeech}
      aria-label={skipLabel}
      title={skipLabel}
      aria-live="polite"
      aria-atomic="true"
      className="fixed bottom-32 left-6 z-40 max-h-[60vh] max-w-[min(280px,calc(100vw-3rem))] rounded-2xl rounded-bl-sm border border-line bg-surface/95 text-left text-sm text-fg shadow-lg shadow-black/30"
    >
      <ScrollArea
        className="max-h-[60vh] px-3 py-2"
        scrollbarThumbClassName="bg-gradient-to-b from-brand to-brand-strong"
      >
        <span>
          <TypedText fullText={typingSnapshot.fullText} isTyping={typingSnapshot.isTyping} />
        </span>
      </ScrollArea>
    </button>
  )
}
