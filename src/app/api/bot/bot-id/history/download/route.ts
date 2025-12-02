import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth-server';
import { loadBotHistory } from '@/lib/bot-database';
import { z } from 'zod';

const downloadQuerySchema = z.object({
  format: z.enum(['csv', 'json']).default('csv'),
  chatId: z.string().optional(),
  senderId: z.string().optional(),
  direction: z.enum(['incoming', 'outgoing', 'all']).optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  search: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    // Получаем токен из куки
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      console.log('Токен отсутствует в запросе к /api/bot/bot-id/history/download');
      return NextResponse.json({ error: 'Не авторизован: отсутствует токен' }, { status: 401 });
    }

    // Проверяем валидность токена
    const user = await verifySession(token);

    if (!user) {
      console.log('Токен невалиден в запросе к /api/bot/bot-id/history/download');
      return NextResponse.json({ error: 'Сессия недействительна' }, { status: 401 });
    }

    if (!user.botDatabaseId) {
      return NextResponse.json({ error: 'Бот не подключен' }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const queryData = Object.fromEntries(searchParams.entries());
    const { format, chatId, senderId, direction, dateFrom, dateTo, search } = downloadQuerySchema.parse(queryData);

    // Преобразуем фильтры в формат для loadBotHistory
    const filters: any = {};

    if (chatId && chatId !== 'all') {
      filters.userId = parseInt(chatId);
    }

    if (senderId && senderId !== 'all') {
      filters.senderId = parseInt(senderId);
    }

    if (direction && direction !== 'all') {
      filters.direction = direction;
    }

    if (dateFrom) {
      filters.dateFrom = dateFrom;
    }

    if (dateTo) {
      filters.dateTo = dateTo;
    }

    if (search) {
      filters.search = search;
    }

    // Получаем все сообщения (без пагинации для экспорта)
    const userId = null;

    const result = await loadBotHistory(userId, user.botDatabaseId, {
      page: 1,
      limit: 10000, // Большой лимит для экспорта
      filters
    });

    if (result.error || !result.messages.length) {
      return NextResponse.json({ error: 'Нет данных для экспорта' }, { status: 404 });
    }

    if (format === 'json') {
      return new NextResponse(JSON.stringify(result.messages, null, 2), {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="bot-messages-${new Date().toISOString().split('T')[0]}.json"`
        }
      });
    }

    // Формат CSV
    const headers = [
      'ID', 'User ID', 'Message ID', 'Sender ID', 'Message Text',
      'Message Type', 'Media File ID', 'Is Media', 'Is Bot',
      'Direction', 'Created At'
    ];

    const csvRows = [
      headers.join(','),
      ...result.messages.map((msg: any) => [
        msg.id,
        msg.user_id,
        msg.message_id,
        msg.sender_id,
        `"${(msg.message_text || '').replace(/"/g, '""')}"`, // Экранирование кавычек
        msg.message_type,
        msg.media_file_id || '',
        msg.is_media ? 'Yes' : 'No',
        msg.is_bot ? 'Yes' : 'No',
        msg.direction,
        msg.created_at
      ].join(','))
    ];

    return new NextResponse(csvRows.join('\n'), {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="bot-messages-${new Date().toISOString().split('T')[0]}.csv"`
      }
    });

  } catch (error) {
    console.error('History download error:', error);
    return NextResponse.json(
      { error: 'Failed to download message history' },
      { status: 500 }
    );
  }
}