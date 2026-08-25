import { Mesh, type Material, type Object3D, type Texture } from "three"

function isTexture(value: unknown): value is Texture {
  return !!value && typeof value === "object" && "isTexture" in value && (value as Texture).isTexture === true
}

function disposeMaterial(material: Material): void {
  for (const value of Object.values(material)) {
    if (isTexture(value)) value.dispose()
  }
  material.dispose()
}

/** Traverse-and-dispose for cleanup on unmount: geometries, materials, and their textures. */
export function disposeObject3D(root: Object3D): void {
  root.traverse((child) => {
    if (!(child instanceof Mesh)) return

    child.geometry?.dispose()

    const material = child.material
    if (Array.isArray(material)) {
      material.forEach(disposeMaterial)
    } else if (material) {
      disposeMaterial(material)
    }
  })
}
