"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { setLocaleAction } from "@/app/actions/locale"
import type { Locale } from "@/i18n"

interface LanguageToggleProps {
  currentLocale: Locale
}

export function LanguageToggle({ currentLocale }: LanguageToggleProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleToggle = (locale: Locale) => {
    if (locale === currentLocale) return
    startTransition(async () => {
      await setLocaleAction(locale)
      router.refresh()
    })
  }

  return (
    <div className="flex items-center gap-1 p-1 rounded-lg bg-neutral-900/80 border border-neutral-800">
      <button
        onClick={() => handleToggle("pt")}
        disabled={isPending}
        aria-label="Mudar para Português"
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
          currentLocale === "pt"
            ? "bg-blue-950 text-blue-300 border border-blue-800/60"
            : "text-neutral-500 hover:text-neutral-200"
        }`}
      >
        <span aria-hidden>🇧🇷</span>
        <span>PT</span>
      </button>
      <button
        onClick={() => handleToggle("en")}
        disabled={isPending}
        aria-label="Switch to English"
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
          currentLocale === "en"
            ? "bg-blue-950 text-blue-300 border border-blue-800/60"
            : "text-neutral-500 hover:text-neutral-200"
        }`}
      >
        <span aria-hidden>🇺🇸</span>
        <span>EN</span>
      </button>
    </div>
  )
}
