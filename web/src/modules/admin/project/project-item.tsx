"use client"


import { useState, useTransition } from "react"
import { Trash2, Edit2, Loader2 } from "lucide-react"
import { deleteProjectAction } from "@/app/actions/project"
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

  return (
    <div className="flex items-center justify-between p-5 rounded-xl border border-neutral-900 bg-neutral-950/50 group transition-all duration-300 hover:bg-neutral-900/50 hover:border-neutral-800">
      <div className="flex-1 min-w-0 pr-4">
        <h4 className="text-white font-medium truncate">{project.title}</h4>
        <div className="flex flex-wrap gap-2 mt-2">
          {project.technologies?.map((tech: string) => (
            <span key={tech} className="text-[10px] px-2 py-0.5 rounded-full bg-blue-950/30 text-blue-400 border border-blue-900/30">
              {tech}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <button className="p-2.5 text-neutral-500 hover:text-blue-400 hover:bg-blue-950/50 rounded-lg transition-all">
              <Edit2 className="w-4 h-4" />
            </button>
          </SheetTrigger>
          <SheetContent className="bg-neutral-950 border-l-neutral-900 overflow-y-auto sm:max-w-xl">
            <SheetHeader className="mb-8">
              <SheetTitle className="text-white">Editar Projeto</SheetTitle>
            </SheetHeader>
            <EditProjectForm project={project} onCancel={() => setIsSheetOpen(false)} />
          </SheetContent>
        </Sheet>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <button className="p-2.5 text-neutral-500 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-all">
              <Trash2 className="w-4 h-4" />
            </button>
          </DialogTrigger>
          <DialogContent className="bg-neutral-950 border-neutral-900 text-white">
            <DialogHeader>
              <DialogTitle>Excluir Projeto</DialogTitle>
            </DialogHeader>
            <p className="text-neutral-400 text-sm py-4">
              Tem certeza que deseja excluir o projeto <strong className="text-white">{project.title}</strong>? Esta ação não pode ser desfeita e os dados serão removidos permanentemente.
            </p>
            <DialogFooter className="gap-2 sm:gap-0">
              <DialogClose asChild>
                <button className="px-4 py-2 rounded-lg border border-neutral-800 text-neutral-300 hover:bg-neutral-900 transition-all text-sm font-medium">
                  Cancelar
                </button>
              </DialogClose>
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="flex items-center justify-center min-w-[100px] px-4 py-2 rounded-lg bg-red-950 border border-red-900/50 text-red-400 hover:bg-red-900 hover:text-white transition-all text-sm font-medium disabled:opacity-50"
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