import Link from "next/link"
import { Github, Linkedin, FileText, ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface HeroProps {
  cvUrlPt?: string
  cvUrlEn?: string
  locale?: string
}

export function Hero({ cvUrlPt, cvUrlEn, locale }: HeroProps) {
  const hasCv = cvUrlPt || cvUrlEn
  const isEn = locale === "en"

  const role = isEn
    ? "Full Stack Developer - Next.js, React and Node.js"
    : "Desenvolvedor Full Stack - Next.js, React e Node.js"

  const greeting = isEn
    ? "Hi! I am Lucas Almeida, a full stack developer specialized in building scalable web applications and high-performance systems with Next.js, React and Node.js."
    : "Olá! Sou Lucas Almeida, desenvolvedor full stack especialista na construção de aplicações web escaláveis e sistemas de alta performance com Next.js, React e Node.js."

  const cvLabel = isEn ? "Resume" : "Currículo"

  return (
    <section className="min-h-[85vh] flex flex-col justify-center items-start pt-20">
      <div className="space-y-6 max-w-3xl animate-in fade-in slide-in-from-bottom-8 duration-700">
        <h2 className="text-brand font-medium tracking-wider text-sm uppercase">
          Software Engineer
        </h2>
        <h1 className="font-display text-5xl md:text-7xl font-bold text-fg tracking-tight">
          Lucas Almeida
          <span className="cursor-blink text-brand" aria-hidden>
            ▍
          </span>
        </h1>
        <h3 className="text-2xl md:text-4xl font-semibold text-fg-muted">
          {role}
        </h3>

        <p className="text-fg-muted text-lg leading-relaxed pt-4 max-w-2xl">
          {greeting}
        </p>

        <div className="flex flex-wrap items-center gap-4 pt-8">
          <Link
            href="https://linkedin.com/in/lucas-almeida-development"
            target="_blank"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-brand hover:bg-brand-strong transition-all text-brand-ink font-semibold shadow-[0_0_30px_-10px_rgba(242,169,60,0.6)]"
          >
            <Linkedin className="w-5 h-5" />
            LinkedIn
          </Link>

          <Link
            href="https://github.com/me-lucas-al"
            target="_blank"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-surface border border-line hover:border-line-strong hover:bg-surface-2 transition-all text-fg font-medium"
          >
            <Github className="w-5 h-5" />
            GitHub
          </Link>

          {hasCv && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-surface border border-line hover:border-line-strong hover:bg-surface-2 transition-all duration-300 text-fg font-medium outline-none">
                  <FileText className="w-5 h-5 text-fg-muted group-hover:text-fg transition-colors" />
                  {cvLabel}
                  <ChevronDown className="w-4 h-4 text-muted-2 group-hover:text-fg-muted transition-all duration-200 group-data-[state=open]:rotate-180" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="min-w-[180px] bg-surface border border-line rounded-xl p-1 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.8)]"
              >
                {cvUrlPt && (
                  <DropdownMenuItem asChild>
                    <a
                      href={cvUrlPt}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-fg-muted hover:text-fg hover:bg-surface-2 focus:text-fg focus:bg-surface-2 transition-all cursor-pointer"
                    >
                      <span className="text-base leading-none">🇧🇷</span>
                      <span className="text-sm font-medium">Português</span>
                    </a>
                  </DropdownMenuItem>
                )}
                {cvUrlEn && (
                  <DropdownMenuItem asChild>
                    <a
                      href={cvUrlEn}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-fg-muted hover:text-fg hover:bg-surface-2 focus:text-fg focus:bg-surface-2 transition-all cursor-pointer"
                    >
                      <span className="text-base leading-none">🇺🇸</span>
                      <span className="text-sm font-medium">English</span>
                    </a>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </section>
  )
}
