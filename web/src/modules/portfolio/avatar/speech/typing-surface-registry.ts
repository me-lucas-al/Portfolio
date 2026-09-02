
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
