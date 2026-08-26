"use client"

import { useCallback, useEffect, useState } from "react"
import { preloadBlips, setBlipVolume } from "./blip-player"

const STORAGE_KEY = "assistant_blips_enabled"

// Starts on: the visitor only hears a blip after they've already opened the
// chat panel and a response starts typing, so there's no risk of unexpected
// sound on page load.
const DEFAULT_BLIPS_ENABLED = true

function loadBlipsEnabled(): boolean {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw === null ? DEFAULT_BLIPS_ENABLED : raw === "1"
  } catch {
    return DEFAULT_BLIPS_ENABLED
  }
}

function persistBlipsEnabled(value: boolean): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, value ? "1" : "0")
  } catch {
    // localStorage unavailable (private browsing, quota) - the toggle just won't stick across visits
  }
}

export interface UseBlipPreferencesResult {
  blipsEnabled: boolean
  setBlipsEnabled: (value: boolean) => void
}

/** Persists the visitor's typing-blip sound preference and mirrors it into `blip-player.ts`'s gain node. */
export function useBlipPreferences(): UseBlipPreferencesResult {
  const [blipsEnabled, setBlipsEnabledState] = useState(DEFAULT_BLIPS_ENABLED)

  useEffect(() => {
    const loaded = loadBlipsEnabled()
    setBlipsEnabledState(loaded)
    setBlipVolume(loaded ? 1 : 0)
    void preloadBlips()
  }, [])

  const setBlipsEnabled = useCallback((value: boolean) => {
    setBlipsEnabledState(value)
    persistBlipsEnabled(value)
    setBlipVolume(value ? 1 : 0)
  }, [])

  return { blipsEnabled, setBlipsEnabled }
}
