import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['info', 'error', 'query', 'warn'],
});

export { prisma };
