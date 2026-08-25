"use client"

import { useEffect, useRef, useState } from "react"
import { AssistantMiniDock } from "./assistant-mini-dock"
import { AssistantOverlay } from "./assistant-overlay"
import { useAssistantChat } from "./use-assistant-chat"
import { setAvatarOverlayState } from "@/modules/portfolio/avatar/contract"
import type { Dictionary, Locale } from "@/i18n"

interface AssistantWidgetProps {
  dict: Dictionary["assistant"]
  locale: Locale
}

export function AssistantWidget({ dict, locale }: AssistantWidgetProps) {
  const [open, setOpen] = useState(false)
  const avatarSlotRef = useRef<HTMLDivElement | null>(null)
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
  } = useAssistantChat(dict, locale)

  // Closing the panel abandons the conversation for now, so an in-flight
  // request no longer has anywhere to render its result - cancel it instead
  // of leaving it to finish silently in the background.
  useEffect(() => {
    if (!open) cancelPending()
  }, [open, cancelPending])

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
