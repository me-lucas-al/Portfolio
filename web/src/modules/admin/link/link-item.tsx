"use client"

import { useState, useTransition } from "react"
import { Trash2, Edit2, Loader2, ChevronUp, ChevronDown } from "lucide-react"
import { deleteLinkAction, reorderLinkAction } from "@/app/actions/link"
import { EditLinkForm } from "./edit-link-form"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { DefaultLinkType } from "@portfolio/packages/schemas/link"
import { toast } from "react-toastify"
import * as LucideIcons from "lucide-react"

export function LinkItem({ link }: { link: DefaultLinkType & { id: number } }) {
  const [isPending, startTransition] = useTransition()
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleDelete = () => {
    startTransition(async () => {
      await deleteLinkAction(link.id)
      toast.success("Link deletado com sucesso!")
      setIsDialogOpen(false)
    })
  }

  const handleReorder = (direction: 'up' | 'down') => {
    startTransition(async () => {
      const result = await reorderLinkAction(link.id, direction)
      if (result.error) {
        toast.error(result.error)
      }
    })
  }

  // Obter dinamicamente o ícone do lucide-react com base na string salva
  // @ts-ignore
  const IconComponent = LucideIcons[link.icon] || LucideIcons.Link

  return (
    <div className="flex items-center justify-between p-5 rounded-xl border border-neutral-900 bg-neutral-950/50 group transition-all duration-300 hover:bg-neutral-900/50 hover:border-neutral-800">
      <div className="flex items-center gap-4 flex-1 min-w-0 pr-4">
        <div className="p-3 bg-neutral-900/50 rounded-lg text-neutral-400 group-hover:text-blue-400 transition-colors">
          <IconComponent className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-white font-medium truncate">{link.title}</h4>
          <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-sm text-neutral-500 hover:text-blue-400 hover:underline truncate inline-block max-w-[200px] sm:max-w-md">
            {link.url}
          </a>
        </div>
      </div>

      <div className="flex items-center gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
        <div className="flex items-center gap-1 mr-2 border-r border-neutral-800 pr-2">
          <button 
            disabled={isPending}
            onClick={() => handleReorder('up')}
            className="p-1.5 text-neutral-500 hover:text-blue-400 hover:bg-neutral-800 rounded transition-all disabled:opacity-30"
            title="Mover para cima"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button 
            disabled={isPending}
            onClick={() => handleReorder('down')}
            className="p-1.5 text-neutral-500 hover:text-blue-400 hover:bg-neutral-800 rounded transition-all disabled:opacity-30"
            title="Mover para baixo"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <button className="p-2.5 text-neutral-500 hover:text-blue-400 hover:bg-blue-950/50 rounded-lg transition-all">
              <Edit2 className="w-4 h-4" />
            </button>
          </SheetTrigger>
          <SheetContent className="bg-neutral-950 border-l-neutral-900 overflow-y-auto sm:max-w-xl">
            <SheetHeader className="mb-8">
              <SheetTitle className="text-white">Editar Link</SheetTitle>
            </SheetHeader>
            <EditLinkForm link={link} onCancel={() => setIsSheetOpen(false)} />
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
              <DialogTitle>Excluir Link</DialogTitle>
            </DialogHeader>
            <p className="text-neutral-400 text-sm py-4">
              Tem certeza que deseja excluir o link <strong className="text-white">{link.title}</strong>? Esta ação não pode ser desfeita.
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
