export interface Dictionary {
  nav: {
    about: string
    skills: string
    projects: string
    experience: string
    education: string
    contact: string
  }
  hero: {
    greeting: string
    role: string
    resume: string
  }
  about: { title: string }
  skills: { title: string; tools: string }
  projects: { title: string }
  experience: { title: string; current: string }
  education: { title: string; current: string }
  contact: {
    title: string
    heading: string
    description: string
    fallback: string
    descriptions: {
      github: string
      linkedin: string
      whatsapp: string
      email: string
    }
  }
  header: { controlPanel: string; navigation: string }
  footer: {
    rights: string
    description: string
  }
  assistant: {
    trigger: string
    title: string
    subtitle: string
    placeholder: string
    send: string
    thinking: string
    error: string
    rateLimited: string
    quotaExceeded: string
    disclaimer: string
    suggestions: string[]
  }
}

export const pt: Dictionary = {
  nav: {
    about: "Sobre",
    skills: "Tecnologias",
    projects: "Projetos",
    experience: "Experiência",
    education: "Formação",
    contact: "Contatos",
  },
  hero: {
    greeting:
      "Olá! Sou Lucas Almeida, desenvolvedor full stack especialista na construção de aplicações web escaláveis e sistemas de alta performance com Next.js, React e Node.js.",
    role: "Desenvolvedor Full Stack Next.js, React e Node.js",
    resume: "Currículo",
  },
  about: { title: "Quem Sou" },
  skills: { title: "Tecnologias", tools: "Ferramentas" },
  projects: { title: "Projetos Desenvolvidos" },
  experience: { title: "Experiências", current: "Atual" },
  education: { title: "Formação Acadêmica", current: "Atual" },
  contact: {
    title: "Contatos",
    heading: "Entre em Contato",
    description:
      "Estou sempre aberto a novas oportunidades e parcerias. Sinta-se à vontade para me mandar uma mensagem através de qualquer uma das plataformas abaixo.",
    fallback: "Acesse o link",
    descriptions: {
      github: "Visite meu perfil no GitHub",
      linkedin: "Conecte-se comigo no LinkedIn",
      whatsapp: "Me mande uma mensagem",
      email: "Mande um email",
    },
  },
  header: { controlPanel: "Painel de Controle", navigation: "Navegação" },
  footer: {
    rights: "Todos os direitos reservados.",
    description: "Desenvolvedor Full Stack & Desenvolvedor Next.js, React e Node.js",
  },
  assistant: {
    trigger: "Assistente de IA",
    title: "Assistente do Lucas",
    subtitle: "Pergunte sobre a trajetória, os projetos e a arquitetura do portfólio",
    placeholder: "Digite sua pergunta...",
    send: "Enviar",
    thinking: "Pensando...",
    error: "Não foi possível responder agora. Tente novamente em instantes.",
    rateLimited: "Muitas mensagens em pouco tempo. Aguarde um instante e tente de novo.",
    quotaExceeded: "Limite máximo atingido, tente novamente amanhã.",
    disclaimer: "Respostas geradas por IA com base nos dados reais do portfólio. Podem conter imprecisões.",
    suggestions: [
      "Onde o Lucas trabalha hoje?",
      "Como o portfólio foi construído?",
      "Quais tecnologias o Lucas domina melhor?",
    ],
  },
}


