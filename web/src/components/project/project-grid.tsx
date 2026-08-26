import { ProjectType } from "@portfolio/packages"
import { ProjectCard } from "./project-card"
import { getDictionary, type Locale } from "@/i18n"

interface ProjectGridProps {
  projects: ProjectType[]
  locale: Locale
}

export function ProjectGrid({ projects, locale }: ProjectGridProps) {
  if (!projects?.length) return null

  const title = getDictionary(locale).projects.title

  return (
    <section className="py-24">
      <div className="flex items-center gap-6 mb-12">
        <h3 className="font-display text-2xl font-bold text-fg">
          {title}
        </h3>
        <div className="h-px bg-line flex-1" />
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
              locale={locale}
            />
          )
        })}
      </div>
    </section>
  )
}