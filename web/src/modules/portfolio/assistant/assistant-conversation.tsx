"use client"

import type { KeyboardEvent, RefObject } from "react"
import { Send } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { AssistantMessage } from "./assistant-message"
import type { ChatMessage } from "./use-assistant-chat"
import type { Dictionary } from "@/i18n"

export interface AssistantConversationProps {
  dict: Dictionary["assistant"]
  messages: ChatMessage[]
  /** The message currently being typed out by the avatar (see `use-typing-speech.ts`), or `null` if none. */
  typingMessageId: number | null
  input: string
  setInput: (value: string) => void
  loading: boolean
  error: string | null
  canRetry: boolean
  bottomRef: RefObject<HTMLDivElement | null>
  handleSend: (text?: string) => void | Promise<void>
  handleRetry: () => void
  handleKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => void
}

// Free of any assumption about its container's size/position - fills whatever
// shell renders it (a side-panel dialog today, potentially a fullscreen
// overlay later), same as the original in-widget markup.
export function AssistantConversation({
  dict,
  messages,
  typingMessageId,
  input,
  setInput,
  loading,
  error,
  canRetry,
  bottomRef,
  handleSend,
  handleRetry,
  handleKeyDown,
}: AssistantConversationProps) {
  return (
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
                    className="text-left text-sm px-3 py-2 rounded-lg bg-surface-2/80 border border-line text-fg-muted hover:text-fg hover:border-line-strong transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message) => (
            <AssistantMessage
              key={message.id}
              role={message.role}
              content={message.content}
              isTyping={message.id === typingMessageId}
            />
          ))}

          {loading && (
            <div className="flex flex-col gap-2 max-w-[85%]">
              {/* aria-live region above is otherwise silent while waiting on a
                  cache-miss generation (up to ~50s) - announce it once. */}
              <span className="sr-only">{dict.thinking}</span>
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-48" />
            </div>
          )}

          {error && (
            <div className="flex flex-col gap-1.5">
              <p className="text-sm text-danger">{error}</p>
              {canRetry && (
                <button
                  type="button"
                  onClick={handleRetry}
                  className="self-start text-xs font-medium text-brand transition-colors hover:text-brand-strong"
                >
                  {dict.retry}
                </button>
              )}
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      <div className="pt-3 border-t border-line flex flex-col gap-2">
        <div className="flex items-end gap-2">
          <Textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={dict.placeholder}
            maxLength={600}
            className="min-h-10 max-h-32 resize-none bg-surface-2/60 border-line text-sm text-fg placeholder:text-muted-2"
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
        <p className="text-[11px] text-muted-2">{dict.disclaimer}</p>
      </div>
    </div>
  )
}
