import { Hero } from "@/modules/portfolio/hero"
import { ProjectGrid } from "@/components/project/project-grid"
import { getProjectsAction } from "@/app/actions/project"

export const revalidate = 3600

export default async function HomePage() {
  const projects = await getProjectsAction()

  return (
    <main className="min-h-screen bg-black selection:bg-blue-900/30 selection:text-blue-200">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <Hero />
        <ProjectGrid projects={projects} />
      </div>
    </main>
  )
}