import { DefaultLinkType } from "@portfolio/packages"
import { Github, Linkedin, Mail, Smartphone, Link as LinkIcon } from "lucide-react"
import Link from "next/link"
import { getDictionary, type Locale } from "@/i18n"

const contactVisuals: Record<string, { icon: React.ReactNode; hoverClass: string; iconClass: string }> = {
  github: {
    icon: <Github className="w-6 h-6" />,
    hoverClass: "hover:border-line-strong hover:bg-surface-2",
    iconClass: "text-fg"
  },
  linkedin: {
    icon: <Linkedin className="w-6 h-6" />,
    hoverClass: "hover:border-[#0A66C2]/50 hover:bg-[#0A66C2]/10",
    iconClass: "text-[#0A66C2]"
  },
  whatsapp: {
    icon: <Smartphone className="w-6 h-6" />,
    hoverClass: "hover:border-success/50 hover:bg-success/10",
    iconClass: "text-success"
  },
  email: {
    icon: <Mail className="w-6 h-6" />,
    hoverClass: "hover:border-danger/50 hover:bg-danger/10",
    iconClass: "text-danger"
  }
}

interface ContactProps {
  links: DefaultLinkType[]
  locale: Locale
}

export function Contact({ links, locale }: ContactProps) {
  const dict = getDictionary(locale)

  const contacts = links.map((link) => {
    const configKey = link.title.toLowerCase();
    const visual = contactVisuals[configKey];
    const description = dict.contact.descriptions[configKey as keyof typeof dict.contact.descriptions]

    return {
      title: link.title,
      url: link.url,
      icon: visual?.icon || <LinkIcon className="w-6 h-6" />,
      description: description || dict.contact.fallback,
      hoverClass: visual?.hoverClass || "hover:border-line-strong hover:bg-surface-2",
      iconClass: visual?.iconClass || "text-fg-muted"
    };
  });

  return (
    <section id="contatos" className="py-20 scroll-mt-20">
      <div className="space-y-12">
        <div className="space-y-4">
          <h2 className="text-brand font-medium tracking-wider text-sm uppercase">
            {dict.contact.title}
          </h2>
          <h3 className="font-display text-3xl md:text-5xl font-bold text-fg tracking-tight">
            {dict.contact.heading}
          </h3>
          <p className="text-fg-muted text-lg max-w-2xl leading-relaxed">
            {dict.contact.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {contacts.map((contact) => (
            <Link
              key={contact.title}
              href={contact.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group flex flex-col items-center justify-center gap-4 p-8 rounded-2xl bg-surface/50 border border-line transition-all duration-300 ${contact.hoverClass}`}
            >
              <div className={`p-4 rounded-full bg-surface-2 border border-line transition-transform duration-300 group-hover:-translate-y-1 ${contact.iconClass}`}>
                {contact.icon}
              </div>
              <div className="text-center space-y-1">
                <h4 className="text-fg font-medium text-lg">{contact.title}</h4>
                <p className="text-sm text-muted-2 transition-colors duration-300 group-hover:text-fg-muted">{contact.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
