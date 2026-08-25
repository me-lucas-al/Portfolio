# Avatar module

Fase 2: three.js engine foundation + idle mini avatar in the page corner. No
React Three Fiber - one `rAF` loop, one model, one light, one static camera,
owned imperatively by `engine/avatar-engine.ts`.

Fase 4 turned the "static camera" above into two damped rigs and moved the
canvas itself out to a full-viewport portal - see "Fase 4: mini <-> overlay
morph" below.

## Asset contract

- Model: `web/public/avatar/facecap.glb`, fetched client-side at
  `/avatar/facecap.glb`. It is three.js's official sample - a bare head mesh
  (plus teeth/eyeLeft/eyeRight meshes and transform groups) with **no
  skeleton/bones**. Only the `head` mesh actually carries morph targets in
  this file, though `engine/morph-index.ts` indexes every mesh generically
  (a richer asset could spread blendshapes across head/teeth/tongue/eyelash
  meshes, and writing to only the first one found would leave the rest
  frozen).
- Blendshapes: 52 targets on the head mesh's `morphTargetDictionary`. This
  file uses the shorthand `_L`/`_R` suffix convention (`eyeBlink_L`,
  `eyeLookIn_L`, ...), **not** full ARKit camelCase (`eyeBlinkLeft`,
  `eyeLookInLeft`, ...). Layers are written against the canonical camelCase
  names; `engine/blendshape-names.ts` maps each canonical name to the
  aliases we've seen, and `resolveBlendshapeKeys()` (in `morph-index.ts`)
  resolves them once per model load. If a future asset uses full ARKit
  names directly, only that alias table needs a new entry - no layer code
  changes.
- No bones at all means the breath layer's spec'd "chest/torso bone, else a
  head bob" fallback always takes the head-bob path for this asset - it
  targets the `head` named node directly.

## Module-scope globals convention

Nothing under `engine/` may reference `window`, `document`, or `navigator`
at module (top-level) scope - only inside function/method bodies. There is
no ESLint rule enforcing this; it's a convention because `engine/` files get
dynamically imported client-side only, but a stray top-level access would
still throw if the module were ever evaluated during SSR or a static
analysis pass. When adding a new file under `engine/`, keep any
`window`/`document`/`navigator` read inside a function.

The same restriction (informally) applies to `detect-webgl.ts` at the module
root - it's a plain, three-less function, but it's still meant to be safe to
import statically from a Server Component boundary, so all its DOM/window
access is confined to the function body.

## Layering / mixer convention

`avatar-engine.ts` composes blink + breath + look-at every frame and writes
**all** managed blendshape weights - including zeros - into the morph index
each tick. It never "pokes" a single changed value. Later phases (audio/
lip-sync, expressions, emotion/tone) add more layers on top of this same
mixer and must follow the same convention, or layers will fight each other
(e.g. a lip-sync layer leaving a mouth blendshape at its last nonzero value
after speech ends, because nothing else claims to own it).

## Lazy-loading

`three` must never end up in the initial page bundle. The only path to it is:

```
avatar-stage.tsx (no three import)
  -> use-avatar-engine.ts (no three import)
    -> await import("./engine/avatar-engine") inside useEffect
      -> engine/*.ts (three imports live here)
```

Do not add a static top-level `import ... from "three"` (or from anything
under `engine/`) to any file reachable from `page.tsx`'s render tree without
going through that dynamic import.

## Scope of Fase 2

Idle mini avatar only: engine foundation, disposal, a context-loss stub, and
the reduced-motion / hidden-tab pause policy. No overlay, no chat wiring, no
audio, no emotion/tone system, no scissor/viewport portal, no LOD swap -
those came later (Fase 4) or are still later phases.

## Fase 4: mini <-> overlay morph

