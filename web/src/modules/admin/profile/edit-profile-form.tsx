"use client"

import { useActionState, useEffect } from "react"
import { updateMultipleSystemSettingsAction } from "@/app/actions/system-setting"
import { Save } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
  const defaultAboutMeEn = systemSettings["about_me_en"] ?? ""
  const defaultFrontend = systemSettings["skills_frontend"] ?? DEFAULT_SKILLS.frontend
  const defaultBackend = systemSettings["skills_backend"] ?? DEFAULT_SKILLS.backend
  const defaultTools = systemSettings["skills_tools"] ?? DEFAULT_SKILLS.tools

  useEffect(() => {
    if (state?.success) {
      // Opcional, pode mostrar um toast
    }
  }, [state])

  return (
    <form action={formAction} className="space-y-8 bg-surface-2/30 p-6 md:p-8 rounded-2xl border border-line">
      {/* Quem Sou */}
      <div className="space-y-4">
        <div className="border-b border-line pb-2">
          <h3 className="text-lg font-medium text-fg">Sobre Mim (Quem Sou)</h3>
          <p className="text-sm text-fg-muted">Texto exibido na seção "Quem Sou". Use quebras de linha para separar parágrafos.</p>
        </div>

        <Tabs defaultValue="pt" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-surface border border-line">
            <TabsTrigger value="pt" className="data-[state=active]:bg-brand/10 data-[state=active]:text-brand text-fg-muted">
              🇧🇷 PT-BR
            </TabsTrigger>
            <TabsTrigger value="en" className="data-[state=active]:bg-brand/10 data-[state=active]:text-brand text-fg-muted">
              🇺🇸 EN-US
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pt" className="space-y-2 mt-4 data-[state=inactive]:hidden" forceMount>
            <textarea
              name="about_me"
              rows={5}
              defaultValue={defaultAboutMe}
              disabled={isPending}
              className="w-full px-4 py-3 rounded-xl bg-surface border border-line text-fg placeholder:text-muted-2 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all disabled:opacity-50"
              placeholder="Fale sobre você..."
            />
          </TabsContent>

          <TabsContent value="en" className="space-y-2 mt-4 data-[state=inactive]:hidden" forceMount>
            <textarea
              name="about_me_en"
              rows={5}
              defaultValue={defaultAboutMeEn}
              disabled={isPending}
              className="w-full px-4 py-3 rounded-xl bg-surface border border-line text-fg placeholder:text-muted-2 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all disabled:opacity-50"
              placeholder="Talk about yourself... (optional, falls back to Portuguese)"
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Tecnologias */}
      <div className="space-y-4">
        <div className="border-b border-line pb-2 pt-4">
          <h3 className="text-lg font-medium text-fg">Tecnologias (Skills)</h3>
          <p className="text-sm text-fg-muted">Insira as tecnologias separadas por vírgula. O sistema irá mapear nomes conhecidos para os ícones corretamente.</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-fg-muted">Frontend</label>
            <input
              type="text"
              name="skills_frontend"
              defaultValue={defaultFrontend}
              disabled={isPending}
              className="w-full px-4 py-3 rounded-xl bg-surface border border-line text-fg placeholder:text-muted-2 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all disabled:opacity-50"
              placeholder="Ex: React, Next.js, Angular, TypeScript..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-fg-muted">Backend</label>
            <input
              type="text"
              name="skills_backend"
              defaultValue={defaultBackend}
              disabled={isPending}
              className="w-full px-4 py-3 rounded-xl bg-surface border border-line text-fg placeholder:text-muted-2 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all disabled:opacity-50"
              placeholder="Ex: Node.js, Java, Spring Boot, PostgreSQL..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-fg-muted">Tools / Ferramentas</label>
            <input
              type="text"
              name="skills_tools"
              defaultValue={defaultTools}
              disabled={isPending}
              className="w-full px-4 py-3 rounded-xl bg-surface border border-line text-fg placeholder:text-muted-2 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all disabled:opacity-50"
              placeholder="Ex: Docker, Jest, Git..."
            />
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-line flex items-center justify-between">
        {state?.error ? (
          <p className="text-sm text-danger">{state.error}</p>
        ) : state?.success ? (
          <p className="text-sm text-success">{state.message}</p>
        ) : <p></p>}

        <button 
          type="submit" 
          disabled={isPending}
          className="px-6 py-3 rounded-xl bg-brand hover:bg-brand-strong text-brand-ink text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-brand disabled:opacity-50 flex items-center gap-2 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          {isPending ? "Salvando..." : "Salvar Alterações"}
        </button>
      </div>
    </form>
  )
}
