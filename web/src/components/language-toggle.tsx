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

  const switchLanguageLocale = (locale: Locale) => {
    if (locale === currentLocale) return
    startTransition(async () => {
      await setLocaleAction(locale)
      router.refresh()
    })
  }

  return (
    <div className="flex items-center gap-1 p-1 rounded-lg bg-surface-2/80 border border-line">
      <span role="status" aria-live="polite" className="sr-only">
        {isPending ? "Mudando idioma / Switching language…" : ""}
      </span>
      <button
        onClick={() => switchLanguageLocale("pt")}
        disabled={isPending}
        aria-label="Mudar para Português"
        aria-busy={isPending && currentLocale !== "pt"}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
          currentLocale === "pt"
            ? "bg-brand/15 text-brand-strong border border-brand/40"
            : "text-muted-2 hover:text-fg-muted"
        }`}
      >
        {isPending && currentLocale !== "pt" ? (
          <span
            aria-hidden
            className="h-3 w-3 rounded-full border-2 border-current border-t-transparent animate-spin"
          />
        ) : (
          <span aria-hidden>🇧🇷</span>
        )}
        <span>PT</span>
      </button>
      <button
        onClick={() => switchLanguageLocale("en")}
        disabled={isPending}
        aria-label="Switch to English"
        aria-busy={isPending && currentLocale !== "en"}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
          currentLocale === "en"
            ? "bg-brand/15 text-brand-strong border border-brand/40"
            : "text-muted-2 hover:text-fg-muted"
        }`}
      >
        {isPending && currentLocale !== "en" ? (
          <span
            aria-hidden
            className="h-3 w-3 rounded-full border-2 border-current border-t-transparent animate-spin"
          />
        ) : (
          <span aria-hidden>🇺🇸</span>
        )}
        <span>EN</span>
      </button>
    </div>
  )
}
