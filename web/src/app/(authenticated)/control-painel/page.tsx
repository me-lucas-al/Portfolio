import { getProjectsAction } from "@/app/actions/project"
import { getExperiencesAction } from "@/app/actions/experience"
import { getEducationsAction } from "@/app/actions/education"
import { AdminDashboard } from "@/modules/admin/admin-dashboard"
import { getUserRole } from "@/lib/get-user-role"
import { redirect } from "next/navigation"
import Link from "next/link"
import { logoutAction } from "@/app/actions/login/auth"

export default async function AdminPage() {
  const admin = await getUserRole("ADMIN")

  if (!admin) redirect("/unauthorized")

  const [projects, experiences, educations] = await Promise.all([
    getProjectsAction(),
    getExperiencesAction(),
    getEducationsAction(),
  ])

  return (
    <main className="min-h-screen bg-black">
      <div className="max-w-5xl mx-auto space-y-12 px-6 pb-20">
        <div className="pt-10 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Painel de Controle
            </h1>
            <p className="text-neutral-500 mt-2 text-sm">
              Faça a gestão dos projetos, experiências e formações do seu portfólio.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 sm:items-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-xl bg-neutral-900/40 hover:bg-neutral-900/70 border border-neutral-800 px-4 py-2.5 text-xs font-medium text-white transition-all focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-offset-2 focus:ring-offset-black"
            >
              Voltar para o portfólio
            </Link>

            <form action={logoutAction} className="w-full sm:w-auto">
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-xl bg-blue-950 hover:bg-blue-900 border border-blue-800/50 px-4 py-2.5 text-xs font-medium text-white transition-all focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-offset-2 focus:ring-offset-black"
              >
                Logout
              </button>
            </form>
          </div>
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