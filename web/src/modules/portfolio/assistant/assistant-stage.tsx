"use client"

import type { KeyboardEvent } from "react"
import { Send } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { AnswerBalloon, AvatarSprite } from "@/modules/portfolio/avatar/contract"
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
  handleSend: (text?: string) => void | Promise<void>
  handleRetry: () => void
  handleKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => void
}

// Visual-novel style "stage": the avatar bust + its current answer balloon
// replace the panel's message list entirely - no scrollable history, each
// answer replaces the last (see `../avatar/speech/answer-balloon.tsx`). The
// visitor's own question never gets a balloon, it stays in the textarea
// while typed and clears on send - only the model's answer renders here.
// Free of any assumption about its container's size/position - fills
// whatever shell renders it, same as the list it replaces.
export function AssistantStage({
  dict,
  messages,
  input,
  setInput,
  loading,
  error,
  canRetry,
  handleSend,
  handleRetry,
  handleKeyDown,
}: AssistantStageProps) {
  return (
    <div className="flex flex-1 flex-col min-h-0 p-4">
      <div className="flex flex-1 flex-col items-center justify-center gap-4 min-h-0 overflow-y-auto py-2">
        <AvatarSprite variant="bust" className="size-28 shrink-0 rounded-full object-cover" />

        <AnswerBalloon skipLabel={dict.skipTyping} thinkingLabel={dict.thinking} />

        {messages.length === 0 && (
          <div className="flex w-full flex-col gap-2">
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
        )}

        {error && (
          <div className="flex w-full flex-col gap-1.5">
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
      </div>

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
            className="bg-brand text-brand-ink hover:bg-brand-strong disabled:opacity-50"
          >
            <Send className="size-4" />
          </Button>
        </div>
        <p className="text-[11px] text-muted-2">{dict.disclaimer}</p>
      </div>
    </div>
  )
}
