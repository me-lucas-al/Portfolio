"use client"

import { ProjectType } from "@portfolio/packages"
import { ProjectGallery } from "./project-gallery"
import { ProjectLinks } from "./project-links"
import type { Locale } from "@/i18n"

export function ProjectCard({ title, description, technologies, deployUrl, githubUrl, imagesUrl, locale }: ProjectType & { locale?: Locale }) {
  return (
    <div className="group relative flex flex-col justify-between p-6 md:p-8 rounded-2xl bg-surface border border-line hover:border-line-strong transition-all duration-300 hover:shadow-[0_0_40px_-15px_rgba(242,169,60,0.25)] hover:-translate-y-1">
      <div>
        <ProjectGallery title={title} imagesUrl={imagesUrl} />

        <p className="text-fg-muted text-sm leading-relaxed mb-6 line-clamp-4">
          {description}
        </p>

        {technologies && technologies.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {technologies.map(tech => (
              <span key={tech} className="px-3 py-1 text-xs font-mono text-fg-muted bg-surface-2 border border-line rounded-full">
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>

      <ProjectLinks githubUrl={githubUrl} deployUrl={deployUrl} locale={locale} />
    </div>
  )
}
