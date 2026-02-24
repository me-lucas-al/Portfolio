"use client"
import { ProjectType } from "@portfolio/packages"
import { ProjectItem } from "./project-item"

export function ProjectList({ projects }: { projects: ProjectType[] }) {
  if (!projects?.length) {
    return <p className="text-neutral-500 text-sm py-8">Nenhum projeto cadastrado no momento.</p>
  }

  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <ProjectItem key={project.id} project={project} />
      ))}
    </div>
  )
}