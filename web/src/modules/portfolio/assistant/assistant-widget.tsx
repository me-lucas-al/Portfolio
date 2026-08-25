"use client"

import { useEffect, useState } from "react"
import { AssistantMiniDock } from "./assistant-mini-dock"
import { AssistantOverlay } from "./assistant-overlay"
import { useAssistantChat } from "./use-assistant-chat"
import type { Dictionary, Locale } from "@/i18n"

interface AssistantWidgetProps {
  dict: Dictionary["assistant"]
  locale: Locale
}

export function AssistantWidget({ dict, locale }: AssistantWidgetProps) {
  const [open, setOpen] = useState(false)
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

  return (
    <>
      <AssistantMiniDock dict={dict} open={open} onOpenChange={setOpen} />
      <AssistantOverlay
        dict={dict}
        open={open}
        onOpenChange={setOpen}
        clearChat={clearChat}
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
