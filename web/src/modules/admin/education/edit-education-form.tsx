"use client"

import { useTransition } from "react"
import { updateEducationAction } from "@/app/actions/education"
import { EducationType } from "@portfolio/packages"
import { Loader2 } from "lucide-react"
import { toast } from "react-toastify"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const formatMonthForInput = (date: Date | string | null | undefined) => {
  if (!date) return "";
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

export function EditEducationForm({ education, onSuccess }: { education: EducationType, onSuccess?: () => void }) {
  const [isPending, startTransition] = useTransition()

  const submitEditEducationForm = (formData: FormData) => {
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
    <form action={submitEditEducationForm} className="space-y-6">
      <Tabs defaultValue="pt" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-surface border border-line">
          <TabsTrigger value="pt" className="data-[state=active]:bg-brand/10 data-[state=active]:text-brand text-fg-muted">
            🇧🇷 PT-BR
          </TabsTrigger>
          <TabsTrigger value="en" className="data-[state=active]:bg-brand/10 data-[state=active]:text-brand text-fg-muted">
            🇺🇸 EN-US
          </TabsTrigger>
        </TabsList>
        <TabsContent value="pt" className="mt-4 data-[state=inactive]:hidden" forceMount>
          <div className="space-y-2">
            <label className="text-sm text-fg-muted">Curso</label>
            <input required name="course" defaultValue={education.course} className="w-full bg-surface border border-line rounded-xl px-4 py-2.5 text-fg placeholder:text-muted-2 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all" />
          </div>
        </TabsContent>
        <TabsContent value="en" className="mt-4 data-[state=inactive]:hidden" forceMount>
          <div className="space-y-2">
            <label className="text-sm text-fg-muted">Course <span className="text-muted-2">(English)</span></label>
            <input name="courseEn" defaultValue={education.courseEn ?? ""} placeholder="English course name (optional)" className="w-full bg-surface border border-line rounded-xl px-4 py-2.5 text-fg placeholder:text-muted-2 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all" />
          </div>
        </TabsContent>
      </Tabs>

      <div className="space-y-2">
        <label className="text-sm text-fg-muted">Instituição</label>
        <input required name="institution" defaultValue={education.institution} className="w-full bg-surface border border-line rounded-xl px-4 py-2.5 text-fg placeholder:text-muted-2 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all" />
      </div>

      <div className="space-y-2">
        <label className="text-sm text-fg-muted">Data de Início</label>
        <input required type="month" name="startDate" defaultValue={formatMonthForInput(education.startDate)} className="w-full bg-surface border border-line rounded-xl px-4 py-2.5 text-fg placeholder:text-muted-2 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all" />
      </div>
      <div className="space-y-2">
        <label className="text-sm text-fg-muted flex justify-between">
          Data de Término
          <span className="text-muted-2 text-[10px] mt-1">Opcional</span>
        </label>
        <input type="month" name="endDate" defaultValue={formatMonthForInput(education.endDate)} className="w-full bg-surface border border-line rounded-xl px-4 py-2.5 text-fg placeholder:text-muted-2 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all" />
      </div>

      <div className="space-y-2">
        <label className="text-sm text-fg-muted">Tipo</label>
        <input required name="type" defaultValue={education.type} className="w-full bg-surface border border-line rounded-xl px-4 py-2.5 text-fg placeholder:text-muted-2 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all" />
      </div>

      <button disabled={isPending} type="submit" className="w-full px-6 py-3 bg-brand hover:bg-brand-strong text-brand-ink font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50">
        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Atualizar Formação"}
      </button>
    </form>
  )
}
