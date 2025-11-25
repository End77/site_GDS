import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth';
import { loadBotHistory } from '@/lib/bot-database';
import { config } from '@/config';
import { z } from 'zod';

const exportQuerySchema = z.object({
  chatId: z.string().optional(),
  senderId: z.string().optional(),
  direction: z.enum(['inbound', 'outbound', 'all']).optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  search: z.string().optional(),
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

    if (!user.botDatabaseId) {
      return NextResponse.json({ error: 'Бот не подключен' }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const queryData = Object.fromEntries(searchParams.entries());
    const { chatId, senderId, direction, dateFrom, dateTo, search } = exportQuerySchema.parse(queryData);

    // Преобразуем фильтры в формат для loadBotHistory
    const filters: any = {};
    
    if (chatId && chatId !== 'all') {
      filters.userId = parseInt(chatId);
    }
    
    if (senderId && senderId !== 'all') {
      filters.senderId = parseInt(senderId);
    }
    
    if (direction && direction !== 'all') {
      filters.direction = direction === 'inbound' ? 'incoming' : 'outgoing';
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

    // Если есть ошибка, возвращаем пустой CSV
    if (result.error || !result.messages || result.messages.length === 0) {
      const emptyCsv = 'ID,User ID,Message ID,Sender ID,Message Text,Message Type,Media File ID,Is Media,Is Bot,Direction,Created At\n';
      return new NextResponse(emptyCsv, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="message-history-${new Date().toISOString().split('T')[0]}.csv"`
        }
      });
    }

    // Формирование CSV
    const csvHeaders = [
      'ID',
      'User ID',
      'Message ID',
      'Sender ID',
      'Message Text',
      'Message Type',
      'Media File ID',
      'Is Media',
      'Is Bot',
      'Direction',
      'Created At'
    ];
    
    const csvRows = result.messages.map((msg: any) => [
      msg.id.toString(),
      msg.user_id.toString(),
      msg.message_id.toString(),
      msg.sender_id.toString(),
      `"${(msg.message_text || '').replace(/"/g, '""')}"`, // Экранирование кавычек в CSV
      msg.message_type,
      `"${(msg.media_file_id || '').replace(/"/g, '""')}"`,
      msg.is_media ? 'true' : 'false',
      msg.is_bot ? 'true' : 'false',
      msg.direction,
      new Date(msg.created_at).toISOString()
    ]);
    
    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => row.join(','))
    ].join('\n');
    
    // Возвращаем CSV файл
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="message-history-${new Date().toISOString().split('T')[0]}.csv"`
      }
    });
    
  } catch (error) {
    console.error('History export error:', error);
    return NextResponse.json(
      { error: 'Failed to export message history' },
      { status: 500 }
    );
  }
}