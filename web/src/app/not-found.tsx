import Link from "next/link";
import BackButton from "@/components/back-button";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-black">
      <BackButton path="/" />
      <section className="flex items-center justify-center px-4">
        <div className="w-full max-w-md p-8 rounded-2xl bg-neutral-950 border border-neutral-800 shadow-[0_0_50px_-15px_rgba(15,23,42,0.8)] text-center space-y-3">
          <h1 className="text-3xl font-semibold text-white tracking-tight">
            404
          </h1>
          <p className="text-sm text-neutral-400">
            Página não encontrada
          </p>
          <p className="text-xs text-neutral-500">
            A página que você tentou acessar não existe ou foi movida.
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-blue-950 hover:bg-blue-900 border border-blue-800/50 text-white text-xs font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-offset-2 focus:ring-offset-black"
            >
              Voltar para a página inicial
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

