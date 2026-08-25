import * as THREE from "three"
import { createRenderer } from "./create-renderer"
import { createScene } from "./create-scene"
import { loadFacecapModel } from "./model-loader"
import { buildMorphIndex, resolveBlendshapeKeys, setMorphWeight, type MorphIndex } from "./morph-index"
import { disposeObject3D } from "./dispose"
import { createRenderLoop } from "./render-loop"
import { createBlinkLayer } from "./layers/blink-layer"
import { createBreathLayer, type BreathLayer } from "./layers/breath-layer"
import { createLookAtLayer } from "./layers/look-at-layer"
import { createViewportRig, toRendererViewportRect, type Rect } from "./viewport-rig"
import { createCameraRig, type CameraFramingName, type CameraRig } from "./camera-rig"
import type { CanonicalBlendshapeName } from "./blendshape-names"

export interface AvatarEngineHandle {
  dispose: () => void
  /** Overrides the look-at target directly (e.g. for a future "look at the chat panel" behavior). */
  setLookTarget: (x: number, y: number) => void
  /**
   * Morphs the avatar toward a named on-screen framing, drawn into `rect`
   * (a viewport-relative CSS-pixel rect, e.g. from `getBoundingClientRect()`).
   * Both the camera framing and the on-screen sub-rectangle continuously
   * chase their new target via damping - calling this again mid-chase (e.g.
   * a rapid open/close) just redirects the chase, nothing to cancel.
   */
  setFraming: (name: CameraFramingName, rect: Rect) => void
}

export interface CreateAvatarEngineOptions {
  onError?: (error: unknown) => void
}

const RESIZE_DEBOUNCE_MS = 150

function getViewportCssSize() {
  return { width: window.innerWidth, height: window.innerHeight }
}

/**
 * Imperative facade - the ONLY object `use-avatar-engine.ts` touches. Owns
 * the renderer, scene, loaded model, morph index, the idle layer mixer
 * (blink + breath + look-at, composed and written into the morph index every
 * frame - never "poke a single changed value"), and, since Fase 4, the
 * viewport/camera rigs that let ONE full-viewport canvas morph between the
 * idle mini-avatar corner framing and the assistant-overlay bust framing.
 *
 * The canvas passed in is now sized to the full viewport (not just its own
 * `clientWidth`/`clientHeight`) and drawn into via a scissored sub-rectangle
 * every frame - see `viewport-rig.ts` and `camera-rig.ts`.
 */
