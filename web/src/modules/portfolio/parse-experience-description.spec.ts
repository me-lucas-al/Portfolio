import { describe, expect, it } from "vitest"
import { parseExperienceDescription } from "./parse-experience-description"

describe("parseExperienceDescription", () => {
  it("returns an empty array for empty text", () => {
    expect(parseExperienceDescription("")).toEqual([])
  })

  it("returns an empty array for whitespace-only text", () => {
    expect(parseExperienceDescription("   \n  \n")).toEqual([])
  })

  it("treats each non-bullet line as its own paragraph", () => {
    expect(parseExperienceDescription("Primeira linha.\nSegunda linha.")).toEqual([
      { type: "paragraph", text: "Primeira linha." },
      { type: "paragraph", text: "Segunda linha." },
    ])
  })

  it("does not treat an internal hyphen as a bullet marker", () => {
    expect(parseExperienceDescription("Trabalhei com soluções off-the-shelf.")).toEqual([
      { type: "paragraph", text: "Trabalhei com soluções off-the-shelf." },
    ])
  })

  it("groups consecutive dash-bulleted lines into one list", () => {
    expect(parseExperienceDescription("- Item um\n- Item dois")).toEqual([
      { type: "list", items: ["Item um", "Item dois"] },
    ])
  })

  it("groups consecutive asterisk-bulleted lines into one list", () => {
    expect(parseExperienceDescription("* Item um\n* Item dois")).toEqual([
      { type: "list", items: ["Item um", "Item dois"] },
    ])
  })

  it("recognizes a bullet character glued to the text with no space", () => {
    expect(parseExperienceDescription("•Item sem espaço")).toEqual([
      { type: "list", items: ["Item sem espaço"] },
    ])
  })

  it("drops a bullet line that has no content after the marker", () => {
    expect(parseExperienceDescription("• \nTexto normal")).toEqual([
      { type: "paragraph", text: "Texto normal" },
    ])
  })

  it("starts a new list block when a paragraph interrupts bullet lines", () => {
    expect(parseExperienceDescription("• Item um\nUm parágrafo no meio\n• Item dois")).toEqual([
      { type: "list", items: ["Item um"] },
      { type: "paragraph", text: "Um parágrafo no meio" },
      { type: "list", items: ["Item dois"] },
    ])
  })

  it("interleaves paragraphs and bullet groups in document order", () => {
    expect(parseExperienceDescription("Intro.\n• Um\n• Dois\nConclusão.")).toEqual([
      { type: "paragraph", text: "Intro." },
      { type: "list", items: ["Um", "Dois"] },
      { type: "paragraph", text: "Conclusão." },
    ])
  })
})
