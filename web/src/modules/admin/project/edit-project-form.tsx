"use client"

import { useActionState, useEffect } from "react"
import { updateProjectAction } from "@/app/actions/project"
import { Loader2 } from "lucide-react"

export function EditProjectForm({ project, onCancel }: { project: any, onCancel: () => void }) {
  const [state, formAction, isPending] = useActionState(updateProjectAction, null)

  useEffect(() => {
    if (state?.success) {
      onCancel()
    }
  }, [state, onCancel])

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="id" value={project.id} />

      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-400 ml-1">Título do Projeto</label>
        <input name="title" defaultValue={project.title} required disabled={isPending} className="w-full px-4 py-3 rounded-xl bg-neutral-900/50 border border-neutral-800 text-white focus:outline-none focus:border-blue-800 transition-all disabled:opacity-50" />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-400 ml-1">Descrição</label>
        <textarea name="description" defaultValue={project.description} required rows={5} disabled={isPending} className="w-full px-4 py-3 rounded-xl bg-neutral-900/50 border border-neutral-800 text-white focus:outline-none focus:border-blue-800 transition-all resize-none disabled:opacity-50" />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-400 ml-1">Tecnologias (separadas por vírgula)</label>
        <input name="technologies" defaultValue={project.technologies?.join(", ") ?? ""} placeholder="Next.js, Tailwind, Prisma..." disabled={isPending} className="w-full px-4 py-3 rounded-xl bg-neutral-900/50 border border-neutral-800 text-white focus:outline-none focus:border-blue-800 transition-all disabled:opacity-50" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-400 ml-1">URL do GitHub</label>
          <input name="githubUrl" defaultValue={project.githubUrl ?? ""} type="url" disabled={isPending} className="w-full px-4 py-3 rounded-xl bg-neutral-900/50 border border-neutral-800 text-white focus:outline-none focus:border-blue-800 transition-all disabled:opacity-50" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-400 ml-1">URL do Deploy</label>
          <input name="deployUrl" defaultValue={project.deployUrl ?? ""} type="url" disabled={isPending} className="w-full px-4 py-3 rounded-xl bg-neutral-900/50 border border-neutral-800 text-white focus:outline-none focus:border-blue-800 transition-all disabled:opacity-50" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-400 ml-1">Imagens (URLs separadas por vírgula)</label>
        <input name="imagesUrl" defaultValue={project.imagesUrl?.join(", ") ?? ""} placeholder="https://..." disabled={isPending} className="w-full px-4 py-3 rounded-xl bg-neutral-900/50 border border-neutral-800 text-white focus:outline-none focus:border-blue-800 transition-all disabled:opacity-50" />
      </div>

      <div className="flex gap-3 pt-6">
        <button type="button" onClick={onCancel} disabled={isPending} className="flex-1 py-3.5 rounded-xl border border-neutral-800 text-white text-sm font-medium hover:bg-neutral-900 transition-all disabled:opacity-50">
          Cancelar
        </button>
        <button type="submit" disabled={isPending} className="flex-1 flex justify-center items-center py-3.5 rounded-xl bg-blue-950 hover:bg-blue-900 border border-blue-800/50 text-white text-sm font-medium transition-all disabled:opacity-50">
          {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Salvar Alterações"}
        </button>
      </div>
    </form>
  )
}