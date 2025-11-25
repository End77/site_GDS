import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth';
import { loadBotHistory } from '@/lib/bot-database';
import { config } from '@/config';
import { z } from 'zod';

const messagesQuerySchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val) : config.messages.pageSize),
  messageType: z.string().optional(),
  direction: z.enum(['incoming', 'outgoing']).optional(),
  search: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('session-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }

    const user = await verifySession(token);
    if (!user) {
      return NextResponse.json({ error: 'Сессия недействительна' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const queryData = Object.fromEntries(searchParams.entries());
    const { page, limit, messageType, direction, search, dateFrom, dateTo } = messagesQuerySchema.parse(queryData);

    // Получаем все сообщения для всех пользователей (для демонстрации)
    const userId = null; // Получаем все сообщения
    
    const result = await loadBotHistory(userId, user.botDatabaseId, {
      page,
      limit,
      filters: {
        messageType,
        direction,
        search,
        dateFrom,
        dateTo,
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        messages: result.messages,
        total: result.total,
        stats: result.stats,
        pagination: {
          page,
          limit,
          totalPages: Math.ceil(result.total / limit),
          hasNext: page * limit < result.total,
          hasPrev: page > 1,
        },
        databaseInfo: result.databaseInfo,
      }
    });

  } catch (error) {
    console.error('Messages API error:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}