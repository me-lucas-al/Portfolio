/**
 * Lazily-created singleton audio graph backing Fase 6's speech playback and
 * amplitude-based lip sync:
 *
 *   <audio> element --MediaElementAudioSourceNode--> GainNode --> AnalyserNode
 *                                                        \--> AudioContext.destination
 *
 * One `<audio>` element, one shared `AudioContext`, created once and reused
 * for every subsequent `speech-player.ts` `play()` call (an
 * `HTMLMediaElement` can only ever be wrapped in one
 * `MediaElementAudioSourceNode`, so the element itself must be a singleton
 * too, not just the context).
 *
 * The analyser is wired downstream of the gain node, not upstream of it -
 * deliberately: `speech-player.ts`'s `stop()` fades the gain down before
 * pausing, specifically so a visitor interrupting the avatar mid-sentence
 * sees the mouth ease shut over the fade instead of an analyser reading the
 * still-loud pre-fade signal right up until a hard cut.
 *
 * `crossOrigin = "anonymous"` is set on the element up front - required for
 * `MediaElementAudioSourceNode` to read real (non-zeroed) sample data from a
 * cross-origin source, and forward-compatible with a later phase serving
 * cached speech audio from a CDN origin. `/api/tts` (same-origin today)
 * doesn't need this yet, but setting it now costs nothing and avoids a
 * silent "analyser reads all zeros" regression later.
 *
 * Like the rest of this module, nothing here references `window`/`document`
 * at module (top-level) scope - only inside `getAudioGraph()`'s body - so
 * this file stays safe to import from a server context even though it's
 * only ever actually reached client-side.
 */

export interface AudioGraphHandle {
  audioElement: HTMLAudioElement
  audioContext: AudioContext
  gainNode: GainNode
  analyserNode: AnalyserNode
  /** Reused every read (`getFloatTimeDomainData`) - never reallocated per frame. */
  timeDomainBuffer: Float32Array<ArrayBuffer>
}

const FFT_SIZE = 1024

let singleton: AudioGraphHandle | null = null

export function getAudioGraph(): AudioGraphHandle {
  if (singleton) return singleton

  const audioElement = new Audio()
  audioElement.crossOrigin = "anonymous"
  audioElement.preload = "auto"

  const AudioContextCtor =
    window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
  const audioContext = new AudioContextCtor()

  const source = audioContext.createMediaElementSource(audioElement)
  const gainNode = audioContext.createGain()
  const analyserNode = audioContext.createAnalyser()
  analyserNode.fftSize = FFT_SIZE

  // Gain feeds both the analyser (read-only tap, no further output) and the
  // real destination (so playback is actually audible) - see the module
  // doc comment above for why the analyser sits downstream of gain.
  source.connect(gainNode)
  gainNode.connect(analyserNode)
  gainNode.connect(audioContext.destination)

  singleton = {
    audioElement,
    audioContext,
    gainNode,
    analyserNode,
    timeDomainBuffer: new Float32Array(analyserNode.fftSize),
  }

  return singleton
}
