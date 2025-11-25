import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth';
import { loadBotHistory } from '@/lib/bot-database';
import { z } from 'zod';

const downloadQuerySchema = z.object({
  chatId: z.string().optional(),
  senderId: z.string().optional(),
  direction: z.enum(['inbound', 'outbound', 'all']).optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  search: z.string().optional(),
  format: z.enum(['csv', 'json']).default('csv'),
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
    const { chatId, senderId, direction, dateFrom, dateTo, search, format } = downloadQuerySchema.parse(queryData);

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

    // Получаем все сообщения без пагинации для скачивания
    const userId = null;
    
    const result = await loadBotHistory(userId, user.botDatabaseId, {
      page: 1,
      limit: 10000, // Большой лимит для скачивания всех данных
      filters
    });

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }

    // Обрабатываем сообщения: убираем ведущие нули из sender_id и заменяем ID бота на "bot"
    const processedMessages = result.messages.map((msg: any) => {
      let processedSenderId = msg.sender_id.toString();
      
      // Убираем ведущие нули, но оставляем хотя бы одну цифру
      processedSenderId = processedSenderId.replace(/^0+/, '') || '0';
      
      // Заменяем 0 на 1 для корректного отображения
      if (processedSenderId === '0') {
        processedSenderId = '1';
      }
      
      // Если sender_id соответствует ID бота (большие числа или специфические ID)
      if (msg.sender_id === msg.bot_id || processedSenderId.startsWith('100') || processedSenderId.length > 10) {
        processedSenderId = 'bot';
      }
      
      return {
        ...msg,
        sender_id: processedSenderId
      };
    });

    if (format === 'json') {
      // Формат JSON
      const jsonData = {
        export_date: new Date().toISOString(),
        filters: {
          chatId: chatId || 'all',
          senderId: senderId || 'all',
          direction: direction || 'all',
          dateFrom: dateFrom || null,
          dateTo: dateTo || null,
          search: search || null
        },
        total_messages: processedMessages.length,
        messages: processedMessages
      };

      return new NextResponse(JSON.stringify(jsonData, null, 2), {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="telegram_messages_${new Date().toISOString().split('T')[0]}.json"`
        }
      });
    } else {
      // Формат CSV
      const csvHeaders = [
        'ID',
        'User ID',
        'Sender ID',
        'Message Type',
        'Content Type',
        'Text',
        'Created At',
        'Updated At'
      ];

      const csvRows = processedMessages.map((msg: any) => [
        msg.id,
        msg.user_id,
        msg.sender_id,
        msg.message_type,
        msg.content_type,
        `"${msg.text?.replace(/"/g, '""') || ''}"`,
        msg.created_at,
        msg.updated_at
      ]);

      const csvContent = [
        csvHeaders.join(','),
        ...csvRows.map(row => row.join(','))
      ].join('\n');

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="telegram_messages_${new Date().toISOString().split('T')[0]}.csv"`
        }
      });
    }
    
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: 'Failed to download messages' },
      { status: 500 }
    );
  }
}