"use client"

import { useActionState, useEffect, useState } from "react"
import { Trash2 } from "lucide-react"
import { clearAssistantCacheAction } from "@/app/actions/assistant-answer"

export function ClearAssistantCacheButton() {
  const [state, formAction, isPending] = useActionState(clearAssistantCacheAction, null)
  const [isConfirming, setIsConfirming] = useState(false)

  useEffect(() => {
    if (state) setIsConfirming(false)
  }, [state])

  return (
    <div className="bg-surface-2/30 p-6 rounded-2xl border border-line space-y-4">
      <div>
        <h3 className="text-lg font-medium text-fg">Cache de Respostas do Assistente</h3>
        <p className="text-sm text-fg-muted mt-1">
          Remove todas as respostas em cache do assistente de IA. Use após alterar o comportamento
          dele (ex.: instruções do sistema) para evitar que respostas antigas continuem sendo servidas.
        </p>
      </div>

      <form
        action={formAction}
        onSubmit={(e) => {
          if (!isConfirming) {
            e.preventDefault()
            setIsConfirming(true)
          }
        }}
      >
        <button
          type="submit"
          disabled={isPending}
          className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all focus:outline-none focus:ring-2 disabled:opacity-50 flex items-center gap-2 cursor-pointer ${
            isConfirming
              ? "bg-danger hover:bg-danger/90 text-white focus:ring-danger"
              : "bg-surface border border-line text-fg hover:border-line-strong focus:ring-brand"
          }`}
        >
          <Trash2 className="w-4 h-4" />
          {isPending ? "Limpando..." : isConfirming ? "Confirmar limpeza do cache" : "Limpar cache do assistente"}
        </button>
      </form>

      {state?.error ? (
        <p className="text-sm text-danger">{state.error}</p>
      ) : state?.success ? (
        <p className="text-sm text-success">{state.message}</p>
      ) : null}
    </div>
  )
}
