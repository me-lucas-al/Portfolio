"use client"

import { useState, useTransition } from "react"
import { updateEducationAction } from "@/app/actions/education"
import { EducationType, EducationCategoryType } from "@portfolio/packages"
import { Loader2, AlertCircle } from "lucide-react"
import { toast } from "react-toastify"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { EducationCertificateField } from "./education-certificate-field"

const formatMonthForInput = (date: Date | string | null | undefined) => {
  if (!date) return "";
  const d = new Date(date);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
};

export function EditEducationForm({ education, onSuccess }: { education: EducationType, onSuccess?: () => void }) {
  const [isPending, startTransition] = useTransition()
  const [category, setCategory] = useState<EducationCategoryType>(education.category || "ACADEMIC")

  const submitEditEducationForm = (formData: FormData) => {
    formData.append("id", education.id.toString())
    startTransition(async () => {
      const result = await updateEducationAction(null, formData)
      if (result?.success) {
        toast.success(result.message || "Formação atualizada com sucesso!")
        if (onSuccess) onSuccess()
      } else {
        toast.error(result?.error || "Erro ao atualizar a formação")
      }
    })
  }

  return (
    <form action={submitEditEducationForm} className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-fg-muted">Categoria</label>
        <input type="hidden" name="category" value={category} />
        <Select value={category} onValueChange={(val) => setCategory(val as EducationCategoryType)}>
          <SelectTrigger className="w-full bg-surface border border-line rounded-xl px-4 py-2.5 text-fg">
            <SelectValue placeholder="Selecione a categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ACADEMIC">Formação Acadêmica (Graduação, Técnico, etc.)</SelectItem>
            <SelectItem value="COURSE">Curso ou Certificação Livre</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {category === "ACADEMIC" && education.category === "COURSE" && education.certificateUrl && (
        <div className="flex items-start gap-2 p-3 rounded-xl bg-prompt/10 border border-prompt/30 text-prompt text-xs">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>Ao salvar como Formação Acadêmica, o certificado vinculado será removido.</span>
        </div>
      )}

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
            <label className="text-sm text-fg-muted">
              {category === "COURSE" ? "Nome do Curso" : "Curso"}
            </label>
            <input
              required
              name="course"
              defaultValue={education.course}
              placeholder={category === "COURSE" ? "Ex: IA para Devs, Next.js na Prática..." : "Ex: Engenharia de Software"}
              className="w-full bg-surface border border-line rounded-xl px-4 py-2.5 text-fg placeholder:text-muted-2 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-fg-muted flex justify-between">
              Descrição
              <span className="text-muted-2 text-xs">Opcional</span>
            </label>
            <textarea
              name="description"
              rows={3}
              defaultValue={education.description ?? ""}
              placeholder="Principais aprendizados, tópicos abordados, projetos desenvolvidos..."
              className="w-full bg-surface border border-line rounded-xl px-4 py-2.5 text-fg placeholder:text-muted-2 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all resize-none"
            />
          </div>
        </TabsContent>
        <TabsContent value="en" className="space-y-4 mt-4 data-[state=inactive]:hidden" forceMount>
          <div className="space-y-2">
            <label className="text-sm text-fg-muted">
              {category === "COURSE" ? "Course Name" : "Course"}{" "}
              <span className="text-muted-2">(English)</span>
            </label>
            <input
              name="courseEn"
              defaultValue={education.courseEn ?? ""}
              placeholder={category === "COURSE" ? "Ex: AI for Devs (optional)" : "Ex: Software Engineering (optional)"}
              className="w-full bg-surface border border-line rounded-xl px-4 py-2.5 text-fg placeholder:text-muted-2 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-fg-muted flex justify-between">
              Description <span className="text-muted-2">(English)</span>
              <span className="text-muted-2 text-xs">Optional</span>
            </label>
            <textarea
              name="descriptionEn"
              rows={3}
              defaultValue={education.descriptionEn ?? ""}
              placeholder="Key learnings, covered topics, projects built... (optional)"
              className="w-full bg-surface border border-line rounded-xl px-4 py-2.5 text-fg placeholder:text-muted-2 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all resize-none"
            />
          </div>
        </TabsContent>
      </Tabs>

      <div className="space-y-2">
        <label className="text-sm text-fg-muted">
          {category === "COURSE" ? "Instituição / Plataforma" : "Instituição"}
        </label>
        <input
          required
          name="institution"
          defaultValue={education.institution}
          placeholder={category === "COURSE" ? "Ex: Full Stack Club, Rocketseat, Alura..." : "Ex: UNIFEI, USP, Fatec..."}
          className="w-full bg-surface border border-line rounded-xl px-4 py-2.5 text-fg placeholder:text-muted-2 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm text-fg-muted">Data de Início</label>
          <input
            required
            type="month"
            name="startDate"
            defaultValue={formatMonthForInput(education.startDate)}
            className="w-full bg-surface border border-line rounded-xl px-4 py-2.5 text-fg placeholder:text-muted-2 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-fg-muted flex justify-between">
            Data de Término
            <span className="text-muted-2 text-xs">Opcional</span>
          </label>
          <input
            type="month"
            name="endDate"
            defaultValue={formatMonthForInput(education.endDate)}
            className="w-full bg-surface border border-line rounded-xl px-4 py-2.5 text-fg placeholder:text-muted-2 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-fg-muted">Tipo</label>
        <input
          required
          name="type"
          defaultValue={education.type}
          placeholder="Ex: Bacharelado, Tecnólogo, Ensino Técnico, Curso Online..."
          className="w-full bg-surface border border-line rounded-xl px-4 py-2.5 text-fg placeholder:text-muted-2 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all"
        />
      </div>

      {category === "COURSE" && (
        <EducationCertificateField
          certificateUrl={education.certificateUrl}
          inputId="edit-education-certificate"
          disabled={isPending}
        />
      )}

      <button
        disabled={isPending}
        type="submit"
        className="w-full px-6 py-3 bg-brand hover:bg-brand-strong text-brand-ink font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
      >
        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Atualizar Formação"}
      </button>
    </form>
  )
}
