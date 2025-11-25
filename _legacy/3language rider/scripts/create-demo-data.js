const Database = require('better-sqlite3');
const { join } = require('path');
const { existsSync, mkdirSync } = require('fs');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const db = new PrismaClient();

async function createDemoData() {
  try {
    console.log('🚀 Создание демонстрационных данных...');

    // Создаем пользователей
    console.log('📝 Создание/проверка пользователей...');
    
    // Проверяем существующих пользователей
    const existingDemoUser = await db.user.findUnique({
      where: { email: 'demo@example.com' }
    });
    
    const existingSimpleUser = await db.user.findUnique({
      where: { email: 'user@example.com' }
    });

    let userWithBot, userWithoutBot;

    // Пользователь с подключенным ботом
    if (!existingDemoUser) {
      const hashedPassword1 = await bcrypt.hash('demo123', 12);
      userWithBot = await db.user.create({
        data: {
          username: 'demo_user',
          email: 'demo@example.com',
          passwordHash: hashedPassword1,
          botDatabaseId: 'demo-telegram-bot',
        },
      });
      console.log('✅ Создан пользователь с ботом:', userWithBot.email);
    } else {
      userWithBot = existingDemoUser;
      console.log('ℹ️ Пользователь с ботом уже существует:', userWithBot.email);
    }

    // Пользователь без бота
    if (!existingSimpleUser) {
      const hashedPassword2 = await bcrypt.hash('user123', 12);
      userWithoutBot = await db.user.create({
        data: {
          username: 'simple_user',
          email: 'user@example.com',
          passwordHash: hashedPassword2,
        },
      });
      console.log('✅ Создан пользователь без бота:', userWithoutBot.email);
    } else {
      userWithoutBot = existingSimpleUser;
      console.log('ℹ️ Пользователь без бота уже существует:', userWithoutBot.email);
    }

    // Создаем демонстрационную базу данных бота
    console.log('🤖 Создание базы данных бота...');
    const botDbPath = join(process.cwd(), 'bot_databases', 'demo-telegram-bot', 'telegram_bot.db');
    const botDir = join(process.cwd(), 'bot_databases', 'demo-telegram-bot');
    
    if (!existsSync(botDir)) {
      mkdirSync(botDir, { recursive: true });
    }

    const botDb = new Database(botDbPath);

    // Создаем таблицу message_history
    botDb.exec(`
      CREATE TABLE IF NOT EXISTS message_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        message_id INTEGER NOT NULL,
        sender_id INTEGER NOT NULL,
        message_text TEXT,
        message_type TEXT NOT NULL,
        media_file_id TEXT,
        is_media BOOLEAN DEFAULT FALSE,
        is_bot BOOLEAN DEFAULT FALSE,
        direction TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE INDEX IF NOT EXISTS idx_user_id ON message_history(user_id);
      CREATE INDEX IF NOT EXISTS idx_direction ON message_history(direction);
      CREATE INDEX IF NOT EXISTS idx_message_type ON message_history(message_type);
      CREATE INDEX IF NOT EXISTS idx_created_at ON message_history(created_at);
    `);

    // Вставляем демонстрационные сообщения
    console.log('💬 Добавление демонстрационных сообщений...');
    const sampleMessages = [
      {
        user_id: 1,
        message_id: 1,
        sender_id: 123456789,
        message_text: 'Здравствуйте! Я ваш Telegram бот. Чем могу помочь?',
        message_type: 'text',
        is_media: 0,
        is_bot: 1,
        direction: 'incoming',
        hours_ago: 24
      },
      {
        user_id: 1,
        message_id: 2,
        sender_id: 987654321,
        message_text: 'Привет! Расскажи о своих функциях',
        message_type: 'text',
        is_media: 0,
        is_bot: 0,
        direction: 'outgoing',
        hours_ago: 23
      },
      {
        user_id: 1,
        message_id: 3,
        sender_id: 123456789,
        message_text: 'Я могу помочь вам с:\n\n📊 Анализом данных\n🤖 Автоматизацией задач\n📝 Обработкой сообщений\n🔍 Поиском информации\n\nЧто вас интересует?',
        message_type: 'text',
        is_media: 0,
        is_bot: 1,
        direction: 'incoming',
        hours_ago: 23
      },
      {
        user_id: 1,
        message_id: 4,
        sender_id: 987654321,
        message_text: 'Интересует анализ данных. Можешь показать пример?',
        message_type: 'text',
        is_media: 0,
        is_bot: 0,
        direction: 'outgoing',
        hours_ago: 22
      },
      {
        user_id: 1,
        message_id: 5,
        sender_id: 123456789,
        message_text: 'Конечно! Вот пример анализа статистики сообщений:\n\n📈 Всего сообщений: 156\n📊 Входящие: 89\n📤 Исходящие: 67\n🖼️ Медиа: 23\n📝 Текст: 133',
        message_type: 'text',
        is_media: 0,
        is_bot: 1,
        direction: 'incoming',
        hours_ago: 22
      },
      {
        user_id: 1,
        message_id: 6,
        sender_id: 987654321,
        message_type: 'photo',
        media_file_id: 'AgACAgIAAxkDAAIBOGQexample123',
        is_media: 1,
        is_bot: 0,
        direction: 'outgoing',
        hours_ago: 21
      },
      {
        user_id: 1,
        message_id: 7,
        sender_id: 123456789,
        message_text: 'Отличное фото! Я вижу это диаграмма продаж. Анализ показывает рост на 25% по сравнению с прошлым месяцем.',
        message_type: 'text',
        is_media: 0,
        is_bot: 1,
        direction: 'incoming',
        hours_ago: 21
      },
      {
        user_id: 1,
        message_id: 8,
        sender_id: 987654321,
        message_text: 'Точно! Можешь подготовить подробный отчет?',
        message_type: 'text',
        is_media: 0,
        is_bot: 0,
        direction: 'outgoing',
        hours_ago: 20
      },
      {
        user_id: 1,
        message_id: 9,
        sender_id: 123456789,
        message_text: 'Да, конечно! Подготавливаю PDF отчет с графиками и рекомендациями. Это займет пару минут.',
        message_type: 'text',
        is_media: 0,
        is_bot: 1,
        direction: 'incoming',
        hours_ago: 20
      },
      {
        user_id: 1,
        message_id: 10,
        sender_id: 123456789,
        message_type: 'document',
        media_file_id: 'BAACAgIAAxkDAAIBOGQreport456',
        is_media: 1,
        is_bot: 1,
        direction: 'incoming',
        hours_ago: 19
      },
      {
        user_id: 1,
        message_id: 11,
        sender_id: 987654321,
        message_text: 'Спасибо! Отчет отличный! 🎉',
        message_type: 'text',
        is_media: 0,
        is_bot: 0,
        direction: 'outgoing',
        hours_ago: 19
      },
      {
        user_id: 1,
        message_id: 12,
        sender_id: 123456789,
        message_text: 'Рад помочь! Если нужны еще аналитические отчеты или данные, просто обращайтесь.',
        message_type: 'text',
        is_media: 0,
        is_bot: 1,
        direction: 'incoming',
        hours_ago: 18
      },
      {
        user_id: 1,
        message_id: 13,
        sender_id: 987654321,
        message_text: 'А какие еще функции у тебя есть?',
        message_type: 'text',
        is_media: 0,
        is_bot: 0,
        direction: 'outgoing',
        hours_ago: 17
      },
      {
        user_id: 1,
        message_id: 14,
        sender_id: 123456789,
        message_text: 'Кроме анализа данных, я могу:\n\n🔔 Отправлять уведомления\n📅 Планировать задачи\n🌐 Работать с API\n💬 Вести чат-бота\n📮 Обрабатывать почту\n\nХотите протестировать что-то конкретное?',
        message_type: 'text',
        is_media: 0,
        is_bot: 1,
        direction: 'incoming',
        hours_ago: 17
      },
      {
        user_id: 1,
        message_id: 15,
        sender_id: 987654321,
        message_text: 'Давай попробуем уведомления!',
        message_type: 'text',
        is_media: 0,
        is_bot: 0,
        direction: 'outgoing',
        hours_ago: 16
      },
      {
        user_id: 1,
        message_id: 16,
        sender_id: 123456789,
        message_text: '🔔 Настройка уведомлений активирована!\n\nТеперь я буду уведомлять вас о:\n✅ Новых сообщениях\n📊 Изменениях в статистике\n⏰ Запланированных задачах\n\nНастройки можно изменить в любой момент.',
        message_type: 'text',
        is_media: 0,
        is_bot: 1,
        direction: 'incoming',
        hours_ago: 16
      },
      {
        user_id: 1,
        message_id: 17,
        sender_id: 987654321,
        message_type: 'video',
        media_file_id: 'BAACAgIAAxkDAAIBOGQvideo789',
        is_media: 1,
        is_bot: 0,
        direction: 'outgoing',
        hours_ago: 15
      },
      {
        user_id: 1,
        message_id: 18,
        sender_id: 123456789,
        message_text: 'Отличное видео! Я проанализировал контент и могу предложить улучшить качество звука на 15%.',
        message_type: 'text',
        is_media: 0,
        is_bot: 1,
        direction: 'incoming',
        hours_ago: 15
      },
      {
        user_id: 1,
        message_id: 19,
        sender_id: 987654321,
        message_text: 'Вау, ты можешь анализировать видео? 😮',
        message_type: 'text',
        is_media: 0,
        is_bot: 0,
        direction: 'outgoing',
        hours_ago: 14
      },
      {
        user_id: 1,
        message_id: 20,
        sender_id: 123456789,
        message_text: 'Да! Я использую передовые алгоритмы для анализа медиафайлов. Могу определять объекты, текст, качество и многое другое.',
        message_type: 'text',
        is_media: 0,
        is_bot: 1,
        direction: 'incoming',
        hours_ago: 14
      }
    ];

    const insertStmt = botDb.prepare(`
      INSERT INTO message_history (
        user_id, message_id, sender_id, message_text, message_type, 
        media_file_id, is_media, is_bot, direction, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    sampleMessages.forEach((msg) => {
      const createdAt = new Date(Date.now() - msg.hours_ago * 3600000).toISOString();
      insertStmt.run(
        msg.user_id,
        msg.message_id,
        msg.sender_id,
        msg.message_text,
        msg.message_type,
        msg.media_file_id || null,
        msg.is_media,
        msg.is_bot,
        msg.direction,
        createdAt
      );
    });

    botDb.close();
    console.log('✅ База данных бота создана успешно!');

    // Создаем еще одну тестовую базу с другим ID для демонстрации
    console.log('🤖 Создание второй тестовой базы...');
    const botDbPath2 = join(process.cwd(), 'bot_databases', 'test-bot-2', 'telegram_bot.db');
    const botDir2 = join(process.cwd(), 'bot_databases', 'test-bot-2');
    
    if (!existsSync(botDir2)) {
      mkdirSync(botDir2, { recursive: true });
    }

    const botDb2 = new Database(botDbPath2);
    botDb2.exec(`
      CREATE TABLE IF NOT EXISTS message_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        message_id INTEGER NOT NULL,
        sender_id INTEGER NOT NULL,
        message_text TEXT,
        message_type TEXT NOT NULL,
        media_file_id TEXT,
        is_media BOOLEAN DEFAULT FALSE,
        is_bot BOOLEAN DEFAULT FALSE,
        direction TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Добавляем несколько сообщений во вторую базу
    const insertStmt2 = botDb2.prepare(`
      INSERT INTO message_history (
        user_id, message_id, sender_id, message_text, message_type, 
        media_file_id, is_media, is_bot, direction, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const testMessages2 = [
      {
        user_id: 1,
        message_id: 1,
        sender_id: 555666777,
        message_text: 'Привет! Это второй тестовый бот.',
        message_type: 'text',
        is_media: 0,
        is_bot: 1,
        direction: 'incoming',
        hours_ago: 5
      },
      {
        user_id: 1,
        message_id: 2,
        sender_id: 999888777,
        message_text: 'Привет! Чем отличаешься от первого бота?',
        message_type: 'text',
        is_media: 0,
        is_bot: 0,
        direction: 'outgoing',
        hours_ago: 4
      },
      {
        user_id: 1,
        message_id: 3,
        sender_id: 555666777,
        message_text: 'Я специализированный бот для тестирования системы. У меня меньше функций, но я работаю быстрее!',
        message_type: 'text',
        is_media: 0,
        is_bot: 1,
        direction: 'incoming',
        hours_ago: 4
      }
    ];

    testMessages2.forEach((msg) => {
      const createdAt = new Date(Date.now() - msg.hours_ago * 3600000).toISOString();
      insertStmt2.run(
        msg.user_id,
        msg.message_id,
        msg.sender_id,
        msg.message_text,
        msg.message_type,
        msg.media_file_id || null,
        msg.is_media,
        msg.is_bot,
        msg.direction,
        createdAt
      );
    });

    botDb2.close();
    console.log('✅ Вторая тестовая база создана!');

    console.log('\n🎉 Демонстрационные данные созданы успешно!');
    console.log('\n📋 Данные для входа:');
    console.log('🔹 Пользователь с ботом:');
    console.log('   Email: demo@example.com');
    console.log('   Пароль: demo123');
    console.log('   Bot Database ID: demo-telegram-bot');
    console.log('\n🔹 Пользователь без бота:');
    console.log('   Email: user@example.com');
    console.log('   Пароль: user123');
    console.log('\n🔹 Дополнительный тестовый бот:');
    console.log('   Bot Database ID: test-bot-2');
    console.log('\n📁 Созданы базы данных:');
    console.log('   ./bot_databases/demo-telegram-bot/telegram_bot.db (20 сообщений)');
    console.log('   ./bot_databases/test-bot-2/telegram_bot.db (3 сообщения)');

  } catch (error) {
    console.error('❌ Ошибка при создании демонстрационных данных:', error);
  } finally {
    await db.$disconnect();
    process.exit(0);
  }
}

createDemoData();