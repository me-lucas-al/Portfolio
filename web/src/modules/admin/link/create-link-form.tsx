"use client"

import { useActionState, useEffect } from "react"
import { createLinkAction } from "@/app/actions/link"
import { toast } from "react-toastify"

export function CreateLinkForm() {
  const [state, formAction, isPending] = useActionState(createLinkAction, null)

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error)
    }

    if (state?.success && state?.message) {
      toast.success(state.message)
    }
  }, [state])

  return (
    <form action={formAction} className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-fg-muted ml-1">Título do Link</label>
        <input
          name="title"
          required
          disabled={isPending}
          placeholder="Ex: GitHub, LinkedIn..."
          className="w-full px-4 py-3 rounded-xl bg-surface border border-line text-fg placeholder:text-muted-2 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all disabled:opacity-50"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-fg-muted ml-1">URL</label>
        <input
          name="url"
          type="url"
          required
          disabled={isPending}
          placeholder="https://..."
          className="w-full px-4 py-3 rounded-xl bg-surface border border-line text-fg placeholder:text-muted-2 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all disabled:opacity-50"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-fg-muted ml-1">Ícone</label>
        <input
          name="icon"
          required
          disabled={isPending}
          placeholder="Ex: Github, Linkedin, Mail..."
          className="w-full px-4 py-3 rounded-xl bg-surface border border-line text-fg placeholder:text-muted-2 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all disabled:opacity-50"
        />
        <p className="text-xs text-muted-2 ml-1">
          Nome do ícone da biblioteca <strong>lucide-react</strong> (Ex: Github, Linkedin, Mail, Twitter).
        </p>
      </div>

      {state?.error && (
        <p className="text-sm text-danger ml-1">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-4 rounded-xl bg-brand hover:bg-brand-strong text-brand-ink text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-ink disabled:opacity-50 flex justify-center items-center cursor-pointer"
      >
        {isPending ? "A salvar..." : "Adicionar Link"}
      </button>
    </form>
  )
}
