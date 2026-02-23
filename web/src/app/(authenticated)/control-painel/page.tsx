import { getProjectsAction } from "@/app/actions/project"
import BackButton from "@/components/back-button"
import { AdminDashboard } from "@/modules/admin/admin-dashboard"

export default async function AdminPage() {
  const projects = await getProjectsAction()

  return (
    <main className="min-h-screen bg-black">
      <BackButton />
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