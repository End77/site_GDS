import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createBotDatabaseManager, validateBotDatabaseId } from '@/lib/bot-database';
import { verifySession, updateUserBotDatabaseId } from '@/lib/auth-server'; // <-- Импортируем updateUserBotDatabaseId

const validateBotIdSchema = z.object({
  botDatabaseId: z.string().min(1, 'ID базы данных не может быть пустым'),
});

export async function POST(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Не авторизован: отсутствует токен сессии' }, { status: 401 });
  }

  try {
    // 1. Проверяем сессию и получаем пользователя
    const user = await verifySession(token);

    if (!user) {
      return NextResponse.json({ error: 'Сессия недействительна' }, { status: 401 });
    }

    const body = await request.json();
    const { botDatabaseId } = validateBotIdSchema.parse(body);

    // 2. Валидация формата
    if (!validateBotDatabaseId(botDatabaseId)) {
      return NextResponse.json(
        { error: 'Неверный формат ID базы данных. Используйте только буквы, цифры и дефисы (минимум 3 символа)' },
        { status: 400 }
      );
    }

    // 3. Проверка существования базы данных
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

    // 4. !!! НОВОЕ: Сохраняем ID базы данных в профиль пользователя
    const updatedUser = await updateUserBotDatabaseId(user.id, botDatabaseId);

    // 5. Возвращаем успешный ответ и обновленные данные пользователя
    return NextResponse.json({
      success: true,
      message: 'База данных успешно подключена',
      user: updatedUser // Возвращаем обновленного пользователя
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Ошибка валидации', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Bot validation error:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}