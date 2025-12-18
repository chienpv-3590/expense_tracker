/**
 * Performance Testing Seed Script
 * Seeds 10,000+ transactions for load testing
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedPerformanceData() {
  console.log('🚀 Starting performance data seeding...');

  // Get all categories
  const categories = await prisma.category.findMany();
  
  if (categories.length === 0) {
    console.error('❌ No categories found. Please run main seed first.');
    process.exit(1);
  }

  const incomeCategories = categories.filter(c => c.type === 'income');
  const expenseCategories = categories.filter(c => c.type === 'expense');

  console.log(`📊 Found ${categories.length} categories (${incomeCategories.length} income, ${expenseCategories.length} expense)`);

  // Configuration
  const TOTAL_TRANSACTIONS = 10000;
  const BATCH_SIZE = 500;
  const START_DATE = new Date('2023-01-01');
  const END_DATE = new Date();

  // Generate realistic amounts
  const generateAmount = (type: 'income' | 'expense'): number => {
    if (type === 'income') {
      // Income: 5M - 50M VND
      return Math.floor(Math.random() * 45000000) + 5000000;
    } else {
      // Expense: 10K - 5M VND
      return Math.floor(Math.random() * 4990000) + 10000;
    }
  };

  // Generate random date between START_DATE and END_DATE
  const generateRandomDate = (): Date => {
    const start = START_DATE.getTime();
    const end = END_DATE.getTime();
    return new Date(start + Math.random() * (end - start));
  };

  // Sample descriptions
  const incomeDescriptions = [
    'Lương tháng',
    'Thưởng dự án',
    'Thu nhập phụ',
    'Làm thêm',
    'Bán đồ cũ',
    'Đầu tư',
    'Thưởng',
    null, // Some without description
  ];

  const expenseDescriptions = [
    'Mua sắm hàng ngày',
    'Ăn trưa',
    'Café',
    'Xăng xe',
    'Đi chợ',
    'Mua đồ',
    'Thanh toán hóa đơn',
    'Ăn tối',
    'Mua quà',
    'Chi phí khác',
    null, // Some without description
  ];

  console.log(`\n📝 Generating ${TOTAL_TRANSACTIONS} transactions...`);
  
  let totalCreated = 0;
  const startTime = Date.now();

  // Delete existing performance test data if any
  const existingCount = await prisma.transaction.count();
  if (existingCount > 1000) {
    console.log(`⚠️  Found ${existingCount} existing transactions. Cleaning up old performance data...`);
    // Keep only last 100 transactions
    const recentTransactions = await prisma.transaction.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      select: { id: true },
    });
    const recentIds = recentTransactions.map(t => t.id);
    
    await prisma.transaction.deleteMany({
      where: {
        id: { notIn: recentIds },
      },
    });
    console.log('✅ Cleaned up old data');
  }

  // Create transactions in batches
  for (let i = 0; i < TOTAL_TRANSACTIONS; i += BATCH_SIZE) {
    const batchSize = Math.min(BATCH_SIZE, TOTAL_TRANSACTIONS - i);
    const transactions = [];

    for (let j = 0; j < batchSize; j++) {
      // 70% expense, 30% income ratio
      const isExpense = Math.random() < 0.7;
      const type = isExpense ? 'expense' : 'income';
      
      const categoryPool = isExpense ? expenseCategories : incomeCategories;
      const category = categoryPool[Math.floor(Math.random() * categoryPool.length)];
      
      const descriptionPool = isExpense ? expenseDescriptions : incomeDescriptions;
      const description = descriptionPool[Math.floor(Math.random() * descriptionPool.length)];

      transactions.push({
        amount: generateAmount(type),
        type,
        categoryId: category.id,
        date: generateRandomDate(),
        description,
      });
    }

    // Batch insert
    await prisma.transaction.createMany({
      data: transactions,
    });

    totalCreated += batchSize;
    const progress = ((totalCreated / TOTAL_TRANSACTIONS) * 100).toFixed(1);
    process.stdout.write(`\r⏳ Progress: ${progress}% (${totalCreated}/${TOTAL_TRANSACTIONS})`);
  }

  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);

  console.log(`\n\n✅ Successfully created ${totalCreated} transactions in ${duration}s`);
  console.log(`⚡ Average: ${(totalCreated / parseFloat(duration)).toFixed(0)} transactions/second`);

  // Verify data
  const finalCount = await prisma.transaction.count();
  const incomeCount = await prisma.transaction.count({ where: { type: 'INCOME' } });
  const expenseCount = await prisma.transaction.count({ where: { type: 'EXPENSE' } });

  console.log('\n📊 Database Statistics:');
  console.log(`   Total transactions: ${finalCount}`);
  console.log(`   Income: ${incomeCount} (${((incomeCount/finalCount)*100).toFixed(1)}%)`);
  console.log(`   Expense: ${expenseCount} (${((expenseCount/finalCount)*100).toFixed(1)}%)`);

  // Calculate total amounts
  const summary = await prisma.transaction.groupBy({
    by: ['type'],
    _sum: {
      amount: true,
    },
  });

  console.log('\n💰 Financial Summary:');
  summary.forEach(item => {
    const amount = item._sum.amount || 0;
    const formatted = new Intl.NumberFormat('vi-VN').format(amount);
    console.log(`   ${item.type}: ${formatted} ₫`);
  });

  // Date range
  const oldest = await prisma.transaction.findFirst({
    orderBy: { date: 'asc' },
    select: { date: true },
  });
  const newest = await prisma.transaction.findFirst({
    orderBy: { date: 'desc' },
    select: { date: true },
  });

  console.log('\n📅 Date Range:');
  console.log(`   Oldest: ${oldest?.date.toLocaleDateString('vi-VN')}`);
  console.log(`   Newest: ${newest?.date.toLocaleDateString('vi-VN')}`);

  console.log('\n🎯 Performance testing data ready!');
  console.log('   Run the following commands to test:');
  console.log('   - npm run dev (open http://localhost:3000)');
  console.log('   - Navigate to dashboard and transactions page');
  console.log('   - Test search and filters');
  console.log('   - Export CSV');
}

seedPerformanceData()
  .catch((e) => {
    console.error('❌ Error seeding performance data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
