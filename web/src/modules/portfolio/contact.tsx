import { DefaultLinkType } from "@portfolio/packages"
import { Github, Linkedin, Mail, Smartphone, Link as LinkIcon } from "lucide-react"
import Link from "next/link"

// 1. Criamos um mapa de configurações visuais fora do componente para não recriá-lo a cada render
const contactConfig: Record<string, any> = {
  github: {
    icon: <Github className="w-6 h-6" />,
    description: "Visite meu perfil no GitHub",
    hoverClass: "hover:border-blue-800 hover:bg-neutral-900",
    iconClass: "text-white"
  },
  linkedin: {
    icon: <Linkedin className="w-6 h-6" />,
    description: "Conecte-se comigo no LinkedIn",
    hoverClass: "hover:border-blue-600 hover:bg-blue-950/30",
    iconClass: "text-blue-500"
  },
  whatsapp: {
    icon: <Smartphone className="w-6 h-6" />,
    description: "Me mande uma mensagem",
    hoverClass: "hover:border-green-600 hover:bg-green-950/30",
    iconClass: "text-green-500"
  },
  email: {
    icon: <Mail className="w-6 h-6" />,
    description: "Mande um email",
    hoverClass: "hover:border-red-600 hover:bg-red-950/30",
    iconClass: "text-red-500"
  }
}

export function Contact({ links }: { links: DefaultLinkType[] }) {
  const contacts = links.map((link) => {
    const configKey = link.title.toLowerCase(); 
    const config = contactConfig[configKey];

    return {
      title: link.title,
      url: link.url,
      icon: config?.icon || <LinkIcon className="w-6 h-6" />,
      description: config?.description || "Acesse o link",
      hoverClass: config?.hoverClass || "hover:border-neutral-600 hover:bg-neutral-800",
      iconClass: config?.iconClass || "text-neutral-400"
    };
  });

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
          {contacts.map((contact) => (
            <Link
              key={contact.title}
              href={contact.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group flex flex-col items-center justify-center gap-4 p-8 rounded-2xl bg-neutral-950/50 border border-neutral-900 transition-all duration-300 ${contact.hoverClass}`}
            >
              <div className={`p-4 rounded-full bg-neutral-900 border border-neutral-800 transition-transform duration-300 group-hover:-translate-y-1 ${contact.iconClass}`}>
                {contact.icon}
              </div>
              <div className="text-center space-y-1">
                <h4 className="text-white font-medium text-lg">{contact.title}</h4>
                <p className="text-sm text-neutral-500 transition-colors duration-300 group-hover:text-neutral-400">{contact.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}