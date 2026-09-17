"use client"

import { useRef, useState, useTransition } from "react"
import { createTimelineMilestoneAction } from "@/app/actions/timeline-milestone"
import { Loader2 } from "lucide-react"
import { toast } from "react-toastify"
import { TimelineMilestoneKindType } from "@portfolio/packages"
import { TimelineMilestoneBasicFields } from "./timeline-milestone-basic-fields"
import { TimelineMilestoneBilingualFields } from "./timeline-milestone-bilingual-fields"
import { TimelineMilestoneImageFields } from "./timeline-milestone-image-fields"
import { TimelineSequenceGraveyardFields } from "./timeline-sequence-graveyard-fields"

export function CreateTimelineMilestoneForm() {
  const [isPending, startTransition] = useTransition()
  const [kind, setKind] = useState<TimelineMilestoneKindType>("MILESTONE")
  const [resetKey, setResetKey] = useState(0)
  const formRef = useRef<HTMLFormElement>(null)

  const submitCreateTimelineMilestoneForm = (formData: FormData) => {
    startTransition(async () => {
      const result = await createTimelineMilestoneAction(null, formData)
      if (result?.success) {
        formRef.current?.reset()
        setKind("MILESTONE")
        setResetKey((prev) => prev + 1)
        toast.success(result.message || "Marco da jornada criado com sucesso!")
      } else {
        toast.error(result?.error || "Erro ao criar marco da jornada")
      }
    })
  }

  return (
    <form ref={formRef} action={submitCreateTimelineMilestoneForm} className="space-y-6 max-w-2xl" key={resetKey}>
      <TimelineMilestoneBasicFields kind={kind} onKindChange={setKind} />
      <TimelineMilestoneBilingualFields />
      <TimelineMilestoneImageFields idPrefix="create-timeline" disabled={isPending} />
      <TimelineSequenceGraveyardFields />

      <button
        disabled={isPending}
        type="submit"
        className="w-full md:w-auto px-6 py-3 bg-brand hover:bg-brand-strong text-brand-ink font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
      >
        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Salvar"}
      </button>
    </form>
  )
}
