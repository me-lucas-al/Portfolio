import { useCallback, useEffect, useRef, useState } from "react"
import type { Dictionary, Locale } from "@/i18n"
import { resolveChatErrorMessage } from "./chat-error-message"

export interface ChatMessage {
  id: number
  role: "user" | "model"
  content: string
}

const MAX_HISTORY_TURNS = 6
const MAX_HISTORY_CONTENT_CHARS = 6000
const STORAGE_KEY = "assistant_chat_v1"
const STORAGE_TTL_MS = 24 * 60 * 60 * 1000
// Above the server's own 60s maxDuration so a slow-but-real response is never
// cut off client-side first, leaving the visitor stuck on a spinner forever.
const REQUEST_TIMEOUT_MS = 65_000

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

// Defensive against payloads already sitting in a visitor's localStorage from
// before the server-side history limit was raised alongside MAX_OUTPUT_TOKENS.
function truncateHistoryContent(content: string): string {
  return content.length > MAX_HISTORY_CONTENT_CHARS ? content.slice(0, MAX_HISTORY_CONTENT_CHARS) : content
}

export function useAssistantChat(dict: Dictionary["assistant"], locale: Locale) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [failedMessage, setFailedMessage] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const nextId = useRef(0)
  const savedAtRef = useRef(Date.now())
  const abortControllerRef = useRef<AbortController | null>(null)

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

  const cancelPending = useCallback(() => {
    abortControllerRef.current?.abort()
  }, [])

  function pushMessage(role: ChatMessage["role"], content: string) {
    nextId.current += 1
    savedAtRef.current = Date.now()
    setMessages((prev) => {
      const next = [...prev, { id: nextId.current, role, content }]
      persistChat(next, savedAtRef.current)
      return next
    })
  }

  async function sendToApi(message: string) {
    cancelPending()
    const controller = new AbortController()
    abortControllerRef.current = controller
    const signal = AbortSignal.any([controller.signal, AbortSignal.timeout(REQUEST_TIMEOUT_MS)])

    // On a fresh send `messages` (from this closure) doesn't include the just-pushed
    // user turn yet, so it's naturally excluded here. On retry it's already committed,
    // so drop it explicitly - otherwise the message being (re)sent would also show up
    // as the last history entry, duplicated.
    const lastMessage = messages[messages.length - 1]
    const priorMessages = lastMessage?.role === "user" && lastMessage.content === message ? messages.slice(0, -1) : messages
    const history = priorMessages
      .slice(-MAX_HISTORY_TURNS)
      .map(({ role, content }) => ({ role, content: truncateHistoryContent(content) }))

    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history, locale }),
        signal,
      })

      if (!response.ok) {
        const errorBody = (await response.json().catch(() => null)) as { reason?: string } | null
        setError(resolveChatErrorMessage(dict, errorBody?.reason))
        setFailedMessage(message)
        setInput(message)
        return
      }

      const data = (await response.json()) as { text: string }
      pushMessage("model", data.text)
      setFailedMessage(null)
      setInput("")
    } catch (err) {
      // A stale request being superseded (cancelPending) or the panel closing
      // aborts in flight - not a user-facing failure, so no error/retry state.
      if (err instanceof DOMException && err.name === "AbortError") return

      console.error("[assistant] request failed:", err)
      setError(err instanceof DOMException && err.name === "TimeoutError" ? dict.timeout : dict.error)
      setFailedMessage(message)
      setInput(message)
    } finally {
      setLoading(false)
    }
  }

  async function handleSend(text?: string) {
    const message = (text ?? input).trim()
    if (!message || loading) return

    pushMessage("user", message)
    setInput("")
    await sendToApi(message)
  }

  function handleRetry() {
    if (!failedMessage || loading) return
    void sendToApi(failedMessage)
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      void handleSend()
    }
  }

  function clearChat() {
    setMessages([])
    setError(null)
    setFailedMessage(null)
    setInput("")
    persistChat([], Date.now())
  }

  return {
    messages,
    input,
    setInput,
    loading,
    error,
    canRetry: failedMessage !== null,
    bottomRef,
    handleSend,
    handleRetry,
    handleKeyDown,
    cancelPending,
    clearChat,
  }
}
