import 'dotenv/config'
import prisma from "../prisma";
import bcrypt from 'bcryptjs';

async function main() {
  console.log('🌱 A iniciar o seed da base de dados...');

  // ==========================================
  // 1. SEED DE USUÁRIOS (ADMIN E TESTE)
  // ==========================================
  const username = process.env.SEED_ADMIN_USERNAME!;
  const password = process.env.SEED_ADMIN_PASSWORD!;

  const hashedPassword = await bcrypt.hash(password, 10);
  
  const admin = await prisma.user.upsert({
    where: { username: username },
    update: {}, 
    create: {
      username: username,
      password: hashedPassword,
      role: 'ADMIN'
    },
  });

  const user = await prisma.user.upsert({
    where: { username: 'teste' },
    update: {}, 
    create: {
      username: 'teste',
      password:  await bcrypt.hash('teste123', 10),
      role: 'USER'
    },
  });
  console.log(`✅ Admin criado/verificado com sucesso: ${admin.username}`);
  console.log(`✅ User criado/verificado com sucesso: ${user.username}`);


  // ==========================================
  // 2. SEED DE PROJETOS
  // ==========================================
  const projetos = [
    {
      title: 'Self Checkout',
      description: 'Sistema de Autoatendimento para Restaurantes (Self-Checkout)',
      githubUrl: 'https://github.com/me-lucas-al/self-checkout',
      technologies: ['Next.js', 'Prisma', 'PostgreSQL', 'Tailwind CSS', 'Stripe'],
      deployUrl: 'selfcheckout-app.vercel.app',
      imagesUrl: [],
    },
    {
      title: 'Agenda de Contatos',
      description: 'Nova versão do sistema de gestão de stock e inventário.',
      githubUrl: 'https://github.com/me-lucas-al/Agenda-de-Contatos',
      technologies: ['Next.js', 'Node.js','Prisma', 'PostgreSQL', 'Tailwind CSS'],
      deployUrl: 'https://agenda-de-contatos-starseg.vercel.app', 
      imagesUrl: [],
    },
    {
      title: 'Clínica Roberto Watanabe',
      description: 'Website desenvolvido para uma clínica holística.',
      githubUrl: 'https://github.com/Clinica-Roberto-Watanabe/Clinica-Roberto-Watanabe',
      technologies: ['React.js', 'Python', 'Flask', 'MySQL', 'SQLAlchemy','Tailwind CSS'],
      deployUrl: 'clinicarobertowatanabe.vercel.app',
      imagesUrl: [],
    }
  ];

  for (const proj of projetos) {
    const existe = await prisma.project.findFirst({ where: { title: proj.title } });
    if (!existe) {
      await prisma.project.create({ data: proj });
      console.log(`✅ Projeto inserido: ${proj.title}`);
    }
  }


  // ==========================================
  // 3. SEED DE EXPERIÊNCIAS
  // ==========================================
  const experiencias = [
    {
      role: "Desenvolvedor Full Stack",
      company: "Star Seg",
      startDate: new Date("2025-08-01"),
      endDate: null, // "Atual"
      description: "Desenvolvimento e modernização de sistemas de monitoramento e segurança utilizados por +40 condomínios e +4.000 usuários ativos. Alcancei uma melhora de 91% no tempo de carregamento da plataforma. Aplicação de Clean Architecture, CI/CD e correções críticas de segurança.",
      techs: ["Next.js", "TypeScript", "Node.js", "Docker", "PostgreSQL", "Tailwind CSS"]
    },
    {
      role: "Desenvolvedor Front-End",
      company: "BNR System (Freelance)",
      startDate: new Date("2024-08-01"),
      endDate: new Date("2025-08-01"),
      description: "Desenvolvimento do Front-End para um sistema de vendas e cotação de peças automotivas. Utilização de React.js, Tailwind CSS e integração com APIs REST. Responsável pelo deploy do sistema e gerenciamento de arquivos.",
      techs: ["React.js", "Tailwind CSS", "API REST"]
    },
    {
      role: "Desenvolvedor Full Stack",
      company: "MedSea Connect (Freelance)",
      startDate: new Date("2024-08-01"),
      endDate: new Date("2024-12-01"),
      description: "Desenvolvimento completo de uma plataforma web para doação de medula óssea, garantindo segurança e eficiência na gestão de dados.",
      techs: ["React.js", "Java Spring Boot", "MySQL"]
    }
  ];

  for (const exp of experiencias) {
    const existe = await prisma.experience.findFirst({ 
      where: { company: exp.company, role: exp.role } 
    });
    if (!existe) {
      await prisma.experience.create({ data: exp });
      console.log(`✅ Experiência inserida: ${exp.role} na ${exp.company}`);
    }
  }


  // ==========================================
  // 4. SEED DE FORMAÇÕES ACADÊMICAS
  // ==========================================
  const formacoes = [
    {
      course: "Engenharia de Software",
      institution: "Universidade Federal de Itajubá (UNIFEI)",
      startDate: new Date("2026-02-01"), // Aprovado em 2026 (Assumi Fevereiro)
      endDate: null,
      type: "Bacharelado"
    },
    {
      course: "Análise e Desenvolvimento de Sistemas",
      institution: "Instituto Federal de São Paulo (IFSP) - Bragança Paulista",
      startDate: new Date("2025-02-01"),
      endDate: new Date("2027-12-01"),
      type: "Tecnólogo"
    },
    {
      course: "Técnico em Informática",
      institution: "Instituto Federal de São Paulo (IFSP) - Bragança Paulista",
      startDate: new Date("2022-02-01"),
      endDate: new Date("2024-12-01"),
      type: "Ensino Técnico"
    }
  ];

  for (const form of formacoes) {
    const existe = await prisma.education.findFirst({ 
      where: { course: form.course, institution: form.institution } 
    });
    if (!existe) {
      await prisma.education.create({ data: form });
      console.log(`✅ Formação inserida: ${form.course} no(a) ${form.institution}`);
    }
  }

  console.log('✅ Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });