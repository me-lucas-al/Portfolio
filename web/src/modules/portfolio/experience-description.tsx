"use client"

import { useLayoutEffect, useRef, useState } from "react"

interface ExperienceDescriptionProps {
  text: string
  showMoreLabel: string
  showLessLabel: string
}

interface Block {
  type: "paragraph" | "list"
  items: string[]
}

const BULLET_PATTERN = /^[•\-*]\s+/

function parseBlocks(text: string): Block[] {
  const blocks: Block[] = []

  for (const rawLine of text.split("\n")) {
    const line = rawLine.trim()
    if (!line) continue

    const isBullet = BULLET_PATTERN.test(line)
    const content = isBullet ? line.replace(BULLET_PATTERN, "") : line
    const last = blocks[blocks.length - 1]

    if (isBullet && last?.type === "list") {
      last.items.push(content)
    } else {
      blocks.push({ type: isBullet ? "list" : "paragraph", items: [content] })
    }
  }

  return blocks
}

export function ExperienceDescription({ text, showMoreLabel, showLessLabel }: ExperienceDescriptionProps) {
  const [expanded, setExpanded] = useState(false)
  const [overflowing, setOverflowing] = useState(false)
  const contentRef = useRef<HTMLDivElement | null>(null)

  useLayoutEffect(() => {
    const node = contentRef.current
    if (!node) return
    setOverflowing(node.scrollHeight - node.clientHeight > 1)
  }, [text])

  const blocks = parseBlocks(text)

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
            <p key={index}>{block.items[0]}</p>
          )
        )}
      </div>

      {overflowing && (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="mt-1 text-xs font-medium text-brand transition-colors hover:text-brand-strong"
        >
          {expanded ? showLessLabel : showMoreLabel}
        </button>
      )}
    </div>
  )
}
