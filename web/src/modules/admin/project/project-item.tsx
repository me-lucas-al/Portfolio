"use client"

import Image from "next/image"
import { useState, useTransition } from "react"
import { Trash2, Edit2, Loader2, ChevronUp, ChevronDown, FolderGit2 } from "lucide-react"
import { deleteProjectAction, reorderProjectAction } from "@/app/actions/project"
import { EditProjectForm } from "./edit-project-form"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { ProjectType } from "@portfolio/packages"
import { toast } from "react-toastify"

export function ProjectItem({ project }: { project: ProjectType }) {
  const [isPending, startTransition] = useTransition()
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleDelete = () => {
    startTransition(async () => {
      await deleteProjectAction(project.id)
      toast.success("Projeto deletado com sucesso!")
      setIsDialogOpen(false)
    })
  }

  const handleReorder = (direction: 'up' | 'down') => {
    startTransition(async () => {
      const result = await reorderProjectAction(project.id, direction)
      if (result.error) {
        toast.error(result.error)
      }
    })
  }

  return (
    <div className="flex items-center justify-between p-5 rounded-xl border border-line bg-surface/80 group transition-all duration-300 hover:bg-surface-2 hover:border-line-strong">
      <div className="flex flex-1 min-w-0 pr-4 items-center">
        <div className="relative flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border border-line bg-surface-2 flex items-center justify-center mr-4">
          {project.imagesUrl && project.imagesUrl.length > 0 ? (
            <Image src={project.imagesUrl[0]} alt={project.title} fill className="object-cover" sizes="48px" />
          ) : (
            <FolderGit2 className="w-6 h-6 text-fg-muted" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-fg font-medium truncate">{project.title}</h4>
          <div className="flex flex-wrap gap-2 mt-2">
            {project.technologies?.map((tech: string) => (
              <span key={tech} className="text-[10px] px-2.5 py-0.5 rounded-full bg-surface-2 text-fg-muted border border-line font-mono">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
        <div className="flex items-center gap-1 mr-2 border-r border-line pr-2">
          <button
            disabled={isPending}
            onClick={() => handleReorder('up')}
            className="p-1.5 text-fg-muted hover:text-brand hover:bg-surface-2 rounded transition-all disabled:opacity-30 cursor-pointer"
            title="Mover para cima"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button
            disabled={isPending}
            onClick={() => handleReorder('down')}
            className="p-1.5 text-fg-muted hover:text-brand hover:bg-surface-2 rounded transition-all disabled:opacity-30 cursor-pointer"
            title="Mover para baixo"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <button className="p-2.5 text-fg-muted hover:text-brand hover:bg-brand/10 rounded-lg transition-all cursor-pointer">
              <Edit2 className="w-4 h-4" />
            </button>
          </SheetTrigger>
          <SheetContent className="bg-surface border-l-line overflow-y-auto sm:max-w-xl text-fg">
            <SheetHeader className="mb-8">
              <SheetTitle className="text-fg font-semibold">Editar Projeto</SheetTitle>
            </SheetHeader>
            <EditProjectForm project={project} onCancel={() => setIsSheetOpen(false)} />
          </SheetContent>
        </Sheet>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <button className="p-2.5 text-fg-muted hover:text-danger hover:bg-danger/10 rounded-lg transition-all cursor-pointer">
              <Trash2 className="w-4 h-4" />
            </button>
          </DialogTrigger>
          <DialogContent className="bg-surface border-line text-fg">
            <DialogHeader>
              <DialogTitle className="text-fg">Excluir Projeto</DialogTitle>
            </DialogHeader>
            <p className="text-fg-muted text-sm py-4">
              Tem certeza que deseja excluir o projeto <strong className="text-fg">{project.title}</strong>? Esta ação não pode ser desfeita e os dados serão removidos permanentemente.
            </p>
            <DialogFooter className="gap-2 sm:gap-0">
              <DialogClose asChild>
                <button className="px-4 py-2 rounded-lg border border-line text-fg-muted hover:text-fg hover:bg-surface-2 transition-all text-sm font-medium cursor-pointer">
                  Cancelar
                </button>
              </DialogClose>
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="flex items-center justify-center min-w-[100px] px-4 py-2 rounded-lg bg-danger/20 border border-danger/40 text-danger hover:bg-danger/30 hover:text-fg transition-all text-sm font-medium disabled:opacity-50 cursor-pointer"
              >
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sim, Excluir"}
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
