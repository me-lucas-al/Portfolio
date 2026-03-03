import { Smartphone, Link as LinkIcon } from "lucide-react"
import Link from "next/link"
import { DefaultLinkType } from "@portfolio/packages/schemas/link"
import * as LucideIcons from "lucide-react"

export function Contact({ links }: { links?: (DefaultLinkType & { id: number })[] }) {


  return (
    <section id="contatos" className="py-20 scroll-mt-20">
      <div className="space-y-12">
        <div className="space-y-4">
          <h2 className="text-blue-500 font-medium tracking-wider text-sm uppercase">
            06. Contatos
          </h2>
          <h3 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
            Entre em Contato
          </h3>
          <p className="text-neutral-400 text-lg max-w-2xl leading-relaxed">
            Estou sempre aberto a novas oportunidades e parcerias. Sinta-se à vontade para me mandar uma mensagem através de qualquer uma das plataformas abaixo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {links?.map((link) => {
            // @ts-ignore
            const IconComp = LucideIcons[link.icon] || LinkIcon;
            return (
              <Link
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center justify-center gap-4 p-8 rounded-2xl bg-neutral-950/50 border border-neutral-900 transition-all duration-300 hover:border-blue-800 hover:bg-neutral-900"
              >
                <div className="p-4 rounded-full bg-neutral-900 border border-neutral-800 transition-transform duration-300 group-hover:-translate-y-1 text-white">
                  <IconComp className="w-6 h-6" />
                </div>
                <div className="text-center space-y-1">
                  <h4 className="text-white font-medium text-lg">{link.title}</h4>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
