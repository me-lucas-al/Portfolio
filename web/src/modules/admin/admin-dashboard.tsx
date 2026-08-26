"use client"

import { useState } from "react"
import { LayoutGrid, Plus, Briefcase, GraduationCap, Code, User } from "lucide-react"
import { ProjectType, ExperienceType, EducationType } from "@portfolio/packages"

import { ProjectTabContent } from "./project/project-tab-content"
import { ExperienceTabContent } from "./experience/experience-tab-content"
import { EducationTabContent } from "./education/education-tab-content"
import { LinkTabContent } from "./link/link-tab-content"
import { ProfileTabContent } from "./profile/profile-tab-content"
import { DefaultLinkType } from "@portfolio/packages/schemas/link"

export type EntityTab = "projects" | "experiences" | "educations" | "links" | "profile"
export type ViewTab = "view" | "create"

interface AdminDashboardProps {
  projects: ProjectType[]
  experiences: ExperienceType[]
  educations: EducationType[]
  links: (DefaultLinkType & { id: number })[]
  systemSettings: Record<string, string>
}

export function AdminDashboard({ projects, experiences, educations, links, systemSettings }: AdminDashboardProps) {
  const [activeEntity, setActiveEntity] = useState<EntityTab>("projects")
  const [activeView, setActiveView] = useState<ViewTab>("view")

  const cvUrlPt = systemSettings["cvUrlPt"] || ""
  const cvUrlEn = systemSettings["cvUrlEn"] || ""

  return (
    <div className="space-y-8">
      <div className="flex gap-6 border-b border-line overflow-x-auto pb-px">
        <button
          onClick={() => { setActiveEntity("projects"); setActiveView("view"); }}
          className={`flex items-center gap-2 pb-4 border-b-2 font-medium transition-colors whitespace-nowrap cursor-pointer ${
            activeEntity === "projects" ? "text-brand border-brand" : "text-fg-muted border-transparent hover:text-fg hover:border-line-strong"
          }`}
        >
          <Code className="w-4 h-4" /> Projetos
        </button>
        <button
          onClick={() => { setActiveEntity("experiences"); setActiveView("view"); }}
          className={`flex items-center gap-2 pb-4 border-b-2 font-medium transition-colors whitespace-nowrap cursor-pointer ${
            activeEntity === "experiences" ? "text-brand border-brand" : "text-fg-muted border-transparent hover:text-fg hover:border-line-strong"
          }`}
        >
          <Briefcase className="w-4 h-4" /> Experiências
        </button>
        <button
          onClick={() => { setActiveEntity("educations"); setActiveView("view"); }}
          className={`flex items-center gap-2 pb-4 border-b-2 font-medium transition-colors whitespace-nowrap cursor-pointer ${
            activeEntity === "educations" ? "text-brand border-brand" : "text-fg-muted border-transparent hover:text-fg hover:border-line-strong"
          }`}
        >
          <GraduationCap className="w-4 h-4" /> Formação
        </button>
        <button
          onClick={() => { setActiveEntity("links"); setActiveView("view"); }}
          className={`flex items-center gap-2 pb-4 border-b-2 font-medium transition-colors whitespace-nowrap cursor-pointer ${
            activeEntity === "links" ? "text-brand border-brand" : "text-fg-muted border-transparent hover:text-fg hover:border-line-strong"
          }`}
        >
          Links
        </button>
        <button
          onClick={() => { setActiveEntity("profile"); setActiveView("view"); }}
          className={`flex items-center gap-2 pb-4 border-b-2 font-medium transition-colors whitespace-nowrap cursor-pointer ${
            activeEntity === "profile" ? "text-brand border-brand" : "text-fg-muted border-transparent hover:text-fg hover:border-line-strong"
          }`}
        >
          <User className="w-4 h-4" /> Perfil
        </button>
      </div>

      {activeEntity !== "profile" && (
        <div className="flex p-1 bg-surface-2/60 border border-line rounded-xl w-fit">
          <button
            onClick={() => setActiveView("view")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              activeView === "view"
                ? "bg-brand/10 text-brand border border-brand/30 shadow-sm shadow-brand/10"
                : "text-fg-muted hover:text-fg hover:bg-surface-2"
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            Visualizar
          </button>
          <button
            onClick={() => setActiveView("create")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              activeView === "create"
                ? "bg-brand/10 text-brand border border-brand/30 shadow-sm shadow-brand/10"
                : "text-fg-muted hover:text-fg hover:bg-surface-2"
            }`}
          >
            <Plus className="w-4 h-4" />
            Adicionar Novo
          </button>
        </div>
      )}

      <div className="p-8 md:p-10 rounded-2xl bg-surface border border-line shadow-xl shadow-brand/5">
        {activeEntity === "projects" && (
          <ProjectTabContent activeView={activeView} projects={projects} />
        )}
        {activeEntity === "experiences" && (
          <ExperienceTabContent activeView={activeView} experiences={experiences} />
        )}
        {activeEntity === "educations" && (
          <EducationTabContent activeView={activeView} educations={educations} />
        )}
        {activeEntity === "links" && (
          <LinkTabContent activeView={activeView} links={links} cvUrlPt={cvUrlPt} cvUrlEn={cvUrlEn} />
        )}
        {activeEntity === "profile" && (
          <ProfileTabContent systemSettings={systemSettings} />
        )}
      </div>
    </div>
  )
}
