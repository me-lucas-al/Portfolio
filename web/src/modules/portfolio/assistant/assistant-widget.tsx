"use client"

import { useEffect, useRef, useState } from "react"
import { AssistantMiniDock } from "./assistant-mini-dock"
import { AssistantOverlay } from "./assistant-overlay"
import { useAssistantChat } from "./use-assistant-chat"
import { setAvatarOverlayState, useSpeechPlayer } from "@/modules/portfolio/avatar/contract"
import type { Dictionary, Locale } from "@/i18n"

interface AssistantWidgetProps {
  dict: Dictionary["assistant"]
  locale: Locale
}

export function AssistantWidget({ dict, locale }: AssistantWidgetProps) {
  const [open, setOpen] = useState(false)
  const avatarSlotRef = useRef<HTMLDivElement | null>(null)
  const { voiceEnabled, setVoiceEnabled, isSpeaking, isPreparingVoice, needsUnlock, speak, stopSpeaking } =
    useSpeechPlayer()
  const {
    messages,
    input,
    setInput,
    loading,
    error,
    canRetry,
    bottomRef,
    handleSend,
    handleRetry,
    handleKeyDown,
    cancelPending,
    clearChat,
  } = useAssistantChat(dict, locale, {
    // Only a *live* response reaches here - the hook never fires this from
    // its localStorage-rehydration effect, so reloading the tab never
    // auto-speaks yesterday's last answer.
    onModelMessage: (message) => {
      if (message.speech) speak(message.speech.url)
    },
    // Both a fresh send and a retry call `sendToApi`, so this reliably
    // interrupts whatever's currently speaking the moment a new question
    // goes out.
    onBeforeSend: stopSpeaking,
  })

  // Closing the panel abandons the conversation for now, so an in-flight
  // request no longer has anywhere to render its result - cancel it instead
  // of leaving it to finish silently in the background. Also stops any
  // speech in flight - `stopSpeaking()` is a safe no-op when nothing is
  // playing, so this doesn't misbehave on mount either (where `open` starts
  // `false`).
  useEffect(() => {
    if (!open) {
      cancelPending()
      stopSpeaking()
    }
  }, [open, cancelPending, stopSpeaking])

  // Tells the avatar module (via `contract.ts` - the ONLY avatar import this
  // module takes) where the overlay's header bust slot currently sits on
  // screen, so its engine can morph the mini avatar into that slot while the
  // overlay is open, and back to the corner once it closes. The slot div
  // itself only exists in the DOM while the dialog is open, so this effect
  // (re)creates its `ResizeObserver` each time `open` flips.
  useEffect(() => {
    const slotEl = avatarSlotRef.current

    if (!open || !slotEl) {
      setAvatarOverlayState(false, null)
      return
    }

    const reportRect = () => {
      setAvatarOverlayState(true, slotEl.getBoundingClientRect())
    }

    reportRect()

    const resizeObserver = new ResizeObserver(reportRect)
    resizeObserver.observe(slotEl)
    window.addEventListener("resize", reportRect)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener("resize", reportRect)
      setAvatarOverlayState(false, null)
    }
  }, [open])

  return (
    <>
      <AssistantMiniDock dict={dict} open={open} onOpenChange={setOpen} />
      <AssistantOverlay
        dict={dict}
        open={open}
        onOpenChange={setOpen}
        clearChat={clearChat}
        avatarSlotRef={avatarSlotRef}
        voiceEnabled={voiceEnabled}
        onToggleVoice={() => setVoiceEnabled(!voiceEnabled)}
        isSpeaking={isSpeaking}
        isPreparingVoice={isPreparingVoice}
        needsUnlock={needsUnlock}
        onStopSpeaking={stopSpeaking}
        messages={messages}
        input={input}
        setInput={setInput}
        loading={loading}
        error={error}
        canRetry={canRetry}
        bottomRef={bottomRef}
        handleSend={handleSend}
        handleRetry={handleRetry}
        handleKeyDown={handleKeyDown}
      />
    </>
  )
}
