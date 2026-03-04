import { Github, Linkedin, Mail, Smartphone } from "lucide-react"
import Link from "next/link"

export function Contact() {
  const contacts = [
    {
      name: "GitHub",
      url: "https://github.com/me-lucas-al",
      icon: <Github className="w-6 h-6" />,
      description: "Visite meu perfil no GitHub",
      hoverClass: "hover:border-blue-800 hover:bg-neutral-900",
      iconClass: "text-white"
    },
    {
      name: "LinkedIn",
      url: "https://linkedin.com/in/lucas-almeida-development",
      icon: <Linkedin className="w-6 h-6" />,
      description: "Conecte-se comigo no LinkedIn",
      hoverClass: "hover:border-blue-600 hover:bg-blue-950/30",
      iconClass: "text-blue-500"
    },
    {
      name: "WhatsApp",
      url: "https://api.whatsapp.com/send/?phone=5511917609074&text=Ol%C3%A1+Lucas%21&type=phone_number&app_absent=0",
      icon: <Smartphone className="w-6 h-6" />,
      description: "Me mande uma mensagem",
      hoverClass: "hover:border-green-600 hover:bg-green-950/30",
      iconClass: "text-green-500"
    },
    {
      name: "Email",
      url: "https://mail.google.com/mail/?view=cm&fs=1&to=me.lucasalmeida@gmail.com&su=Assunto%20aqui&body=Escreva%20sua%20mensagem%20aqui",
      icon: <Mail className="w-6 h-6" />,
      description: "Mande um email",
      hoverClass: "hover:border-red-600 hover:bg-red-950/30",
      iconClass: "text-red-500"
    }
  ]

  return (
    <section id="contatos" className="py-20 scroll-mt-20">
      <div className="space-y-12">
        <div className="flex items-center gap-6 mb-6">
        <h3 className="text-2xl font-bold text-white flex items-center gap-3">
          <span className="text-blue-500 font-mono text-lg font-normal">06.</span>
          Contatos
        </h3>
        <div className="h-px bg-neutral-900 flex-1" />
      </div>
          <p className="text-neutral-400 text-lg max-w-2xl leading-relaxed">
            Entre em contato através de qualquer uma das plataformas abaixo.
          </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {contacts.map((contact) => (
            <Link
              key={contact.name}
              href={contact.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group flex flex-col items-center justify-center gap-4 p-8 rounded-2xl bg-neutral-950/50 border border-neutral-900 transition-all duration-300 ${contact.hoverClass}`}
            >
              <div className={`p-4 rounded-full bg-neutral-900 border border-neutral-800 transition-transform duration-300 group-hover:-translate-y-1 ${contact.iconClass}`}>
                {contact.icon}
              </div>
              <div className="text-center space-y-1">
                <h4 className="text-white font-medium text-lg">{contact.name}</h4>
                <p className="text-sm text-neutral-500 transition-colors duration-300 group-hover:text-neutral-400">{contact.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
