import type { Locale } from "@/i18n"
import { requestAssistantOpenWithPhaseContext } from "@/modules/portfolio/assistant/contract"
import {
  setAvatarOverlayState,
  setAvatarTone,
  setTypingSpeechPersistent,
  skipTypingSpeech,
  startTypingSpeech,
  stopTypingSpeech,
  type Tone,
} from "../../avatar/contract"
import type { TimelineMilestone } from "../timeline-data"
import { buildNarrationScript, type NarrationBeat, type NarrationBeatKind } from "./narration-script"
import { getNarrationSnapshot, setNarrationState } from "./narration-state"

const BEAT_TONE: Record<NarrationBeatKind, Tone> = {
  title: "neutral",
  impact: "surprised",
  problem: "explanatory",
  inflection: "surprised",
  solution: "positive",
  sequence: "explanatory",
  graveyard: "explanatory",
}

// Negative and distinct from real chat message ids (which start at 1), so narration
// beats never collide with an actual chat message id in the shared typing-speech store.
function toNarrationMessageId(beatIndex: number): number {
  return -(beatIndex + 1)
}

function playBeat(beat: NarrationBeat, beatIndex: number): void {
  setAvatarTone(BEAT_TONE[beat.kind])
  startTypingSpeech(toNarrationMessageId(beatIndex), beat.text)
}

export function startJourneyNarration(milestones: TimelineMilestone[], locale: Locale, fromSlug?: string): void {
  const script = buildNarrationScript(milestones, locale)
  if (script.length === 0) return

  const requestedIndex = fromSlug ? script.findIndex((beat) => beat.milestoneSlug === fromSlug) : 0
  const startIndex = Math.max(requestedIndex, 0)

  setTypingSpeechPersistent(true)
  setNarrationState({ status: "playing", script, beatIndex: startIndex })
  playBeat(script[startIndex], startIndex)
}

export function markCurrentBeatTypingFinished(): void {
  const snapshot = getNarrationSnapshot()
  if (snapshot.status !== "playing") return

  setNarrationState({ status: "awaiting-advance" })
}

export function advanceToNextBeat(): void {
  const snapshot = getNarrationSnapshot()
  if (snapshot.status !== "awaiting-advance") return

  const nextIndex = snapshot.beatIndex + 1
  if (nextIndex >= snapshot.script.length) {
    stopTypingSpeech()
    setNarrationState({ status: "finished" })
    return
  }

  setNarrationState({ status: "playing", beatIndex: nextIndex })
  playBeat(snapshot.script[nextIndex], nextIndex)
}

function buildPhaseContextForCurrentBeat(): string | null {
  const snapshot = getNarrationSnapshot()
  const currentBeat = snapshot.script[snapshot.beatIndex]
  if (!currentBeat) return null

  return snapshot.script
    .filter((beat) => beat.milestoneSlug === currentBeat.milestoneSlug)
    .map((beat) => beat.text)
    .join("\n\n")
}

export function pauseNarrationForQuestion(): void {
  const snapshot = getNarrationSnapshot()
  if (snapshot.status !== "playing" && snapshot.status !== "awaiting-advance") return

  const phaseContext = buildPhaseContextForCurrentBeat()
  stopTypingSpeech()
  setNarrationState({ status: "paused-for-question" })
  if (phaseContext) requestAssistantOpenWithPhaseContext(phaseContext)
}

export function resumeNarrationFromQuestion(): void {
  const snapshot = getNarrationSnapshot()
  if (snapshot.status !== "paused-for-question") return

  const beat = snapshot.script[snapshot.beatIndex]
  setAvatarTone(BEAT_TONE[beat.kind])
  startTypingSpeech(toNarrationMessageId(snapshot.beatIndex), beat.text)
  skipTypingSpeech()
  setNarrationState({ status: "awaiting-advance" })
}

export function exitJourneyNarration(): void {
  stopTypingSpeech()
  setTypingSpeechPersistent(false)
  setAvatarOverlayState(false)
  setNarrationState({ status: "idle", script: [], beatIndex: 0 })
}
