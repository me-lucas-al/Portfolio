import type { Mesh, Object3D } from "three"
import { BLENDSHAPE_ALIASES, type CanonicalBlendshapeName } from "./blendshape-names"

export interface MorphTargetRef {
  mesh: Mesh
  index: number
}

/** Every blendshape name found in the loaded scene, mapped to ALL meshes that carry it. */
export type MorphIndex = Map<string, MorphTargetRef[]>

/**
 * Traverses the loaded scene graph and indexes every mesh with a
 * `morphTargetDictionary`. ARKit-style blendshapes can be spread across
 * multiple meshes (head, teeth, tongue, eyelashes) - a name found on more
 * than one mesh must be written to all of them, or the meshes that weren't
 * "first" stay frozen. (In the current facecap.glb placeholder only the head
 * mesh actually carries morph targets, but the index is built generically so
 * a richer asset with per-part meshes works without code changes.)
 */
export function buildMorphIndex(root: Object3D): MorphIndex {
  const index: MorphIndex = new Map()

  root.traverse((child) => {
    const mesh = child as Mesh
    const dictionary = mesh.morphTargetDictionary
    const influences = mesh.morphTargetInfluences

    if (!dictionary || !influences) return

    for (const [name, morphTargetIndex] of Object.entries(dictionary)) {
      const targets = index.get(name) ?? []
      targets.push({ mesh, index: morphTargetIndex })
      index.set(name, targets)
    }
  })

  return index
}

/** Writes a weight to every mesh registered under `name`. No-op if the name isn't in this asset. */
export function setMorphWeight(index: MorphIndex, name: string, weight: number): void {
  const targets = index.get(name)
  if (!targets) return

  for (const target of targets) {
    if (target.mesh.morphTargetInfluences) {
      target.mesh.morphTargetInfluences[target.index] = weight
    }
  }
}

/**
 * Resolves each canonical blendshape name to whichever alias actually exists
 * in this loaded asset's morph index (or `null` if none of the aliases are
 * present). Computed once per model load and reused every frame.
 */
export function resolveBlendshapeKeys(
  index: MorphIndex
): Record<CanonicalBlendshapeName, string | null> {
  const resolved = {} as Record<CanonicalBlendshapeName, string | null>

  for (const canonicalName of Object.keys(BLENDSHAPE_ALIASES) as CanonicalBlendshapeName[]) {
    const aliases = BLENDSHAPE_ALIASES[canonicalName]
    resolved[canonicalName] = aliases.find((alias) => index.has(alias)) ?? null
  }

  return resolved
}
