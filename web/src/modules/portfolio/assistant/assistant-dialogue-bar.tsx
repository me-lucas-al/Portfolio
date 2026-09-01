"use client"

import type { CSSProperties } from "react"
import { CircleStop, Trash2, X } from "lucide-react"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { AssistantStage, type AssistantStageProps } from "./assistant-stage"

interface AssistantDialogueBarProps extends AssistantStageProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clearChat: () => void
  /** TTS is dormant (see `../avatar/README.md`) - these stay wired for when it's re-enabled per-message. */
  isSpeaking: boolean
  isPreparingVoice: boolean
  onStopSpeaking: () => void
}

// Neutralizes DialogContent's default pop-in zoom (zoom-in-95/zoom-out-95)
// via inline style - see the former `assistant-overlay.tsx` for the original
// rationale (twMerge can't dedupe tw-animate-css's scale vars against an
// override class). The bar should only slide up from the bottom edge.
const noZoomStyle: CSSProperties = {
  ["--tw-enter-scale" as string]: 1,
  ["--tw-exit-scale" as string]: 1,
} as CSSProperties

// Replaces the former right-edge sliding chat panel (`assistant-overlay.tsx`)
// with a bottom-docked "dialogue box" in the avatar's own visual-novel
// language (see `../avatar/README.md`) - the assistant's only surface once
// open. Radix's `Dialog` primitive is kept for its focus trap / ESC-to-close
// / aria wiring; only its positioning is restyled here. `DialogTitle`/
// `DialogDescription` stay mounted but screen-reader-only - the visible name
// tag now lives on the avatar's bust portrait inside `AssistantStage`.
export function AssistantDialogueBar({
  open,
  onOpenChange,
  clearChat,
  isSpeaking,
  isPreparingVoice,
  onStopSpeaking,
  dict,
  messages,
  ...stageProps
}: AssistantDialogueBarProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        style={noZoomStyle}
        className="top-auto right-0 bottom-0 left-0 z-50 flex max-h-[85vh] w-full translate-x-0 translate-y-0 flex-col gap-0 rounded-t-3xl rounded-b-none border border-b-0 border-line border-t-4 border-t-brand bg-surface p-0 text-fg shadow-2xl shadow-black/40 outline-none duration-300 sm:left-1/2 sm:w-full sm:max-w-2xl sm:-translate-x-1/2 data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom"
      >
        <DialogTitle className="sr-only">{dict.title}</DialogTitle>
        <DialogDescription className="sr-only">{dict.subtitle}</DialogDescription>

        <div className="flex items-center justify-end gap-1 px-3 pt-2">
          {(isSpeaking || isPreparingVoice) && (
            <button
              type="button"
              onClick={onStopSpeaking}
              aria-label={isPreparingVoice ? dict.preparingVoice : dict.stopSpeaking}
              title={isPreparingVoice ? dict.preparingVoice : dict.stopSpeaking}
              className="rounded-md p-1.5 text-muted-2 transition-colors hover:bg-surface-2 hover:text-fg-muted"
            >
              <CircleStop className={`size-4 ${isPreparingVoice ? "animate-pulse" : ""}`} />
            </button>
          )}
          {messages.length > 0 && (
            <button
              type="button"
              onClick={clearChat}
              aria-label="Clear chat"
              className="rounded-md p-1.5 text-muted-2 transition-colors hover:bg-surface-2 hover:text-fg-muted"
            >
              <Trash2 className="size-4" />
            </button>
          )}
          <DialogClose asChild>
            <button
              type="button"
              aria-label={dict.close}
              className="rounded-md p-1.5 text-muted-2 transition-colors hover:bg-surface-2 hover:text-fg-muted"
            >
              <X className="size-4" />
            </button>
          </DialogClose>
        </div>

        <AssistantStage dict={dict} messages={messages} {...stageProps} />
      </DialogContent>
    </Dialog>
  )
}
