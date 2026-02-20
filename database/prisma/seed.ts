import 'dotenv/config'
import prisma from "../prisma";
import bcrypt from 'bcryptjs';


async function main() {
  console.log('🌱 A iniciar o seed da base de dados...');

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
  console.log(`✅ Admin criado/verificado com sucesso: ${admin.username}`);

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