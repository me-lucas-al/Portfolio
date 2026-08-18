"use client"

import { useEffect, useState } from "react"
import { MessageCircle, Send } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
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

const DESKTOP_QUERY = "(min-width: 1024px)"

export function AssistantWidget({ dict, locale }: AssistantWidgetProps) {
  const [open, setOpen] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const { messages, input, setInput, loading, error, bottomRef, handleSend, handleKeyDown } = useAssistantChat(
    dict,
    locale,
  )

  useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_QUERY)
    setIsDesktop(mediaQuery.matches)
    const handleChange = (event: MediaQueryListEvent) => setIsDesktop(event.matches)
    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  const body = (
    <div className="flex flex-col h-full min-h-0">
      <ScrollArea className="flex-1 min-h-0 pr-2">
        <div className="flex flex-col gap-3 py-2" aria-live="polite">
          {messages.length === 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-sm text-neutral-500">{dict.subtitle}</p>
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

          {error && <p className="text-sm text-red-400">{error}</p>}

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
  )

  const trigger = (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label={dict.trigger}
      className="fixed bottom-6 right-6 z-40 flex items-center justify-center size-14 rounded-full bg-blue-600 text-white shadow-lg shadow-blue-950/50 hover:bg-blue-500 transition-all active:scale-95"
    >
      <MessageCircle className="size-6" />
    </button>
  )

  if (isDesktop) {
    return (
      <>
        {trigger}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-lg h-[600px] flex flex-col bg-neutral-950 border-neutral-800 text-white">
            <DialogHeader>
              <DialogTitle className="text-white">{dict.title}</DialogTitle>
              <DialogDescription className="sr-only">{dict.subtitle}</DialogDescription>
            </DialogHeader>
            {body}
          </DialogContent>
        </Dialog>
      </>
    )
  }

  return (
    <>
      {trigger}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="h-[85vh] flex flex-col bg-neutral-950 border-neutral-800 text-white p-4">
          <SheetHeader className="p-0">
            <SheetTitle className="text-white">{dict.title}</SheetTitle>
            <SheetDescription className="sr-only">{dict.subtitle}</SheetDescription>
          </SheetHeader>
          <div className="flex-1 min-h-0">{body}</div>
        </SheetContent>
      </Sheet>
    </>
  )
}
