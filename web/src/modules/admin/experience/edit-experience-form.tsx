"use client"

import { useTransition } from "react"
import { updateExperienceAction } from "@/app/actions/experience"
import { ExperienceType } from "@portfolio/packages"
import { Loader2 } from "lucide-react"
import { toast } from "react-toastify"

export function EditExperienceForm({ experience, onSuccess }: { experience: ExperienceType, onSuccess?: () => void }) {
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (formData: FormData) => {
    formData.append("id", experience.id.toString())
    startTransition(async () => {
      const result = await updateExperienceAction(null, formData)
      if (result?.success) {
        toast.success("Experiência atualizada com sucesso!")
        if (onSuccess) onSuccess()
      } else {
        toast.error(result?.error || "Erro ao atualizar a experiência")
      }
    })
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm text-neutral-400">Cargo</label>
          <input required name="role" defaultValue={experience.role} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-white focus:border-blue-500" />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-neutral-400">Empresa</label>
          <input required name="company" defaultValue={experience.company} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-white focus:border-blue-500" />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm text-neutral-400">Período</label>
        <input required name="period" defaultValue={experience.period} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-white focus:border-blue-500" />
      </div>
      <div className="space-y-2">
        <label className="text-sm text-neutral-400">Descrição</label>
        <textarea required name="description" defaultValue={experience.description} rows={4} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-white focus:border-blue-500 resize-none" />
      </div>
      <div className="space-y-2">
        <label className="text-sm text-neutral-400">Tecnologias</label>
        <input name="techs" defaultValue={experience.techs?.join(", ")} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-white focus:border-blue-500" />
      </div>
      <button disabled={isPending} type="submit" className="w-full px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Atualizar Experiência"}
      </button>
    </form>
  )
}