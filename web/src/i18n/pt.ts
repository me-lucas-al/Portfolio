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
  experience: { title: string; current: string; showMore: string; showLess: string }
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
    ctaBubble: string
    close: string
    title: string
    subtitle: string
    placeholder: string
    send: string
    thinking: string
    error: string
    rateLimited: string
    quotaExceeded: string
    overloaded: string
    timeout: string
    retry: string
    disclaimer: string
    suggestions: string[]
    voiceEnable: string
    voiceDisable: string
    preparingVoice: string
    stopSpeaking: string
    voiceUnlockHint: string
    skipTyping: string
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
  experience: { title: "Experiências", current: "Atual", showMore: "Ver mais", showLess: "Ver menos" },
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
    ctaBubble: "Fale com a minha IA e tire suas dúvidas! 👋",
    close: "Fechar",
    title: "Assistente do Lucas",
    subtitle: "Pergunte sobre a trajetória, os projetos e a arquitetura do portfólio",
    placeholder: "Digite sua pergunta...",
    send: "Enviar",
    thinking: "Pensando...",
    error: "Não foi possível responder agora. Tente novamente em instantes.",
    rateLimited: "Muitas mensagens em pouco tempo. Aguarde um instante e tente de novo.",
    quotaExceeded: "Limite máximo atingido, tente novamente amanhã.",
    overloaded: "O modelo de IA está sobrecarregado neste momento. Tente novamente em alguns segundos.",
    timeout: "A resposta demorou mais do que o esperado. Tente novamente.",
    retry: "Tentar novamente",
    disclaimer: "Respostas geradas por IA com base nos dados reais do portfólio. Podem conter imprecisões.",
    suggestions: [
      "Onde o Lucas trabalha hoje?",
      "Como o portfólio foi construído?",
      "Quais tecnologias o Lucas domina melhor?",
    ],
    voiceEnable: "Ativar voz",
    voiceDisable: "Desativar voz",
    preparingVoice: "Preparando voz...",
    stopSpeaking: "Parar de falar",
    voiceUnlockHint: "Toque em qualquer lugar da página para ativar o áudio",
    skipTyping: "Pular para o fim",
  },
}
