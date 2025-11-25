import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

async function createDemoChatMessages() {
  try {
    console.log('Creating demo chat messages...')

    // Получаем пользователей
    const users = await db.user.findMany()
    
    if (users.length < 2) {
      console.log('Need at least 2 users to create demo messages')
      return
    }

    const admin = users.find(u => u.role === 'admin')
    const user1 = users.find(u => u.email === 'user@gds.com')
    const user2 = users.find(u => u.email === 'user2@gds.com')

    if (!admin || !user1 || !user2) {
      console.log('Required users not found')
      return
    }

    // Создаем демо-сообщения
    const demoMessages = [
      {
        fromUserId: admin.id,
        toUserId: user1.id,
        text: 'Добро пожаловать в систему!',
        messageType: 'text',
        direction: 'outgoing'
      },
      {
        fromUserId: user1.id,
        toUserId: admin.id,
        text: 'Спасибо! Рад быть здесь.',
        messageType: 'text',
        direction: 'outgoing'
      },
      {
        fromUserId: user1.id,
        toUserId: user2.id,
        text: 'Привет! Как дела?',
        messageType: 'text',
        direction: 'outgoing'
      },
      {
        fromUserId: user2.id,
        toUserId: user1.id,
        text: 'Привет! Отлично, спасибо. А у тебя?',
        messageType: 'text',
        direction: 'outgoing'
      },
      {
        fromUserId: user1.id,
        toUserId: user2.id,
        text: 'Тоже хорошо. Проверяю новый чат.',
        messageType: 'text',
        direction: 'outgoing'
      },
      {
        fromUserId: user2.id,
        toUserId: user1.id,
        text: 'Классная система! Очень удобно.',
        messageType: 'text',
        direction: 'outgoing'
      },
      {
        fromUserId: admin.id,
        toUserId: user2.id,
        text: 'Не забудьте про Telegram Bot',
        messageType: 'text',
        direction: 'outgoing'
      },
      {
        fromUserId: user2.id,
        toUserId: admin.id,
        text: 'Обязательно посмотрю!',
        messageType: 'text',
        direction: 'outgoing'
      }
    ]

    for (const msg of demoMessages) {
      await db.message.create({
        data: {
          ...msg,
          createdAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000) // Случайное время за последние 24 часа
        }
      })
    }

    console.log('Demo chat messages created successfully')

  } catch (error) {
    console.error('Error creating demo chat messages:', error)
  } finally {
    await db.$disconnect()
  }
}

createDemoChatMessages()