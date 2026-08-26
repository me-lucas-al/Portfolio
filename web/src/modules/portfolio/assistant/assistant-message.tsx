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
            ? "bg-blue-600 text-white"
            : "bg-neutral-900/80 border border-neutral-800 text-neutral-200"
        }`}
      >
        {isUser ? content : <TypedText fullText={content} isTyping={isTyping} />}
      </div>
    </div>
  )
}
