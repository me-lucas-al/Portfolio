"use client"

import { useState, useTransition } from "react"
import { updateTimelineMilestoneAction } from "@/app/actions/timeline-milestone"
import { Loader2 } from "lucide-react"
import { toast } from "react-toastify"
import { TimelineMilestoneKindType, TimelineMilestoneType } from "@portfolio/packages"
import { TimelineMilestoneBasicFields } from "./timeline-milestone-basic-fields"
import { TimelineMilestoneBilingualFields } from "./timeline-milestone-bilingual-fields"
import { TimelineMilestoneImageFields } from "./timeline-milestone-image-fields"
import { TimelineSequenceGraveyardFields } from "./timeline-sequence-graveyard-fields"

export function EditTimelineMilestoneForm({ milestone, onSuccess }: { milestone: TimelineMilestoneType, onSuccess?: () => void }) {
  const [isPending, startTransition] = useTransition()
  const [kind, setKind] = useState<TimelineMilestoneKindType>(milestone.kind)

  const submitEditTimelineMilestoneForm = (formData: FormData) => {
    formData.append("id", milestone.id.toString())
    startTransition(async () => {
      const result = await updateTimelineMilestoneAction(null, formData)
      if (result?.success) {
        toast.success(result.message || "Marco da jornada atualizado com sucesso!")
        if (onSuccess) onSuccess()
      } else {
        toast.error(result?.error || "Erro ao atualizar o marco da jornada")
      }
    })
  }

  return (
    <form action={submitEditTimelineMilestoneForm} className="space-y-6">
      <TimelineMilestoneBasicFields
        defaultSlug={milestone.slug}
        defaultTags={milestone.tags.join(", ")}
        kind={kind}
        onKindChange={setKind}
      />

      <TimelineMilestoneBilingualFields
        defaults={{
          dateLabelPt: milestone.dateLabelPt,
          dateLabelEn: milestone.dateLabelEn ?? "",
          titlePt: milestone.titlePt,
          titleEn: milestone.titleEn ?? "",
          impactPt: milestone.impactPt,
          impactEn: milestone.impactEn ?? "",
          narrationPt: milestone.narrationPt,
          narrationEn: milestone.narrationEn ?? "",
          problemPt: milestone.problemPt,
          problemEn: milestone.problemEn ?? "",
          inflectionPt: milestone.inflectionPt,
          inflectionEn: milestone.inflectionEn ?? "",
          solutionPt: milestone.solutionPt,
          solutionEn: milestone.solutionEn ?? "",
        }}
      />

      <TimelineMilestoneImageFields
        idPrefix="edit-timeline"
        disabled={isPending}
        beforeImageUrl={milestone.beforeImageUrl}
        beforeImageAlt={milestone.beforeImageAlt}
        afterImageUrl={milestone.afterImageUrl}
        afterImageAlt={milestone.afterImageAlt}
      />

      <TimelineSequenceGraveyardFields
        initialSequence={milestone.sequence}
        initialGraveyard={milestone.graveyard}
      />

      <button
        disabled={isPending}
        type="submit"
        className="w-full px-6 py-3 bg-brand hover:bg-brand-strong text-brand-ink font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
      >
        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Atualizar Marco"}
      </button>
    </form>
  )
}
