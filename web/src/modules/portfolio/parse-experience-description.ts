export type DescriptionBlock = { type: "paragraph"; text: string } | { type: "list"; items: string[] }

const BULLET_PATTERN = /^(?:•\s*|[-*]\s+)/

export function parseExperienceDescription(text: string): DescriptionBlock[] {
  const blocks: DescriptionBlock[] = []

  for (const rawLine of text.split("\n")) {
    const line = rawLine.trim()
    if (!line) continue

    const isBullet = BULLET_PATTERN.test(line)
    const content = isBullet ? line.replace(BULLET_PATTERN, "").trim() : line
    if (isBullet && !content) continue

    const last = blocks[blocks.length - 1]

    if (isBullet && last?.type === "list") {
      last.items.push(content)
    } else if (isBullet) {
      blocks.push({ type: "list", items: [content] })
    } else {
      blocks.push({ type: "paragraph", text: content })
    }
  }

  return blocks
}
