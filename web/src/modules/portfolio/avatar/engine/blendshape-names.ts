/**
 * Canonical (ARKit camelCase) blendshape names used by every layer in this
 * engine, mapped to the alternate spellings we've actually seen in loaded
 * assets.
 *
 * The committed `facecap.glb` placeholder (three.js's official sample) uses
 * the shorthand `_L`/`_R` suffix convention (e.g. `eyeBlink_L`,
 * `eyeLookIn_L`) rather than full ARKit camelCase (`eyeBlinkLeft`,
 * `eyeLookInLeft`). Layers are written against the canonical names below so
 * a future, higher-fidelity avatar asset that *does* use full ARKit names
 * works without touching layer code - only this alias table would need a
 * new entry.
 */
export const BLENDSHAPE_ALIASES = {
  eyeBlinkLeft: ["eyeBlinkLeft", "eyeBlink_L"],
  eyeBlinkRight: ["eyeBlinkRight", "eyeBlink_R"],
  eyeLookInLeft: ["eyeLookInLeft", "eyeLookIn_L"],
  eyeLookOutLeft: ["eyeLookOutLeft", "eyeLookOut_L"],
  eyeLookUpLeft: ["eyeLookUpLeft", "eyeLookUp_L"],
  eyeLookDownLeft: ["eyeLookDownLeft", "eyeLookDown_L"],
  eyeLookInRight: ["eyeLookInRight", "eyeLookIn_R"],
  eyeLookOutRight: ["eyeLookOutRight", "eyeLookOut_R"],
  eyeLookUpRight: ["eyeLookUpRight", "eyeLookUp_R"],
  eyeLookDownRight: ["eyeLookDownRight", "eyeLookDown_R"],
} as const satisfies Record<string, readonly string[]>

export type CanonicalBlendshapeName = keyof typeof BLENDSHAPE_ALIASES
