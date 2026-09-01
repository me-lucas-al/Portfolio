"use client"

import { useEffect, useState } from "react"
import { AssistantMiniDock } from "./assistant-mini-dock"
import { AssistantOverlay } from "./assistant-overlay"
import { useAssistantChat } from "./use-assistant-chat"
import {
  classifyTone,
  setAvatarOverlayState,
  setAvatarThinking,
  setAvatarTone,
  useBlipPreferences,
  useSpeechPlayer,
  useTypingSpeech,
} from "@/modules/portfolio/avatar/contract"
import type { Dictionary, Locale } from "@/i18n"

interface AssistantWidgetProps {
  dict: Dictionary["assistant"]
  locale: Locale
}

export function AssistantWidget({ dict, locale }: AssistantWidgetProps) {
  const [open, setOpen] = useState(false)
  const { isSpeaking, isPreparingVoice, speak, stopSpeaking } = useSpeechPlayer()
  const { blipsEnabled, setBlipsEnabled } = useBlipPreferences()
  const { startTypingSpeech, stopTypingSpeech } = useTypingSpeech()
  const {
    messages,
    input,
    setInput,
    loading,
    error,
    canRetry,
    handleSend,
    handleRetry,
    handleKeyDown,
    cancelPending,
    clearChat,
  } = useAssistantChat(dict, locale, {
    // Only a *live* response reaches here - the hook never fires this from
    // its localStorage-rehydration effect, so reloading the tab never
    // auto-types/speaks (or re-expresses) yesterday's last answer; a reload
    // wakes the avatar in "neutral", with every past message already fully
    // revealed.
    onModelMessage: (message, messageId) => {
      if (message.speech) speak(message.speech.url)
      setAvatarTone(classifyTone(message.text, locale))
      startTypingSpeech(messageId, message.text)
    },
    // Both a fresh send and a retry call `sendToApi`, so this reliably
    // interrupts whatever's currently speaking/typing the moment a new
    // question goes out.
    onBeforeSend: () => {
      stopSpeaking()
      stopTypingSpeech()
    },
  })

  // Closing the panel abandons the conversation for now, so an in-flight
  // request no longer has anywhere to render its result - cancel it instead
  // of leaving it to finish silently in the background. Also stops any
  // speech/typing in flight - both are safe no-ops when nothing is active,
  // so this doesn't misbehave on mount either (where `open` starts `false`).
  useEffect(() => {
    if (!open) {
      cancelPending()
      stopSpeaking()
    }
  }, [open, cancelPending, stopSpeaking])

  // Drives the avatar's "thinking" signal straight from this hook's
  // `loading` state - see `emotion-layer.ts` for the fast-path guard that
  // keeps a cache-hit response from ever visibly starting an animation that
  // would then get cut off mid-transition.
  useEffect(() => {
    setAvatarThinking(loading)
  }, [loading])

  // `useAssistantChat` never routes a failed request through
  // `onModelMessage` (that callback only fires for a live, successful
  // response) - an error still deserves an apologetic expression, so this
  // classifies the error string itself the moment it appears. This is the
  // only "error state" the avatar gets; there's no separate explicit error
  // enum layered on top - classifying the error copy itself (which
  // `classify-tone.ts` recognizes as apologetic) is enough.
  useEffect(() => {
    if (error) setAvatarTone(classifyTone(error, locale))
  }, [error, locale])

  // Tells the avatar module (via `contract.ts` - the ONLY avatar import this
  // module takes) whether the overlay panel is open, so it can show the bust
  // in the panel header and hide the mini corner avatar (or the reverse once
  // it closes).
  useEffect(() => {
    setAvatarOverlayState(open)
    return () => setAvatarOverlayState(false)
  }, [open])

  return (
    <>
      <AssistantMiniDock dict={dict} open={open} onOpenChange={setOpen} />
      <AssistantOverlay
        dict={dict}
        open={open}
        onOpenChange={setOpen}
        clearChat={clearChat}
        blipsEnabled={blipsEnabled}
        onToggleBlips={() => setBlipsEnabled(!blipsEnabled)}
        isSpeaking={isSpeaking}
        isPreparingVoice={isPreparingVoice}
        onStopSpeaking={stopSpeaking}
        messages={messages}
        input={input}
        setInput={setInput}
        loading={loading}
        error={error}
        canRetry={canRetry}
        handleSend={handleSend}
        handleRetry={handleRetry}
        handleKeyDown={handleKeyDown}
      />
    </>
  )
}
