import { splitSentences } from "./split-sentences";
import { describe, expect, it } from "vitest";

describe("splitSentences", () => {
  it("should split regular sentences correctly", () => {
    const text = "Olá! Como vai você? Eu estou bem.";
    const result = splitSentences(text);
    expect(result).toEqual(["Olá!", "Como vai você?", "Eu estou bem."]);
  });

  it("should preserve the remaining text if there is no punctuation", () => {
    const text = "This is a sentence. And this is trailing text";
    const result = splitSentences(text);
    expect(result).toEqual(["This is a sentence.", "And this is trailing text"]);
  });

  it("should handle markdown elements like asterisks", () => {
    const text = "**Bold text.** Normal text.";
    const result = splitSentences(text);
    expect(result).toEqual(["**Bold text.**", "Normal text."]);
  });
  
  it("should handle empty strings", () => {
    expect(splitSentences("")).toEqual([]);
  });
  
  it("should handle single words", () => {
    expect(splitSentences("Teste")).toEqual(["Teste"]);
  });
});

