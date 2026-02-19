"use client"

import { useState } from "react"
import { LayoutGrid, Plus } from "lucide-react"
import { CreateProjectForm } from "./project/create-project-form"
import { ProjectList } from "../project/project-list"
import { ProjectType } from "@portfolio/packages"

export function AdminDashboard({ projects }: { projects: ProjectType[] }) {
  const [activeTab, setActiveTab] = useState<"view" | "create">("view")

  return (
    <div className="space-y-8">
      <div className="flex p-1 bg-neutral-950 border border-neutral-900 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab("view")}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === "view"
              ? "bg-blue-950 text-blue-400 border border-blue-900/50 shadow-[0_0_20px_-5px_rgba(23,37,84,0.5)]"
              : "text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900/50"
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          Visualizar Projetos
        </button>
        <button
          onClick={() => setActiveTab("create")}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === "create"
              ? "bg-blue-950 text-blue-400 border border-blue-900/50 shadow-[0_0_20px_-5px_rgba(23,37,84,0.5)]"
              : "text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900/50"
          }`}
        >
          <Plus className="w-4 h-4" />
          Criar Projeto
        </button>
      </div>

      <div className="p-8 md:p-10 rounded-2xl bg-neutral-950 border border-blue-950/50 shadow-[0_0_50px_-15px_rgba(23,37,84,0.4)] animate-in fade-in slide-in-from-bottom-4">
        {activeTab === "view" ? (
          <div className="space-y-6">
            <h2 className="text-xl font-medium text-white mb-6">Projetos Publicados</h2>
            <ProjectList projects={projects} />
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-xl font-medium text-white mb-6">Novo Projeto</h2>
            <CreateProjectForm />
          </div>
        )}
      </div>
    </div>
  )
}