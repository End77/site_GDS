import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

async function createDemoBotData() {
  try {
    console.log('Creating demo bot data...')

    // Создаем демо-пользователей бота
    const botUser1 = await db.botUser.upsert({
      where: { telegramId: 123456789 },
      update: {},
      create: {
        telegramId: 123456789,
        username: 'john_doe',
        firstName: 'John',
        lastName: 'Doe',
        isActive: true
      }
    })

    const botUser2 = await db.botUser.upsert({
      where: { telegramId: 987654321 },
      update: {},
      create: {
        telegramId: 987654321,
        username: 'alice_smith',
        firstName: 'Alice',
        lastName: 'Smith',
        isActive: true
      }
    })

    const botUser3 = await db.botUser.upsert({
      where: { telegramId: 555666777 },
      update: {},
      create: {
        telegramId: 555666777,
        username: 'bob_wilson',
        firstName: 'Bob',
        lastName: 'Wilson',
        isActive: false
      }
    })

    console.log('Bot users created:', { botUser1, botUser2, botUser3 })

    // Создаем демо-сообщения бота
    const demoMessages = [
      {
        userId: botUser1.id,
        messageId: 1001,
        senderId: 123456789,
        messageText: 'Hello, bot!',
        messageType: 'text',
        isMedia: false,
        isBot: false,
        direction: 'incoming'
      },
      {
        userId: botUser1.id,
        messageId: 1002,
        senderId: 987654321, // Bot ID
        messageText: 'Hello! How can I help you today?',
        messageType: 'text',
        isMedia: false,
        isBot: true,
        direction: 'outgoing'
      },
      {
        userId: botUser2.id,
        messageId: 1003,
        senderId: 987654321,
        messageText: 'Привет! Я многоязычный бот.',
        messageType: 'text',
        isMedia: false,
        isBot: true,
        direction: 'outgoing'
      },
      {
        userId: botUser2.id,
        messageId: 1004,
        senderId: 987654321,
        messageText: 'Bonjour! Je suis un bot multilingue.',
        messageType: 'text',
        isMedia: false,
        isBot: true,
        direction: 'outgoing'
      },
      {
        userId: botUser3.id,
        messageId: 1005,
        senderId: 555666777,
        messageText: 'What languages do you support?',
        messageType: 'text',
        isMedia: false,
        isBot: false,
        direction: 'incoming'
      },
      {
        userId: botUser3.id,
        messageId: 1006,
        senderId: 987654321,
        messageText: 'I support Russian, English, and Armenian!',
        messageType: 'text',
        isMedia: false,
        isBot: true,
        direction: 'outgoing'
      }
    ]

    for (const msg of demoMessages) {
      await db.botMessage.create({
        data: {
          ...msg,
          createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Случайное время за последнюю неделю
        }
      })
    }

    console.log('Demo bot messages created')

    // Создаем статистику
    await db.botStats.upsert({
      where: { 
        date: new Date(new Date().setHours(0, 0, 0, 0)) 
      },
      update: {
        totalUsers: 3,
        activeUsers: 2,
        totalMessages: 6,
        incomingMessages: 2,
        outgoingMessages: 4
      },
      create: {
        date: new Date(new Date().setHours(0, 0, 0, 0)),
        totalUsers: 3,
        activeUsers: 2,
        totalMessages: 6,
        incomingMessages: 2,
        outgoingMessages: 4
      }
    })

    console.log('Bot stats created')

  } catch (error) {
    console.error('Error creating demo bot data:', error)
  } finally {
    await db.$disconnect()
  }
}

createDemoBotData()