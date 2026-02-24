import { getProjectsAction } from "@/app/actions/project"
import { getExperiencesAction } from "@/app/actions/experience"
import { getEducationsAction } from "@/app/actions/education"
import BackButton from "@/components/back-button"
import { AdminDashboard } from "@/modules/admin/admin-dashboard"

export default async function AdminPage() {
  const [projects, experiences, educations] = await Promise.all([
    getProjectsAction(),
    getExperiencesAction(),
    getEducationsAction()
  ])

  return (
    <main className="min-h-screen bg-black">
      <BackButton />
      <div className="max-w-5xl mx-auto space-y-12 px-6 pb-20">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Painel de Controle</h1>
          <p className="text-neutral-500 mt-2 text-sm">
            Faça a gestão dos projetos, experiências e formações do seu portfólio.
          </p>
        </div>

        <AdminDashboard 
          projects={projects} 
          experiences={experiences} 
          educations={educations} 
        />
      </div>
    </main>
  )
}