import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();
  const institutions = await prisma.institution.findMany();
  console.log('Institutions:', JSON.stringify(institutions, null, 2));
  
  const users = await prisma.grcUser.findMany({ take: 1 });
  console.log('Sample User institutionId:', users[0]?.institutionId);
  
  await prisma.$disconnect();
}

main();
