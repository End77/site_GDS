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

    const botManager = new BotDatabaseManager(user.botDatabaseId);
    
    // Создаем тестовые сообщения с разными sender_id для проверки обработки
    const testMessages = [
      {
        user_id: 12345,
        message_id: 1001,
        sender_id: 0,      // Будет заменен на пустую строку, а затем на 1
        message_text: 'Сообщение с sender_id = 0',
        message_type: 'text',
        content_type: 'text',
        is_media: false,
        is_bot: false,
        direction: 'incoming',
        created_at: new Date(Date.now() - 3600000).toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        user_id: 12345,
        message_id: 1002,
        sender_id: 0,     // Будет заменен на пустую строку, а затем на 1
        message_text: 'Сообщение с sender_id = 00',
        message_type: 'text',
        content_type: 'text',
        is_media: false,
        is_bot: false,
        direction: 'outgoing',
        created_at: new Date(Date.now() - 3000000).toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        user_id: 12345,
        message_id: 1003,
        sender_id: 123,   // Станет '123'
        message_text: 'Сообщение с sender_id = 00123',
        message_type: 'text',
        content_type: 'text',
        is_media: false,
        is_bot: false,
        direction: 'incoming',
        created_at: new Date(Date.now() - 2400000).toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        user_id: 12345,
        message_id: 1004,
        sender_id: 1002787335121, // Станет 'bot'
        message_text: 'Сообщение от бота (ID начинается с 100)',
        message_type: 'text',
        content_type: 'text',
        is_media: false,
        is_bot: true,
        direction: 'outgoing',
        created_at: new Date(Date.now() - 1800000).toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        user_id: 67890,
        message_id: 1005,
        sender_id: 456,    // Станет '456'
        message_text: 'Сообщение с sender_id = 0456',
        message_type: 'text',
        content_type: 'text',
        is_media: false,
        is_bot: false,
        direction: 'incoming',
        created_at: new Date(Date.now() - 1200000).toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        user_id: 67890,
        message_id: 1006,
        sender_id: 999,     // Останется '999'
        message_text: 'Обычное сообщение с sender_id = 999',
        message_type: 'text',
        content_type: 'text',
        is_media: false,
        is_bot: false,
        direction: 'outgoing',
        created_at: new Date(Date.now() - 600000).toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    // Добавляем тестовые сообщения
    for (const message of testMessages) {
      await botManager.createMessage(message);
    }

    return NextResponse.json({
      success: true,
      message: 'Тестовые данные созданы успешно',
      testMessages: testMessages.map(msg => ({
        original_sender_id: msg.sender_id,
        expected_sender_id: msg.sender_id === 0 ? '1' : 
                           msg.sender_id === 1002787335121 ? 'bot' :
                           msg.sender_id.toString(),
        text: msg.message_text
      }))
    });
    
  } catch (error) {
    console.error('Test data creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create test data' },
      { status: 500 }
    );
  }
}