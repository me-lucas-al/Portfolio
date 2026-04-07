"use client"

import { useActionState, useEffect, useRef, useState } from "react"
import { updateProjectAction } from "@/app/actions/project"
import { Loader2, X, ImageIcon } from "lucide-react"
import { toast } from "react-toastify"
import { ProjectType } from "@portfolio/packages"
import { useGetUserRole } from "@/lib/use-get-user-role"

export function EditProjectForm({ project, onCancel }: { project: ProjectType, onCancel: () => void }) {
  const [state, formAction, isPending] = useActionState(updateProjectAction, null)
  const user = useGetUserRole('USER')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [keptImages, setKeptImages] = useState<string[]>(project.imagesUrl ?? [])
  const [newFiles, setNewFiles] = useState<File[]>([])
  const [newPreviews, setNewPreviews] = useState<string[]>([])

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error)
      onCancel()
    }
    if (state?.success && state?.message) {
      toast.success(state.message)
    }
  }, [state, onCancel])

  const handleRemoveExisting = (url: string) => {
    setKeptImages(prev => prev.filter(u => u !== url))
  }

  const handleNewFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setNewFiles(prev => [...prev, ...files])
    const previews = files.map(f => URL.createObjectURL(f))
    setNewPreviews(prev => [...prev, ...previews])
    // Reset input so same file can be re-selected if needed
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleRemoveNew = (index: number) => {
    setNewFiles(prev => prev.filter((_, i) => i !== index))
    setNewPreviews(prev => {
      URL.revokeObjectURL(prev[index])
      return prev.filter((_, i) => i !== index)
    })
  }

  const handleSubmit = async (formData: FormData) => {
    // Append kept images so the action knows what to preserve
    keptImages.forEach(url => formData.append("keptImages", url))
    // Append new files for upload
    newFiles.forEach(file => formData.append("images", file))
    return formAction(formData)
  }

  const hasImages = keptImages.length > 0 || newPreviews.length > 0

  return (
    <form action={handleSubmit} encType="multipart/form-data" className="space-y-5 p-4">
      <input type="hidden" name="id" value={project.id} />

      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-400 ml-1">Título do Projeto</label>
        <input name="title" defaultValue={project.title} required disabled={user} className="w-full px-4 py-3 rounded-xl bg-neutral-900/50 border border-neutral-800 text-white focus:outline-none focus:border-blue-800 transition-all disabled:opacity-50" />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-400 ml-1">Descrição</label>
        <textarea name="description" defaultValue={project.description ?? ""} rows={5} disabled={user} className="w-full px-4 py-3 rounded-xl bg-neutral-900/50 border border-neutral-800 text-white focus:outline-none focus:border-blue-800 transition-all resize-none disabled:opacity-50" />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-400 ml-1">Tecnologias (separadas por vírgula)</label>
        <input name="technologies" defaultValue={project.technologies?.join(", ") ?? ""} placeholder="Next.js, Tailwind, Prisma..." disabled={user} className="w-full px-4 py-3 rounded-xl bg-neutral-900/50 border border-neutral-800 text-white focus:outline-none focus:border-blue-800 transition-all disabled:opacity-50" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-400 ml-1">URL do GitHub</label>
          <input name="githubUrl" defaultValue={project.githubUrl ?? ""} type="url" disabled={user} className="w-full px-4 py-3 rounded-xl bg-neutral-900/50 border border-neutral-800 text-white focus:outline-none focus:border-blue-800 transition-all disabled:opacity-50" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-400 ml-1">URL do Deploy</label>
          <input name="deployUrl" defaultValue={project.deployUrl ?? ""} type="url" disabled={user} className="w-full px-4 py-3 rounded-xl bg-neutral-900/50 border border-neutral-800 text-white focus:outline-none focus:border-blue-800 transition-all disabled:opacity-50" />
        </div>
      </div>

      {/* Images section */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-neutral-400 ml-1">Imagens do Projeto</label>

        {hasImages && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {keptImages.map((url, i) => (
              <div key={url} className="relative group aspect-video rounded-lg overflow-hidden border border-neutral-800">
                <img src={url} alt={`Imagem ${i + 1}`} className="w-full h-full object-cover" />
                {i === 0 && (
                  <span className="absolute top-1 left-1 text-[10px] font-semibold bg-blue-900/80 text-blue-200 px-1.5 py-0.5 rounded">Capa</span>
                )}
                {!user && (
                  <button
                    type="button"
                    onClick={() => handleRemoveExisting(url)}
                    className="absolute top-1 right-1 p-0.5 rounded-full bg-black/60 text-red-400 hover:bg-red-950 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
            {newPreviews.map((src, i) => (
              <div key={src} className="relative group aspect-video rounded-lg overflow-hidden border border-blue-900/50">
                <img src={src} alt={`Nova imagem ${i + 1}`} className="w-full h-full object-cover" />
                <span className="absolute top-1 left-1 text-[10px] font-semibold bg-blue-950/80 text-blue-300 px-1.5 py-0.5 rounded">Nova</span>
                {!user && (
                  <button
                    type="button"
                    onClick={() => handleRemoveNew(i)}
                    className="absolute top-1 right-1 p-0.5 rounded-full bg-black/60 text-red-400 hover:bg-red-950 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {!user && (
          <label
            htmlFor="edit-project-images"
            className="group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-blue-800/50 bg-neutral-900/30 px-6 py-7 text-center transition-all hover:border-blue-700 hover:bg-neutral-900/60"
          >
            <ImageIcon className="w-8 h-8 text-neutral-600 group-hover:text-blue-500 transition-colors mb-2" />
            <span className="text-sm font-medium text-neutral-400 group-hover:text-neutral-200 transition-colors">
              {hasImages ? "Adicionar mais imagens" : "Adicionar imagens"}
            </span>
            <span className="mt-1 text-xs text-neutral-600">PNG, JPG ou WEBP até 10MB</span>
          </label>
        )}

        <input
          ref={fileInputRef}
          id="edit-project-images"
          type="file"
          accept="image/*"
          multiple
          disabled={isPending || !!user}
          onChange={handleNewFiles}
          className="sr-only"
        />
        <p className="text-xs text-neutral-600 ml-1">A primeira imagem é usada como capa.</p>
      </div>

      <div className="flex gap-3 pt-6">
        <button type="button" onClick={onCancel} disabled={user} className="flex-1 py-3.5 rounded-xl border border-neutral-800 text-white text-sm font-medium hover:bg-neutral-900 transition-all disabled:opacity-50">
          Cancelar
        </button>
        <button type="submit" disabled={isPending || !!user} className="flex-1 flex justify-center items-center py-3.5 rounded-xl bg-blue-950 hover:bg-blue-900 border border-blue-800/50 text-white text-sm font-medium transition-all disabled:opacity-50">
          {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Salvar Alterações"}
        </button>
      </div>
    </form>
  )
}