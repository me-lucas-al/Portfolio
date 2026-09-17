import { TimelineMilestoneType } from "@portfolio/packages"
import { CreateTimelineMilestoneForm } from "./create-timeline-milestone-form"
import { TimelineMilestoneList } from "./timeline-milestone-list"

interface TimelineMilestoneTabContentProps {
  activeView: "view" | "create"
  milestones: TimelineMilestoneType[]
}

export function TimelineMilestoneTabContent({ activeView, milestones }: TimelineMilestoneTabContentProps) {
  if (activeView === "view") {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
        <h2 className="text-xl font-medium text-fg mb-6">Jornada do Projeto</h2>
        <TimelineMilestoneList milestones={milestones} />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
      <h2 className="text-xl font-medium text-fg mb-6">Novo Marco da Jornada</h2>
      <CreateTimelineMilestoneForm />
    </div>
  )
}
