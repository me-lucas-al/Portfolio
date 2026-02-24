"use client"

import { useTransition } from "react"
import { updateEducationAction } from "@/app/actions/education"
import { EducationType } from "@portfolio/packages"
import { Loader2 } from "lucide-react"
import { toast } from "react-toastify"

export function EditEducationForm({ education, onSuccess }: { education: EducationType, onSuccess?: () => void }) {
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (formData: FormData) => {
    formData.append("id", education.id.toString())
    startTransition(async () => {
      const result = await updateEducationAction(null, formData)
      if (result?.success) {
        toast.success("Formação atualizada com sucesso!")
        if (onSuccess) onSuccess()
      } else {
        toast.error(result?.error || "Erro ao atualizar a formação")
      }
    })
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm text-neutral-400">Curso</label>
          <input required name="course" defaultValue={education.course} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-white focus:border-blue-500" />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-neutral-400">Instituição</label>
          <input required name="institution" defaultValue={education.institution} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-white focus:border-blue-500" />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-neutral-400">Período</label>
          <input required name="period" defaultValue={education.period} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-white focus:border-blue-500" />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-neutral-400">Tipo</label>
          <input required name="type" defaultValue={education.type} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-white focus:border-blue-500" />
        </div>
      </div>
      <button disabled={isPending} type="submit" className="w-full px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Atualizar Formação"}
      </button>
    </form>
  )
}