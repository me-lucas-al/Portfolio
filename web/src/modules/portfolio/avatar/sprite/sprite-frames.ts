import type { Expression } from "./tone-expression-map"

export type MouthState = "closed" | "open"

const SPRITE_BASE_PATH = "/avatar/sprites"

const FRAME_URLS: Record<Expression, { closed: string; open: string }> = {
  neutral: {
    closed: `${SPRITE_BASE_PATH}/neutral-closed.png`,
    open: `${SPRITE_BASE_PATH}/neutral-open.png`,
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

export function getFrameUrl(expression: Expression, mouthState: MouthState): string {
  const frames = FRAME_URLS[expression]
  return mouthState === "open" ? frames.open : frames.closed
}

function allFrameUrls(): string[] {
  return Object.values(FRAME_URLS).flatMap((frames) => [frames.closed, frames.open])
}

let preloadPromise: Promise<void[]> | null = null

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
