"use client"

import { useActionState, useEffect } from "react"
import { updateMultipleSystemSettingsAction } from "@/app/actions/system-setting"
import { Save } from "lucide-react"

interface EditProfileFormProps {
  systemSettings: Record<string, string>
}

// Valores iniciais caso nunca tenha salvo no banco
const DEFAULT_ABOUT = `Sou um Desenvolvedor Full Stack com foco em arquitetura de software, construindo aplicações web escaláveis e orientadas a resultados de negócios. Com experiência prática no ecossistema JavaScript e TypeScript, atuo diariamente com Node.js, React.js e Next.js.\n\nMinha experiência inclui a aplicação de Clean Architecture, refatoração de código, gerenciamento de bancos de dados relacionais e a estruturação de pipelines CI/CD com Docker para garantir entregas contínuas, estabilidade e segurança.`;

const DEFAULT_SKILLS = {
  frontend: "React, Next.js, TypeScript, Tailwind CSS, Jest",
  backend: "Node.js, Fastify, Clean Architecture, Prisma ORM, PostgreSQL, MongoDB",
  tools: "Docker, CI/CD, Github Actions"
}

export function EditProfileForm({ systemSettings }: EditProfileFormProps) {
  const [state, formAction, isPending] = useActionState(updateMultipleSystemSettingsAction, null)

  const defaultAboutMe = systemSettings["about_me"] ?? DEFAULT_ABOUT
  const defaultFrontend = systemSettings["skills_frontend"] ?? DEFAULT_SKILLS.frontend
  const defaultBackend = systemSettings["skills_backend"] ?? DEFAULT_SKILLS.backend
  const defaultTools = systemSettings["skills_tools"] ?? DEFAULT_SKILLS.tools

  useEffect(() => {
    if (state?.success) {
      // Opcional, pode mostrar um toast
    }
  }, [state])

  return (
    <form action={formAction} className="space-y-8 bg-neutral-900/20 p-6 md:p-8 rounded-2xl border border-neutral-800/50">
      {/* Quem Sou */}
      <div className="space-y-4">
        <div className="border-b border-neutral-800 pb-2">
          <h3 className="text-lg font-medium text-white">Sobre Mim (Quem Sou)</h3>
          <p className="text-sm text-neutral-500">Texto exibido na seção "Quem Sou". Use quebras de linha para separar parágrafos.</p>
        </div>

        <div className="space-y-2">
          <textarea
            name="about_me"
            rows={5}
            defaultValue={defaultAboutMe}
            disabled={isPending}
            className="w-full px-4 py-3 rounded-xl bg-neutral-900/50 border border-neutral-800 text-white placeholder:text-neutral-600 focus:outline-none focus:border-blue-800 focus:ring-1 focus:ring-blue-800 transition-all disabled:opacity-50"
            placeholder="Fale sobre você..."
          />
        </div>
      </div>

      {/* Tecnologias */}
      <div className="space-y-4">
        <div className="border-b border-neutral-800 pb-2 pt-4">
          <h3 className="text-lg font-medium text-white">Tecnologias (Skills)</h3>
          <p className="text-sm text-neutral-500">Insira as tecnologias separadas por vírgula. O sistema irá mapear nomes conhecidos para os ícones corretamente.</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300">Frontend</label>
            <input
              type="text"
              name="skills_frontend"
              defaultValue={defaultFrontend}
              disabled={isPending}
              className="w-full px-4 py-3 rounded-xl bg-neutral-900/50 border border-neutral-800 text-white placeholder:text-neutral-600 focus:outline-none focus:border-blue-800 focus:ring-1 focus:ring-blue-800 transition-all disabled:opacity-50"
              placeholder="Ex: React, Next.js, Vue..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300">Backend</label>
            <input
              type="text"
              name="skills_backend"
              defaultValue={defaultBackend}
              disabled={isPending}
              className="w-full px-4 py-3 rounded-xl bg-neutral-900/50 border border-neutral-800 text-white placeholder:text-neutral-600 focus:outline-none focus:border-blue-800 focus:ring-1 focus:ring-blue-800 transition-all disabled:opacity-50"
              placeholder="Ex: Node.js, Express, PostgreSQL..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300">Tools / Ferramentas</label>
            <input
              type="text"
              name="skills_tools"
              defaultValue={defaultTools}
              disabled={isPending}
              className="w-full px-4 py-3 rounded-xl bg-neutral-900/50 border border-neutral-800 text-white placeholder:text-neutral-600 focus:outline-none focus:border-blue-800 focus:ring-1 focus:ring-blue-800 transition-all disabled:opacity-50"
              placeholder="Ex: Docker, Jest, Git..."
            />
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
        {state?.error ? (
          <p className="text-sm text-red-400">{state.error}</p>
        ) : state?.success ? (
          <p className="text-sm text-green-400">{state.message}</p>
        ) : <p></p>}

        <button 
          type="submit" 
          disabled={isPending}
          className="px-6 py-3 rounded-xl bg-blue-950 hover:bg-blue-900 border border-blue-800/50 text-white text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-800 disabled:opacity-50 flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          {isPending ? "Salvando..." : "Salvar Alterações"}
        </button>
      </div>
    </form>
  )
}
