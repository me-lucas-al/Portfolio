"use client"

import { useEffect, useRef } from "react"
import { registerTypingSurface } from "./typing-surface-registry"

interface TypedTextProps {
  fullText: string
  isTyping: boolean
  className?: string
}

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
