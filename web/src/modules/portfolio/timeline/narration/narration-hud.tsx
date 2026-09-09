"use client"

import { useEffect, useRef } from "react"
import { MessageCircleQuestion, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTypingSpeech } from "@/modules/portfolio/avatar/contract"
import { useAssistantBridge } from "@/modules/portfolio/assistant/contract"
import {
  advanceToNextBeat,
  exitJourneyNarration,
  markCurrentBeatTypingFinished,
  pauseNarrationForQuestion,
  resumeNarrationFromQuestion,
} from "./narration-controls"
import { useNarration } from "./use-narration"

export interface NarrationHudDict {
  narrationContinue: string
  narrationExit: string
  askAboutPhase: string
  outro: string
}

interface NarrationHudProps {
  dict: NarrationHudDict
}

export function NarrationHud({ dict }: NarrationHudProps) {
  const narration = useNarration()
  const { isTyping } = useTypingSpeech()
  const bridge = useAssistantBridge()
  const wasAssistantOpen = useRef(false)

  useEffect(() => {
    if (narration.status === "playing" && !isTyping) {
      markCurrentBeatTypingFinished()
    }
  }, [narration.status, isTyping])

  useEffect(() => {
    const wasOpen = wasAssistantOpen.current
    const isNowOpen = bridge.assistantOpen
    wasAssistantOpen.current = isNowOpen

    const justOpenedManually =
      !wasOpen && isNowOpen && (narration.status === "playing" || narration.status === "awaiting-advance")
    if (justOpenedManually) {
      pauseNarrationForQuestion()
      return
    }

    const justClosed = wasOpen && !isNowOpen
    if (justClosed && narration.status === "paused-for-question") {
      resumeNarrationFromQuestion()
    }
  }, [bridge.assistantOpen, narration.status])

  useEffect(() => {
    if (narration.status === "idle") return

    function exitNarrationOnEscapeKey(event: KeyboardEvent) {
      if (event.key === "Escape") exitJourneyNarration()
    }

    window.addEventListener("keydown", exitNarrationOnEscapeKey)
    return () => window.removeEventListener("keydown", exitNarrationOnEscapeKey)
  }, [narration.status])

  if (narration.status === "idle") return null

  const isFinished = narration.status === "finished"
  const isPausedForQuestion = narration.status === "paused-for-question"
  const totalBeats = narration.script.length
  const currentBeatNumber = Math.min(narration.beatIndex + 1, totalBeats)

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-between gap-3 border-t border-line bg-surface/95 px-4 py-3 shadow-lg shadow-black/30 backdrop-blur">
      <span className="font-mono text-xs text-muted-2">
        {isFinished ? dict.outro : `${currentBeatNumber} / ${totalBeats}`}
      </span>

      <div className="flex items-center gap-2">
        {!isFinished && !isPausedForQuestion && (
          <Button type="button" size="sm" variant="outline" onClick={pauseNarrationForQuestion}>
            <MessageCircleQuestion className="size-4" />
            {dict.askAboutPhase}
          </Button>
        )}
        {!isFinished && narration.status === "awaiting-advance" && (
          <Button type="button" size="sm" onClick={advanceToNextBeat}>
            {dict.narrationContinue}
          </Button>
        )}
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          onClick={exitJourneyNarration}
          aria-label={dict.narrationExit}
          title={dict.narrationExit}
        >
          <X className="size-4" />
        </Button>
      </div>
    </div>
  )
}
