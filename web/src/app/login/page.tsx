"use client" 

import { useActionState } from "react";
import { loginAction } from "../actions/auth";

export default function Login() {
  const [state, formAction, isPending] = useActionState(loginAction, undefined);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-900 border border-blue-900 rounded-lg p-8">
        <h1 className="text-3xl text-white mb-8">Login</h1>

        <form action={formAction} className="space-y-6">
          
          {state?.error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded text-sm">
              {state.error}
            </div>
          )}

          <div>
            <label htmlFor="username" className="block text-sm text-gray-300 mb-2">
              Usuário
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              className="w-full bg-black border border-blue-900 rounded px-4 py-2 text-white focus:outline-none focus:border-blue-700"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm text-gray-300 mb-2">
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full bg-black border border-blue-900 rounded px-4 py-2 text-white focus:outline-none focus:border-blue-700"
            />
          </div>

          <div className="text-right">
            <a href="#" className="text-sm text-blue-400 hover:text-blue-300">
              Esqueceu a senha?
            </a>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-700 hover:bg-blue-600 text-white py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}