There is now exactly ONE `<canvas>` for the whole page, ever:
`avatar-canvas-layer.tsx` portals it onto `document.body`
(`fixed inset-0 z-30 pointer-events-none`), mounted once by `AvatarStage` and
never conditionally unmounted while the page lives. `engine/avatar-engine.ts`
sizes the renderer to the full viewport (`window.innerWidth/innerHeight`,
debounced on resize) instead of a small fixed canvas.

`AvatarStage` no longer renders a canvas of its own - it renders
`<AvatarCanvasLayer />` plus a `pointer-events-none` placeholder `<div>` in
the same corner slot as before, whose only job is to be measured
(`getBoundingClientRect()`). The actual avatar pixels come from the
full-viewport canvas, scissored into a sub-rectangle that tracks that div's
on-screen position every frame.

Two new rigs drive this, both in `engine/`, both using the same
exponential-damping pattern as `layers/look-at-layer.ts`
(`current += (target - current) * (1 - exp(-rate * dt))`) rather than a
fixed-duration tween - there is no "transition start time" state anywhere,
so re-targeting mid-chase (rapid open/close) just redirects the chase from
wherever `current` already is:

- `viewport-rig.ts` chases a target CSS-pixel rect and converts it into the
  coordinates `renderer.setScissor`/`setViewport` expect each frame (Y-flip;
  deliberately **no** DPR premultiplication - three.js's own
  `setViewport`/`setScissor` already multiply by `renderer.getPixelRatio()`
  internally, per their doc comments and implementation in
  `WebGLRenderer.js`).
- `camera-rig.ts` chases a named framing's fov/position/lookAt. Two presets
  exist today: `MINI_HEAD_PRESET` (reuses the Fase 2 static camera's exact
  numbers: 28deg fov, object radius filling 62% of the frustum) and
  `OVERLAY_BUST_PRESET` (32deg fov, 48% coverage - pulled back and
  re-centered for the assistant overlay's header slot). facecap.glb has no
  torso/shoulders, so "bust" is provisional/tunable until a richer asset
  exists.

`AvatarEngineHandle.setFraming(name, rect)` drives both rigs together. The
render loop (inside `avatar-engine.ts`) calls both rigs' `update()` and
applies the scissor/viewport every frame, unconditionally - the damping is
correct (and effectively free) at rest too, not just mid-transition.

### Cross-module signal

`state/avatar-signal-bus.ts` is a plain, three-less, module-scope mutable
store (`{ overlayOpen, overlayAnchorRect }`) with a setter and a getter - no
pub/sub. `contract.ts`'s `setAvatarOverlayState(open, anchorRect)` is the
ONLY function `modules/portfolio/assistant/*` is allowed to call into this
module; it just writes into the bus.

On the avatar side, `use-avatar-framing.ts` polls the bus (mount, window
resize, and a 120ms interval - cheap, and not the every-frame path; only the
rigs' own `update()` runs every frame) and calls `engine.setFraming(...)`
with either `{ name: "overlay-bust", rect: overlayAnchorRect }` when the
overlay is open, or `{ name: "mini", rect: <mini anchor div's rect> }`
otherwise.

### Context-loss recovery

Strengthened from the Fase 2 stub: `avatar-engine.ts` now actually re-loads
`facecap.glb` and rebuilds the morph index / breath layer / camera rig on
`webglcontextrestored`, instead of just resuming with possibly-stale
textures. `create-renderer.ts` still only flags the loss/restore transition;
`avatar-engine.ts` decides what to do about it.

### Explicitly not done in Fase 4

- The avatar is still visually and functionally separate from
  `AssistantMiniDock`'s FAB trigger - it does not become a click target, and
  the FAB still owns opening/closing the chat. Merging them is a deliberate
  deferral, not an oversight.
- No fullscreen redesign of the assistant overlay - it's still the ~420px
  side panel, just with a small avatar-bust slot added to its header.
- No LOD swap, no dynamic DPR degrade loop - the DPR clamp stays static.
- No `visualViewport`-based mobile-keyboard handling.
