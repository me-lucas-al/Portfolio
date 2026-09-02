"use client"

import { useRef, useTransition } from "react"
import { createExperienceAction } from "@/app/actions/experience"
import { Loader2 } from "lucide-react"
import { toast } from "react-toastify"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function CreateExperienceForm() {
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  const submitCreateExperienceForm = (formData: FormData) => {
    startTransition(async () => {
      const result = await createExperienceAction(null, formData)
      if (result?.success) {
        formRef.current?.reset()
        toast.success("Experiência criada com sucesso!")
      } else {
        toast.error(result?.error || "Erro ao criar experiência")
      }
    })
  }

  return (
    <form ref={formRef} action={submitCreateExperienceForm} className="space-y-6 max-w-2xl">
      <div className="space-y-2">
        <label className="text-sm font-medium text-fg-muted">Empresa</label>
        <input required name="company" placeholder="Ex: Star Seg" className="w-full bg-surface border border-line rounded-xl px-4 py-2.5 text-fg placeholder:text-muted-2 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-fg-muted">Data de Início</label>
          <input required type="month" name="startDate" className="w-full bg-surface border border-line rounded-xl px-4 py-2.5 text-fg placeholder:text-muted-2 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-fg-muted flex justify-between">
            Data de Término
            <span className="text-muted-2 text-xs font-normal">Opcional (Deixe vazio se atual)</span>
          </label>
          <input type="month" name="endDate" className="w-full bg-surface border border-line rounded-xl px-4 py-2.5 text-fg placeholder:text-muted-2 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all" />
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
            <label className="text-sm font-medium text-fg-muted">Cargo</label>
            <input required name="role" placeholder="Ex: Desenvolvedor Front-end" className="w-full bg-surface border border-line rounded-xl px-4 py-2.5 text-fg placeholder:text-muted-2 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-fg-muted">Descrição</label>
            <textarea required name="description" rows={4} placeholder="Descreva suas responsabilidades..." className="w-full bg-surface border border-line rounded-xl px-4 py-2.5 text-fg placeholder:text-muted-2 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all resize-none" />
          </div>
        </TabsContent>
        <TabsContent value="en" className="space-y-4 mt-4 data-[state=inactive]:hidden" forceMount>
          <div className="space-y-2">
            <label className="text-sm font-medium text-fg-muted">Role <span className="text-muted-2">(English)</span></label>
            <input name="roleEn" placeholder="Ex: Front-end Developer (optional)" className="w-full bg-surface border border-line rounded-xl px-4 py-2.5 text-fg placeholder:text-muted-2 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-fg-muted">Description <span className="text-muted-2">(English)</span></label>
            <textarea name="descriptionEn" rows={4} placeholder="Describe your responsibilities... (optional)" className="w-full bg-surface border border-line rounded-xl px-4 py-2.5 text-fg placeholder:text-muted-2 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all resize-none" />
          </div>
        </TabsContent>
      </Tabs>

      <div className="space-y-2">
        <label className="text-sm font-medium text-fg-muted">Tecnologias (Separadas por vírgula)</label>
        <input name="techs" placeholder="Ex: React, Next.js, Tailwind CSS" className="w-full bg-surface border border-line rounded-xl px-4 py-2.5 text-fg placeholder:text-muted-2 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all" />
      </div>

      <button disabled={isPending} type="submit" className="w-full md:w-auto px-6 py-3 bg-brand hover:bg-brand-strong text-brand-ink font-semibold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer">
        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Salvar Experiência"}
      </button>
    </form>
  )
}
