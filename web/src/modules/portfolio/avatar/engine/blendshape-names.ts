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
  // Fase 6 (viseme layer). Unlike the eye names above, `jawOpen` and
  // `mouthFunnel` are not L/R-paired ARKit blendshapes, so the committed
  // facecap.glb (which otherwise renames paired shapes with an `_L`/`_R`
  // suffix) carries them under their exact canonical spelling already -
  // verified by inspecting the asset's `morphTargetDictionary` directly.
  // Listed here anyway (single-alias, no renaming) because
  // `resolveBlendshapeKeys` only ever resolves names that are keys of this
  // table.
  jawOpen: ["jawOpen"],
  mouthFunnel: ["mouthFunnel"],
  // Fase 7 (tone/emotion layer). Verified directly against the committed
  // facecap.glb's `morphTargetDictionary` the same way Fase 6 did for
  // jawOpen/mouthFunnel above - every one of these names actually exists on
  // this placeholder asset, all under the same `_L`/`_R` suffix convention
  // as the eye names, except `browInnerUp` which (like jawOpen/mouthFunnel)
  // is an unpaired ARKit shape and carries its exact canonical spelling.
  mouthSmileLeft: ["mouthSmileLeft", "mouthSmile_L"],
  mouthSmileRight: ["mouthSmileRight", "mouthSmile_R"],
  cheekSquintLeft: ["cheekSquintLeft", "cheekSquint_L"],
  cheekSquintRight: ["cheekSquintRight", "cheekSquint_R"],
  browInnerUp: ["browInnerUp"],
  browOuterUpLeft: ["browOuterUpLeft", "browOuterUp_L"],
  browOuterUpRight: ["browOuterUpRight", "browOuterUp_R"],
  eyeWideLeft: ["eyeWideLeft", "eyeWide_L"],
  eyeWideRight: ["eyeWideRight", "eyeWide_R"],
  mouthPressLeft: ["mouthPressLeft", "mouthPress_L"],
  mouthPressRight: ["mouthPressRight", "mouthPress_R"],
  mouthFrownLeft: ["mouthFrownLeft", "mouthFrown_L"],
  mouthFrownRight: ["mouthFrownRight", "mouthFrown_R"],
} as const satisfies Record<string, readonly string[]>

export type CanonicalBlendshapeName = keyof typeof BLENDSHAPE_ALIASES
