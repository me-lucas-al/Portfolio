import * as THREE from "three"
import { createRenderer } from "./create-renderer"
import { createScene, frameCameraOnObject } from "./create-scene"
import { loadFacecapModel } from "./model-loader"
import { buildMorphIndex, resolveBlendshapeKeys, setMorphWeight, type MorphIndex } from "./morph-index"
import { disposeObject3D } from "./dispose"
import { createRenderLoop } from "./render-loop"
import { createBlinkLayer } from "./layers/blink-layer"
import { createBreathLayer } from "./layers/breath-layer"
import { createLookAtLayer } from "./layers/look-at-layer"
import type { CanonicalBlendshapeName } from "./blendshape-names"

export interface AvatarEngineHandle {
  dispose: () => void
  /** Overrides the look-at target directly (e.g. for a future "look at the chat panel" behavior). */
  setLookTarget: (x: number, y: number) => void
}

export interface CreateAvatarEngineOptions {
  onError?: (error: unknown) => void
}

/**
 * Imperative facade - the ONLY object `use-avatar-engine.ts` touches. Owns
 * the renderer, scene, loaded model, morph index, and the idle layer mixer:
 * every frame it composes blink + breath + look-at and writes ALL managed
 * blendshape weights (including zeros) into the morph index. Never "poke a
 * single changed value" - later phases add more layers on top of this same
 * convention and must not fight it.
 */
export async function create(
  canvas: HTMLCanvasElement,
  options: CreateAvatarEngineOptions = {}
): Promise<AvatarEngineHandle> {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches

  let contextLost = false

  const rendererHandle = createRenderer(canvas, {
    onContextLost: () => {
      contextLost = true
    },
    onContextRestored: () => {
      // Minimal recovery stub for this phase: the GPU discarded all
      // textures/programs on context loss. We just let rendering resume
      // (three.js re-uploads resources lazily on next use for most simple
      // cases); a later phase should verify/rebuild the scene explicitly.
      contextLost = false
    },
  })
  const { renderer } = rendererHandle

  const width = canvas.clientWidth || 128
  const height = canvas.clientHeight || 128
  renderer.setSize(width, height, false)

  const { scene, camera } = createScene(width / Math.max(height, 1))

  let morphIndex: MorphIndex = new Map()
  let blendshapeKeys: Record<CanonicalBlendshapeName, string | null> | null = null
  let headNode: THREE.Object3D | null = null
  let model: THREE.Object3D | null = null

  try {
    model = await loadFacecapModel()
    scene.add(model)
    morphIndex = buildMorphIndex(model)
    blendshapeKeys = resolveBlendshapeKeys(morphIndex)
    headNode = model.getObjectByName("head") ?? null
    frameCameraOnObject(camera, model)
  } catch (error) {
    options.onError?.(error)
  }

  const blink = createBlinkLayer(reducedMotion)
  const breath = createBreathLayer(headNode, reducedMotion)
  const lookAt = createLookAtLayer({ coarsePointer })

  const applyBlendshapeWeights = (weights: Record<string, number>) => {
    if (!blendshapeKeys) return
    for (const [canonicalName, weight] of Object.entries(weights)) {
      const actualKey = blendshapeKeys[canonicalName as CanonicalBlendshapeName]
      if (actualKey) setMorphWeight(morphIndex, actualKey, weight)
    }
  }

  const renderLoop = createRenderLoop((deltaSeconds) => {
    if (contextLost) return

    const blinkWeights = blink.update(deltaSeconds)
    const lookAtWeights = lookAt.update(deltaSeconds)
    breath.update(deltaSeconds)

    applyBlendshapeWeights({ ...blinkWeights, ...lookAtWeights })

    renderer.render(scene, camera)
  }, reducedMotion)

  renderLoop.start()

  const dispose = () => {
    renderLoop.dispose()
    lookAt.dispose()
    rendererHandle.dispose()
    if (model) disposeObject3D(model)
  }

  const setLookTarget = (x: number, y: number) => {
    lookAt.setTarget(x, y)
  }

  return { dispose, setLookTarget }
}
