import { setBlinking } from "../state/avatar-signal-bus"

/**
 * Single module-scope timer (not one per `AvatarSprite` instance) so the
 * mini and bust surfaces blink in sync - both read the same `blinking` flag
 * off the shared signal bus.
 *
 * Paused while the tab is hidden (same `document.hidden` check the old
 * three.js render loop used) and never started at all under
 * `prefers-reduced-motion` - `avatar-sprite.tsx` is the one place that
 * decides whether to call `startBlinkTimer()`.
 */
const MIN_INTERVAL_MS = 2000
const MAX_INTERVAL_MS = 6000
const BLINK_DURATION_MS = 150

let timeoutId: ReturnType<typeof setTimeout> | null = null
let refCount = 0

function randomInterval(): number {
  return MIN_INTERVAL_MS + Math.random() * (MAX_INTERVAL_MS - MIN_INTERVAL_MS)
}

function scheduleNextBlink(): void {
  timeoutId = setTimeout(() => {
    if (document.hidden) {
      scheduleNextBlink()
      return
    }

    setBlinking(true)
    timeoutId = setTimeout(() => {
      setBlinking(false)
      scheduleNextBlink()
    }, BLINK_DURATION_MS)
  }, randomInterval())
}

/** Ref-counted: safe to call once per mounted `AvatarSprite` instance. Only the first call actually starts the loop. */
export function startBlinkTimer(): void {
  refCount += 1
  if (refCount > 1) return
  scheduleNextBlink()
}

/** Stops the loop once every instance that started it has stopped. */
export function stopBlinkTimer(): void {
  refCount = Math.max(0, refCount - 1)
  if (refCount > 0) return

  if (timeoutId !== null) {
    clearTimeout(timeoutId)
    timeoutId = null
  }
  setBlinking(false)
}
