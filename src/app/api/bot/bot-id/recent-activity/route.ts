import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth-server';
import { loadBotHistory } from '@/lib/bot-database';
import { z } from 'zod';

const querySchema = z.object({
  chatId: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    // 1. Аутентификация
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }

    const user = await verifySession(token);
    if (!user || !user.botDatabaseId) {
      return NextResponse.json({ error: 'Бот не подключен или сессия недействительна' }, { status: 401 });
    }

    // 2. Получение параметров запроса
    const { searchParams } = new URL(request.url);
    const { chatId } = querySchema.parse(Object.fromEntries(searchParams.entries()));

    // 3. Формирование фильтров
    const filters: any = {};
    if (chatId && chatId !== 'all') {
      filters.userId = parseInt(chatId);
    }

    // 4. Загрузка сообщений
    const result = await loadBotHistory(null, user.botDatabaseId, {
      page: 1,
      limit: 10, // Получаем только 10 последних
      filters,
    });

    if (result.error) {
      return NextResponse.json({ messages: [] });
    }

    // 5. Обработка сообщений (та же логика, что и в истории)
    const processedMessages = result.messages.map((msg: any) => {
      let processedSenderId = msg.sender_id.toString();
      processedSenderId = processedSenderId.replace(/^0+/, '') || '0';
      if (processedSenderId === '0') {
        processedSenderId = '1';
      }
      if (msg.sender_id === msg.bot_id || processedSenderId.startsWith('100') || processedSenderId.length > 10) {
        processedSenderId = 'bot';
      }
      return { ...msg, sender_id: processedSenderId };
    });

    return NextResponse.json({ messages: processedMessages });

  } catch (error) {
    console.error('Recent activity fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch recent activity' }, { status: 500 });
  }
}