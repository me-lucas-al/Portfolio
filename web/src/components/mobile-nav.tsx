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
import { Logo } from "@/components/logo"
import type { Dictionary, Locale } from "@/i18n"

interface MobileNavProps {
  dict: Dictionary
  locale: Locale
  hasSession: boolean
}

export function MobileNav({ dict, locale, hasSession }: MobileNavProps) {
  const [open, setOpen] = useState(false)

  const navItems = [
    { href: "#sobre", label: dict.nav.about },
    { href: "#tecnologias", label: dict.nav.skills },
    { href: "#projetos", label: dict.nav.projects },
    { href: "#experiencia", label: dict.nav.experience },
    { href: "#formacao", label: dict.nav.education },
    { href: "#contatos", label: dict.nav.contact },
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
            className="p-2.5 rounded-xl bg-surface-2/80 border border-line text-fg-muted hover:text-fg hover:border-line-strong transition-all active:scale-95"
          >
            <Menu className="w-5 h-5" />
          </button>
        </SheetTrigger>

        <SheetContent
          side="right"
          className="w-[280px] sm:w-[320px] bg-surface/95 backdrop-blur-xl border-l border-line p-6 flex flex-col justify-between"
        >
          <div className="space-y-6 mt-4">
            <SheetHeader className="p-0 text-left">
              <SheetTitle asChild>
                <Logo wordmarkClassName="text-lg" />
              </SheetTitle>
              <p className="text-xs text-muted-2 font-mono">
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
                  className="group flex items-center gap-1.5 px-3.5 py-3 rounded-xl text-fg-muted hover:text-fg hover:bg-surface-2/80 border border-transparent hover:border-line transition-all text-sm font-medium"
                >
                  <span className="w-0 opacity-0 overflow-hidden text-accent transition-all duration-200 group-hover:w-3 group-hover:opacity-100">
                    {"›"}
                  </span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="pt-6 border-t border-line space-y-4">
            {hasSession && (
              <Link
                href="/control-painel"
                onClick={handleLinkClick}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-accent/10 text-accent-strong border border-accent/30 text-xs font-medium hover:bg-accent hover:text-accent-ink transition-all shadow-sm"
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
