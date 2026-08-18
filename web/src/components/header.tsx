import Link from "next/link"
import { auth } from "@/auth"
import { getLocale } from "@/lib/locale"
import { getDictionary } from "@/i18n"
import { LanguageToggle } from "@/components/language-toggle"
import { MobileNav } from "@/components/mobile-nav"

export async function Header() {
  const session = await auth()
  const locale = await getLocale()
  const dict = getDictionary(locale)

  return (
    <header className="fixed top-0 w-full bg-black/70 backdrop-blur-md z-50 border-b border-neutral-900">
      <div className="max-w-6xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
        <Link
          href="/"
          className="shrink-0 whitespace-nowrap text-white font-bold text-lg sm:text-xl tracking-tighter hover:text-blue-400 transition-colors"
        >
          Lucas Almeida
        </Link>

        {/* Desktop Navigation & Controls */}
        <div className="hidden md:flex items-center gap-6">
          <nav className="flex items-center gap-6 lg:gap-8">
            <Link
              href="#sobre"
              className="text-sm font-medium text-neutral-400 hover:text-white transition-colors"
            >
              <span className="text-blue-500 font-mono mr-1">01.</span>
              {dict.nav.about}
            </Link>
            <Link
              href="#tecnologias"
              className="text-sm font-medium text-neutral-400 hover:text-white transition-colors"
            >
              <span className="text-blue-500 font-mono mr-1">02.</span>
              {dict.nav.skills}
            </Link>
            <Link
              href="#projetos"
              className="text-sm font-medium text-neutral-400 hover:text-white transition-colors"
            >
              <span className="text-blue-500 font-mono mr-1">03.</span>
              {dict.nav.projects}
            </Link>
            <Link
              href="#experiencia"
              className="text-sm font-medium text-neutral-400 hover:text-white transition-colors"
            >
              <span className="text-blue-500 font-mono mr-1">04.</span>
              {dict.nav.experience}
            </Link>
            <Link
              href="#formacao"
              className="text-sm font-medium text-neutral-400 hover:text-white transition-colors"
            >
              <span className="text-blue-500 font-mono mr-1">05.</span>
              {dict.nav.education}
            </Link>
            <Link
              href="#contatos"
              className="text-sm font-medium text-neutral-400 hover:text-white transition-colors"
            >
              <span className="text-blue-500 font-mono mr-1">06.</span>
              {dict.nav.contact}
            </Link>
          </nav>

          <div className="h-4 w-px bg-neutral-800" />

          <LanguageToggle currentLocale={locale} />

          {session && (
            <Link
              href="/control-painel"
              className="px-4 py-2 rounded-lg bg-blue-950/30 text-blue-400 border border-blue-900/50 text-xs font-medium hover:bg-blue-900 hover:text-white transition-all whitespace-nowrap"
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
