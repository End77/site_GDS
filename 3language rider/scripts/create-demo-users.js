const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createDemoUsers() {
  try {
    // Create user without bot database (for testing scenario 1)
    const userWithoutBot = await prisma.user.upsert({
      where: { email: 'user1@example.com' },
      update: {},
      create: {
        username: 'user1',
        email: 'user1@example.com',
        passwordHash: await bcrypt.hash('password123', 12),
      },
    });

    // Create user with bot database (for testing scenario 2)
    const userWithBot = await prisma.user.upsert({
      where: { email: 'user2@example.com' },
      update: {},
      create: {
        username: 'user2',
        email: 'user2@example.com',
        passwordHash: await bcrypt.hash('password123', 12),
        botDatabaseId: 'demo-bot',
      },
    });

    console.log('Demo users created successfully!');
    console.log('User 1 (no bot): user1@example.com / password123');
    console.log('User 2 (with bot): user2@example.com / password123');
    console.log('Bot Database ID for user2: demo-bot');
    
  } catch (error) {
    console.error('Error creating demo users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createDemoUsers();