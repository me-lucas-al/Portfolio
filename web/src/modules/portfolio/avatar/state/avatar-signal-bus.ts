/**
 * Module-scope mutable store bridging the assistant module's React state
 * (is the chat overlay open, and where does its avatar-bust header slot sit
 * on screen right now) to the avatar side, which reads it from a plain
 * getter - the same "mutable value written by something outside React,
 * read back without going through React state" convention
 * `engine/layers/look-at-layer.ts` already uses for pointer position.
 *
 * Deliberately no pub/sub here: nothing subscribes to changes. The avatar
 * side (see `../use-avatar-framing.ts`) re-checks this on its own cadence
 * (mount, resize, a short interval) instead of being pushed to.
 *
 * Three-less, like `../contract.ts` which is the only place allowed to call
 * `setOverlayState` from outside this module.
 */

export interface AvatarOverlayRect {
  x: number
  y: number
  width: number
  height: number
}

interface AvatarSignalState {
  overlayOpen: boolean
  overlayAnchorRect: AvatarOverlayRect | null
}

const state: AvatarSignalState = {
  overlayOpen: false,
  overlayAnchorRect: null,
}

/** Written by `contract.ts`'s `setAvatarOverlayState` on behalf of the assistant module. */
export function setOverlayState(open: boolean, anchorRect: AvatarOverlayRect | null): void {
  state.overlayOpen = open
  state.overlayAnchorRect = open ? anchorRect : null
}

/** Read by the avatar module's own framing hook. Never mutate the returned object. */
export function getOverlayState(): Readonly<AvatarSignalState> {
  return state
}
