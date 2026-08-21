import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const email = String(process.env.SUPER_ADMIN_EMAIL || '')
    .trim()
    .toLowerCase();
  const password = String(process.env.SUPER_ADMIN_PASSWORD || '');
  const name = String(
    process.env.SUPER_ADMIN_NAME || 'Platform Super Admin',
  ).trim();

  if (!email || !password) {
    throw new Error(
      'SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD must be set in .env for seeding.',
    );
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    await prisma.user.update({
      where: { email },
      data: {
        role: UserRole.SUPER_ADMIN,
        isActive: true,
        name: existing.name || name,
      },
    });
    console.log(`Super Admin already exists: ${email} (ensured active SUPER_ADMIN)`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role: UserRole.SUPER_ADMIN,
      isActive: true,
    },
  });

  console.log(`Super Admin created: ${email}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
