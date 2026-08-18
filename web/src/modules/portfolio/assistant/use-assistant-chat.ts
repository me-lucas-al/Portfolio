import { useEffect, useRef, useState } from "react"
import type { Dictionary, Locale } from "@/i18n"

export interface ChatMessage {
  id: number
  role: "user" | "model"
  content: string
}

const MAX_HISTORY_TURNS = 6
const STORAGE_KEY = "assistant_chat_v1"
const STORAGE_TTL_MS = 24 * 60 * 60 * 1000

interface PersistedChat {
  messages: ChatMessage[]
  savedAt: number
}

function loadPersistedChat(): PersistedChat | null {
  if (typeof window === "undefined") return null

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw) as PersistedChat
    if (!Array.isArray(parsed.messages) || !parsed.savedAt) return null

    if (Date.now() - parsed.savedAt > STORAGE_TTL_MS) {
      window.localStorage.removeItem(STORAGE_KEY)
      return null
    }

    return parsed
  } catch {
    return null
  }
}

// Only called from pushMessage (on real activity) so that reopening/reloading the
// tab never rewrites `savedAt` on its own - otherwise the 24h TTL would never expire
// as long as the user occasionally revisits the page without sending anything.
function persistChat(messages: ChatMessage[], savedAt: number) {
  if (typeof window === "undefined") return

  try {
    if (messages.length === 0) {
      window.localStorage.removeItem(STORAGE_KEY)
      return
    }

    const payload: PersistedChat = { messages, savedAt }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  } catch {
    // localStorage unavailable (private browsing, quota) - degrade to in-memory only
  }
}

export function useAssistantChat(dict: Dictionary["assistant"], locale: Locale) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const nextId = useRef(0)
  const savedAtRef = useRef(Date.now())

  useEffect(() => {
    const restored = loadPersistedChat()
    if (!restored) return

    setMessages(restored.messages)
    savedAtRef.current = restored.savedAt
    nextId.current = restored.messages.reduce((max, message) => Math.max(max, message.id), 0) + 1
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  function pushMessage(role: ChatMessage["role"], content: string) {
    nextId.current += 1
    savedAtRef.current = Date.now()
    setMessages((prev) => {
      const next = [...prev, { id: nextId.current, role, content }]
      persistChat(next, savedAtRef.current)
      return next
    })
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
