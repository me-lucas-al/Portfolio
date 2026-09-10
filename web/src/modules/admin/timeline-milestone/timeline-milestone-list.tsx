"use client"

import { TimelineMilestoneType } from "@portfolio/packages"
import { Pencil, Trash2, Loader2, ChevronUp, ChevronDown } from "lucide-react"
import { deleteTimelineMilestoneAction, reorderTimelineMilestoneAction } from "@/app/actions/timeline-milestone"
import { useState, useTransition } from "react"
import { SideSheet } from "@/components/side-sheet"
import { Modal } from "@/components/modal"
import { EditTimelineMilestoneForm } from "./edit-timeline-milestone-form"
import { toast } from "react-toastify"

export function TimelineMilestoneList({ milestones }: { milestones: TimelineMilestoneType[] }) {
  const [editingMilestone, setEditingMilestone] = useState<TimelineMilestoneType | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [isPending, startTransition] = useTransition()

  const executeMilestoneDeletion = () => {
    if (deletingId) {
      startTransition(async () => {
        await deleteTimelineMilestoneAction(deletingId)
        toast.success("Marco da jornada deletado com sucesso!")
        setDeletingId(null)
      })
    }
  }

  const reorderMilestonePosition = (id: number, direction: 'up' | 'down') => {
    startTransition(async () => {
      const result = await reorderTimelineMilestoneAction(id, direction)
      if (result.error) {
        toast.error(result.error)
      }
    })
  }

  if (!milestones.length) return <p className="text-fg-muted text-sm py-8">Nenhum marco cadastrado na jornada.</p>

  return (
    <div className="space-y-4">
      {milestones.map((milestone) => (
        <div key={milestone.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl border border-line bg-surface/80 hover:bg-surface-2 hover:border-line-strong transition-colors">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`text-[11px] font-medium px-2 py-0.5 rounded-md border ${
                  milestone.kind === "GAP"
                    ? "bg-surface-2 text-muted-2 border-line-strong"
                    : "bg-brand/20 text-brand border-brand/40"
                }`}
              >
                {milestone.kind === "GAP" ? "Hiato" : "Marco"}
              </span>
              <h4 className="text-fg font-medium">{milestone.titlePt}</h4>
            </div>
            <p className="text-sm text-muted-2">
              {milestone.dateLabelPt} • <span className="text-xs font-mono">{milestone.slug}</span>
            </p>
            {milestone.impactPt && (
              <p className="text-xs text-fg-muted/80 line-clamp-2 max-w-xl">
                {milestone.impactPt}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 mr-2 border-r border-line pr-2">
              <button
                disabled={isPending}
                onClick={() => reorderMilestonePosition(milestone.id, 'up')}
                className="p-1.5 text-fg-muted hover:text-brand hover:bg-surface-2 rounded transition-all disabled:opacity-30 cursor-pointer"
                title="Mover para cima"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <button
                disabled={isPending}
                onClick={() => reorderMilestonePosition(milestone.id, 'down')}
                className="p-1.5 text-fg-muted hover:text-brand hover:bg-surface-2 rounded transition-all disabled:opacity-30 cursor-pointer"
                title="Mover para baixo"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
            <button onClick={() => setEditingMilestone(milestone)} className="p-2 text-fg-muted hover:text-brand hover:bg-brand/10 rounded-lg transition-colors cursor-pointer">
              <Pencil className="w-4 h-4" />
            </button>
            <button
              disabled={isPending && deletingId === milestone.id}
              onClick={() => setDeletingId(milestone.id)}
              className="p-2 text-fg-muted hover:text-danger hover:bg-danger/10 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}

      <SideSheet.Root open={!!editingMilestone} onOpenChange={(open) => !open && setEditingMilestone(null)}>
        <SideSheet.Content
          title="Editar Marco da Jornada"
          description="Atualize os textos, imagens e detalhes deste marco."
        >
          {editingMilestone && <EditTimelineMilestoneForm key={editingMilestone.id} milestone={editingMilestone} onSuccess={() => setEditingMilestone(null)} />}
        </SideSheet.Content>
      </SideSheet.Root>

      <Modal.Root open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <Modal.Content
          title="Confirmar deleção"
          description="Tem a certeza de que deseja deletar este marco da jornada? Esta ação não pode ser desfeita."
        >
          <Modal.Footer className="flex gap-2 sm:justify-end mt-4">
            <button onClick={() => setDeletingId(null)} disabled={isPending} className="px-4 py-2 rounded-lg text-sm font-medium border border-line text-fg-muted hover:text-fg hover:bg-surface-2 transition-colors cursor-pointer">
              Cancelar
            </button>
            <button onClick={executeMilestoneDeletion} disabled={isPending} className="px-4 py-2 rounded-lg text-sm font-medium bg-danger/20 border border-danger/40 text-danger hover:bg-danger/30 hover:text-fg transition-colors flex items-center justify-center gap-2 min-w-[100px] cursor-pointer">
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Deletar"}
            </button>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Root>
    </div>
  )
}
