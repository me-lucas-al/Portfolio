import { setMouthOpen } from "../state/avatar-signal-bus"

export type MouthSourceName = "typing" | "audio"

const PRIORITY: Record<MouthSourceName, number> = {
  typing: 0,
  audio: 1,
}

let activeSource: MouthSourceName | null = null

export function activateMouthSource(name: MouthSourceName): void {
  if (activeSource !== null && PRIORITY[activeSource] > PRIORITY[name]) return
  activeSource = name
}

export function deactivateMouthSource(name: MouthSourceName): void {
  if (activeSource !== name) return
  activeSource = null
  setMouthOpen(0)
}

export function writeMouthOpen(name: MouthSourceName, value: number): void {
  if (activeSource !== name) return
  setMouthOpen(value)
}

export function getActiveMouthSource(): MouthSourceName | null {
  return activeSource
}
