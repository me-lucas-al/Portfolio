"use client" // Error components must be Client Components

import { useEffect } from "react"
import { AlertCircle, RotateCcw } from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global Error Caught:", error)
  }, [error])

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 bg-black text-white">
      <div className="w-full max-w-md bg-neutral-950 border border-neutral-900 rounded-2xl p-8 shadow-2xl flex flex-col items-center text-center space-y-6">
        <div className="w-16 h-16 bg-red-950/30 rounded-full flex items-center justify-center border border-red-900/50">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white tracking-tight">Ops! Algo deu errado</h2>
          <p className="text-neutral-400 text-sm leading-relaxed">
            Ocorreu um erro inesperado ao tentar processar sua solicitação. Detalhes do erro foram registrados.
          </p>
        </div>

        <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4 w-full text-left overflow-hidden">
          <p className="text-xs text-neutral-500 font-mono break-words">
            {error.message || "Erro desconhecido."}
          </p>
          {error.digest && (
            <p className="text-[10px] text-neutral-600 font-mono mt-2">
              Digest: {error.digest}
            </p>
          )}
        </div>

        <button
          onClick={() => reset()}
          className="flex items-center gap-2 w-full justify-center px-6 py-3.5 bg-blue-950 hover:bg-blue-900 border border-blue-900/50 text-white rounded-xl font-medium transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          Tentar novamente
        </button>
      </div>
    </div>
  )
}
