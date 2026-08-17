"use client"

import { useRef, useTransition } from "react"
import { createEducationAction } from "@/app/actions/education"
import { Loader2 } from "lucide-react"
import { toast } from "react-toastify"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function CreateEducationForm() {
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = await createEducationAction(null, formData)
      if (result?.success) {
        formRef.current?.reset()
        toast.success("Formação acadêmica criada com sucesso!")
      } else {
        toast.error(result?.error || "Erro ao criar formação")
      }
    })
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-6 max-w-2xl">
      <Tabs defaultValue="pt" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-neutral-900 border border-neutral-800">
          <TabsTrigger value="pt" className="data-[state=active]:bg-blue-950 data-[state=active]:text-blue-300">
            🇧🇷 PT-BR
          </TabsTrigger>
          <TabsTrigger value="en" className="data-[state=active]:bg-blue-950 data-[state=active]:text-blue-300">
            🇺🇸 EN-US
          </TabsTrigger>
        </TabsList>
        <TabsContent value="pt" className="mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300">Curso</label>
            <input required name="course" placeholder="Ex: Engenharia de Software" className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors" />
          </div>
        </TabsContent>
        <TabsContent value="en" className="mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300">Course <span className="text-neutral-600">(English)</span></label>
            <input name="courseEn" placeholder="Ex: Software Engineering (optional)" className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors" />
          </div>
        </TabsContent>
      </Tabs>

      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-300">Instituição</label>
        <input required name="institution" placeholder="Ex: UNIFEI" className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-300">Data de Início</label>
          <input required type="month" name="startDate" className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-300 flex justify-between">
            Data de Término
            <span className="text-neutral-500 text-xs font-normal">Opcional (Deixe vazio se atual)</span>
          </label>
          <input type="month" name="endDate" className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-300">Tipo</label>
        <input required name="type" placeholder="Ex: Bacharelado, Tecnólogo..." className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors" />
      </div>

      <button disabled={isPending} type="submit" className="w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Salvar Formação"}
      </button>
    </form>
  )
}