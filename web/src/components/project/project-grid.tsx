import { ProjectType } from "@portfolio/packages"
import { ProjectCard } from "./project-card"
import type { Locale } from "@/i18n"

interface ProjectGridProps {
  projects: ProjectType[]
  locale: Locale
}

export function ProjectGrid({ projects, locale }: ProjectGridProps) {
  if (!projects?.length) return null

  const title = locale === "en" ? "Projects" : "Projetos Desenvolvidos"

  return (
    <section className="py-24">
      <div className="flex items-center gap-6 mb-12">
        <h3 className="text-2xl font-bold text-white flex items-center gap-3">
          <span className="text-blue-500 font-mono text-lg font-normal">03.</span> 
          {title}
        </h3>
        <div className="h-px bg-neutral-900 flex-1" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => {
          const displayTitle = locale === "en" ? (project.titleEn || project.title) : project.title
          const displayDescription = locale === "en" ? (project.descriptionEn || project.description) : project.description
          return (
            <ProjectCard
              key={project.id}
              {...project}
              title={displayTitle}
              description={displayDescription}
            />
          )
        })}
      </div>
    </section>
  )
}