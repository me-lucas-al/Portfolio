import { Header } from "@/components/header"
import { Hero } from "@/modules/portfolio/hero"
import { About } from "@/modules/portfolio/about"
import { Skills } from "@/modules/portfolio/skills"
import { Experience } from "@/modules/portfolio/experience"
import { Education } from "@/modules/portfolio/education"
import { Contact } from "@/modules/portfolio/contact"
import { ProjectGrid } from "@/components/project/project-grid"
import { getProjectsAction } from "@/app/actions/project"
import { getExperiencesAction } from "@/app/actions/experience"
import { getEducationsAction } from "@/app/actions/education"
import { getLinksAction } from "@/app/actions/link"
import { getSystemSettingAction } from "@/app/actions/system-setting"

export const revalidate = 3600

export default async function HomePage() {
  const [projects, experiences, educations, links, cvUrlPt, cvUrlEn] = await Promise.all([
    getProjectsAction(),
    getExperiencesAction(),
    getEducationsAction(),
    getLinksAction(),
    getSystemSettingAction("cvUrlPt"),
    getSystemSettingAction("cvUrlEn"),
  ])

  return (
    <main className="min-h-screen bg-black selection:bg-blue-900/30 selection:text-blue-200">
      <Header />
      <div className="max-w-6xl mx-auto px-6 md:px-12 pt-20">
        <Hero cvUrlPt={cvUrlPt ?? undefined} cvUrlEn={cvUrlEn ?? undefined} />
        <About />
        <Skills />
        <div id="projetos" className="scroll-mt-20">
          <ProjectGrid projects={projects} />
        </div>
        <Experience experiences={experiences} />
        <Education educations={educations} />
        <Contact links={links} />
      </div>
    </main>
  )
}