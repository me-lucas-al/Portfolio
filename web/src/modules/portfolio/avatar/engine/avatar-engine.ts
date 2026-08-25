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
import { createVisemeLayer } from "./layers/viseme-layer"
import { createEmotionLayer } from "./layers/emotion-layer"
import { createViewportRig, toRendererViewportRect, type Rect } from "./viewport-rig"
import { createCameraRig, type CameraFramingName, type CameraRig } from "./camera-rig"
import { createDprDegrade } from "./dpr-degrade"
import type { CanonicalBlendshapeName } from "./blendshape-names"
import { setMouthOpen, getTone } from "../state/avatar-signal-bus"

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
// Below this fraction of `window.innerHeight`, `visualViewport.height` is
// assumed to mean "the on-screen keyboard is very likely open" rather than
// e.g. a mobile browser chrome (address bar) show/hide, which shrinks it by
// a much smaller fraction. Only consulted on coarse-pointer devices - see
// the `visualViewport` listener below.
const KEYBOARD_VISIBLE_HEIGHT_RATIO = 0.75

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
  const viseme = createVisemeLayer()
  const emotion = createEmotionLayer()
  const viewportRig = createViewportRig(reducedMotion)
  // Never ticked while `reducedMotion` (see `dpr-degrade.ts`'s own doc
  // comment) - there is no continuous rAF to react to a "sustained render
  // load" in that mode, so the render loop callback below simply skips both
  // of its calls whenever `reducedMotion` is true.
  const dprDegrade = createDprDegrade(renderer.getPixelRatio())
  let appliedDpr = renderer.getPixelRatio()

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

  // On coarse-pointer devices only: `visualViewport.height` shrinking well
  // below `window.innerHeight` is the on-screen-keyboard heuristic from the
  // plan (iOS never updates `innerHeight` when the keyboard opens - the
  // layout viewport is unaffected, only the visual one shrinks). Gated to
  // `coarsePointer` so a desktop window/devtools resize (which moves both
  // dimensions together) never misreads as a keyboard opening. Routed
  // through `renderLoop.setPaused` (declared below) rather than a second,
  // parallel pause flag.
  const visualViewport = coarsePointer ? window.visualViewport : null
  const handleVisualViewportResize = () => {
    if (!visualViewport) return
    const heightRatio = visualViewport.height / window.innerHeight
    renderLoop.setPaused(heightRatio < KEYBOARD_VISIBLE_HEIGHT_RATIO)
  }
  visualViewport?.addEventListener("resize", handleVisualViewportResize)

  const renderLoop = createRenderLoop((deltaSeconds) => {
    if (contextLost) return

    const blinkWeights = blink.update(deltaSeconds)
    const lookAtWeights = lookAt.update(deltaSeconds)
    const visemeWeights = viseme.update(deltaSeconds)
    // Polled once per frame from the bus (see `state/avatar-signal-bus.ts`)
    // and forwarded into the layer's own `setTone`, mirroring how
    // `setLookTarget` below forwards into `lookAt.setTarget` - the layer
    // itself never reaches into the bus for `tone` (only for `thinking` and
    // `mouthOpen`, which it reads directly every tick like `viseme` does).
    emotion.setTone(getTone())
    const emotionWeights = emotion.update(deltaSeconds)
    breath.update(deltaSeconds)

    applyBlendshapeWeights({ ...blinkWeights, ...lookAtWeights, ...visemeWeights, ...emotionWeights })

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

    // `reducedMotion` bypasses the degrade loop entirely (see its own doc
    // comment) - every on-demand render (there is no continuous rAF in that
    // mode) always happens. Otherwise, once degraded, this gates the actual
    // `render()` call to ~30fps while every update above still ran this tick.
    const nowMs = performance.now()
    if (reducedMotion || dprDegrade.shouldRenderThisFrame(nowMs)) {
      const renderStartMs = performance.now()
      renderer.render(scene, camera)

      if (!reducedMotion) {
        const nextDpr = dprDegrade.recordRenderTime(performance.now() - renderStartMs, nowMs)
        if (nextDpr !== appliedDpr) {
          appliedDpr = nextDpr
          renderer.setPixelRatio(appliedDpr)
        }
      }
    }
  }, reducedMotion, () => {
    // Fase 6: a backgrounded tab stops rendering entirely (see
    // `render-loop.ts`) - if that pause landed mid-word, the last painted
    // frame (mouth potentially wide open) would otherwise sit on screen
    // indefinitely. Force the bus back to rest before that final forced
    // render, so a mid-speech tab switch always leaves the mouth closed.
    setMouthOpen(0)
  })

  renderLoop.start()

  const dispose = () => {
    renderLoop.dispose()
    lookAt.dispose()
    window.removeEventListener("resize", handleResize)
    visualViewport?.removeEventListener("resize", handleVisualViewportResize)
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
