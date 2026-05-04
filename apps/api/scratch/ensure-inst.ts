import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();
  const defaultInst = await prisma.institution.findFirst({
    where: { id: '' }
  });

  if (!defaultInst) {
    console.log('Creating default institution with empty string ID...');
    await prisma.institution.create({
      data: {
        id: '',
        name: 'Default Institution',
      }
    });
    console.log('Done.');
  } else {
    console.log('Default institution already exists.');
  }
  
  await prisma.$disconnect();
}

main();
