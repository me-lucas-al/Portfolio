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
        <label className="text-sm font-medium text-white ml-1">Título do Link</label>
        <input 
          name="title" 
          required 
          disabled={isPending}
          placeholder="Ex: GitHub, LinkedIn..."
          className="w-full px-4 py-3 rounded-xl bg-neutral-900/50 border border-neutral-800 text-white focus:outline-none focus:border-blue-800 focus:ring-1 focus:ring-blue-800 transition-all disabled:opacity-50" 
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-white ml-1">URL</label>
        <input 
          name="url" 
          type="url"
          required 
          disabled={isPending}
          placeholder="https://..."
          className="w-full px-4 py-3 rounded-xl bg-neutral-900/50 border border-neutral-800 text-white focus:outline-none focus:border-blue-800 focus:ring-1 focus:ring-blue-800 transition-all disabled:opacity-50" 
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-white ml-1">Ícone</label>
        <input 
          name="icon" 
          required 
          disabled={isPending}
          placeholder="Ex: Github, Linkedin, Mail..."
          className="w-full px-4 py-3 rounded-xl bg-neutral-900/50 border border-neutral-800 text-white focus:outline-none focus:border-blue-800 focus:ring-1 focus:ring-blue-800 transition-all disabled:opacity-50" 
        />
        <p className="text-xs text-neutral-500 ml-1">
          Nome do ícone da biblioteca <strong>lucide-react</strong> (Ex: Github, Linkedin, Mail, Twitter).
        </p>
      </div>

      {state?.error && (
        <p className="text-sm text-red-500 ml-1">{state.error}</p>
      )}

      <button 
        type="submit" 
        disabled={isPending}
        className="w-full py-4 rounded-xl bg-blue-950 hover:bg-blue-900 border border-blue-800/50 text-white text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 flex justify-center items-center"
      >
        {isPending ? "A salvar..." : "Adicionar Link"}
      </button>
    </form>
  )
}
