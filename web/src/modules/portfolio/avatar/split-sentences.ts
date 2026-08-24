export function splitSentences(text: string): string[] {
  // Use a regex that splits on . ! ? optionally followed by quotes/asterisks, then a space, keeping the punctuation
  // by using a capturing group. This prevents dropping the last sentence
  // if it doesn't end with punctuation.
  const regex = /([.!?]+["'*)]*)\s+/g;
  const parts = text.split(regex);
  
  const sentences: string[] = [];
  for (let i = 0; i < parts.length; i += 2) {
    const content = parts[i];
    const punc = parts[i + 1] || "";
    const sentence = (content + punc).trim();
    if (sentence) {
      sentences.push(sentence);
    }
  }
  
  return sentences;
}
