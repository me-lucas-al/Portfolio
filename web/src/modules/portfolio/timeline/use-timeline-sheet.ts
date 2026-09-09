"use client"

import { useCallback } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

const TIMELINE_QUERY_PARAM = "timeline"

export function useTimelineSheet() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const activeSlug = searchParams.get(TIMELINE_QUERY_PARAM)

  const openTimelineMilestone = useCallback(
    (slug: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(TIMELINE_QUERY_PARAM, slug)
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [pathname, router, searchParams]
  )

  const closeTimelineMilestone = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete(TIMELINE_QUERY_PARAM)
    const query = params.toString()
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }, [pathname, router, searchParams])

  return { activeSlug, openTimelineMilestone, closeTimelineMilestone }
}
