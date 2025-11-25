import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const db = new PrismaClient()

async function createDemoUsers() {
  try {
    console.log('Creating demo users...')

    // Создаем администратора
    const adminPassword = await bcrypt.hash('admin123', 10)
    const admin = await db.user.upsert({
      where: { email: 'admin@gds.com' },
      update: {},
      create: {
        username: 'Administrator',
        email: 'admin@gds.com',
        passwordHash: adminPassword,
        role: 'admin',
        company: 'Gentle Droid Solutions'
      }
    })

    // Создаем обычного пользователя
    const userPassword = await bcrypt.hash('user123', 10)
    const user = await db.user.upsert({
      where: { email: 'user@gds.com' },
      update: {},
      create: {
        username: 'Demo User',
        email: 'user@gds.com',
        passwordHash: userPassword,
        role: 'user',
        company: 'Gentle Droid Solutions'
      }
    })

    // Создаем еще одного пользователя для теста чата
    const user2Password = await bcrypt.hash('user123', 10)
    const user2 = await db.user.upsert({
      where: { email: 'user2@gds.com' },
      update: {},
      create: {
        username: 'Test User',
        email: 'user2@gds.com',
        passwordHash: user2Password,
        role: 'user',
        company: 'Gentle Droid Solutions'
      }
    })

    console.log('Demo users created successfully:')
    console.log('Admin:', admin)
    console.log('User 1:', user)
    console.log('User 2:', user2)

    // Создаем настройки бота
    await db.botSettings.upsert({
      where: { key: 'bot_token' },
      update: {},
      create: {
        key: 'bot_token',
        value: 'YOUR_BOT_TOKEN_HERE',
        description: 'Telegram Bot API Token'
      }
    })

    await db.botSettings.upsert({
      where: { key: 'bot_language' },
      update: {},
      create: {
        key: 'bot_language',
        value: 'ru',
        description: 'Default bot language'
      }
    })

    console.log('Bot settings created')

  } catch (error) {
    console.error('Error creating demo users:', error)
  } finally {
    await db.$disconnect()
  }
}

createDemoUsers()