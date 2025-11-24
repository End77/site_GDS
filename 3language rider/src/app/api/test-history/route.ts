import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth';
import { BotDatabaseManager } from '@/lib/bot-database';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('session-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }

    const user = await verifySession(token);
    if (!user) {
      return NextResponse.json({ error: 'Сессия недействительна' }, { status: 401 });
    }

    if (!user.botDatabaseId) {
      return NextResponse.json({ error: 'Бот не подключен' }, { status: 400 });
    }

    const botDb = new BotDatabaseManager(user.botDatabaseId);
    await botDb.initialize();

    // Создаем тестовые сообщения
    const testMessages = [
      {
        user_id: 12345,
        message_id: 1001,
        sender_id: 12345,
        message_text: 'Привет! Как дела?',
        message_type: 'text',
        media_file_id: null,
        is_media: false,
        is_bot: false,
        direction: 'incoming',
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 часа назад
      },
      {
        user_id: 12345,
        message_id: 1002,
        sender_id: 1,
        message_text: 'Здравствуйте! У меня все отлично, спасибо! Как я могу вам помочь?',
        message_type: 'text',
        media_file_id: null,
        is_media: false,
        is_bot: true,
        direction: 'outgoing',
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000 + 30000).toISOString(), // 2 часа назад + 30 секунд
      },
      {
        user_id: 67890,
        message_id: 1003,
        sender_id: 67890,
        message_text: 'Какая погода сегодня?',
        message_type: 'text',
        media_file_id: null,
        is_media: false,
        is_bot: false,
        direction: 'incoming',
        created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1 час назад
      },
      {
        user_id: 67890,
        message_id: 1004,
        sender_id: 1,
        message_text: 'Сегодня солнечно, температура +25°C. Отличный день для прогулки!',
        message_type: 'text',
        media_file_id: null,
        is_media: false,
        is_bot: true,
        direction: 'outgoing',
        created_at: new Date(Date.now() - 60 * 60 * 1000 + 45000).toISOString(), // 1 час назад + 45 секунд
      },
      {
        user_id: 12345,
        message_id: 1005,
        sender_id: 12345,
        message_text: 'Помоги мне с задачей',
        message_type: 'text',
        media_file_id: null,
        is_media: false,
        is_bot: false,
        direction: 'incoming',
        created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 минут назад
      },
      {
        user_id: 11111,
        message_id: 1006,
        sender_id: 11111,
        message_text: 'Отправь картинку',
        message_type: 'photo',
        media_file_id: 'Abc123PhotoId',
        is_media: true,
        is_bot: false,
        direction: 'incoming',
        created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 минут назад
      },
      {
        user_id: 11111,
        message_id: 1007,
        sender_id: 1,
        message_text: 'К сожалению, я не могу отправлять изображения, но могу помочь найти их в интернете!',
        message_type: 'text',
        media_file_id: null,
        is_media: false,
        is_bot: true,
        direction: 'outgoing',
        created_at: new Date(Date.now() - 15 * 60 * 1000 + 20000).toISOString(), // 15 минут назад + 20 секунд
      },
      {
        user_id: 12345,
        message_id: 1008,
        sender_id: 12345,
        message_text: 'Спасибо за помощь!',
        message_type: 'text',
        media_file_id: null,
        is_media: false,
        is_bot: false,
        direction: 'incoming',
        created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 минут назад
      },
    ];

    // Вставляем тестовые данные
    for (const message of testMessages) {
      await botDb.createMessage(message);
    }

    await botDb.close();

    return NextResponse.json({
      success: true,
      message: 'Тестовые данные для истории созданы',
      count: testMessages.length
    });

  } catch (error) {
    console.error('Test history creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create test history data' },
      { status: 500 }
    );
  }
}