import { ExperienceType } from "@portfolio/packages"
import { CreateExperienceForm } from "./create-experience-form"
import { ExperienceList } from "./experience-list"

interface ExperienceTabContentProps {
  activeView: "view" | "create"
  experiences: ExperienceType[]
}

export function ExperienceTabContent({ activeView, experiences }: ExperienceTabContentProps) {
  if (activeView === "view") {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
        <h2 className="text-xl font-medium text-white mb-6">Experiências Profissionais</h2>
        <ExperienceList experiences={experiences} />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
      <h2 className="text-xl font-medium text-white mb-6">Nova Experiência</h2>
      <CreateExperienceForm />
    </div>
  )
}