export async function create(
  canvas: HTMLCanvasElement,
  options: CreateAvatarEngineOptions = {}
): Promise<AvatarEngineHandle> {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches

  let contextLost = false
  let model: THREE.Object3D | null = null
  let morphIndex: MorphIndex = new Map()
  let blendshapeKeys: Record<CanonicalBlendshapeName, string | null> | null = null
  let activeFraming: CameraFramingName = "mini"
  let viewportCssSize = getViewportCssSize()

  // Assigned right below, before anything could possibly invoke the
  // context-loss callbacks passed to `createRenderer` (they only ever fire
  // from a real `webglcontextlost`/`webglcontextrestored` browser event, never
  // synchronously during setup) - safe for those closures to reference these
  // bindings ahead of their assignment.
  let scene!: THREE.Scene
  let camera!: THREE.PerspectiveCamera
  let breath: BreathLayer = createBreathLayer(null, reducedMotion)
  let cameraRig: CameraRig

  /**
   * (Re)loads facecap.glb and rebuilds everything derived from it: the morph
   * index, the breath layer (targets the "head" node), and the camera rig
   * (frames itself off the model's bounding box).
   *
   * Used both for the initial boot and - since `webglcontextlost` discards
   * ALL GPU resources, not just pauses them - to actually re-upload a fresh
   * model on `webglcontextrestored`, rather than resuming with stale/blank
   * textures (see `create-renderer.ts` and the `onContextRestored` wiring
   * below).
   */
  const loadModel = async (): Promise<void> => {
    try {
      const loaded = await loadFacecapModel()

      if (model) {
        scene.remove(model)
        disposeObject3D(model)
      }

      scene.add(loaded)
      model = loaded
      morphIndex = buildMorphIndex(loaded)
      blendshapeKeys = resolveBlendshapeKeys(morphIndex)

      const headNode = loaded.getObjectByName("head") ?? null
      breath = createBreathLayer(headNode, reducedMotion)
      cameraRig = createCameraRig(camera, loaded, reducedMotion, activeFraming)
    } catch (error) {
      options.onError?.(error)
    }
  }

  const rendererHandle = createRenderer(canvas, {
    onContextLost: () => {
      contextLost = true
    },
    onContextRestored: () => {
      void loadModel().then(() => {
        contextLost = false
      })
    },
  })
  const { renderer } = rendererHandle

  renderer.setSize(viewportCssSize.width, viewportCssSize.height, false)

  const created = createScene(viewportCssSize.width / Math.max(viewportCssSize.height, 1))
  scene = created.scene
  camera = created.camera
  cameraRig = createCameraRig(camera, null, reducedMotion)

  await loadModel()

  const blink = createBlinkLayer(reducedMotion)
  const lookAt = createLookAtLayer({ coarsePointer })
  const viewportRig = createViewportRig(reducedMotion)

  const applyBlendshapeWeights = (weights: Record<string, number>) => {
    if (!blendshapeKeys) return
    for (const [canonicalName, weight] of Object.entries(weights)) {
      const actualKey = blendshapeKeys[canonicalName as CanonicalBlendshapeName]
      if (actualKey) setMorphWeight(morphIndex, actualKey, weight)
    }
  }

  let resizeTimeout: ReturnType<typeof setTimeout> | null = null
  const handleResize = () => {
    if (resizeTimeout !== null) clearTimeout(resizeTimeout)
    resizeTimeout = setTimeout(() => {
      viewportCssSize = getViewportCssSize()
      renderer.setSize(viewportCssSize.width, viewportCssSize.height, false)
    }, RESIZE_DEBOUNCE_MS)
  }
  window.addEventListener("resize", handleResize)

  const renderLoop = createRenderLoop((deltaSeconds) => {
    if (contextLost) return

    const blinkWeights = blink.update(deltaSeconds)
    const lookAtWeights = lookAt.update(deltaSeconds)
    breath.update(deltaSeconds)

    applyBlendshapeWeights({ ...blinkWeights, ...lookAtWeights })

    // Always run, at rest or mid-transition: a continuous chase-the-target
    // damp is correct (and effectively free) even when already converged.
    viewportRig.update(deltaSeconds)
    const currentRect = viewportRig.getCurrentRect()
    const aspect =
      currentRect.width > 0 && currentRect.height > 0 ? currentRect.width / currentRect.height : camera.aspect
    cameraRig.update(deltaSeconds, aspect)

    const glRect = toRendererViewportRect(currentRect, viewportCssSize.height)
    renderer.setScissorTest(true)
    renderer.setScissor(glRect.x, glRect.y, glRect.width, glRect.height)
    renderer.setViewport(glRect.x, glRect.y, glRect.width, glRect.height)

    renderer.render(scene, camera)
  }, reducedMotion)

  renderLoop.start()

  const dispose = () => {
    renderLoop.dispose()
    lookAt.dispose()
    window.removeEventListener("resize", handleResize)
    if (resizeTimeout !== null) clearTimeout(resizeTimeout)
    rendererHandle.dispose()
    if (model) disposeObject3D(model)
  }

  const setLookTarget = (x: number, y: number) => {
    lookAt.setTarget(x, y)
  }

  const setFraming = (name: CameraFramingName, rect: Rect) => {
    activeFraming = name
    viewportRig.setTargetRect(rect)
    cameraRig.setFraming(name)
    // No-op unless `reducedMotion` (see `render-loop.ts`) - under reduced
    // motion there is no continuous rAF, so a framing change needs an
    // explicit nudge to actually paint the (instantly-snapped) new state.
    renderLoop.requestRender()
  }

  return { dispose, setLookTarget, setFraming }
}
