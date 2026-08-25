"use client"

import type { CSSProperties, RefObject } from "react"
import { CircleStop, Trash2, Volume2, VolumeX, X } from "lucide-react"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { AssistantConversation, type AssistantConversationProps } from "./assistant-conversation"

interface AssistantOverlayProps extends AssistantConversationProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clearChat: () => void
  /**
   * Header slot the avatar module draws its "overlay-bust" framing into
   * (see `assistant-widget.tsx`). This component has no idea the avatar
   * exists - it just renders an empty, decorative circular placeholder and
   * hands the ref up.
   */
  avatarSlotRef: RefObject<HTMLDivElement | null>
  /** User's voice preference (persisted by `useSpeechPlayer`) - controls only the toggle button's icon/label here. */
  voiceEnabled: boolean
  onToggleVoice: () => void
  isSpeaking: boolean
  /** True while `/api/tts` is still synthesizing - the response arrives whole, tens of seconds after the text does. */
  isPreparingVoice: boolean
  /** Voice is on but no gesture has unlocked the audio element yet this load. */
  needsUnlock: boolean
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
  avatarSlotRef,
  voiceEnabled,
  onToggleVoice,
  isSpeaking,
  isPreparingVoice,
  needsUnlock,
  onStopSpeaking,
  dict,
  messages,
  ...conversationProps
}: AssistantOverlayProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        style={noZoomStyle}
        className="top-0 bottom-0 right-0 left-auto translate-x-0 translate-y-0 z-50 flex flex-col w-full sm:w-[420px] max-w-none sm:max-w-none gap-0 rounded-none border-0 border-l border-neutral-800 p-0 shadow-2xl shadow-black/40 duration-300 bg-neutral-950 text-white outline-none data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right"
      >
        <div className="flex items-center justify-between gap-3 border-b border-neutral-900 px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <div ref={avatarSlotRef} aria-hidden="true" className="size-11 shrink-0 rounded-full pointer-events-none" />
            <div className="min-w-0">
              <DialogTitle className="text-sm leading-normal font-semibold text-white">{dict.title}</DialogTitle>
              <DialogDescription className="text-xs text-neutral-500">{dict.subtitle}</DialogDescription>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {(isSpeaking || isPreparingVoice) && (
              <button
                type="button"
                onClick={onStopSpeaking}
                aria-label={isPreparingVoice ? dict.preparingVoice : dict.stopSpeaking}
                title={isPreparingVoice ? dict.preparingVoice : dict.stopSpeaking}
                className="rounded-md p-1.5 text-neutral-500 transition-colors hover:bg-neutral-900 hover:text-neutral-300"
              >
                <CircleStop className={`size-4 ${isPreparingVoice ? "animate-pulse" : ""}`} />
              </button>
            )}
            <button
              type="button"
              onClick={onToggleVoice}
              aria-label={voiceEnabled ? dict.voiceDisable : dict.voiceEnable}
              aria-pressed={voiceEnabled}
              title={needsUnlock ? dict.voiceUnlockHint : voiceEnabled ? dict.voiceDisable : dict.voiceEnable}
              className="rounded-md p-1.5 text-neutral-500 transition-colors hover:bg-neutral-900 hover:text-neutral-300"
            >
              {voiceEnabled ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
            </button>
            {messages.length > 0 && (
              <button
                type="button"
                onClick={clearChat}
                aria-label="Clear chat"
                className="rounded-md p-1.5 text-neutral-500 transition-colors hover:bg-neutral-900 hover:text-neutral-300"
              >
                <Trash2 className="size-4" />
              </button>
            )}
            <DialogClose asChild>
              <button
                type="button"
                aria-label={dict.close}
                className="rounded-md p-1.5 text-neutral-500 transition-colors hover:bg-neutral-900 hover:text-neutral-300"
              >
                <X className="size-4" />
              </button>
            </DialogClose>
          </div>
        </div>

        <AssistantConversation dict={dict} messages={messages} {...conversationProps} />
      </DialogContent>
    </Dialog>
  )
}
