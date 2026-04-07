import { DefaultLinkType } from "@portfolio/packages/schemas/link"
import { CreateLinkForm } from "./create-link-form"
import { LinkList } from "./link-list"
import { ResumeLinksForm } from "./resume-links-form"

interface LinkTabContentProps {
  activeView: "view" | "create"
  links: (DefaultLinkType & { id: number })[]
  cvUrlPt: string
  cvUrlEn: string
}

export function LinkTabContent({ activeView, links, cvUrlPt, cvUrlEn }: LinkTabContentProps) {
  if (activeView === "view") {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
        <div>
          <h2 className="text-xl font-medium text-white mb-6">Links e Redes Sociais</h2>
          <LinkList links={links} />
        </div>
        <ResumeLinksForm cvUrlPt={cvUrlPt} cvUrlEn={cvUrlEn} />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
      <h2 className="text-xl font-medium text-white mb-6">Novo Link</h2>
      <CreateLinkForm />
    </div>
  )
}

