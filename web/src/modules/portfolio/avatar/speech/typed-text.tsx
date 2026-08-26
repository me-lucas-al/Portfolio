"use client"

import { useEffect, useRef } from "react"
import { registerTypingSurface } from "./typing-surface-registry"

interface TypedTextProps {
  fullText: string
  isTyping: boolean
  className?: string
}

/**
 * While `isTyping`, registers its `<span>` with `typing-surface-registry.ts`
 * and lets `typing-engine.ts` write revealed characters straight into the
 * DOM - not through React state, see the registry's own doc comment for why.
 * Once typing is done (or was never active for this text, e.g. a message
 * restored from `localStorage`), renders `fullText` directly through React
 * like any other text.
 *
 * The animated span is `aria-hidden` with a `sr-only` sibling carrying the
 * complete text, so a screen reader announces the response once instead of
 * character by character.
 */
export function TypedText({ fullText, isTyping, className }: TypedTextProps) {
  const spanRef = useRef<HTMLSpanElement | null>(null)

  useEffect(() => {
    if (!isTyping) return
    const node = spanRef.current
    if (!node) return
    return registerTypingSurface(node)
  }, [isTyping])

  if (!isTyping) {
    return <span className={className}>{fullText}</span>
  }

  return (
    <>
      <span ref={spanRef} aria-hidden="true" className={className} />
      <span className="sr-only">{fullText}</span>
    </>
  )
}
