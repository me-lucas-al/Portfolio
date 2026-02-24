import { ProjectType } from "@portfolio/packages"
import { CreateProjectForm } from "./create-project-form"
import { ProjectList } from "./project-list"

interface ProjectTabContentProps {
  activeView: "view" | "create"
  projects: ProjectType[]
}

export function ProjectTabContent({ activeView, projects }: ProjectTabContentProps) {
  if (activeView === "view") {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
        <h2 className="text-xl font-medium text-white mb-6">Projetos Publicados</h2>
        <ProjectList projects={projects} />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
      <h2 className="text-xl font-medium text-white mb-6">Novo Projeto</h2>
      <CreateProjectForm />
    </div>
  )
}