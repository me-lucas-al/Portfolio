import { EducationType } from "@portfolio/packages"
import { CreateEducationForm } from "./create-education-form"
import { EducationList } from "./education-list"

interface EducationTabContentProps {
  activeView: "view" | "create"
  educations: EducationType[]
}

export function EducationTabContent({ activeView, educations }: EducationTabContentProps) {
  if (activeView === "view") {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
        <h2 className="text-xl font-medium text-white mb-6">Formações Acadêmicas</h2>
        <EducationList educations={educations} />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
      <h2 className="text-xl font-medium text-white mb-6">Nova Formação</h2>
      <CreateEducationForm />
    </div>
  )
}