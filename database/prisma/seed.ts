import prisma from "../prisma";
import bcrypt from 'bcryptjs';


async function main() {
  console.log('🌱 A iniciar o seed da base de dados...');
  const hashedPassword = await bcrypt.hash('12345678', 10);
  
  const admin = await prisma.admin.upsert({
    where: { username: 'lucas' },
    update: {}, 
    create: {
      username: 'lucas',
      password: hashedPassword,
    },
  });
  console.log(`✅ Admin criado/verificado com sucesso: ${admin.username}`);

  const projetos = [
    {
      title: 'Star Lockers',
      description: 'Sistema de gestão de permissões e acessos para lockers inteligentes.',
      githubUrl: 'https://github.com/seu-user/star-lockers',
      deployUrl: 'https://star-lockers.com',
      imageUrl: 'https://via.placeholder.com/800x600?text=Star+Lockers',
    },
    {
      title: 'Star Stock v2',
      description: 'Nova versão do sistema de gestão de stock e inventário.',
      githubUrl: 'https://github.com/seu-user/star-stock-v2',
      deployUrl: null, 
      imageUrl: 'https://via.placeholder.com/800x600?text=Star+Stock+v2',
    },
    {
      title: 'Clínica Roberto Watanabe',
      description: 'Website desenvolvido para uma clínica holística.',
      githubUrl: 'https://github.com/seu-user/clinica-roberto-watanabe',
      deployUrl: 'https://clinicarobertowatanabe.com',
      imageUrl: null,
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