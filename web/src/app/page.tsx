import { Header } from "@/components/header"
import { Hero } from "@/modules/portfolio/hero"
import { About } from "@/modules/portfolio/about"
import { Skills } from "@/modules/portfolio/skills"
import { Experience } from "@/modules/portfolio/experience"
import { Education } from "@/modules/portfolio/education"
import { ProjectGrid } from "@/components/project/project-grid"
import { getProjectsAction } from "@/app/actions/project"
import { getExperiencesAction } from "@/app/actions/experience"
import { getEducationsAction } from "@/app/actions/education"

export const revalidate = 3600

export default async function HomePage() {
  const [projects, experiences, educations] = await Promise.all([
    getProjectsAction(),
    getExperiencesAction(),
    getEducationsAction()
  ])

  return (
    <main className="min-h-screen bg-black selection:bg-blue-900/30 selection:text-blue-200">
      <Header />
      <div className="max-w-6xl mx-auto px-6 md:px-12 pt-20">
        <Hero />
        <About />
        <Skills />
        <div id="projetos" className="scroll-mt-20">
          <ProjectGrid projects={projects} />
        </div>
        <Experience experiences={experiences} />
        <Education educations={educations} />
      </div>
    </main>
  )
}