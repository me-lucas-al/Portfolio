# Avatar module

Fase 2: three.js engine foundation + idle mini avatar in the page corner. No
React Three Fiber - one `rAF` loop, one model, one light, one static camera,
owned imperatively by `engine/avatar-engine.ts`.

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

## Scope of this phase

Idle mini avatar only: engine foundation, disposal, a context-loss stub, and
the reduced-motion / hidden-tab pause policy. No overlay, no chat wiring, no
audio, no emotion/tone system, no scissor/viewport portal, no LOD swap -
those are later phases.
