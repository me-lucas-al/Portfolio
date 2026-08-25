/**
 * Pure capability check. No globals are read at module scope - only inside
 * the function body - so this file is safe to import statically from a
 * Server Component's client boundary without breaking SSR.
 */
export function detectWebglSupport(): boolean {
  if (typeof window === "undefined") return false

  try {
    const canvas = document.createElement("canvas")
    const gl =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl")

    return !!gl && typeof WebGLRenderingContext !== "undefined"
  } catch {
    return false
  }
}
