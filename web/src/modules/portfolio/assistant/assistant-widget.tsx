"use client"

import { useEffect, useRef, useState } from "react"
import { MessageCircle, Send, X } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { AssistantMessage } from "./assistant-message"
import { useAssistantChat } from "./use-assistant-chat"
import type { Dictionary, Locale } from "@/i18n"

interface AssistantWidgetProps {
  dict: Dictionary["assistant"]
  locale: Locale
}

const CTA_SEEN_KEY = "assistant_cta_seen"
const CTA_DELAY_MS = 1500

function hasSeenCta(): boolean {
  try {
    return window.localStorage.getItem(CTA_SEEN_KEY) !== null
  } catch {
    return false
  }
}

function markCtaSeen() {
  try {
    window.localStorage.setItem(CTA_SEEN_KEY, "1")
  } catch {
    // localStorage unavailable (private browsing, quota) - the bubble may reappear next visit
  }
}

export function AssistantWidget({ dict, locale }: AssistantWidgetProps) {
  const [open, setOpen] = useState(false)
  const [showCta, setShowCta] = useState(false)
  const { messages, input, setInput, loading, error, canRetry, bottomRef, handleSend, handleRetry, handleKeyDown, cancelPending } =
    useAssistantChat(dict, locale)
  const panelRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const wasOpenRef = useRef(false)

  // Closing the panel abandons the conversation for now, so an in-flight
  // request no longer has anywhere to render its result - cancel it instead
  // of leaving it to finish silently in the background.
  useEffect(() => {
    if (!open) cancelPending()
  }, [open, cancelPending])

  useEffect(() => {
    if (hasSeenCta()) return
    const timeout = window.setTimeout(() => setShowCta(true), CTA_DELAY_MS)
    return () => window.clearTimeout(timeout)
  }, [])

  useEffect(() => {
    if (!open) return
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [open])

  // Non-modal, so no focus trap: only move focus in/out on open/close, mirroring
  // what Dialog/Sheet gave us for free before this became a custom panel.
  useEffect(() => {
    if (open) {
      panelRef.current?.focus()
      wasOpenRef.current = true
    } else if (wasOpenRef.current) {
      triggerRef.current?.focus()
      wasOpenRef.current = false
    }
  }, [open])

  function dismissCta() {
    setShowCta(false)
    markCtaSeen()
  }

  function openPanel() {
    setOpen(true)
    dismissCta()
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
        {showCta && !open && (
          <div className="flex items-center gap-2 rounded-2xl border border-neutral-800 bg-neutral-900/95 px-4 py-2 text-sm text-neutral-200 shadow-lg shadow-black/30 animate-in fade-in slide-in-from-bottom-2">
            <span>{dict.ctaBubble}</span>
            <button
              type="button"
              onClick={dismissCta}
              aria-label={dict.close}
              className="text-neutral-500 transition-colors hover:text-neutral-300"
            >
              <X className="size-3.5" />
            </button>
          </div>
        )}

        <button
          ref={triggerRef}
          type="button"
          onClick={() => (open ? setOpen(false) : openPanel())}
          aria-label={dict.trigger}
          aria-expanded={open}
          className="flex size-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-950/50 transition-all hover:bg-blue-500 active:scale-95"
        >
          {open ? <X className="size-6" /> : <MessageCircle className="size-6" />}
        </button>
      </div>

      <aside
        ref={panelRef}
        role="complementary"
        aria-label={dict.title}
        tabIndex={-1}
        inert={!open}
        className={`fixed inset-y-0 right-0 z-50 flex w-full flex-col border-l border-neutral-800 bg-neutral-950 text-white shadow-2xl shadow-black/40 outline-none transition-transform duration-300 ease-in-out sm:w-[420px] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-neutral-900 px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-white">{dict.title}</p>
            <p className="text-xs text-neutral-500">{dict.subtitle}</p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label={dict.close}
            className="rounded-md p-1.5 text-neutral-500 transition-colors hover:bg-neutral-900 hover:text-neutral-300"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="flex flex-1 flex-col min-h-0 p-4">
          <ScrollArea className="flex-1 min-h-0 pr-2">
            <div className="flex flex-col gap-3 py-2" aria-live="polite">
              {messages.length === 0 && (
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-2 mt-2">
                    {dict.suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => void handleSend(suggestion)}
                        className="text-left text-sm px-3 py-2 rounded-lg bg-neutral-900/80 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((message) => (
                <AssistantMessage key={message.id} role={message.role} content={message.content} />
              ))}

              {loading && (
                <div className="flex flex-col gap-2 max-w-[85%]">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-48" />
                </div>
              )}

              {error && (
                <div className="flex flex-col gap-1.5">
                  <p className="text-sm text-red-400">{error}</p>
                  {canRetry && (
                    <button
                      type="button"
                      onClick={handleRetry}
                      className="self-start text-xs font-medium text-blue-400 transition-colors hover:text-blue-300"
                    >
                      {dict.retry}
                    </button>
                  )}
                </div>
              )}

              <div ref={bottomRef} />
            </div>
          </ScrollArea>

          <div className="pt-3 border-t border-neutral-900 flex flex-col gap-2">
            <div className="flex items-end gap-2">
              <Textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={dict.placeholder}
                maxLength={600}
                className="min-h-10 max-h-32 resize-none bg-neutral-900/60 border-neutral-800 text-sm text-white placeholder:text-neutral-600"
              />
              <Button
                size="icon"
                onClick={() => void handleSend()}
                disabled={loading || !input.trim()}
                aria-label={dict.send}
              >
                <Send className="size-4" />
              </Button>
            </div>
            <p className="text-[11px] text-neutral-600">{dict.disclaimer}</p>
          </div>
        </div>
      </aside>
    </>
  )
}
