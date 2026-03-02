import Link from "next/link"
import { Github, Linkedin, Download } from "lucide-react"

export function Hero() {
  return (
    <section className="min-h-[85vh] flex flex-col justify-center items-start pt-20">
      <div className="space-y-6 max-w-3xl animate-in fade-in slide-in-from-bottom-8 duration-700">
        <h2 className="text-blue-500 font-medium tracking-wider text-sm uppercase">
          Software Engineer
        </h2>
        <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight">
          Lucas Almeida
        </h1>
        <h3 className="text-3xl md:text-5xl font-semibold text-neutral-400">
          Desenvolvedor Full Stack
        </h3>
        
        <p className="text-neutral-400 text-lg leading-relaxed pt-4 max-w-2xl">
          Especialista na construção de aplicações web escaláveis e arquiteturas robustas utilizando o ecossistema React, Next.js e Node.js.
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
          
          <div className="flex flex-col max-w-sm sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto sm:ml-auto bg-neutral-950/50 p-1.5 rounded-xl border border-neutral-900">
            <Link
              href="https://drive.google.com/file/d/145nnzLHLlkUMpumXU_oT0T1dXjqnUOJ_/view?usp=sharing"
              target="_blank"
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 transition-all text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              CV (PT)
            </Link>
            <div className="hidden sm:block w-px h-4 bg-neutral-800" />
            <Link
              href="https://drive.google.com/file/d/1r-buCGPwzNeRhXUnj5XNe_6aSErGNsKW/view?usp=sharing"
              target="_blank"
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 transition-all text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              CV (EN)
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}