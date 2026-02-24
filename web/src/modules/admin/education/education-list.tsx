"use client"

import { EducationType } from "@portfolio/packages"
import { Pencil, Trash2, Loader2 } from "lucide-react"
import { deleteEducationAction } from "@/app/actions/education"
import { useState, useTransition } from "react"
import { SideSheet } from "@/components/side-sheet"
import { Modal } from "@/components/modal"
import { EditEducationForm } from "./edit-education-form"
import { toast } from "react-toastify"

export function EducationList({ educations }: { educations: EducationType[] }) {
  const [editingEdu, setEditingEdu] = useState<EducationType | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [isPending, startTransition] = useTransition()

  const confirmDelete = () => {
    if (deletingId) {
      startTransition(async () => {
        await deleteEducationAction(deletingId)
        toast.success("Formação deletada com sucesso!")
        setDeletingId(null)
      })
    }
  }

  if (!educations.length) return <p className="text-neutral-500">Nenhuma formação cadastrada.</p>

  return (
    <div className="space-y-4">
      {educations.map((edu) => (
        <div key={edu.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl border border-neutral-800 bg-neutral-900/50 hover:border-neutral-700 transition-colors">
          <div>
            <h4 className="text-white font-medium">{edu.course}</h4>
            <p className="text-sm text-neutral-400 mt-1">{edu.institution} • {edu.period}</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setEditingEdu(edu)} className="p-2 text-neutral-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors">
              <Pencil className="w-4 h-4" />
            </button>
            <button 
              disabled={isPending && deletingId === edu.id} 
              onClick={() => setDeletingId(edu.id)} 
              className="p-2 text-neutral-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors disabled:opacity-50"
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
            <button onClick={() => setDeletingId(null)} disabled={isPending} className="px-4 py-2 rounded-lg text-sm font-medium text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors">
              Cancelar
            </button>
            <button onClick={confirmDelete} disabled={isPending} className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 hover:bg-red-700 text-white transition-colors flex items-center justify-center gap-2 min-w-[100px]">
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Deletar"}
            </button>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Root>
    </div>
  )
}