"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/actions/login/auth";
import BackButton from "@/components/back-button";

export default function Login() {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <main className="min-h-screen bg-ink text-fg">
      <BackButton />
      <section className="flex items-center justify-center px-4">
        <div className="w-full max-w-sm p-8 rounded-2xl bg-surface border border-line shadow-xl shadow-brand/5">
          <div className="mb-8 text-center space-y-1">
            <h1 className="font-display text-2xl font-bold text-fg tracking-tight">
              Acesso Restrito
            </h1>
            <p className="text-sm text-fg-muted">
              Insira as suas credenciais para continuar
            </p>
          </div>

          {state?.error && (
            <div className="mb-6 p-3 rounded-lg bg-danger/10 border border-danger/30 text-danger text-sm text-center font-medium animate-in fade-in slide-in-from-top-2">
              {state.error}
            </div>
          )}

          <form action={formAction} className="space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="username"
                className="text-sm font-medium text-fg-muted ml-1"
              >
                Usuário
              </label>
              <input
                type="text"
                id="username"
                name="username"
                required
                disabled={isPending}
                autoComplete="off"
                className="w-full px-4 py-3 rounded-xl bg-surface-2/60 border border-line text-fg placeholder-muted-2 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all disabled:opacity-50"
                placeholder="admin"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-fg-muted ml-1"
              >
                Senha
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                disabled={isPending}
                className="w-full px-4 py-3 rounded-xl bg-surface-2/60 border border-line text-fg placeholder-muted-2 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all disabled:opacity-50"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full mt-2 flex items-center justify-center py-3 px-4 rounded-xl bg-brand hover:bg-brand-strong text-brand-ink text-sm font-semibold transition-all focus:outline-none focus:ring-2 cursor-pointer focus:ring-brand focus:ring-offset-2 focus:ring-offset-ink disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4 text-brand-ink"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Autenticando...
                </span>
              ) : (
                "Entrar"
              )}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
