"use client"

import type { Dictionary } from "@/i18n"
import { AvatarSprite } from "./sprite/avatar-sprite"
import { SpeechBalloon } from "./speech/speech-balloon"

interface AvatarStageProps {
  dict: Dictionary["assistant"]
}

/**
 * Mounts the avatar's mini (corner, idle) surface plus its floating speech
 * balloon. No canvas, no portal, no rect measuring - `AvatarSprite` reads
 * everything it needs off the shared signal bus and hides itself while the
 * assistant overlay is open (see `sprite/avatar-sprite.tsx`); the "bust"
 * variant is mounted separately, directly in the overlay's header slot
 * (`modules/portfolio/assistant/assistant-overlay.tsx`).
 */
export function AvatarStage({ dict }: AvatarStageProps) {
  return (
    <>
      <AvatarSprite
        variant="mini"
        className="fixed bottom-6 left-6 z-30 h-24 w-24 rounded-full object-cover sm:h-28 sm:w-28"
      />
      <SpeechBalloon skipLabel={dict.skipTyping} />
    </>
  )
}
