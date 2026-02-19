"use client"

import { useActionState } from "react"
import { createProjectAction } from "@/app/actions/project"

export function CreateProjectForm() {
  const [state, formAction, isPending] = useActionState(createProjectAction, null)

  return (
    <form action={formAction} className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-400 ml-1">Título do Projeto</label>
        <input 
          name="title" 
          required 
          disabled={isPending}
          className="w-full px-4 py-3 rounded-xl bg-neutral-900/50 border border-neutral-800 text-white focus:outline-none focus:border-blue-800 focus:ring-1 focus:ring-blue-800 transition-all disabled:opacity-50" 
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-400 ml-1">Descrição</label>
        <textarea 
          name="description" 
          required 
          rows={4} 
          disabled={isPending}
          className="w-full px-4 py-3 rounded-xl bg-neutral-900/50 border border-neutral-800 text-white focus:outline-none focus:border-blue-800 focus:ring-1 focus:ring-blue-800 transition-all resize-none disabled:opacity-50" 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-400 ml-1">URL do GitHub</label>
          <input 
            name="githubUrl" 
            type="url" 
            disabled={isPending}
            className="w-full px-4 py-3 rounded-xl bg-neutral-900/50 border border-neutral-800 text-white focus:outline-none focus:border-blue-800 focus:ring-1 focus:ring-blue-800 transition-all disabled:opacity-50" 
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-400 ml-1">URL do Deploy</label>
          <input 
            name="deployUrl" 
            type="url" 
            disabled={isPending}
            className="w-full px-4 py-3 rounded-xl bg-neutral-900/50 border border-neutral-800 text-white focus:outline-none focus:border-blue-800 focus:ring-1 focus:ring-blue-800 transition-all disabled:opacity-50" 
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-400 ml-1">URL da Imagem (Firebase)</label>
        <input 
          name="imageUrl" 
          type="url" 
          disabled={isPending}
          className="w-full px-4 py-3 rounded-xl bg-neutral-900/50 border border-neutral-800 text-white focus:outline-none focus:border-blue-800 focus:ring-1 focus:ring-blue-800 transition-all disabled:opacity-50" 
        />
      </div>

      <button 
        type="submit" 
        disabled={isPending}
        className="w-full py-4 rounded-xl bg-blue-950 hover:bg-blue-900 border border-blue-800/50 text-white text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 flex justify-center items-center"
      >
        {isPending ? "A publicar..." : "Adicionar ao Portfólio"}
      </button>
    </form>
  )
}