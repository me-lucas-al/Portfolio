import { useEffect, useRef, useState } from "react"
import type { Dictionary, Locale } from "@/i18n"

export interface ChatMessage {
  id: number
  role: "user" | "model"
  content: string
}

const MAX_HISTORY_TURNS = 6

export function useAssistantChat(dict: Dictionary["assistant"], locale: Locale) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const nextId = useRef(0)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  function pushMessage(role: ChatMessage["role"], content: string) {
    nextId.current += 1
    setMessages((prev) => [...prev, { id: nextId.current, role, content }])
  }

  async function handleSend(text?: string) {
    const message = (text ?? input).trim()
    if (!message || loading) return

    const history = messages.slice(-MAX_HISTORY_TURNS).map(({ role, content }) => ({ role, content }))
    pushMessage("user", message)
    setInput("")
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history, locale }),
      })

      if (response.status === 429) {
        setError(dict.rateLimited)
        return
      }
      if (!response.ok) {
        const errorBody = (await response.json().catch(() => null)) as { reason?: string } | null
        setError(errorBody?.reason === "upstream_quota" ? dict.quotaExceeded : dict.error)
        return
      }

      const data = (await response.json()) as { text: string }
      pushMessage("model", data.text)
    } catch {
      setError(dict.error)
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      void handleSend()
    }
  }

  return { messages, input, setInput, loading, error, bottomRef, handleSend, handleKeyDown }
}
