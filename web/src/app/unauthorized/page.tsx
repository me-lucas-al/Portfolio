import BackButton from "@/components/back-button";
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <main className="min-h-screen bg-black">
      <BackButton path="/" />
      <section className="flex items-center justify-center px-4">
        <div className="w-full max-w-md p-8 rounded-2xl bg-neutral-950 border border-red-900/40 shadow-[0_0_50px_-15px_rgba(127,29,29,0.6)]">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold text-white tracking-tight">
              Acesso não autorizado
            </h1>
            <p className="text-sm text-neutral-400">
              Você não tem permissão para acessar esta página. 
            </p>
            <p className="text-xs text-neutral-500">
              Caso acredite que isso seja um engano, contate o administrador do sistema.
            </p>
            <div className="pt-4">
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-blue-950 hover:bg-blue-900 border border-blue-800/50 text-white text-xs font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-offset-2 focus:ring-offset-black"
              >
                Ir para o login
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

