"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { registerTypingSurface } from "./typing-surface-registry"

interface TypedTextProps {
  fullText: string
  isTyping: boolean
  className?: string
}

const WRAP_CLASSNAME = "min-w-0 break-words [overflow-wrap:anywhere]"

export function TypedText({ fullText, isTyping, className }: TypedTextProps) {
  const spanRef = useRef<HTMLSpanElement | null>(null)

  useEffect(() => {
    if (!isTyping) return
    const node = spanRef.current
    if (!node) return
    return registerTypingSurface(node)
  }, [isTyping])

  if (!isTyping) {
    return <span className={cn(WRAP_CLASSNAME, className)}>{fullText}</span>
  }

  return (
    <>
      <span ref={spanRef} aria-hidden="true" className={cn(WRAP_CLASSNAME, className)} />
      <span className="sr-only">{fullText}</span>
    </>
  )
}
