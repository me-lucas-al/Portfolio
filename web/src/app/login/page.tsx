"use client"

import { useActionState } from "react"
import { loginAction } from "@/app/actions/auth"

export default function Login() {
  const [state, formAction, isPending] = useActionState(loginAction, null)

  return (
    <main className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-sm p-8 rounded-2xl bg-neutral-950 border border-blue-950/50 shadow-[0_0_50px_-15px_rgba(23,37,84,0.4)]">
        
        <div className="mb-8 text-center space-y-1">
          <h1 className="text-2xl font-medium text-white tracking-tight">
            Acesso Restrito
          </h1>
          <p className="text-sm text-neutral-500">
            Insira as suas credenciais para continuar
          </p>
        </div>

        {state?.error && (
          <div className="mb-6 p-3 rounded-lg bg-red-950/30 border border-red-900/50 text-red-400 text-sm text-center font-medium animate-in fade-in slide-in-from-top-2">
            {state.error}
          </div>
        )}

        <form action={formAction} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium text-neutral-400 ml-1">
              Usuário
            </label>
            <input
              type="text"
              id="username"
              name="username"
              required
              disabled={isPending}
              autoComplete="off"
              className="w-full px-4 py-3 rounded-xl bg-neutral-900/50 border border-neutral-800 text-white placeholder-neutral-600 focus:outline-none focus:border-blue-800 focus:ring-1 focus:ring-blue-800 transition-all disabled:opacity-50"
              placeholder="admin"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-neutral-400 ml-1">
              Senha
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              disabled={isPending}
              className="w-full px-4 py-3 rounded-xl bg-neutral-900/50 border border-neutral-800 text-white placeholder-neutral-600 focus:outline-none focus:border-blue-800 focus:ring-1 focus:ring-blue-800 transition-all disabled:opacity-50"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full mt-2 flex items-center justify-center py-3 px-4 rounded-xl bg-blue-950 hover:bg-blue-900 border border-blue-800/50 text-white text-sm font-medium transition-all focus:outline-none focus:ring-2 cursor-pointer focus:ring-blue-800 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-blue-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Autenticando...
              </span>
            ) : (
              "Entrar"
            )}
          </button>
        </form>
      </div>
    </main>
  )
}