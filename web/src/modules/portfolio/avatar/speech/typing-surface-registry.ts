/**
 * Registry of DOM nodes currently displaying the typing engine's revealed
 * text. Writing here goes straight to `node.textContent`, not React state -
 * at `typing-engine.ts`'s ~32ms/char cadence that would otherwise mean
 * dozens of re-renders per second of everything above the text node.
 *
 * Two surfaces can be registered at once (the floating balloon + the
 * message bubble), and transferring between them (e.g. opening the panel
 * mid-typing) is free: registering a new node just means it receives
 * `getRevealedText()` on the very next `writeTypingSurfaces` call - nothing
 * about the typing engine's own state resets.
 */
const surfaces = new Set<HTMLElement>()
let revealedText = ""

export function registerTypingSurface(node: HTMLElement): () => void {
  node.textContent = revealedText
  surfaces.add(node)
  return () => {
    surfaces.delete(node)
  }
}

export function writeTypingSurfaces(nextRevealedText: string): void {
  revealedText = nextRevealedText
  surfaces.forEach((node) => {
    node.textContent = revealedText
  })
}

export function getRevealedText(): string {
  return revealedText
}
