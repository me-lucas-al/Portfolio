import { describe, expect, it } from "vitest"
import { classifyTone } from "./classify-tone"

describe("classifyTone", () => {
  it("classifies known pt apologetic phrasing", () => {
    expect(classifyTone("Desculpe, não consegui encontrar essa informação no momento.", "pt")).toBe("apologetic")
  })

  it("classifies a known pt error-dictionary string verbatim", () => {
    expect(classifyTone("Limite máximo atingido, tente novamente amanhã.", "pt")).toBe("apologetic")
  })

  it("classifies known en apologetic phrasing", () => {
    expect(classifyTone("Sorry, I don't know the answer to that specific question.", "en")).toBe("apologetic")
  })

  it("classifies a known en error-dictionary string verbatim", () => {
    expect(classifyTone("Daily limit reached, please try again tomorrow.", "en")).toBe("apologetic")
  })

  it("classifies pt text starting with a surprise marker", () => {
    expect(classifyTone("Na verdade, o Lucas migrou esse projeto para Next.js recentemente.", "pt")).toBe(
      "surprised"
    )
  })

  it("classifies pt text containing a question mark", () => {
    expect(classifyTone("Ele trabalha na empresa atual desde quando?", "pt")).toBe("surprised")
  })

  it("classifies en text starting with a surprise marker", () => {
    expect(classifyTone("Interestingly, this project uses a custom rendering pipeline.", "en")).toBe("surprised")
  })

  it("classifies en text containing a question mark", () => {
    expect(classifyTone("Is Lucas available for new opportunities?", "en")).toBe("surprised")
  })

  it("classifies a short pt exclamation with a positive marker as enthusiastic", () => {
    expect(classifyTone("Sim! O Lucas ama React e constrói projetos incríveis!", "pt")).toBe("enthusiastic")
  })

  it("classifies a short en exclamation with a positive marker as enthusiastic", () => {
    expect(classifyTone("Yes! Lucas has built some amazing full stack projects!", "en")).toBe("enthusiastic")
  })

  it("classifies pt text with a positive marker but no exclamation as positive", () => {
    expect(classifyTone("Ótimo, o Lucas realmente domina bem as tecnologias mencionadas.", "pt")).toBe("positive")
  })

  it("classifies en text with a positive marker but no exclamation as positive", () => {
    expect(classifyTone("Great, Lucas has strong experience with Next.js and Node.js.", "en")).toBe("positive")
  })

  it("classifies a bare pt exclamation with no negative markers as positive", () => {
    expect(classifyTone("Consegui finalizar aquela tarefa mais rápido do que esperava!", "pt")).toBe("positive")
  })

  it("classifies a bare en exclamation with no negative markers as positive", () => {
    expect(classifyTone("The redesign shipped a day earlier than planned!", "en")).toBe("positive")
  })

  it("classifies a long pt technical explanation as explanatory", () => {
    const text =
      "O portfólio foi construído com Next.js e React no front-end, utilizando TypeScript para manter a tipagem estrita em todo o código, e o back-end expõe uma API própria que se comunica com o banco de dados através do Prisma, garantindo consultas seguras e previsíveis para cada uma das seções do site, desde a listagem de projetos até o histórico de experiências profissionais."
    expect(text.length).toBeGreaterThan(350)
    expect(classifyTone(text, "pt")).toBe("explanatory")
  })

  it("classifies an en response with three sentences as explanatory", () => {
    const text =
      "The homepage renders the hero section first. Then it loads the projects grid lazily. Finally, the contact section fades in as you scroll."
    expect(classifyTone(text, "en")).toBe("explanatory")
  })

  it("classifies a short en response with multiple technical markers as explanatory", () => {
    expect(classifyTone("The API talks to Prisma directly, no caching layer in between.", "en")).toBe("explanatory")
  })

  it("classifies a plain pt statement as neutral", () => {
    expect(classifyTone("O Lucas mora em Fortaleza.", "pt")).toBe("neutral")
  })

  it("classifies a plain en statement as neutral", () => {
    expect(classifyTone("Lucas is a full stack developer.", "en")).toBe("neutral")
  })

  it("classifies empty text as neutral", () => {
    expect(classifyTone("   ", "pt")).toBe("neutral")
  })
})
