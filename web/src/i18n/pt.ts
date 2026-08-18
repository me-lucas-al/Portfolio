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
}


