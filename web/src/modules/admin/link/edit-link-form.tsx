"use client"

import { useActionState, useEffect } from "react"
import { updateLinkAction } from "@/app/actions/link"
import { Loader2 } from "lucide-react"
import { toast } from "react-toastify"
import { DefaultLinkType } from "@portfolio/packages/schemas/link"
import { useGetUserRole } from "@/lib/use-get-user-role"

export function EditLinkForm({ link, onCancel }: { link: DefaultLinkType & { id: number }, onCancel: () => void }) {
  const [state, formAction, isPending] = useActionState(updateLinkAction, null)
  const user = useGetUserRole('USER')

  useEffect(() => {
      if (state?.error) {
        toast.error(state.error)
        onCancel()
      }
      
      if (state?.success && state?.message) {
        toast.success(state.message)
      }
    }, [state, onCancel])

  return (
    <form action={formAction} className="space-y-5 p-4">
      <input type="hidden" name="id" value={link.id} />

      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-400 ml-1">Título do Link</label>
        <input name="title" defaultValue={link.title} required disabled={user} className="w-full px-4 py-3 rounded-xl bg-neutral-900/50 border border-neutral-800 text-white focus:outline-none focus:border-blue-800 transition-all disabled:opacity-50" />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-400 ml-1">URL</label>
        <input name="url" defaultValue={link.url} type="url" required disabled={user} className="w-full px-4 py-3 rounded-xl bg-neutral-900/50 border border-neutral-800 text-white focus:outline-none focus:border-blue-800 transition-all disabled:opacity-50" />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-400 ml-1">Ícone</label>
        <input name="icon" defaultValue={link.icon} required disabled={user} className="w-full px-4 py-3 rounded-xl bg-neutral-900/50 border border-neutral-800 text-white focus:outline-none focus:border-blue-800 transition-all disabled:opacity-50" />
        <p className="text-xs text-neutral-500 ml-1">
          Nome do ícone da biblioteca <strong>lucide-react</strong> (Ex: Github, Linkedin).
        </p>
      </div>

      <div className="flex gap-3 pt-6">
        <button type="button" onClick={onCancel} disabled={user} className="flex-1 py-3.5 rounded-xl border border-neutral-800 text-white text-sm font-medium hover:bg-neutral-900 transition-all disabled:opacity-50">
          Cancelar
        </button>
        <button type="submit" disabled={user} className="flex-1 flex justify-center items-center py-3.5 rounded-xl bg-blue-950 hover:bg-blue-900 border border-blue-800/50 text-white text-sm font-medium transition-all disabled:opacity-50">
          {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Salvar Alterações"}
        </button>
      </div>
    </form>
  )
}
