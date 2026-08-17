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
    ? "Full Stack Developer — Next.js, React and Node.js"
    : "Desenvolvedor Full Stack Next.js, React e Node.js"

  const greeting = isEn
    ? "Hi! I am Lucas Almeida, a full stack developer specialized in building scalable web applications and high-performance systems with Next.js, React and Node.js."
    : "Olá! Sou Lucas Almeida, desenvolvedor full stack especialista na construção de aplicações web escaláveis e sistemas de alta performance com Next.js, React e Node.js."

  const cvLabel = isEn ? "Resume" : "Currículo"

  return (
    <section className="min-h-[85vh] flex flex-col justify-center items-start pt-20">
      <div className="space-y-6 max-w-3xl animate-in fade-in slide-in-from-bottom-8 duration-700">
        <h2 className="text-blue-500 font-medium tracking-wider text-sm uppercase">
          Software Engineer
        </h2>
        <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight">
          Lucas Almeida
        </h1>
        <h3 className="text-2xl md:text-4xl font-semibold text-neutral-400">
          {role}
        </h3>

        <p className="text-neutral-400 text-lg leading-relaxed pt-4 max-w-2xl">
          {greeting}
        </p>

        <div className="flex flex-wrap items-center gap-4 pt-8">
          <Link
            href="https://github.com/me-lucas-al"
            target="_blank"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-blue-800 hover:bg-neutral-900 transition-all text-white font-medium"
          >
            <Github className="w-5 h-5" />
            GitHub
          </Link>

          <Link
            href="https://linkedin.com/in/lucas-almeida-development"
            target="_blank"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-950 border border-blue-800 hover:bg-blue-900 transition-all text-white font-medium shadow-[0_0_30px_-10px_rgba(23,37,84,0.5)]"
          >
            <Linkedin className="w-5 h-5" />
            LinkedIn
          </Link>

          {hasCv && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-blue-700 hover:bg-neutral-900 hover:shadow-[0_0_25px_-8px_rgba(59,130,246,0.4)] transition-all duration-300 text-white font-medium outline-none">
                  <FileText className="w-5 h-5 text-blue-400 group-hover:text-blue-300 transition-colors" />
                  {cvLabel}
                  <ChevronDown className="w-4 h-4 text-neutral-500 group-hover:text-neutral-300 transition-all duration-200 group-data-[state=open]:rotate-180" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="min-w-[180px] bg-neutral-950 border border-neutral-800 rounded-xl p-1 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.8)]"
              >
                {cvUrlPt && (
                  <DropdownMenuItem asChild>
                    <a
                      href={cvUrlPt}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-800 transition-all cursor-pointer"
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
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-800 transition-all cursor-pointer"
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