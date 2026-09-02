"use client"

import { MediaFullscreenDialog } from "@/components/media/media-fullscreen-dialog"

interface ProjectFullscreenDialogProps {
  title: string
  imagesUrl: string[]
  startIndex?: number
}

export function ProjectFullscreenDialog({ title, imagesUrl, startIndex = 0 }: ProjectFullscreenDialogProps) {
  return (
    <MediaFullscreenDialog
      title={title}
      srTitle={`Modo tela cheia do projeto ${title}`}
      alt={title}
      imagesUrl={imagesUrl}
      startIndex={startIndex}
    />
  )
}
