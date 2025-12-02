import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth-server';
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

export async function GET(request: NextRequest) {
  try {
    // Получаем токен из куки
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      console.log('Токен отсутствует в запросе к /api/bot/bot-id/history');
      return NextResponse.json({ error: 'Не авторизован: отсутствует токен' }, { status: 401 });
    }

    // Проверяем валидность токена
    const user = await verifySession(token);

    if (!user) {
      console.log('Токен невалиден в запросе к /api/bot/bot-id/history');
      return NextResponse.json({ error: 'Сессия недействительна' }, { status: 401 });
    }

    if (!user.botDatabaseId) {
      return NextResponse.json({ error: 'Бот не подключен' }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const queryData = Object.fromEntries(searchParams.entries());
    const { page, limit, chatId, senderId, direction, dateFrom, dateTo, search } = historyQuerySchema.parse(queryData);

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

    // Получаем все сообщения (для всех пользователей)
    const userId = null;
    
    const result = await loadBotHistory(userId, user.botDatabaseId, {
      page,
      limit,
      filters
    });

    // Если есть ошибка (например, БД не найдена), возвращаем пустые данные
    if (result.error) {
      return NextResponse.json({
        messages: [],
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false
        },
        filters: {
          chats: [],
          senders: []
        }
      });
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

    // Группируем сообщения для фильтров
    const chatsMap = new Map();
    const sendersMap = new Map();
    
    processedMessages.forEach((msg: any) => {
      // Группировка по чатам (user_id)
      const chatKey = msg.user_id.toString();
      if (!chatsMap.has(chatKey)) {
        chatsMap.set(chatKey, {
          chat_id: chatKey,
          last_message_date: msg.created_at,
          message_count: 0,
          last_message: msg.message_text || 'Медиа файл'
        });
      }
      chatsMap.get(chatKey).message_count++;
      if (new Date(msg.created_at) > new Date(chatsMap.get(chatKey).last_message_date)) {
        chatsMap.get(chatKey).last_message_date = msg.created_at;
        chatsMap.get(chatKey).last_message = msg.message_text || 'Медиа файл';
      }
      
      // Группировка по отправителям (с уже обработанными sender_id)
      const senderKey = msg.sender_id;
      if (!sendersMap.has(senderKey)) {
        sendersMap.set(senderKey, {
          sender_id: senderKey,
          message_count: 0,
          last_message_date: msg.created_at
        });
      }
      sendersMap.get(senderKey).message_count++;
      if (new Date(msg.created_at) > new Date(sendersMap.get(senderKey).last_message_date)) {
        sendersMap.get(senderKey).last_message_date = msg.created_at;
      }
    });

    const chats = Array.from(chatsMap.values()).sort((a, b) => 
      new Date(b.last_message_date).getTime() - new Date(a.last_message_date).getTime()
    );
    
    const senders = Array.from(sendersMap.values()).sort((a, b) => 
      new Date(b.last_message_date).getTime() - new Date(a.last_message_date).getTime()
    );

    return NextResponse.json({
      messages: processedMessages,
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
        hasNext: page * limit < result.total,
        hasPrev: page > 1
      },
      filters: {
        chats,
        senders
      }
    });
    
  } catch (error) {
    console.error('History fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch message history' },
      { status: 500 }
    );
  }
}