import { Suspense } from "react"
import { BookOpen, Moon } from "lucide-react"
import { getDictionary, type Locale } from "@/i18n"
import { timelineMilestones } from "./timeline-data"
import { TimelineCard } from "./timeline-card"
import { TimelineSheet } from "./timeline-sheet"
import { NarrationHud, StartNarrationButton } from "./narration/contract"

interface TimelineProps {
  locale: Locale
}

function TimelineStaticFallback({ locale }: { locale: Locale }) {
  return (
    <div>
      {timelineMilestones.map((milestone, index) => {
        const isGap = milestone.kind === "gap"
        const isLast = index === timelineMilestones.length - 1
        const dateLabel = locale === "en" ? milestone.dateLabelEn : milestone.dateLabelPt
        const title = locale === "en" ? milestone.titleEn : milestone.titlePt
        const impact = locale === "en" ? milestone.impactEn : milestone.impactPt

        return (
          <div key={milestone.slug} className={`flex gap-4 md:gap-6 ${isLast ? "" : "pb-10"}`}>
            <div className="relative flex w-8 shrink-0 flex-col items-center md:w-10">
              <span
                className={`z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                  isGap ? "border-line-strong bg-ink" : "border-brand/40 bg-brand/15"
                }`}
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
            <div className={`min-w-0 flex-1 ${isGap ? "opacity-70" : ""}`}>
              <span className="font-mono text-sm text-muted-2">{dateLabel}</span>
              <h4 className="mt-1 text-xl font-bold text-fg">{title}</h4>
              <p className="mt-2 text-sm text-fg-muted">{impact}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function Timeline({ locale }: TimelineProps) {
  const dict = getDictionary(locale).timeline

  return (
    <section id="jornada" className="py-24 scroll-mt-20">
      <div className="mb-3 flex items-center gap-6">
        <h3 className="font-display text-2xl font-bold text-fg">{dict.title}</h3>
        <div className="h-px flex-1 bg-line" />
        <StartNarrationButton milestones={timelineMilestones} locale={locale} label={dict.narrateCta} />
      </div>
      <p className="mb-12 font-mono text-xs text-muted-2">
        <span className="text-brand">$</span> {dict.subtitle}
      </p>

      <Suspense fallback={<TimelineStaticFallback locale={locale} />}>
        <div>
          {timelineMilestones.map((milestone, index) => (
            <TimelineCard
              key={milestone.slug}
              milestone={milestone}
              locale={locale}
              isLast={index === timelineMilestones.length - 1}
            />
          ))}
        </div>
        <TimelineSheet milestones={timelineMilestones} locale={locale} dict={dict} />
      </Suspense>

      <p className="mt-10 pl-12 font-mono text-sm text-muted-2 md:pl-14">
        <span className="text-brand">{">"}</span> {dict.outro}
        <span className="cursor-blink text-brand">▍</span>
      </p>

      <NarrationHud
        dict={{
          narrationContinue: dict.narrationContinue,
          narrationExit: dict.narrationExit,
          askAboutPhase: dict.askAboutPhase,
          outro: dict.outro,
        }}
      />
    </section>
  )
}
