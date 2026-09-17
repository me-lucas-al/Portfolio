"use client"

import { BookOpen, Moon } from "lucide-react"
import { useEffect, useRef } from "react"
import type { Locale } from "@/i18n"
import { useNarration } from "./narration/contract"
import type { TimelineMilestone } from "./timeline-data"
import { useTimelineSheet } from "./use-timeline-sheet"

interface TimelineCardProps {
  milestone: TimelineMilestone
  locale: Locale
  isLast: boolean
}

export function TimelineCard({ milestone, locale, isLast }: TimelineCardProps) {
  const { openTimelineMilestone } = useTimelineSheet()
  const narration = useNarration()
  const cardRef = useRef<HTMLDivElement>(null)

  const isGap = milestone.kind === "gap"
  const dateLabel = locale === "en" ? milestone.dateLabelEn : milestone.dateLabelPt
  const title = locale === "en" ? milestone.titleEn : milestone.titlePt
  const impact = locale === "en" ? milestone.impactEn : milestone.impactPt

  const isNarrating = narration.status !== "idle" && narration.status !== "finished"
  const isFocused = isNarrating && narration.script[narration.beatIndex]?.milestoneSlug === milestone.slug

  useEffect(() => {
    if (isFocused) cardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
  }, [isFocused])

  return (
    <div ref={cardRef} className={`flex gap-4 md:gap-6 ${isLast ? "" : "pb-10"}`}>
      <div className="relative flex w-8 shrink-0 flex-col items-center md:w-10">
        <span
          className={`z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-transform duration-300 ${
            isGap ? "border-line-strong bg-ink" : "border-brand/40 bg-brand/15"
          } ${isFocused ? "narration-dot-focus border-brand shadow-[0_0_12px_2px_var(--brand)]" : ""}`}
        >
          {isGap ? (
            <Moon className="h-3 w-3 text-muted-2" />
          ) : (
            <BookOpen className="h-3.5 w-3.5 text-brand" />
          )}
        </span>
        {!isLast && (
          <span className="absolute left-1/2 top-6 bottom-0 w-1 -translate-x-1/2 bg-line-strong" />
        )}
      </div>
      <button
        type="button"
        onClick={() => openTimelineMilestone(milestone.slug)}
        className={`group min-w-0 flex-1 rounded-xl text-left transition-all duration-300 ${
          isGap ? "opacity-70" : ""
        } ${isFocused ? "narration-focus bg-surface-2 p-3 -m-3" : "p-0"}`}
      >
        <span className="font-mono text-sm text-muted-2">{dateLabel}</span>
        <h4 className="mt-1 cursor-pointer text-xl font-bold text-fg transition-colors group-hover:text-brand">
          {title}
        </h4>
        <p className="mt-2 text-sm text-fg-muted">{impact}</p>
        {!isGap && milestone.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {milestone.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-line bg-surface-2 px-2.5 py-1 font-mono text-xs text-fg-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </button>
    </div>
  )
}
