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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Lucas Almeida",
    "alternateName": "Lucas Almeida de Souza",
    "url": "https://www.lucasalmeidasouza.com",
    "jobTitle": "Desenvolvedor Full Stack | Programador Next.js, Node.js e React",
    "description": "Programador Next.js, Programador Node.js e Programador React. Desenvolvedor Full Stack focado no ecossistema JavaScript, Java e soluções IoT. Estudante de ADS no IFSP.",
    "alumniOf": {
      "@type": "EducationalOrganization",
      "name": "IFSP - Instituto Federal de São Paulo"
    },
    "knowsAbout": [
      "Programador Next.js", "Programador Node.js", "Programador React", "Next.js", "React", "TypeScript", "Node.js", "Prisma", "Java", "Spring Boot", "IoT", "MQTT", "Docker"
    ],
    "sameAs": [
      "https://github.com/me-lucas-al",
      "https://linkedin.com/in/lucas-almeida-development"
    ]
  }

  return (
    <main className="min-h-screen bg-black selection:bg-blue-900/30 selection:text-blue-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
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