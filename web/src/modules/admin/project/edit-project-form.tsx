"use client"

import { useActionState, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { updateProjectAction } from "@/app/actions/project"
import { Loader2, X, ImageIcon } from "lucide-react"
import { toast } from "react-toastify"
import { ProjectType } from "@portfolio/packages"
import { useGetUserRole } from "@/lib/use-get-user-role"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { SortableContext, arrayMove, rectSortingStrategy, sortableKeyboardCoordinates } from "@dnd-kit/sortable"
import { SortableImageItem } from "./sortable-image-item"

interface NewImage {
  id: string
  file: File
  preview: string
}

export function EditProjectForm({ project, onCancel }: { project: ProjectType, onCancel: () => void }) {
  const [state, formAction, isPending] = useActionState(updateProjectAction, null)
  const user = useGetUserRole('USER')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [keptImages, setKeptImages] = useState<string[]>(project.imagesUrl ?? [])
  const [newImages, setNewImages] = useState<NewImage[]>([])
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

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
    setNewImages(prev => [...prev, ...files.map(file => ({ id: URL.createObjectURL(file), file, preview: URL.createObjectURL(file) }))])
    // Reset input so same file can be re-selected if needed
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleRemoveNew = (id: string) => {
    setNewImages(prev => {
      const removed = prev.find(img => img.id === id)
      if (removed) URL.revokeObjectURL(removed.preview)
      return prev.filter(img => img.id !== id)
    })
  }

  const handleKeptDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    setKeptImages(items => {
      const oldIndex = items.indexOf(active.id as string)
      const newIndex = items.indexOf(over.id as string)
      return arrayMove(items, oldIndex, newIndex)
    })
  }

  const handleNewDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    setNewImages(items => {
      const oldIndex = items.findIndex(img => img.id === active.id)
      const newIndex = items.findIndex(img => img.id === over.id)
      return arrayMove(items, oldIndex, newIndex)
    })
  }

  const handleSubmit = async (formData: FormData) => {
    // Append kept images so the action knows what to preserve
    keptImages.forEach(url => formData.append("keptImages", url))
    // Append new files for upload, in the order set by the user
    newImages.forEach(({ file }) => formData.append("images", file))
    return formAction(formData)
  }

  const hasImages = keptImages.length > 0 || newImages.length > 0

  return (
    <form action={handleSubmit} className="space-y-5 p-4">
      <input type="hidden" name="id" value={project.id} />

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
            <input name="title" defaultValue={project.title} required disabled={user} className="w-full px-4 py-3 rounded-xl bg-surface border border-line text-fg placeholder:text-muted-2 focus:outline-none focus:border-brand transition-all disabled:opacity-50" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-fg-muted ml-1">Descrição</label>
            <textarea name="description" defaultValue={project.description ?? ""} rows={5} disabled={user} className="w-full px-4 py-3 rounded-xl bg-surface border border-line text-fg placeholder:text-muted-2 focus:outline-none focus:border-brand transition-all resize-none disabled:opacity-50" />
          </div>
        </TabsContent>

        <TabsContent value="en" className="space-y-4 mt-4 data-[state=inactive]:hidden" forceMount>
          <div className="space-y-2">
            <label className="text-sm font-medium text-fg-muted ml-1">Project Title <span className="text-muted-2">(English)</span></label>
            <input name="titleEn" defaultValue={project.titleEn ?? ""} disabled={user} placeholder="English title (optional)" className="w-full px-4 py-3 rounded-xl bg-surface border border-line text-fg placeholder:text-muted-2 focus:outline-none focus:border-brand transition-all disabled:opacity-50" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-fg-muted ml-1">Description <span className="text-muted-2">(English)</span></label>
            <textarea name="descriptionEn" defaultValue={project.descriptionEn ?? ""} rows={5} disabled={user} placeholder="English description (optional)" className="w-full px-4 py-3 rounded-xl bg-surface border border-line text-fg placeholder:text-muted-2 focus:outline-none focus:border-brand transition-all resize-none disabled:opacity-50" />
          </div>
        </TabsContent>
      </Tabs>

      <div className="space-y-2">
        <label className="text-sm font-medium text-fg-muted ml-1">Tecnologias (separadas por vírgula)</label>
        <input name="technologies" defaultValue={project.technologies?.join(", ") ?? ""} placeholder="Next.js, Tailwind, Prisma..." disabled={user} className="w-full px-4 py-3 rounded-xl bg-surface border border-line text-fg placeholder:text-muted-2 focus:outline-none focus:border-brand transition-all disabled:opacity-50" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-fg-muted ml-1">URL do GitHub</label>
          <input name="githubUrl" defaultValue={project.githubUrl ?? ""} type="url" disabled={user} className="w-full px-4 py-3 rounded-xl bg-surface border border-line text-fg placeholder:text-muted-2 focus:outline-none focus:border-brand transition-all disabled:opacity-50" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-fg-muted ml-1">URL do Deploy</label>
          <input name="deployUrl" defaultValue={project.deployUrl ?? ""} type="url" disabled={user} className="w-full px-4 py-3 rounded-xl bg-surface border border-line text-fg placeholder:text-muted-2 focus:outline-none focus:border-brand transition-all disabled:opacity-50" />
        </div>
      </div>

      {/* Images section */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-fg-muted ml-1">Imagens do Projeto</label>

        {hasImages && (
          <>
            {keptImages.length > 0 && (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleKeptDragEnd}>
                <SortableContext items={keptImages} strategy={rectSortingStrategy}>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {keptImages.map((url, i) => (
                      <SortableImageItem
                        key={url}
                        id={url}
                        disabled={!!user}
                        badge={i === 0 ? "Capa" : undefined}
                        badgeClassName="bg-brand/20 text-brand border-brand/40"
                        onRemove={() => handleRemoveExisting(url)}
                      >
                        <Image src={url} alt={`Imagem ${i + 1}`} fill className="object-cover pointer-events-none" sizes="(max-width: 640px) 33vw, 25vw" />
                      </SortableImageItem>
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}

            {newImages.length > 0 && (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleNewDragEnd}>
                <SortableContext items={newImages.map(img => img.id)} strategy={rectSortingStrategy}>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-2">
                    {newImages.map((img, i) => (
                      <SortableImageItem
                        key={img.id}
                        id={img.id}
                        disabled={!!user}
                        badge={keptImages.length === 0 && i === 0 ? "Capa" : "Nova"}
                        badgeClassName={keptImages.length === 0 && i === 0 ? "bg-brand/20 text-brand border-brand/40" : "bg-prompt/20 text-prompt border-prompt/40"}
                        onRemove={() => handleRemoveNew(img.id)}
                      >
                        <img src={img.preview} alt={`Nova imagem ${i + 1}`} className="w-full h-full object-cover pointer-events-none" />
                      </SortableImageItem>
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </>
        )}

        {!user && (
          <label
            htmlFor="edit-project-images"
            className="group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-line-strong bg-surface/40 px-6 py-7 text-center transition-all hover:border-brand/60 hover:bg-surface-2/60"
          >
            <ImageIcon className="w-8 h-8 text-fg-muted group-hover:text-brand transition-colors mb-2" />
            <span className="text-sm font-medium text-fg-muted group-hover:text-fg transition-colors">
              {hasImages ? "Adicionar mais imagens" : "Adicionar imagens"}
            </span>
            <span className="mt-1 text-xs text-muted-2">PNG, JPG ou WEBP até 10MB</span>
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
        <p className="text-xs text-muted-2 ml-1">A primeira imagem é usada como capa.</p>
      </div>

      <div className="flex gap-3 pt-6">
        <button type="button" onClick={onCancel} disabled={user} className="flex-1 py-3.5 rounded-xl border border-line text-fg-muted text-sm font-medium hover:text-fg hover:bg-surface-2 transition-all disabled:opacity-50 cursor-pointer">
          Cancelar
        </button>
        <button type="submit" disabled={isPending || !!user} className="flex-1 flex justify-center items-center py-3.5 rounded-xl bg-brand hover:bg-brand-strong text-brand-ink text-sm font-semibold transition-all disabled:opacity-50 cursor-pointer">
          {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Salvar Alterações"}
        </button>
      </div>
    </form>
  )
}