import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const defaultCategories = [
  // Income categories
  { name: 'Lương', type: 'income' },
  { name: 'Thu nhập khác', type: 'income' },

  // Expense categories
  { name: 'Ăn uống', type: 'expense' },
  { name: 'Di chuyển', type: 'expense' },
  { name: 'Giải trí', type: 'expense' },
  { name: 'Hóa đơn', type: 'expense' },
  { name: 'Mua sắm', type: 'expense' },
  { name: 'Y tế', type: 'expense' },
  { name: 'Chi phí khác', type: 'expense' },
];

async function main() {
  console.log('Start seeding...');

  for (const category of defaultCategories) {
    const result = await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
    console.log(`Created/Updated category: ${result.name}`);
  }

  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
