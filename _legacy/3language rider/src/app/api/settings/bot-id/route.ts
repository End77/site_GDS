import { NextRequest, NextResponse } from 'next/server';
import { verifySession, updateUserBotDatabaseId } from '@/lib/auth';
import { createBotDatabaseManager, validateBotDatabaseId } from '@/lib/bot-database';
import { z } from 'zod';

const updateBotIdSchema = z.object({
  botDatabaseId: z.string().nullable().optional(),
});

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

    const body = await request.json();
    const { botDatabaseId } = updateBotIdSchema.parse(body);

    // Валидация botDatabaseId если он предоставлен
    if (botDatabaseId && !validateBotDatabaseId(botDatabaseId)) {
      return NextResponse.json(
        { error: 'Неверный формат ID базы данных. Используйте только буквы, цифры и дефисы (минимум 3 символа)' },
        { status: 400 }
      );
    }

    // Проверка существования базы данных если указан ID
    if (botDatabaseId) {
      const botDb = createBotDatabaseManager(botDatabaseId);
      const dbInfo = botDb.getDatabaseInfo();

      if (!dbInfo.exists) {
        return NextResponse.json(
          { error: `База данных не найдена по пути: ${dbInfo.path}` },
          { status: 404 }
        );
      }

      if (!dbInfo.hasTable) {
        return NextResponse.json(
          { error: 'В базе данных отсутствует таблица message_history' },
          { status: 404 }
        );
      }
    }

    // Обновляем bot_database_id пользователя
    const updatedUser = await updateUserBotDatabaseId(user.id, botDatabaseId);

    return NextResponse.json({
      success: true,
      message: botDatabaseId
        ? 'База данных бота успешно подключена'
        : 'Подключение к базе данных бота отключено',
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        botDatabaseId: updatedUser.botDatabaseId,
      }
    });

  } catch (error) {
    console.error('Settings bot-id error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Ошибка валидации', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}


export async function GET(request: NextRequest) {
  console.log('=> GET /api/auth/me called'); // Лог 1
  }