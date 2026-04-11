"use client"

import { ProjectType } from "@portfolio/packages"
import { ProjectGallery } from "./project-gallery"
import { ProjectLinks } from "./project-links"

export function ProjectCard({ title, description, technologies, deployUrl, githubUrl, imagesUrl }: ProjectType) {
  return (
    <div className="group relative flex flex-col justify-between p-6 md:p-8 rounded-2xl bg-neutral-950 border border-neutral-900 hover:border-blue-900/50 transition-all duration-300 hover:shadow-[0_0_40px_-15px_rgba(23,37,84,0.6)] hover:-translate-y-1">
      <div>
        <ProjectGallery title={title} imagesUrl={imagesUrl} />
        
        <p className="text-neutral-400 text-sm leading-relaxed mb-6 line-clamp-4">
          {description}
        </p>

        {technologies && technologies.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {technologies.map(tech => (
              <span key={tech} className="px-3 py-1 text-xs font-mono text-blue-400 bg-blue-950/30 border border-blue-900/30 rounded-full">
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>

      <ProjectLinks githubUrl={githubUrl} deployUrl={deployUrl} />
    </div>
  )
}