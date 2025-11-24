import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth';
import { loadBotHistory } from '@/lib/bot-database';

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
      return NextResponse.json(
        { error: 'База данных бота не настроена' },
        { status: 400 }
      );
    }

    // Перезагружаем историю с первой страницы
    const userId = 1;
    const result = await loadBotHistory(userId, user.botDatabaseId, {
      page: 1,
      limit: 50
    });

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'История сообщений перезагружена',
      data: {
        messages: result.messages,
        total: result.total,
        stats: result.stats,
        databaseInfo: result.databaseInfo,
      }
    });

  } catch (error) {
    console.error('Messages reload error:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}