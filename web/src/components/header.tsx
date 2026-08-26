import Link from "next/link"
import { auth } from "@/auth"
import { getLocale } from "@/lib/locale"
import { getDictionary } from "@/i18n"
import { LanguageToggle } from "@/components/language-toggle"
import { MobileNav } from "@/components/mobile-nav"
import { Logo } from "@/components/logo"

export async function Header() {
  const session = await auth()
  const locale = await getLocale()
  const dict = getDictionary(locale)

  const navItems = [
    { href: "#sobre", label: dict.nav.about },
    { href: "#tecnologias", label: dict.nav.skills },
    { href: "#projetos", label: dict.nav.projects },
    { href: "#experiencia", label: dict.nav.experience },
    { href: "#formacao", label: dict.nav.education },
    { href: "#contatos", label: dict.nav.contact },
  ]

  return (
    <header className="fixed top-0 w-full bg-ink/80 backdrop-blur-md z-50 border-b border-line">
      <div className="max-w-6xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between gap-6">
        <Link href="/" className="shrink-0 hover:opacity-80 transition-opacity">
          <Logo wordmarkClassName="text-lg sm:text-xl" />
        </Link>

        {/* Desktop Navigation & Controls */}
        <div className="hidden lg:flex items-center gap-4 xl:gap-6">
          <nav className="flex items-center gap-3 xl:gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center text-xs xl:text-sm font-medium text-fg-muted hover:text-fg transition-colors whitespace-nowrap"
              >
                <span className="w-0 opacity-0 overflow-hidden text-accent transition-all duration-200 group-hover:w-3 group-hover:opacity-100">
                  {"›"}
                </span>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="h-4 w-px bg-line shrink-0" />

          <LanguageToggle currentLocale={locale} />

          {session && (
            <Link
              href="/control-painel"
              className="px-3 py-1.5 rounded-lg bg-accent/10 text-accent-strong border border-accent/30 text-xs font-medium hover:bg-accent hover:text-accent-ink hover:border-accent transition-all whitespace-nowrap"
            >
              {dict.header.controlPanel}
            </Link>
          )}
        </div>

        {/* Mobile Menu & Language Toggle */}
        <MobileNav dict={dict} locale={locale} hasSession={!!session} />
      </div>
    </header>
  )
}
