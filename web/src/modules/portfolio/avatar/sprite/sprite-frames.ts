import type { Expression } from "./tone-expression-map"

export type MouthState = "closed" | "open"

const SPRITE_BASE_PATH = "/avatar/sprites"

// Blink only exists for "neutral" - a blink mid a strong expression
// (apologetic/surprised) would need its own frame, which doesn't exist yet.
// `avatar-sprite.tsx` only ever asks for `blinking: true` while the current
// expression is "neutral" (see its own comment), but this function still
// falls back to `${expression}-closed` if it's ever called for anything
// else, instead of returning a URL that doesn't exist.
const FRAME_URLS: Record<Expression, { closed: string; open: string; blink?: string }> = {
  neutral: {
    closed: `${SPRITE_BASE_PATH}/neutral-closed.png`,
    open: `${SPRITE_BASE_PATH}/neutral-open.png`,
    blink: `${SPRITE_BASE_PATH}/neutral-blink.png`,
  },
  positive: {
    closed: `${SPRITE_BASE_PATH}/positive-closed.png`,
    open: `${SPRITE_BASE_PATH}/positive-open.png`,
  },
  apologetic: {
    closed: `${SPRITE_BASE_PATH}/apologetic-closed.png`,
    open: `${SPRITE_BASE_PATH}/apologetic-open.png`,
  },
  surprised: {
    closed: `${SPRITE_BASE_PATH}/surprised-closed.png`,
    open: `${SPRITE_BASE_PATH}/surprised-open.png`,
  },
}

export function getFrameUrl(expression: Expression, mouthState: MouthState, blinking: boolean): string {
  const frames = FRAME_URLS[expression]
  if (blinking && frames.blink) return frames.blink
  return mouthState === "open" ? frames.open : frames.closed
}

function allFrameUrls(): string[] {
  return Object.values(FRAME_URLS).flatMap((frames) => [frames.closed, frames.open, frames.blink].filter(Boolean) as string[])
}

let preloadPromise: Promise<void[]> | null = null

/** Warms the browser's HTTP cache for every sprite frame so the first expression/mouth/blink change never pops in late. Safe to call from every mounted `AvatarSprite` instance - only the first call actually fetches anything. */
export function preloadAllSpriteFrames(): Promise<void[]> {
  if (preloadPromise) return preloadPromise

  preloadPromise = Promise.all(
    allFrameUrls().map(
      (url) =>
        new Promise<void>((resolve) => {
          const image = new Image()
          image.onload = () => resolve()
          image.onerror = () => resolve()
          image.src = url
        })
    )
  )

  return preloadPromise
}
