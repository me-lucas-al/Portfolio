"use client"

import { useState } from "react"
import { LayoutGrid, Plus, Briefcase, GraduationCap, Code } from "lucide-react"
import { ProjectType, ExperienceType, EducationType } from "@portfolio/packages"

import { ProjectTabContent } from "./project/project-tab-content"
import { ExperienceTabContent } from "./experience/experience-tab-content"
import { EducationTabContent } from "./education/education-tab-content"

export type EntityTab = "projects" | "experiences" | "educations"
export type ViewTab = "view" | "create"

interface AdminDashboardProps {
  projects: ProjectType[]
  experiences: ExperienceType[]
  educations: EducationType[]
}

export function AdminDashboard({ projects, experiences, educations }: AdminDashboardProps) {
  const [activeEntity, setActiveEntity] = useState<EntityTab>("projects")
  const [activeView, setActiveView] = useState<ViewTab>("view")

  return (
    <div className="space-y-8">
      <div className="flex gap-6 border-b border-neutral-900 overflow-x-auto pb-px">
        <button
          onClick={() => { setActiveEntity("projects"); setActiveView("view"); }}
          className={`flex items-center gap-2 pb-4 border-b-2 font-medium transition-colors whitespace-nowrap ${
            activeEntity === "projects" ? "text-blue-400 border-blue-500" : "text-neutral-500 border-transparent hover:text-neutral-300"
          }`}
        >
          <Code className="w-4 h-4" /> Projetos
        </button>
        <button
          onClick={() => { setActiveEntity("experiences"); setActiveView("view"); }}
          className={`flex items-center gap-2 pb-4 border-b-2 font-medium transition-colors whitespace-nowrap ${
            activeEntity === "experiences" ? "text-blue-400 border-blue-500" : "text-neutral-500 border-transparent hover:text-neutral-300"
          }`}
        >
          <Briefcase className="w-4 h-4" /> Experiências
        </button>
        <button
          onClick={() => { setActiveEntity("educations"); setActiveView("view"); }}
          className={`flex items-center gap-2 pb-4 border-b-2 font-medium transition-colors whitespace-nowrap ${
            activeEntity === "educations" ? "text-blue-400 border-blue-500" : "text-neutral-500 border-transparent hover:text-neutral-300"
          }`}
        >
          <GraduationCap className="w-4 h-4" /> Formação
        </button>
      </div>

      <div className="flex p-1 bg-neutral-950 border border-neutral-900 rounded-xl w-fit">
        <button
          onClick={() => setActiveView("view")}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeView === "view"
              ? "bg-blue-950 text-blue-400 border border-blue-900/50 shadow-[0_0_20px_-5px_rgba(23,37,84,0.5)]"
              : "text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900/50"
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          Visualizar
        </button>
        <button
          onClick={() => setActiveView("create")}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeView === "create"
              ? "bg-blue-950 text-blue-400 border border-blue-900/50 shadow-[0_0_20px_-5px_rgba(23,37,84,0.5)]"
              : "text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900/50"
          }`}
        >
          <Plus className="w-4 h-4" />
          Adicionar Novo
        </button>
      </div>

      <div className="p-8 md:p-10 rounded-2xl bg-neutral-950 border border-blue-950/50 shadow-[0_0_50px_-15px_rgba(23,37,84,0.4)]">
        {activeEntity === "projects" && (
          <ProjectTabContent activeView={activeView} projects={projects} />
        )}
        {activeEntity === "experiences" && (
          <ExperienceTabContent activeView={activeView} experiences={experiences} />
        )}
        {activeEntity === "educations" && (
          <EducationTabContent activeView={activeView} educations={educations} />
        )}
      </div>
    </div>
  )
}