// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'tummapalagopichand@gmail.com' },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);

    await prisma.user.create({
      data: {
        name: 'Tummapala Gopichand',
        email: 'tummapalagopichand@gmail.com',
        password: hashedPassword,
        role: 'ADMIN',
        team: 'Alpha',
      },
    });

    console.log('✅ Admin user created!');
  } else {
    console.log('ℹ️ Admin already exists.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
