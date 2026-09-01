"use client"

import type { CSSProperties } from "react"
import { CircleStop, Trash2, Volume2, VolumeX, X } from "lucide-react"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { AvatarSprite } from "@/modules/portfolio/avatar/contract"
import { AssistantStage, type AssistantStageProps } from "./assistant-stage"

interface AssistantOverlayProps extends AssistantStageProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clearChat: () => void
  /** Visitor's typing-blip sound preference (persisted by `useBlipPreferences`) - controls the toggle button's icon/label here. */
  blipsEnabled: boolean
  onToggleBlips: () => void
  /** TTS is dormant (see `../avatar/README.md`) - these stay wired for when it's re-enabled per-message. */
  isSpeaking: boolean
  isPreparingVoice: boolean
  onStopSpeaking: () => void
}

// Neutralizes DialogContent's default pop-in zoom (zoom-in-95/zoom-out-95) via
// inline style, which always wins the cascade regardless of Tailwind's utility
// generation order - twMerge can't dedupe those class names since they come
// from the tw-animate-css plugin, not core Tailwind, so passing an override
// class alongside the originals would leave both in the stylesheet with an
// unpredictable winner. The panel should only slide, never zoom.
const noZoomStyle: CSSProperties = {
  ["--tw-enter-scale" as string]: 1,
  ["--tw-exit-scale" as string]: 1,
} as CSSProperties

export function AssistantOverlay({
  open,
  onOpenChange,
  clearChat,
  blipsEnabled,
  onToggleBlips,
  isSpeaking,
  isPreparingVoice,
  onStopSpeaking,
  dict,
  messages,
  ...stageProps
}: AssistantOverlayProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        style={noZoomStyle}
        className="top-0 bottom-0 right-0 left-auto translate-x-0 translate-y-0 z-50 flex flex-col w-full sm:w-[420px] max-w-none sm:max-w-none gap-0 rounded-none border-0 border-l border-line p-0 shadow-2xl shadow-black/40 duration-300 bg-surface text-fg outline-none data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right"
      >
        <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <AvatarSprite variant="bust" className="size-11 shrink-0 rounded-full object-cover" />
            <div className="min-w-0">
              <DialogTitle className="text-sm leading-normal font-semibold text-fg">{dict.title}</DialogTitle>
              <DialogDescription className="text-xs text-muted-2">{dict.subtitle}</DialogDescription>
            </div>
          </div>
          <div className="flex items-center gap-1">
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
            <button
              type="button"
              onClick={onToggleBlips}
              aria-label={blipsEnabled ? dict.blipsDisable : dict.blipsEnable}
              aria-pressed={blipsEnabled}
              title={blipsEnabled ? dict.blipsDisable : dict.blipsEnable}
              className="rounded-md p-1.5 text-muted-2 transition-colors hover:bg-surface-2 hover:text-fg-muted"
            >
              {blipsEnabled ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
            </button>
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
        </div>

        <AssistantStage dict={dict} messages={messages} {...stageProps} />
      </DialogContent>
    </Dialog>
  )
}
