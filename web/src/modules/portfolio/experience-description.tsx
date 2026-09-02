"use client"

import { useLayoutEffect, useMemo, useRef, useState } from "react"
import { parseExperienceDescription } from "./parse-experience-description"

interface ExperienceDescriptionProps {
  text: string
  showMoreLabel: string
  showLessLabel: string
}

export function ExperienceDescription({ text, showMoreLabel, showLessLabel }: ExperienceDescriptionProps) {
  const [expanded, setExpanded] = useState(false)
  const [overflowing, setOverflowing] = useState(false)
  const contentRef = useRef<HTMLDivElement | null>(null)

  useLayoutEffect(() => {
    const node = contentRef.current
    if (!node) return

    const measure = () => setOverflowing(node.scrollHeight - node.clientHeight > 1)
    measure()

    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [text])

  const blocks = useMemo(() => parseExperienceDescription(text), [text])

  const toggleDescriptionExpansion = () => {
    setExpanded((prev) => !prev)
  }

  return (
    <div>
      <div
        ref={contentRef}
        className={`space-y-2 text-sm leading-relaxed text-fg-muted ${expanded ? "" : "line-clamp-5"}`}
      >
        {blocks.map((block, index) =>
          block.type === "list" ? (
            <ul key={index} className="list-disc space-y-1 pl-5">
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}>{item}</li>
              ))}
            </ul>
          ) : (
            <p key={index}>{block.text}</p>
          )
        )}
      </div>

      {overflowing && (
        <button
          type="button"
          onClick={toggleDescriptionExpansion}
          className="mt-1 text-xs font-medium text-brand transition-colors hover:text-brand-strong"
        >
          {expanded ? showLessLabel : showMoreLabel}
        </button>
      )}
    </div>
  )
}
