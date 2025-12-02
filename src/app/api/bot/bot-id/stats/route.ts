import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth-server';
import { loadBotHistory } from '@/lib/bot-database';

export async function GET(request: NextRequest) {
  try {
    // Получаем токен из куки
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      console.log('Токен отсутствует в запросе к /api/bot/stats');
      return NextResponse.json({ error: 'Не авторизован: отсутствует токен' }, { status: 401 });
    }

    // Проверяем валидность токена
    const user = await verifySession(token);

    if (!user) {
      console.log('Токен невалиден в запросе к /api/bot/stats');
      return NextResponse.json({ error: 'Сессия недействительна' }, { status: 401 });
    }

    if (!user.botDatabaseId) {
      return NextResponse.json({ error: 'Бот не подключен' }, { status: 400 });
    }

    // Получаем статистику по сообщениям
    const result = await loadBotHistory(null, user.botDatabaseId);

    if (result.error) {
      return NextResponse.json({
        totalMessages: 0,
        totalChats: 0,
        todayMessages: 0,
        activeUsers: 0
      });
    }

    // Считаем сообщения за сегодня
    const today = new Date().toISOString().split('T')[0];
    const todayMessages = result.messages.filter((msg: any) =>
      msg.created_at.startsWith(today)
    ).length;

    // Получаем уникальные чаты
    const uniqueChats = new Set(result.messages.map((msg: any) => msg.user_id)).size;

    // Получаем уникальных отправителей (не ботов)
    const uniqueUsers = new Set(
      result.messages
        .filter((msg: any) => !msg.is_bot)
        .map((msg: any) => msg.sender_id)
    ).size;

    return NextResponse.json({
      totalMessages: result.total,
      totalChats: uniqueChats,
      todayMessages,
      activeUsers: uniqueUsers
    });

  } catch (error) {
    console.error('Stats fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bot stats' },
      { status: 500 }
    );
  }
}