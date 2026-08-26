import { getProjectsAction } from "@/app/actions/project"
import { getExperiencesAction } from "@/app/actions/experience"
import { getEducationsAction } from "@/app/actions/education"
import { getLinksAction } from "@/app/actions/link"
import { getAllSystemSettingsAction } from "@/app/actions/system-setting"
import { AdminDashboard } from "@/modules/admin/admin-dashboard"
import { getUserRole } from "@/lib/get-user-role"
import { redirect } from "next/navigation"
import Link from "next/link"
import { logoutAction } from "@/app/actions/login/auth"

export default async function AdminPage() {
  const admin = await getUserRole("ADMIN")

  if (!admin) redirect("/unauthorized")

  const [projects, experiences, educations, links, systemSettings] = await Promise.all([
    getProjectsAction(),
    getExperiencesAction(),
    getEducationsAction(),
    getLinksAction(),
    getAllSystemSettingsAction(),
  ])

  return (
    <main className="min-h-screen bg-ink text-fg">
      <div className="max-w-5xl mx-auto space-y-12 px-6 pb-20">
        <div className="pt-10 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-fg tracking-tight">
              Painel de Controle
            </h1>
            <p className="text-fg-muted mt-2 text-sm">
              Faça a gestão dos projetos, experiências e formações do seu portfólio.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 sm:items-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-xl bg-surface hover:bg-surface-2 border border-line hover:border-line-strong px-4 py-2.5 text-xs font-medium text-fg transition-all focus:outline-none focus:ring-2 focus:ring-brand/40 focus:ring-offset-2 focus:ring-offset-ink"
            >
              Voltar para o portfólio
            </Link>

            <form action={logoutAction} className="w-full sm:w-auto">
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-xl bg-danger/10 hover:bg-danger/20 border border-danger/30 px-4 py-2.5 text-xs font-medium text-danger transition-all focus:outline-none focus:ring-2 focus:ring-danger/40 focus:ring-offset-2 focus:ring-offset-ink cursor-pointer"
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
          links={links}
          systemSettings={systemSettings}
        />
      </div>
    </main>
  )
}
