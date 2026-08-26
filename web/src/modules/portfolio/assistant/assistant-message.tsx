import { TypedText } from "@/modules/portfolio/avatar/contract"

interface AssistantMessageProps {
  role: "user" | "model"
  content: string
  isTyping: boolean
}

export function AssistantMessage({ role, content, isTyping }: AssistantMessageProps) {
  const isUser = role === "user"

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-xl px-3 py-2 text-sm whitespace-pre-wrap break-words ${
          isUser
            ? "bg-accent text-accent-ink"
            : "bg-surface-2/80 border border-line text-fg-muted"
        }`}
      >
        {isUser ? content : <TypedText fullText={content} isTyping={isTyping} />}
      </div>
    </div>
  )
}
