import { onAudioUnlockGesture } from "./audio-unlock"

const BLIP_URLS = [
  "/avatar/blips/blip-01.wav",
  "/avatar/blips/blip-02.wav",
  "/avatar/blips/blip-03.wav",
  "/avatar/blips/blip-04.wav",
  "/avatar/blips/blip-05.wav",
]

const MAX_CONCURRENT_VOICES = 6
const PITCH_JITTER = 0.12
const SHOT_FADE_IN_SECONDS = 0.002

let audioContext: AudioContext | null = null
let blipGain: GainNode | null = null
let buffers: AudioBuffer[] = []
let loadPromise: Promise<void> | null = null
let lastPlayedIndex = -1
let activeVoiceCount = 0

function getContext(): { context: AudioContext; gain: GainNode } {
  if (audioContext && blipGain) return { context: audioContext, gain: blipGain }

  const AudioContextCtor =
    window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
  audioContext = new AudioContextCtor()
  blipGain = audioContext.createGain()
  blipGain.connect(audioContext.destination)

  onAudioUnlockGesture(() => {
    if (audioContext?.state === "suspended") {
      void audioContext.resume().catch(() => {})
    }
  })

  return { context: audioContext, gain: blipGain }
}

export function preloadBlips(): Promise<void> {
  if (loadPromise) return loadPromise

  const { context } = getContext()

  loadPromise = Promise.all(
    BLIP_URLS.map((url) =>
      fetch(url)
        .then((response) => response.arrayBuffer())
        .then((data) => context.decodeAudioData(data))
        .catch(() => null)
    )
  ).then((decoded) => {
    buffers = decoded.filter((buffer): buffer is AudioBuffer => buffer !== null)
  })

  return loadPromise
}

export function isBlipReady(): boolean {
  return buffers.length > 0
}

function pickNextIndex(): number {
  if (buffers.length === 1) return 0
  let index = Math.floor(Math.random() * buffers.length)
  if (index === lastPlayedIndex) index = (index + 1) % buffers.length
  return index
}

export function playBlip(): void {
  if (!isBlipReady()) return
  if (activeVoiceCount >= MAX_CONCURRENT_VOICES) return

  const { context, gain } = getContext()
  if (context.state === "suspended") return

  const index = pickNextIndex()
  lastPlayedIndex = index
  const buffer = buffers[index]

  const source = context.createBufferSource()
  source.buffer = buffer
  source.playbackRate.value = 1 + (Math.random() * 2 - 1) * PITCH_JITTER

  const shotGain = context.createGain()
  const now = context.currentTime
  shotGain.gain.setValueAtTime(0, now)
  shotGain.gain.linearRampToValueAtTime(1, now + SHOT_FADE_IN_SECONDS)

  source.connect(shotGain)
  shotGain.connect(gain)

  activeVoiceCount += 1
  source.onended = () => {
    activeVoiceCount = Math.max(0, activeVoiceCount - 1)
    source.disconnect()
    shotGain.disconnect()
  }

  source.start()
}

export function setBlipVolume(value: number): void {
  const { gain } = getContext()
  gain.gain.value = Math.max(0, Math.min(1, value))
}
