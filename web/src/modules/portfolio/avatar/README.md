# Avatar module

2D sprite avatar (plain `<img>` swap, no canvas, no `three.js`, no rig) with
a typewriter speech balloon/message bubble and a per-character "blip" sound,
in the style of Animal Crossing/Undertale. A three.js version of this module
existed earlier in this branch's history (camera rig, blendshape layers,
`facecap.glb`) - it was abandoned because the placeholder model had no
resemblance to the portfolio's owner, and switching to a look-alike VRM would
have required a third-party tool (VRoid Studio) this agent can't operate.
See git history if you need to resurrect any of that.

## Public contract

`contract.ts` is the ONLY file other modules (`modules/portfolio/assistant/*`)
are allowed to import from this module. It re-exports:

- `AvatarSprite` / `AvatarSpriteVariant` - the `<img>` component itself.
- `TypedText` - typewriter-reveal text component, used by both balloons below.
- `AnswerBalloon` - the persistent answer balloon for the assistant panel's
  open state (see "Typing engine" below).
- `useTypingSpeech` - starts/stops/skips the shared typing engine.
- `useSpeechPlayer` / `useBlipPreferences` - audio preferences.
- `classifyTone` / `Tone` - text -> tone classification.
- `setAvatarOverlayState` / `setAvatarTone` / `setAvatarThinking` - setters
  the assistant widget calls to drive the avatar's state.

Nothing outside this module should reach into `./sprite/*`, `./speech/*`,
`./mouth/*`, `./audio/*`, `./state/*`, or `./tone/*` directly.

## Architecture

### Signal bus (`state/avatar-signal-bus.ts`)

Module-scope mutable store + a tiny pub/sub, written from outside React
(assistant widget, timers, audio analysers) and read via
`useSyncExternalStore` by `AvatarSprite`. Fields: `overlayOpen`, `mouthOpen`,
`blinking`, `tone`, `thinking`. No rect/camera/framing fields exist - a 2D
sprite has nothing to point a camera at.

### Sprite engine (`sprite/*`)

- `tone-expression-map.ts` reduces the six-value `Tone` taxonomy down to four
  visual `Expression`s (`neutral`/`positive`/`apologetic`/`surprised`).
- `sprite-frames.ts` maps `(expression, mouthState, blinking)` to a PNG URL
  under `web/public/avatar/sprites/` and preloads all of them.
- `avatar-sprite.tsx` is the actual `<img>` component - reads the signal bus,
  thresholds `mouthOpen` at `0.15` into open/closed, and swaps `src`.
  Mounted twice, independently, coordinated only through the shared bus: once
  as `variant="mini"` (idle corner) by `avatar-stage.tsx`, once as
  `variant="bust"` directly in the assistant overlay's header slot.
- `blink-timer.ts` is a single ref-counted, module-scope timer (not one per
  mounted instance) so both surfaces blink in sync. Paused while the tab is
  hidden, never started under `prefers-reduced-motion`. Blink frames only
  exist for the `neutral` expression.

### Mouth arbiter (`mouth/mouth-source.ts`)

Two things can want to move the mouth: the typing engine's synthetic tick, or
real TTS audio amplitude (`audio/lip-sync-analyser.ts`). `audio` always wins
over `typing`. `AvatarSprite` only ever reads the resulting `mouthOpen` value
off the signal bus - it has no idea which source produced it. Re-enabling TTS
per-message later needs zero changes here, in the bus, or in `AvatarSprite`.

### Typing engine (`speech/*`)

- `punctuation-cadence.ts` - pure function, extra hold (ms) after a given
  character (comma/semicolon/colon, sentence-enders, newline, ellipsis).
- `typing-engine.ts` - headless `rAF` loop: reveals characters at
  `BASE_CHAR_MS=32` + punctuation holds, drives the mouth's attack/release
  envelope, throttles blips to `MIN_BLIP_INTERVAL_MS=60` apart, and clamps a
  large frame delta (tab backgrounded) so returning to the tab never dumps a
  burst of characters/blips at once.
