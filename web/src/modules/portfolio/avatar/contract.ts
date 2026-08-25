/**
 * Public contract for the avatar module.
 *
 * This is the ONLY file other modules (e.g. the assistant widget, in a later
 * phase) are allowed to import from `modules/portfolio/avatar`. It must never
 * import from `./engine/*` or from `three` - keeping it dependency-free lets
 * any consumer reference these types without pulling three.js into their
 * bundle.
 *
 * Keep this small. Later phases (audio/lip-sync, expressions, emotion/tone)
 * extend this contract - do not pre-build fields for them here.
 */

/** High-level state the avatar can be in. Extended by later phases. */
export type AvatarState = "idle" | "loading" | "error" | "unsupported"

/** Minimal handle a consumer could use to react to state changes. */
export interface AvatarStatus {
  state: AvatarState
}
