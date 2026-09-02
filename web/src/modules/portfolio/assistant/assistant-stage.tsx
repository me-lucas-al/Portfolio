"use client"

import { useEffect, useRef, type KeyboardEvent } from "react"
import { Send } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { AnswerBalloon, AvatarSprite, TypedText, useTypingSpeech } from "@/modules/portfolio/avatar/contract"
import type { ChatMessage } from "./use-assistant-chat"
import type { Dictionary } from "@/i18n"

export interface AssistantStageProps {
  dict: Dictionary["assistant"]
  messages: ChatMessage[]
  input: string
  setInput: (value: string) => void
  loading: boolean
  error: string | null
  canRetry: boolean
  sendChatMessage: (text?: string) => void | Promise<void>
  retryLastFailedMessage: () => void
  handleChatInputKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => void
}

export function AssistantStage({
  dict,
  messages,
  input,
  setInput,
  loading,
  error,
  canRetry,
  sendChatMessage,
  retryLastFailedMessage,
  handleChatInputKeyDown,
}: AssistantStageProps) {
  const { typingMessageId } = useTypingSpeech()
  const transcriptRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const node = transcriptRef.current
    if (!node) return
    node.scrollTop = node.scrollHeight
  }, [messages, loading, typingMessageId])

  return (
    <div className="flex flex-1 min-h-0 flex-col gap-3 px-4 pb-4 pt-1 sm:px-5">
      <div className="flex min-h-0 flex-1 items-start gap-3">
        <AvatarSprite
          variant="bust"
          className="size-12 shrink-0 rounded-full object-cover ring-2 ring-brand/60 sm:size-16"
        />
        <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-2 pt-1">
          <span className="w-fit rounded-full bg-brand px-3 py-0.5 text-xs font-bold text-brand-ink">
            {dict.title}
          </span>

          <div ref={transcriptRef} className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pr-1">
            {messages.length === 0 && !loading && <p className="text-sm text-fg-muted">{dict.subtitle}</p>}

            {messages.map((message) => {
              if (message.role === "model" && message.id === typingMessageId) return null

              if (message.role === "user") {
                return (
                  <p key={message.id} className="text-sm font-medium text-brand">
                    <span aria-hidden="true">▸ </span>
                    {message.content}
                  </p>
                )
              }

              return <TypedText key={message.id} fullText={message.content} isTyping={false} className="block text-sm leading-relaxed text-fg" />
            })}

            <AnswerBalloon skipLabel={dict.skipTyping} thinkingLabel={dict.thinking} />

            {messages.length === 0 && (
              <div className="flex flex-wrap gap-2">
                {dict.suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => void sendChatMessage(suggestion)}
                    className="rounded-full border border-line bg-surface-2/80 px-3 py-1.5 text-left text-xs text-fg-muted transition-colors hover:border-brand/60 hover:text-fg"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>

          {error && (
            <div className="flex flex-col gap-1.5">
              <p className="text-sm text-danger">{error}</p>
              {canRetry && (
                <button
                  type="button"
                  onClick={retryLastFailedMessage}
                  className="self-start text-xs font-medium text-brand transition-colors hover:text-brand-strong"
                >
                  {dict.retry}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-end gap-2 border-t border-line pt-3">
        <span className="pb-2 text-brand" aria-hidden="true">
          ▸
        </span>
        <Textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleChatInputKeyDown}
          placeholder={dict.placeholder}
          maxLength={600}
          className="min-h-9 max-h-28 flex-1 resize-none rounded-2xl border-line bg-ink/50 px-3 py-2 text-sm text-fg placeholder:text-muted-2 focus-visible:border-brand focus-visible:ring-brand/30"
        />
        <Button
          size="icon"
          onClick={() => void sendChatMessage()}
          disabled={loading || !input.trim()}
          aria-label={dict.send}
          className="shrink-0 rounded-full bg-brand text-brand-ink hover:bg-brand-strong disabled:opacity-50"
        >
          <Send className="size-4" />
        </Button>
      </div>
      <p className="text-[11px] text-muted-2">{dict.disclaimer}</p>
    </div>
  )
}
