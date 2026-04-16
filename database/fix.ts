import { prisma } from './prisma';

async function fix() {
  await prisma.systemSetting.deleteMany({
    where: {
      key: {
        in: ['about_me', 'skills_frontend', 'skills_backend', 'skills_tools']
      }
    }
  });
  console.log('Deleted bad entries');
}

fix()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
