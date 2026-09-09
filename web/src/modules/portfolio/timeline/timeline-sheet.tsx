"use client"

import Image from "next/image"
import { MessageCircleQuestion, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { MediaFullscreenDialog } from "@/components/media/media-fullscreen-dialog"
import { SideSheet } from "@/components/side-sheet"
import type { Locale } from "@/i18n"
import { requestAssistantOpenWithPhaseContext } from "@/modules/portfolio/assistant/contract"
import { buildMilestonePhaseContext, startJourneyNarration } from "./narration/contract"
import type { TimelineImage, TimelineMilestone } from "./timeline-data"
import { useTimelineSheet } from "./use-timeline-sheet"

interface TimelineSheetDict {
  problem: string
  inflection: string
  solution: string
  sequenceTitle: string
  graveyardTitle: string
  discarded: string
  viewBefore: string
  viewAfter: string
  narrateFromHere: string
  askAboutPhase: string
}

interface TimelineSheetProps {
  milestones: TimelineMilestone[]
  locale: Locale
  dict: TimelineSheetDict
}

function TimelineImagePreview({ image, label }: { image: TimelineImage; label: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="relative h-24 w-full overflow-hidden rounded-xl border border-line transition-colors hover:border-line-strong"
        >
          <Image src={image.src} alt={image.alt} fill className="object-cover" sizes="200px" />
          <span className="absolute bottom-1 right-1.5 rounded bg-ink/70 px-1.5 py-0.5 font-mono text-[10px] text-fg">
            {label}
          </span>
        </button>
      </DialogTrigger>
      <MediaFullscreenDialog title={image.alt} alt={image.alt} imagesUrl={[image.src]} />
    </Dialog>
  )
}

export function TimelineSheet({ milestones, locale, dict }: TimelineSheetProps) {
  const { activeSlug, closeTimelineMilestone } = useTimelineSheet()
  const milestone = milestones.find((item) => item.slug === activeSlug)

  const title = milestone ? (locale === "en" ? milestone.titleEn : milestone.titlePt) : undefined
  const dateLabel = milestone ? (locale === "en" ? milestone.dateLabelEn : milestone.dateLabelPt) : undefined

  return (
    <SideSheet.Root
      open={Boolean(milestone)}
      onOpenChange={(next) => {
        if (!next) closeTimelineMilestone()
      }}
    >
      <SideSheet.Content title={title} description={dateLabel}>
        {milestone && (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  closeTimelineMilestone()
                  startJourneyNarration(milestones, locale, milestone.slug)
                }}
              >
                <Play className="size-4" />
                {dict.narrateFromHere}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => requestAssistantOpenWithPhaseContext(buildMilestonePhaseContext(milestone, locale))}
              >
                <MessageCircleQuestion className="size-4" />
                {dict.askAboutPhase}
              </Button>
            </div>

            {(milestone.beforeImage || milestone.afterImage) && (
              <div className="grid grid-cols-2 gap-3">
                {milestone.beforeImage && (
                  <TimelineImagePreview image={milestone.beforeImage} label={dict.viewBefore} />
                )}
                {milestone.afterImage && (
                  <TimelineImagePreview image={milestone.afterImage} label={dict.viewAfter} />
                )}
              </div>
            )}

            {milestone.problemPt && (
              <div>
                <span className="font-mono text-xs uppercase tracking-wide text-brand">
                  {dict.problem}
                </span>
                <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">
                  {locale === "en" ? milestone.problemEn : milestone.problemPt}
                </p>
              </div>
            )}

            {milestone.inflectionPt && (
              <div>
                <span className="font-mono text-xs uppercase tracking-wide text-brand">
                  {dict.inflection}
                </span>
                <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">
                  {locale === "en" ? milestone.inflectionEn : milestone.inflectionPt}
                </p>
              </div>
            )}

            {milestone.solutionPt && (
              <div>
                <span className="font-mono text-xs uppercase tracking-wide text-brand">
                  {dict.solution}
                </span>
                <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">
                  {locale === "en" ? milestone.solutionEn : milestone.solutionPt}
                </p>
              </div>
            )}

            {milestone.sequence && milestone.sequence.length > 0 && (
              <div>
                <span className="font-mono text-xs uppercase tracking-wide text-brand">
                  {dict.sequenceTitle}
                </span>
                <div className="mt-3">
                  {milestone.sequence.map((step, index) => {
                    const isLastStep = index === milestone.sequence!.length - 1
                    return (
                      <div key={`${milestone.slug}-sequence-${index}`} className="flex gap-3">
                        <div className="relative flex w-4 shrink-0 flex-col items-center">
                          <span className="z-10 mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                          {!isLastStep && (
                            <span className="absolute left-1/2 top-2.5 bottom-0 w-px -translate-x-1/2 bg-line" />
                          )}
                        </div>
                        <div className={isLastStep ? "pb-0" : "pb-4"}>
                          <span className="font-mono text-[11px] text-muted-2">
                            {locale === "en" ? step.dateEn : step.datePt}
                          </span>
                          <p className="mt-0.5 text-xs leading-relaxed text-fg-muted">
                            {locale === "en" ? step.labelEn : step.labelPt}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {milestone.graveyard && milestone.graveyard.length > 0 && (
              <div>
                <span className="font-mono text-xs uppercase tracking-wide text-muted-2">
                  {dict.graveyardTitle}
                </span>
                <div className="mt-2 space-y-2">
                  {milestone.graveyard.map((idea, index) => (
                    <div
                      key={`${milestone.slug}-graveyard-${index}`}
                      className="rounded-xl border border-line bg-surface-2 p-3"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold text-muted-2 line-through">
                          {locale === "en" ? idea.titleEn : idea.titlePt}
                        </span>
                        <span className="rounded-full border border-line-strong px-1.5 py-0.5 font-mono text-[10px] text-muted-2">
                          {dict.discarded}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-fg-muted">
                        {locale === "en" ? idea.descriptionEn : idea.descriptionPt}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </SideSheet.Content>
    </SideSheet.Root>
  )
}
