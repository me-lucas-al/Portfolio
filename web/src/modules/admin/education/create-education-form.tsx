"use client"

import { useRef, useState, useTransition } from "react"
import { createEducationAction } from "@/app/actions/education"
import { Loader2 } from "lucide-react"
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
import { EducationCategoryType } from "@portfolio/packages"

export function CreateEducationForm() {
  const [isPending, startTransition] = useTransition()
  const [category, setCategory] = useState<EducationCategoryType>("ACADEMIC")
  const [resetKey, setResetKey] = useState(0)
  const formRef = useRef<HTMLFormElement>(null)

  const submitCreateEducationForm = (formData: FormData) => {
    startTransition(async () => {
      const result = await createEducationAction(null, formData)
      if (result?.success) {
        formRef.current?.reset()
        setCategory("ACADEMIC")
        setResetKey((prev) => prev + 1)
        toast.success(result.message || "Formação ou curso criado com sucesso!")
      } else {
        toast.error(result?.error || "Erro ao criar formação")
      }
    })
  }

  return (
    <form ref={formRef} action={submitCreateEducationForm} className="space-y-6 max-w-2xl">
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
            <label className="text-sm font-medium text-fg-muted">
              {category === "COURSE" ? "Nome do Curso" : "Curso"}
            </label>
            <input
              required
              name="course"
              placeholder={category === "COURSE" ? "Ex: IA para Devs, Next.js na Prática..." : "Ex: Engenharia de Software"}
              className="w-full bg-surface border border-line rounded-xl px-4 py-2.5 text-fg placeholder:text-muted-2 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all"
            />
          </div>
        </TabsContent>
        <TabsContent value="en" className="mt-4 data-[state=inactive]:hidden" forceMount>
          <div className="space-y-2">
            <label className="text-sm font-medium text-fg-muted">
              {category === "COURSE" ? "Course Name" : "Course"}{" "}
              <span className="text-muted-2">(English)</span>
            </label>
            <input
              name="courseEn"
              placeholder={category === "COURSE" ? "Ex: AI for Devs (optional)" : "Ex: Software Engineering (optional)"}
              className="w-full bg-surface border border-line rounded-xl px-4 py-2.5 text-fg placeholder:text-muted-2 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all"
            />
          </div>
        </TabsContent>
      </Tabs>

      <div className="space-y-2">
        <label className="text-sm font-medium text-fg-muted">
          {category === "COURSE" ? "Instituição / Plataforma" : "Instituição"}
        </label>
        <input
          required
          name="institution"
          placeholder={category === "COURSE" ? "Ex: Full Stack Club, Rocketseat, Alura..." : "Ex: UNIFEI, USP, Fatec..."}
          className="w-full bg-surface border border-line rounded-xl px-4 py-2.5 text-fg placeholder:text-muted-2 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-fg-muted">Data de Início</label>
          <input
            required
            type="month"
            name="startDate"
            className="w-full bg-surface border border-line rounded-xl px-4 py-2.5 text-fg placeholder:text-muted-2 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-fg-muted flex justify-between">
            Data de Término
            <span className="text-muted-2 text-xs font-normal">Opcional (Deixe vazio se em andamento)</span>
          </label>
          <input
            type="month"
            name="endDate"
            className="w-full bg-surface border border-line rounded-xl px-4 py-2.5 text-fg placeholder:text-muted-2 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-fg-muted">Tipo</label>
        <input
          required
          name="type"
          placeholder="Ex: Bacharelado, Tecnólogo, Ensino Técnico, Curso Online..."
          className="w-full bg-surface border border-line rounded-xl px-4 py-2.5 text-fg placeholder:text-muted-2 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all"
        />
      </div>

      {category === "COURSE" && (
        <EducationCertificateField
          key={`create-cert-${resetKey}`}
          inputId="create-education-certificate"
          disabled={isPending}
        />
      )}

      <button
        disabled={isPending}
        type="submit"
        className="w-full md:w-auto px-6 py-3 bg-brand hover:bg-brand-strong text-brand-ink font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
      >
        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Salvar"}
      </button>
    </form>
  )
}
