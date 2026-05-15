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
import { getAllSystemSettingsAction } from "@/app/actions/system-setting"

export const revalidate = 3600

export default async function HomePage() {
  const [projects, experiences, educations, links, systemSettings] = await Promise.all([
    getProjectsAction(),
    getExperiencesAction(),
    getEducationsAction(),
    getLinksAction(),
    getAllSystemSettingsAction()
  ])

  const cvUrlPt = systemSettings["cvUrlPt"] || "https://drive.google.com/file/d/1qWlAyq4ZBnSw0q_iuMWRIGcO7tezJ0w8/view"
  const cvUrlEn = systemSettings["cvUrlEn"] || "https://drive.google.com/file/d/186wXOZukhbBw6P13pB850Mqgb-NCKtaA/view"
  const aboutMe = systemSettings["about_me"]
  const skillsFrontend = systemSettings["skills_frontend"]
  const skillsBackend = systemSettings["skills_backend"]
  const skillsTools = systemSettings["skills_tools"]

  return (
    <main className="min-h-screen bg-black selection:bg-blue-900/30 selection:text-blue-200">
      <Header />
      <div className="max-w-6xl mx-auto px-6 md:px-12 pt-20">
        <Hero cvUrlPt={cvUrlPt} cvUrlEn={cvUrlEn} />
        <About text={aboutMe} />
        <Skills frontend={skillsFrontend} backend={skillsBackend} tools={skillsTools} />
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