"use client"

import { useTransition } from "react"
import { updateExperienceAction } from "@/app/actions/experience"
import { ExperienceType } from "@portfolio/packages"
import { Loader2 } from "lucide-react"
import { toast } from "react-toastify"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Função para converter o Date do banco para formato "YYYY-MM" do input type="month"
const formatMonthForInput = (date: Date | string | null | undefined) => {
  if (!date) return "";
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

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
      <div className="space-y-2">
        <label className="text-sm text-fg-muted">Empresa</label>
        <input required name="company" defaultValue={experience.company} className="w-full bg-surface border border-line rounded-xl px-4 py-2.5 text-fg placeholder:text-muted-2 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm text-fg-muted">Data de Início</label>
          <input required type="month" name="startDate" defaultValue={formatMonthForInput(experience.startDate)} className="w-full bg-surface border border-line rounded-xl px-4 py-2.5 text-fg placeholder:text-muted-2 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all" />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-fg-muted flex justify-between">
            Data de Término
            <span className="text-muted-2 text-[10px] mt-1">Opcional</span>
          </label>
          <input type="month" name="endDate" defaultValue={formatMonthForInput(experience.endDate)} className="w-full bg-surface border border-line rounded-xl px-4 py-2.5 text-fg placeholder:text-muted-2 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all" />
        </div>
      </div>

      <Tabs defaultValue="pt" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-surface border border-line">
          <TabsTrigger value="pt" className="data-[state=active]:bg-brand/10 data-[state=active]:text-brand text-fg-muted">
            🇧🇷 PT-BR
          </TabsTrigger>
          <TabsTrigger value="en" className="data-[state=active]:bg-brand/10 data-[state=active]:text-brand text-fg-muted">
            🇺🇸 EN-US
          </TabsTrigger>
        </TabsList>
        <TabsContent value="pt" className="space-y-4 mt-4 data-[state=inactive]:hidden" forceMount>
          <div className="space-y-2">
            <label className="text-sm text-fg-muted">Cargo</label>
            <input required name="role" defaultValue={experience.role} className="w-full bg-surface border border-line rounded-xl px-4 py-2.5 text-fg placeholder:text-muted-2 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-fg-muted">Descrição</label>
            <textarea required name="description" defaultValue={experience.description} rows={4} className="w-full bg-surface border border-line rounded-xl px-4 py-2.5 text-fg placeholder:text-muted-2 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all resize-none" />
          </div>
        </TabsContent>
        <TabsContent value="en" className="space-y-4 mt-4 data-[state=inactive]:hidden" forceMount>
          <div className="space-y-2">
            <label className="text-sm text-fg-muted">Role <span className="text-muted-2">(English)</span></label>
            <input name="roleEn" defaultValue={experience.roleEn ?? ""} placeholder="English role (optional)" className="w-full bg-surface border border-line rounded-xl px-4 py-2.5 text-fg placeholder:text-muted-2 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-fg-muted">Description <span className="text-muted-2">(English)</span></label>
            <textarea name="descriptionEn" defaultValue={experience.descriptionEn ?? ""} rows={4} placeholder="English description (optional)" className="w-full bg-surface border border-line rounded-xl px-4 py-2.5 text-fg placeholder:text-muted-2 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all resize-none" />
          </div>
        </TabsContent>
      </Tabs>
      <div className="space-y-2">
        <label className="text-sm text-fg-muted">Tecnologias</label>
        <input name="techs" defaultValue={experience.techs?.join(", ")} className="w-full bg-surface border border-line rounded-xl px-4 py-2.5 text-fg placeholder:text-muted-2 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all" />
      </div>
      <button disabled={isPending} type="submit" className="w-full px-6 py-3 bg-brand hover:bg-brand-strong text-brand-ink font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50">
        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Atualizar Experiência"}
      </button>
    </form>
  )
}