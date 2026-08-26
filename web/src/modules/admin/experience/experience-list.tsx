"use client"

import { ExperienceType } from "@portfolio/packages"
import { Pencil, Trash2, Loader2, ChevronUp, ChevronDown } from "lucide-react"
import { deleteExperienceAction, reorderExperienceAction } from "@/app/actions/experience"
import { useState, useTransition } from "react"
import { SideSheet } from "@/components/side-sheet"
import { Modal } from "@/components/modal"
import { EditExperienceForm } from "./edit-experience-form"
import { toast } from "react-toastify"

export function ExperienceList({ experiences }: { experiences: ExperienceType[] }) {
  const [editingExp, setEditingExp] = useState<ExperienceType | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [isPending, startTransition] = useTransition()

  const confirmDelete = () => {
    if (deletingId) {
      startTransition(async () => {
        await deleteExperienceAction(deletingId)
        toast.success("Experiência deletada com sucesso!")
        setDeletingId(null)
      })
    }
  }

  const handleReorder = (id: number, direction: 'up' | 'down') => {
    startTransition(async () => {
      const result = await reorderExperienceAction(id, direction)
      if (result.error) {
        toast.error(result.error)
      }
    })
  }

  if (!experiences.length) return <p className="text-fg-muted text-sm py-8">Nenhuma experiência cadastrada.</p>

  return (
    <div className="space-y-4">
      {experiences.map((exp) => (
        <div key={exp.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl border border-line bg-surface/80 hover:bg-surface-2 hover:border-line-strong transition-colors">
          <div>
            <h4 className="text-fg font-medium">{exp.role} <span className="text-fg-muted font-normal">na {exp.company}</span></h4>
            <p className="text-sm text-muted-2 mt-1">
              {new Date(exp.startDate).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })} - {exp.endDate ? new Date(exp.endDate).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }) : 'Presente'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 mr-2 border-r border-line pr-2">
              <button 
                disabled={isPending}
                onClick={() => handleReorder(exp.id, 'up')}
                className="p-1.5 text-fg-muted hover:text-brand hover:bg-surface-2 rounded transition-all disabled:opacity-30 cursor-pointer"
                title="Mover para cima"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <button 
                disabled={isPending}
                onClick={() => handleReorder(exp.id, 'down')}
                className="p-1.5 text-fg-muted hover:text-brand hover:bg-surface-2 rounded transition-all disabled:opacity-30 cursor-pointer"
                title="Mover para baixo"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
            <button onClick={() => setEditingExp(exp)} className="p-2 text-fg-muted hover:text-brand hover:bg-brand/10 rounded-lg transition-colors cursor-pointer">
              <Pencil className="w-4 h-4" />
            </button>
            <button 
              disabled={isPending && deletingId === exp.id} 
              onClick={() => setDeletingId(exp.id)} 
              className="p-2 text-fg-muted hover:text-danger hover:bg-danger/10 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}

      <SideSheet.Root open={!!editingExp} onOpenChange={(open) => !open && setEditingExp(null)}>
        <SideSheet.Content 
          title="Editar Experiência" 
          description="Atualize as informações da sua experiência profissional abaixo."
        >
          {editingExp && <EditExperienceForm experience={editingExp} onSuccess={() => setEditingExp(null)} />}
        </SideSheet.Content>
      </SideSheet.Root>

      <Modal.Root open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <Modal.Content 
          title="Confirmar deleção" 
          description="Tem a certeza de que deseja deletar esta experiência? Esta ação não pode ser desfeita."
        >
          <Modal.Footer className="flex gap-2 sm:justify-end mt-4">
            <button onClick={() => setDeletingId(null)} disabled={isPending} className="px-4 py-2 rounded-lg text-sm font-medium border border-line text-fg-muted hover:text-fg hover:bg-surface-2 transition-colors cursor-pointer">
              Cancelar
            </button>
            <button onClick={confirmDelete} disabled={isPending} className="px-4 py-2 rounded-lg text-sm font-medium bg-danger/20 border border-danger/40 text-danger hover:bg-danger/30 hover:text-fg transition-colors flex items-center justify-center gap-2 min-w-[100px] cursor-pointer">
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Deletar"}
            </button>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Root>
    </div>
  )
}