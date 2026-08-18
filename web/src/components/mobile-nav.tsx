"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, LayoutDashboard } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { LanguageToggle } from "@/components/language-toggle"
import type { Dictionary, Locale } from "@/i18n"

interface MobileNavProps {
  dict: Dictionary
  locale: Locale
  hasSession: boolean
}

export function MobileNav({ dict, locale, hasSession }: MobileNavProps) {
  const [open, setOpen] = useState(false)

  const navItems = [
    { href: "#sobre", number: "01.", label: dict.nav.about },
    { href: "#tecnologias", number: "02.", label: dict.nav.skills },
    { href: "#projetos", number: "03.", label: dict.nav.projects },
    { href: "#experiencia", number: "04.", label: dict.nav.experience },
    { href: "#formacao", number: "05.", label: dict.nav.education },
    { href: "#contatos", number: "06.", label: dict.nav.contact },
  ]

  const handleLinkClick = () => {
    setOpen(false)
  }

  return (
    <div className="flex lg:hidden items-center shrink-0">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button
            aria-label={locale === "en" ? "Open navigation menu" : "Abrir menu de navegação"}
            className="p-2.5 rounded-xl bg-neutral-900/80 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700 transition-all active:scale-95"
          >
            <Menu className="w-5 h-5" />
          </button>
        </SheetTrigger>

        <SheetContent
          side="right"
          className="w-[280px] sm:w-[320px] bg-neutral-950/95 backdrop-blur-xl border-l border-neutral-800/80 p-6 flex flex-col justify-between"
        >
          <div className="space-y-6 mt-4">
            <SheetHeader className="p-0 text-left">
              <SheetTitle className="text-white font-bold text-lg tracking-tight">
                Lucas Almeida
              </SheetTitle>
              <p className="text-xs text-neutral-500 font-mono">
                {dict.header.navigation}
              </p>
            </SheetHeader>

            <LanguageToggle currentLocale={locale} />

            <nav className="flex flex-col gap-1 pt-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleLinkClick}
                  className="flex items-center gap-3 px-3.5 py-3 rounded-xl text-neutral-300 hover:text-white hover:bg-neutral-900/80 border border-transparent hover:border-neutral-800 transition-all text-sm font-medium"
                >
                  <span className="text-blue-500 font-mono text-xs font-semibold">
                    {item.number}
                  </span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="pt-6 border-t border-neutral-900 space-y-4">
            {hasSession && (
              <Link
                href="/control-painel"
                onClick={handleLinkClick}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-blue-950/60 text-blue-300 border border-blue-900/60 text-xs font-medium hover:bg-blue-900 hover:text-white transition-all shadow-sm"
              >
                <LayoutDashboard className="w-4 h-4" />
                {dict.header.controlPanel}
              </Link>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
