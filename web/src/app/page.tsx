import { Header } from "@/components/header"
import { Hero } from "@/modules/portfolio/hero"
import { About } from "@/modules/portfolio/about"
import { Skills } from "@/modules/portfolio/skills"
import { Experience } from "@/modules/portfolio/experience"
import { Education } from "@/modules/portfolio/education"
import { Contact } from "@/modules/portfolio/contact"
import { AssistantWidget } from "@/modules/portfolio/assistant/assistant-widget"
import { ProjectGrid } from "@/components/project/project-grid"
import { getProjectsAction } from "@/app/actions/project"
import { getExperiencesAction } from "@/app/actions/experience"
import { getEducationsAction } from "@/app/actions/education"
import { getLinksAction } from "@/app/actions/link"
import { getAllSystemSettingsAction } from "@/app/actions/system-setting"
import { getLocale } from "@/lib/locale"
import { getDictionary } from "@/i18n"

export const revalidate = 3600

export default async function HomePage() {
  const [projects, experiences, educations, links, systemSettings, locale] = await Promise.all([
    getProjectsAction(),
    getExperiencesAction(),
    getEducationsAction(),
    getLinksAction(),
    getAllSystemSettingsAction(),
    getLocale(),
  ])

  const dict = getDictionary(locale)


  const cvUrlPt = systemSettings["cvUrlPt"] || "https://drive.google.com/file/d/1qWlAyq4ZBnSw0q_iuMWRIGcO7tezJ0w8/view"
  const cvUrlEn = systemSettings["cvUrlEn"] || "https://drive.google.com/file/d/186wXOZukhbBw6P13pB850Mqgb-NCKtaA/view"
  const aboutMe = systemSettings["about_me"]
  const aboutMeEn = systemSettings["about_me_en"]
  const skillsFrontend = systemSettings["skills_frontend"]
  const skillsBackend = systemSettings["skills_backend"]
  const skillsTools = systemSettings["skills_tools"]

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://www.lucasalmeidasouza.com/#person",
        "name": "Lucas Almeida",
        "alternateName": [
          "Lucas Almeida Dev",
          "Lucas Almeida Desenvolvedor",
          "Lucas Almeida Programador",
          "Lucas Almeida Next",
          "Lucas Almeida React",
          "Lucas Almeida Node",
          "Lucas Almeida de Souza"
        ],
        "url": "https://www.lucasalmeidasouza.com",
        "jobTitle": "Desenvolvedor Full Stack & Programador Next.js, React e Node.js",
        "description": "Lucas Almeida é um desenvolvedor de software e programador especialista em Next.js, React e Node.js, construindo aplicações web escaláveis e de alta performance.",
        "alumniOf": {
          "@type": "EducationalOrganization",
          "name": "IFSP - Instituto Federal de São Paulo"
        },
        "knowsAbout": [
          "Lucas Almeida",
          "Lucas Almeida Dev",
          "Lucas Almeida Desenvolvedor",
          "Lucas Almeida Programador",
          "Lucas Almeida Next",
          "Lucas Almeida React",
          "Lucas Almeida Node",
          "Programador Next.js",
          "Programador React",
          "Programador Node.js",
          "Desenvolvedor Next.js",
          "Desenvolvedor React",
          "Desenvolvedor Node.js",
          "Next.js",
          "React",
          "Node.js",
          "TypeScript",
          "JavaScript",
          "Java",
          "Spring Boot",
          "Docker",
          "Prisma ORM"
        ],
        "sameAs": [
          "https://github.com/me-lucas-al",
          "https://linkedin.com/in/lucas-almeida-development"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://www.lucasalmeidasouza.com/#website",
        "url": "https://www.lucasalmeidasouza.com",
        "name": "Lucas Almeida Dev",
        "alternateName": "Lucas Almeida | Programador & Desenvolvedor Next.js, React e Node.js",
        "publisher": {
          "@id": "https://www.lucasalmeidasouza.com/#person"
        },
        "inLanguage": "pt-BR"
      },
      {
        "@type": "ProfilePage",
        "@id": "https://www.lucasalmeidasouza.com/#webpage",
        "url": "https://www.lucasalmeidasouza.com",
        "name": "Lucas Almeida | Lucas Almeida Dev - Portfólio Oficial",
        "mainEntity": {
          "@id": "https://www.lucasalmeidasouza.com/#person"
        }
      }
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
        <Hero cvUrlPt={cvUrlPt} cvUrlEn={cvUrlEn} locale={locale} />
        <About textPt={aboutMe} textEn={aboutMeEn} locale={locale} />
        <Skills frontend={skillsFrontend} backend={skillsBackend} tools={skillsTools} locale={locale} />
        <div id="projetos" className="scroll-mt-20">
          <ProjectGrid projects={projects} locale={locale} />
        </div>
        <Experience experiences={experiences} locale={locale} />
        <Education educations={educations} locale={locale} />
        <Contact links={links} locale={locale} />
      </div>
      <footer className="border-t border-neutral-900 py-8 text-center text-xs text-neutral-500 mt-12">
        <div className="max-w-6xl mx-auto px-6 space-y-1">
          <p>© {new Date().getFullYear()} Lucas Almeida. {dict.footer.rights}</p>
          <p className="text-neutral-600">Lucas Almeida | {dict.footer.description}</p>
        </div>
      </footer>
      <AssistantWidget dict={dict.assistant} locale={locale} />
    </main>
  )
}