- `typing-surface-registry.ts` - up to two DOM nodes (balloon + message
  bubble) registered at once; the engine writes revealed text straight into
  `textContent`, not React state (at ~32ms/char that would be dozens of
  re-renders/second otherwise).
- `typed-text.tsx` - registers its `<span>` while `isTyping`, else renders
  the full text through React. `aria-hidden` on the animated span + a
  `sr-only` sibling with the complete text, so a screen reader announces the
  response once, not character by character.
- `typing-speech-state.ts` / `use-typing-speech.ts` - small React-friendly
  store wrapping the engine, tracking which message id is currently typing.
  `speech-balloon.tsx` (mounted by `avatar-stage.tsx`, a different component
  tree than the assistant panel) and `assistant-widget.tsx` both read this
  same store - that's *why* it's a module-scope store and not just local
  React state.
- `speech-balloon.tsx` - floating balloon anchored above the mini avatar,
  visible only while the panel is closed and there's something to show
  (typing, or lingering ~6s after it finished). Click skips to the end.
- `answer-balloon.tsx` - the panel-open counterpart, mounted by
  `modules/portfolio/assistant/assistant-stage.tsx`. Not `fixed`, no
  `LINGER_MS` auto-hide - a normal block that fills the panel's "stage" and
  keeps showing the last answer until the next question clears `fullText`.
  Also the only consumer of the `thinking` signal so far - shows a `Skeleton`
  placeholder while `avatarSignal.thinking` is true and nothing has started
  typing yet.
- Under `prefers-reduced-motion`, `typing-speech-state.ts` skips the reveal
  entirely - text appears whole immediately, no blips, no mouth movement.

### Audio (`audio/*`)

- `audio-graph.ts` / `speech-player.ts` / `use-speech-player.ts` /
  `lip-sync-analyser.ts` - the TTS playback + amplitude-based lip-sync
  pipeline. **Dormant**: nothing currently sets `useSpeechPlayer`'s
  `voiceEnabled` to `true` from the UI (`ASSISTANT_VOICE_ENABLED` still
  exists server-side). Kept working end-to-end on purpose, so re-enabling it
  per-message later is a one-line change in `assistant-widget.tsx`, not a
  rewrite.
- `audio-unlock.ts` - shared iOS/Safari unlock gesture (`pointerdown`/
  `keydown`, once per page load), used by both `speech-player.ts` and
  `blip-player.ts` so they don't each wire their own listeners.
- `blip-player.ts` - its own `AudioContext` graph (deliberately separate from
  the TTS one, so the two never fight over lip-sync), pitch-jittered,
  never-repeats-the-last-clip, capped at 6 concurrent voices.
- `use-blip-preferences.ts` - persists the blip on/off toggle in
  `localStorage` (`assistant_blips_enabled`, defaults **on**).

## Assets

- `web/public/avatar/sprites/*.png` - 9 frames (4 expressions × closed/open
  mouth, + 1 blink for `neutral`), each a distinct AI-generated 2D
  illustration with a real transparent background. Generated by
  `web/scripts/generate-avatar-sprites.mjs` (not part of the app - see that
  script's own doc comment) from `dados-pessoais/avatar_lucas.jpg` as a
  reference image. Re-running that script (`pnpm --filter @portfolio/web
  generate:avatar-sprites`) writes straight back to these same 9 file names -
  the contract - without touching any code.
- `web/public/avatar/blips/blip-0{1..5}.wav` - **currently placeholders**: 5
  synthesized short tones, not real recorded syllables. Swap for real
  recordings (mono, 24kHz, 16-bit PCM, 70-90ms, zero-crossing edits) without
  touching any code.

## Explicitly not done in this phase

- Real blip recordings (see Assets above - sprite art is done).
- Re-enabling TTS from the UI (the plumbing exists and works; nothing calls
  `setVoiceEnabled(true)`).
- A "tap to enable audio" affordance for blips specifically - the shared
  unlock gesture (`audio-unlock.ts`) resumes the blip `AudioContext`
  silently on first tap/keydown; there's no dedicated hint UI for it the way
  TTS's dormant `voiceUnlockHint` copy is.
