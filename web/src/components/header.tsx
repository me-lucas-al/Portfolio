import Link from "next/link"
import { auth } from "@/auth"

export async function Header() {
  const session = await auth()
  return (
    <header className="fixed top-0 w-full bg-black/70 backdrop-blur-md z-50 border-b border-neutral-900">
      <div className="max-w-6xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
        <Link
          href="/"
          className="text-white font-bold text-xl tracking-tighter hover:text-blue-400 transition-colors"
        >
          Lucas Almeida
        </Link>

        <div className="flex items-center gap-3 md:gap-8">
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="#sobre"
              className="text-sm font-medium text-neutral-400 hover:text-white transition-colors"
            >
              <span className="text-blue-500 font-mono mr-1">01.</span>Sobre
            </Link>
            <Link
              href="#tecnologias"
              className="text-sm font-medium text-neutral-400 hover:text-white transition-colors"
            >
              <span className="text-blue-500 font-mono mr-1">02.</span>Tecnologias
            </Link>
            <Link
              href="#projetos"
              className="text-sm font-medium text-neutral-400 hover:text-white transition-colors"
            >
              <span className="text-blue-500 font-mono mr-1">03.</span>Projetos
            </Link>
            <Link
              href="#experiencia"
              className="text-sm font-medium text-neutral-400 hover:text-white transition-colors"
            >
              <span className="text-blue-500 font-mono mr-1">04.</span>Experiência
            </Link>
            <Link
              href="#formacao"
              className="text-sm font-medium text-neutral-400 hover:text-white transition-colors"
            >
              <span className="text-blue-500 font-mono mr-1">05.</span>Formação
            </Link>
            <Link
              href="#contatos"
              className="text-sm font-medium text-neutral-400 hover:text-white transition-colors"
            >
              <span className="text-blue-500 font-mono mr-1">06.</span>Contatos
            </Link>
          </nav>

          {session && (
            <Link
              href="/control-painel"
              className="px-4 py-2 rounded-lg bg-blue-950/30 text-blue-400 border border-blue-900/50 text-xs font-medium hover:bg-blue-900 hover:text-white transition-all whitespace-nowrap"
            >
              Painel de Controle
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}