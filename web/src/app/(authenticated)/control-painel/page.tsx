import { getProjectsAction } from "@/app/actions/project"
import { AdminDashboard } from "@/modules/admin/admin-dashboard"
import { ArrowLeftIcon } from "lucide-react"
import Link from "next/link"

export default async function AdminPage() {
  const projects = await getProjectsAction()

  return (
    <main className="min-h-screen bg-black">
      <div className="flex items-center gap-4 pt-6 px-6">
        <Link
          href="/"
        >
          <ArrowLeftIcon />
        </Link>
      </div>
      <div className="max-w-4xl mx-auto space-y-12">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Painel de Controle</h1>
          <p className="text-neutral-500 mt-2 text-sm">Faça a gestão dos projetos em destaque no seu portfólio.</p>
        </div>

        <AdminDashboard projects={projects} />
      </div>
    </main>
  )
}