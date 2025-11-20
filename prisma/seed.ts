import { PrismaClient } from './.prisma/generated';
const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding categories...');

  const categories = [
    { name: 'Peças e Componentes Industriais', slug: 'pecas-e-componentes' },
    { name: 'Automação Industrial', slug: 'automacao-industrial' },
    { name: 'Ferramentas e Equipamentos', slug: 'ferramentas-e-equipamentos' },
    { name: 'Elétrica e Eletrônica', slug: 'eletrica-e-eletronica' },
    { name: 'Segurança e EPIs', slug: 'seguranca-e-epis' },
    { name: 'Máquinas e Motores', slug: 'maquinas-e-motores' },
    { name: 'Hidráulica e Pneumática', slug: 'hidraulica-e-pneumatica' },
    { name: 'Químicos e Lubrificantes', slug: 'quimicos-e-lubrificantes' },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
