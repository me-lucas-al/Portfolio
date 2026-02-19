import { CreateProjectForm } from "@/components/admin/project/create-project-form"
import { ArrowLeftIcon } from "lucide-react"
import Link from "next/link"

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-12 md:py-24">
      <div>
        <Link
          href="/"
        >
          <ArrowLeftIcon />
        </Link>
      </div>
      <div className="h-12" />
      <div className="max-w-3xl mx-auto mb-12">
        <h1 className="text-3xl font-bold text-white tracking-tight">Bem-vindo, Admin!</h1>
        <p className="text-neutral-500 mt-2 text-sm">Use o painel abaixo para gerenciar seus projetos.</p>
      </div>
      <div className="max-w-3xl mx-auto">
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-white tracking-tight">Painel de Controle</h1>
          <p className="text-neutral-500 mt-2 text-sm">Adicione novos projetos para exibição pública.</p>
        </div>

        <div className="p-8 md:p-10 rounded-2xl bg-neutral-950 border border-blue-950/50 shadow-[0_0_50px_-15px_rgba(23,37,84,0.4)]">
          <div className="mb-8">
            <h2 className="text-xl font-medium text-white">Novo Projeto</h2>
            <div className="h-px w-12 bg-blue-800 mt-4" />
          </div>
          
          <CreateProjectForm />
        </div>
      </div>
    </main>
  )
}