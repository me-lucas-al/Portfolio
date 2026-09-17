"use client"

import { useSyncExternalStore } from "react"
import { getNarrationSnapshot, subscribeNarration } from "./narration-state"

function getServerNarrationSnapshot() {
  return getNarrationSnapshot()
}

export function useNarration() {
  return useSyncExternalStore(subscribeNarration, getNarrationSnapshot, getServerNarrationSnapshot)
}
