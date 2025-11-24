import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth';
import { saveBotMessage } from '@/lib/bot-database';

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

    // Используем userId = 1 для совместимости
    const userId = 1;
    
    // Тестовые сообщения для демонстрации
    const testMessages = [
      {
        user_id: 12345,
        sender_id: 12345,
        message_text: 'Здравствуйте! У меня есть вопрос по вашим услугам',
        message_type: 'text',
        is_media: false,
        is_bot: false,
        direction: 'incoming',
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 часа назад
      },
      {
        user_id: 12345,
        sender_id: 12345,
        message_text: 'Меня интересует стоимость консультации',
        message_type: 'text',
        is_media: false,
        is_bot: false,
        direction: 'incoming',
        created_at: new Date(Date.now() - 1.9 * 60 * 60 * 1000).toISOString() // 1.9 часа назад
      },
      {
        user_id: 67890,
        sender_id: 67890,
        message_text: 'Добрый день! Хочу записаться на прием',
        message_type: 'text',
        is_media: false,
        is_bot: false,
        direction: 'incoming',
        created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() // 3 часа назад
      },
      {
        user_id: 67890,
        sender_id: 67890,
        message_text: 'Когда у вас есть свободное время на завтра?',
        message_type: 'text',
        is_media: false,
        is_bot: false,
        direction: 'incoming',
        created_at: new Date(Date.now() - 2.8 * 60 * 60 * 1000).toISOString() // 2.8 часа назад
      },
      {
        user_id: 11111,
        sender_id: 11111,
        message_text: 'Ողջույն Ինչպե՞ս կարող եմ օգնել',
        message_type: 'text',
        is_media: false,
        is_bot: false,
        direction: 'incoming',
        created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() // 5 часов назад
      },
      {
        user_id: 22222,
        sender_id: 22222,
        message_text: 'Hello! I need information about your services',
        message_type: 'text',
        is_media: false,
        is_bot: false,
        direction: 'incoming',
        created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString() // 6 часов назад
      },
      {
        user_id: 22222,
        sender_id: 22222,
        message_text: 'Do you have English-speaking support?',
        message_type: 'text',
        is_media: false,
        is_bot: false,
        direction: 'incoming',
        created_at: new Date(Date.now() - 5.8 * 60 * 60 * 1000).toISOString() // 5.8 часов назад
      },
      {
        user_id: 33333,
        sender_id: 33333,
        message_text: 'Посоветуйте, пожалуйста, хороший ресторан в центре',
        message_type: 'text',
        is_media: false,
        is_bot: false,
        direction: 'incoming',
        created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString() // 8 часов назад
      },
      {
        user_id: 44444,
        sender_id: 44444,
        message_text: 'Спасибо за предыдущую консультацию, все помогло!',
        message_type: 'text',
        is_media: false,
        is_bot: false,
        direction: 'incoming',
        created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() // 12 часов назад
      },
      {
        user_id: 55555,
        sender_id: 55555,
        message_text: 'Есть ли у вас скидки для постоянных клиентов?',
        message_type: 'text',
        is_media: false,
        is_bot: false,
        direction: 'incoming',
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 24 часа назад
      },
      {
        user_id: 66666,
        sender_id: 66666,
        message_text: 'Подскажите, пожалуйста, как работает ваша система',
        message_type: 'text',
        is_media: false,
        is_bot: false,
        direction: 'incoming',
        created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString() // 48 часов назад
      },
      {
        user_id: 77777,
        sender_id: 77777,
        message_text: 'Хочу оставить отзыв о вашей работе - все отлично!',
        message_type: 'text',
        is_media: false,
        is_bot: false,
        direction: 'incoming',
        created_at: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString() // 72 часа назад
      }
    ];

    // Добавляем сообщения в базу данных
    const savedMessages = [];
    for (const message of testMessages) {
      const savedMessage = await saveBotMessage(userId, user.botDatabaseId!, message);
      savedMessages.push(savedMessage);
    }

    return NextResponse.json({
      success: true,
      message: `Добавлено ${savedMessages.length} тестовых сообщений`,
      data: {
        count: savedMessages.length,
        messages: savedMessages.map(msg => ({
          id: msg.id,
          user_id: msg.user_id,
          message_text: msg.message_text?.substring(0, 50) + '...',
          created_at: msg.created_at
        }))
      }
    });

  } catch (error) {
    console.error('Seed messages API error:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}