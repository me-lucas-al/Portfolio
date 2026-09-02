"use client"

import { EducationType } from "@portfolio/packages"
import { Pencil, Trash2, Loader2, ChevronUp, ChevronDown } from "lucide-react"
import { deleteEducationAction, reorderEducationAction } from "@/app/actions/education"
import { useState, useTransition } from "react"
import { SideSheet } from "@/components/side-sheet"
import { Modal } from "@/components/modal"
import { EditEducationForm } from "./edit-education-form"
import { toast } from "react-toastify"

export function EducationList({ educations }: { educations: EducationType[] }) {
  const [editingEdu, setEditingEdu] = useState<EducationType | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [isPending, startTransition] = useTransition()

  const executeEducationDeletion = () => {
    if (deletingId) {
      startTransition(async () => {
        await deleteEducationAction(deletingId)
        toast.success("Formação deletada com sucesso!")
        setDeletingId(null)
      })
    }
  }

  const reorderEducationPosition = (id: number, direction: 'up' | 'down') => {
    startTransition(async () => {
      const result = await reorderEducationAction(id, direction)
      if (result.error) {
        toast.error(result.error)
      }
    })
  }

  if (!educations.length) return <p className="text-fg-muted text-sm py-8">Nenhuma formação cadastrada.</p>

  return (
    <div className="space-y-4">
      {educations.map((edu) => (
        <div key={edu.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl border border-line bg-surface/80 hover:bg-surface-2 hover:border-line-strong transition-colors">
          <div>
            <h4 className="text-fg font-medium">{edu.course}</h4>
            <p className="text-sm text-muted-2 mt-1">
              {edu.institution} • {new Date(edu.startDate).getFullYear()} - {edu.endDate ? new Date(edu.endDate).getFullYear() : 'Presente'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 mr-2 border-r border-line pr-2">
              <button
                disabled={isPending}
                onClick={() => reorderEducationPosition(edu.id, 'up')}
                className="p-1.5 text-fg-muted hover:text-brand hover:bg-surface-2 rounded transition-all disabled:opacity-30 cursor-pointer"
                title="Mover para cima"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <button
                disabled={isPending}
                onClick={() => reorderEducationPosition(edu.id, 'down')}
                className="p-1.5 text-fg-muted hover:text-brand hover:bg-surface-2 rounded transition-all disabled:opacity-30 cursor-pointer"
                title="Mover para baixo"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
            <button onClick={() => setEditingEdu(edu)} className="p-2 text-fg-muted hover:text-brand hover:bg-brand/10 rounded-lg transition-colors cursor-pointer">
              <Pencil className="w-4 h-4" />
            </button>
            <button
              disabled={isPending && deletingId === edu.id}
              onClick={() => setDeletingId(edu.id)}
              className="p-2 text-fg-muted hover:text-danger hover:bg-danger/10 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}

      <SideSheet.Root open={!!editingEdu} onOpenChange={(open) => !open && setEditingEdu(null)}>
        <SideSheet.Content
          title="Editar Formação"
          description="Atualize os detalhes da sua formação académica ou curso."
        >
          {editingEdu && <EditEducationForm education={editingEdu} onSuccess={() => setEditingEdu(null)} />}
        </SideSheet.Content>
      </SideSheet.Root>

      <Modal.Root open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <Modal.Content
          title="Confirmar deleção"
          description="Tem a certeza de que deseja deletar esta formação? Esta ação não pode ser desfeita."
        >
          <Modal.Footer className="flex gap-2 sm:justify-end mt-4">
            <button onClick={() => setDeletingId(null)} disabled={isPending} className="px-4 py-2 rounded-lg text-sm font-medium border border-line text-fg-muted hover:text-fg hover:bg-surface-2 transition-colors cursor-pointer">
              Cancelar
            </button>
            <button onClick={executeEducationDeletion} disabled={isPending} className="px-4 py-2 rounded-lg text-sm font-medium bg-danger/20 border border-danger/40 text-danger hover:bg-danger/30 hover:text-fg transition-colors flex items-center justify-center gap-2 min-w-[100px] cursor-pointer">
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Deletar"}
            </button>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Root>
    </div>
  )
}
