"use client"

import { Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Locale } from "@/i18n"
import type { TimelineMilestone } from "../timeline-data"
import { startJourneyNarration } from "./narration-controls"

interface StartNarrationButtonProps {
  milestones: TimelineMilestone[]
  locale: Locale
  label: string
  fromSlug?: string
}

export function StartNarrationButton({ milestones, locale, label, fromSlug }: StartNarrationButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={() => startJourneyNarration(milestones, locale, fromSlug)}
    >
      <Play className="size-4" />
      {label}
    </Button>
  )
}
