import BackButton from "@/components/back-button";
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <main className="min-h-screen bg-ink text-fg">
      <BackButton path="/" />
      <section className="flex items-center justify-center px-4">
        <div className="w-full max-w-md p-8 rounded-2xl bg-surface border border-danger/30 shadow-xl shadow-danger/5">
          <div className="space-y-2 text-center">
            <h1 className="font-display text-2xl font-bold text-fg tracking-tight">
              Acesso não autorizado
            </h1>
            <p className="text-sm text-fg-muted">
              Você não tem permissão para acessar esta página. 
            </p>
            <p className="text-xs text-muted-2">
              Caso acredite que isso seja um engano, contate o administrador do sistema.
            </p>
            <div className="pt-4">
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-brand hover:bg-brand-strong text-brand-ink text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-ink"
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

