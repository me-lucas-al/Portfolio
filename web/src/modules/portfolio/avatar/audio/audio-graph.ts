
export interface AudioGraphHandle {
  audioElement: HTMLAudioElement
  audioContext: AudioContext
  gainNode: GainNode
  analyserNode: AnalyserNode

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
