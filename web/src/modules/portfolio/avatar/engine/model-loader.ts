import { GLTFLoader, type GLTF } from "three/examples/jsm/loaders/GLTFLoader.js"
import type { Group } from "three"

const MODEL_URL = "/avatar/facecap.glb"

export interface ModelLoadProgress {
  loaded: number
  total: number
}

/**
 * Streams facecap.glb through the Fetch API instead of letting GLTFLoader's
 * default XHR path handle the request, so callers get real byte-level
 * download progress (GLTFLoader.load's onProgress only reports
 * `lengthComputable` XHR progress events, which is fine, but streaming here
 * keeps us in control of the buffer end-to-end for this phase and future
 * ones - e.g. aborting mid-download).
 */
export async function loadFacecapModel(
  onProgress?: (progress: ModelLoadProgress) => void,
  signal?: AbortSignal
): Promise<Group> {
  const response = await fetch(MODEL_URL, { signal })

  if (!response.ok || !response.body) {
    throw new Error(`Failed to fetch avatar model: ${response.status} ${response.statusText}`)
  }

  const total = Number(response.headers.get("content-length")) || 0
  const reader = response.body.getReader()
  const chunks: Uint8Array[] = []
  let loaded = 0

  for (;;) {
    const { done, value } = await reader.read()
    if (done) break

    if (value) {
      chunks.push(value)
      loaded += value.byteLength
      onProgress?.({ loaded, total })
    }
  }

  const buffer = new Uint8Array(loaded)
  let byteOffset = 0
  for (const chunk of chunks) {
    buffer.set(chunk, byteOffset)
    byteOffset += chunk.byteLength
  }

  const loader = new GLTFLoader()
  const gltf: GLTF = await loader.parseAsync(buffer.buffer as ArrayBuffer, "")

  return gltf.scene
}
