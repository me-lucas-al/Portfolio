"use client"

import { useActionState, useEffect } from "react"
import { createProjectAction } from "@/app/actions/project"
import { toast } from "react-toastify"

export function CreateProjectForm() {
  const [state, formAction, isPending] = useActionState(createProjectAction, null)

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error)
    }
    
    if (state?.success && state?.message) {
      toast.success(state.message)
    }
  }, [state])
  
  return (
    <form action={formAction} encType="multipart/form-data" className="space-y-6">
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
        <label className="text-sm font-medium text-neutral-400 ml-1">
          Imagens do Projeto
        </label>
        <label
          htmlFor="project-images"
          className="group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-blue-800/60 bg-linear-to-b from-neutral-900/70 to-neutral-950 px-6 py-10 text-center transition-all hover:border-blue-700 hover:from-neutral-900 hover:to-neutral-900"
        >
          <span className="text-sm font-medium text-neutral-200">
            Arraste imagens aqui ou clique para selecionar
          </span>
          <span className="mt-2 text-xs text-neutral-500">
            PNG, JPG ou WEBP até 10MB por arquivo
          </span>
          <span className="mt-5 inline-flex items-center rounded-lg border border-blue-800/70 bg-blue-950/50 px-4 py-2 text-xs font-medium text-blue-200 transition-colors group-hover:bg-blue-900/60">
            Escolher arquivos
          </span>
        </label>
        <input
          id="project-images"
          name="images"
          type="file"
          accept="image/*"
          multiple
          disabled={isPending}
          className="sr-only"
        />
        <p className="text-xs text-neutral-600 ml-1">
          A primeira imagem enviada será usada como capa do projeto.
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-400 ml-1">
          Tecnologias (separadas por vírgula)
        </label>
        <input
          name="technologies"
          disabled={isPending}
          placeholder="Next.js, Prisma, PostgreSQL"
          className="w-full px-4 py-3 rounded-xl bg-neutral-900/50 border border-neutral-800 text-white placeholder:text-neutral-600 focus:outline-none focus:border-blue-800 focus:ring-1 focus:ring-blue-800 transition-all disabled:opacity-50"
        />
      </div>

      {state?.error && (
        <p className="text-sm text-red-400 ml-1">{state.error}</p>
      )}

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