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
  skills: { title: string }
  projects: { title: string }
  experience: { title: string; current: string }
  education: { title: string; current: string }
  contact: { title: string }
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
  about: { title: "Sobre Mim" },
  skills: { title: "Tecnologias" },
  projects: { title: "Projetos" },
  experience: { title: "Experiências", current: "Atual" },
  education: { title: "Formação Acadêmica", current: "Atual" },
  contact: { title: "Contatos" },
  footer: {
    rights: "Todos os direitos reservados.",
    description: "Desenvolvedor Full Stack & Desenvolvedor Next.js, React e Node.js",
  },
}


