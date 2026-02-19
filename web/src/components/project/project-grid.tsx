import { ProjectCard } from "./project-card"

export function ProjectGrid({ projects }: { projects: any[] }) {
  if (!projects?.length) return null

  return (
    <section className="py-24">
      <div className="flex items-center gap-6 mb-12">
        <h3 className="text-2xl font-bold text-white flex items-center gap-3">
          <span className="text-blue-500 font-mono text-lg font-normal">01.</span> 
          Projetos Desenvolvidos
        </h3>
        <div className="h-px bg-neutral-900 flex-1" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.id} {...project} />
        ))}
      </div>
    </section>
  )
}