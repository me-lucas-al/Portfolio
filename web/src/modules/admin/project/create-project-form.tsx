"use client"

import { useActionState, useEffect, useRef, useState } from "react"
import { createProjectAction } from "@/app/actions/project"
import { toast } from "react-toastify"
import { Loader2, X, ImageIcon } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function CreateProjectForm() {
  const [state, formAction, isPending] = useActionState(createProjectAction, null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [newFiles, setNewFiles] = useState<File[]>([])
  const [newPreviews, setNewPreviews] = useState<string[]>([])

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error)
    }
    
    if (state?.success && state?.message) {
      toast.success(state.message)
      setNewFiles([])
      setNewPreviews([])
    }
  }, [state])
  
  const handleNewFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setNewFiles(prev => [...prev, ...files])
    const previews = files.map(f => URL.createObjectURL(f))
    setNewPreviews(prev => [...prev, ...previews])
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
    newFiles.forEach(file => formData.append("images", file))
    return formAction(formData)
  }
  
  const hasImages = newPreviews.length > 0

  return (
    <form action={handleSubmit} className="space-y-6">
      <Tabs defaultValue="pt" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-surface border border-line">
          <TabsTrigger value="pt" className="data-[state=active]:bg-brand/10 data-[state=active]:text-brand text-fg-muted">
            🇧🇷 PT-BR
          </TabsTrigger>
          <TabsTrigger value="en" className="data-[state=active]:bg-brand/10 data-[state=active]:text-brand text-fg-muted">
            🇺🇸 EN-US
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pt" className="space-y-4 mt-4 data-[state=inactive]:hidden" forceMount>
          <div className="space-y-2">
            <label className="text-sm font-medium text-fg-muted ml-1">Título do Projeto</label>
            <input 
              name="title" 
              required 
              disabled={isPending}
              className="w-full px-4 py-3 rounded-xl bg-surface border border-line text-fg placeholder:text-muted-2 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all disabled:opacity-50" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-fg-muted ml-1">Descrição</label>
            <textarea 
              name="description" 
              rows={4} 
              disabled={isPending}
              className="w-full px-4 py-3 rounded-xl bg-surface border border-line text-fg placeholder:text-muted-2 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all resize-none disabled:opacity-50" 
            />
          </div>
        </TabsContent>

        <TabsContent value="en" className="space-y-4 mt-4 data-[state=inactive]:hidden" forceMount>
          <div className="space-y-2">
            <label className="text-sm font-medium text-fg-muted ml-1">Project Title <span className="text-muted-2">(English)</span></label>
            <input 
              name="titleEn" 
              disabled={isPending}
              placeholder="English title (optional)"
              className="w-full px-4 py-3 rounded-xl bg-surface border border-line text-fg placeholder:text-muted-2 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all disabled:opacity-50" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-fg-muted ml-1">Description <span className="text-muted-2">(English)</span></label>
            <textarea 
              name="descriptionEn" 
              rows={4} 
              disabled={isPending}
              placeholder="English description (optional)"
              className="w-full px-4 py-3 rounded-xl bg-surface border border-line text-fg placeholder:text-muted-2 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all resize-none disabled:opacity-50" 
            />
          </div>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-fg-muted ml-1">URL do GitHub</label>
          <input 
            name="githubUrl" 
            type="url" 
            disabled={isPending}
            className="w-full px-4 py-3 rounded-xl bg-surface border border-line text-fg placeholder:text-muted-2 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all disabled:opacity-50" 
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-fg-muted ml-1">URL do Deploy</label>
          <input 
            name="deployUrl" 
            type="url" 
            disabled={isPending}
            className="w-full px-4 py-3 rounded-xl bg-surface border border-line text-fg placeholder:text-muted-2 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all disabled:opacity-50" 
          />
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium text-fg-muted ml-1">Imagens do Projeto</label>

        {hasImages && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {newPreviews.map((src, i) => (
              <div key={src} className="relative group aspect-video rounded-lg overflow-hidden border border-line-strong bg-surface-2">
                <img src={src} alt={`Nova imagem ${i + 1}`} className="w-full h-full object-cover" />
                {i === 0 && (
                  <span className="absolute top-1 left-1 text-[10px] font-semibold bg-brand/20 text-brand border border-brand/40 px-1.5 py-0.5 rounded">Capa</span>
                )}
                <button
                  type="button"
                  onClick={() => handleRemoveNew(i)}
                  className="absolute top-1 right-1 p-1 rounded-full bg-ink/80 text-danger hover:bg-danger/20 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        <label
          htmlFor="create-project-images"
          className="group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-line-strong bg-surface/40 px-6 py-8 text-center transition-all hover:border-brand/60 hover:bg-surface-2/60 disabled:opacity-50"
        >
          <ImageIcon className="w-8 h-8 text-fg-muted group-hover:text-brand transition-colors mb-2" />
          <span className="text-sm font-medium text-fg-muted group-hover:text-fg transition-colors">
            {hasImages ? "Adicionar mais imagens" : "Selecionar imagens"}
          </span>
          <span className="mt-1 text-xs text-muted-2">PNG, JPG ou WEBP até 10MB</span>
        </label>

        <input
          ref={fileInputRef}
          id="create-project-images"
          type="file"
          accept="image/*"
          multiple
          disabled={isPending}
          onChange={handleNewFiles}
          className="sr-only"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-fg-muted ml-1">
          Tecnologias (separadas por vírgula)
        </label>
        <input
          name="technologies"
          disabled={isPending}
          placeholder="Next.js, Prisma, PostgreSQL"
          className="w-full px-4 py-3 rounded-xl bg-surface border border-line text-fg placeholder:text-muted-2 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all disabled:opacity-50"
        />
      </div>

      {state?.error && (
        <p className="text-sm text-danger ml-1">{state.error}</p>
      )}

      <button 
        type="submit" 
        disabled={isPending}
        className="w-full py-4 rounded-xl bg-brand hover:bg-brand-strong text-brand-ink text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-brand disabled:opacity-50 flex justify-center items-center cursor-pointer"
      >
        {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Adicionar ao Portfólio"}
      </button>
    </form>
  )
}