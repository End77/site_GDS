import { NextRequest, NextResponse } from 'next/server';
import { User } from '@/lib/auth-server';
import { loadBotHistory } from '@/lib/bot-database';
import { z } from 'zod';

const historyQuerySchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val) : 50),
  chatId: z.string().optional(),
  senderId: z.string().optional(),
  direction: z.enum(['incoming', 'outgoing', 'all']).optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  search: z.string().optional(),
});

export async function handleHistoryAction(
  request: NextRequest,
  user: User,
  botType: 'telegram' | 'whatsapp'
) {
  if (!user.botDatabaseId) {
    return NextResponse.json({ error: 'Бот не подключен' }, { status: 400 });
  }

  const { searchParams } = new URL(request.url);
  const queryData = Object.fromEntries(searchParams.entries());
  const { page, limit, chatId, senderId, direction, dateFrom, dateTo, search } = historyQuerySchema.parse(queryData);

  const filters: any = {};
  if (chatId && chatId !== 'all') filters.userId = parseInt(chatId);
  if (senderId && senderId !== 'all') filters.senderId = parseInt(senderId);
  if (direction && direction !== 'all') filters.direction = direction;
  if (dateFrom) filters.dateFrom = dateFrom;
  if (dateTo) filters.dateTo = dateTo;
  if (search) filters.search = search;

  const result = await loadBotHistory(null, user.botDatabaseId, { page, limit, filters });

  if (result.error) {
    return NextResponse.json({ messages: [], pagination: { /*...*/ }, filters: { /*...*/ } });
  }

  // --- Здесь можно добавить логику, специфичную для botType ---
  // Например, по-разному обрабатывать сообщения для Telegram и WhatsApp
  // const processedMessages = botType === 'telegram' ? processTelegramMessages(result.messages) : processWhatsAppMessages(result.messages);
  // Пока оставим общую логику

  const processedMessages = result.messages.map((msg: any) => {
    // ... ваша логика обработки сообщений (убрать нули, заменить на 'bot' и т.д.)
    // ...
  });

  // ... ваша логика группировки для фильтров
  // ...

  return NextResponse.json({
    messages: processedMessages,
    pagination: { /*...*/ },
    filters: { /*...*/ }
  });
}