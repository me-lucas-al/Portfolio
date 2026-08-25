"use client"

import Image from "next/image"

/**
 * Rendered instead of the 3D canvas when WebGL isn't available (capability
 * check failed) or while the engine is loading its first frame. Keeps the
 * corner slot occupied with a small static avatar instead of an empty gap.
 */
export function NoWebglFallback() {
  return (
    <div className="h-full w-full overflow-hidden rounded-full bg-neutral-900">
      <Image
        src="/portfolio_profile.jpg"
        alt=""
        width={128}
        height={128}
        className="h-full w-full object-cover"
        priority={false}
      />
    </div>
  )
}
