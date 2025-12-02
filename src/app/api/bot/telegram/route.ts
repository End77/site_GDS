import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth-server';
import { z } from 'zod';

// Импортируем обработчики для каждого действия
import { handleHistoryAction } from '@/lib/bot-handlers/history-handler';
import { handleStatsAction } from '@/lib/bot-handlers/stats-handler';
import { handleSettingsAction } from '@/lib/bot-handlers/settings-handler';
import { handleRecentActivityAction } from '@/lib/bot-handlers/recent-activity-handler';

// Валидация параметров URL
const paramsSchema = z.object({
  botType: z.enum(['telegram', 'whatsapp']),
  action: z.enum(['history', 'stats', 'settings', 'recent-activity']),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { botType: string; action: string } }
) {
  try {
    // 1. Валидируем параметры из URL
    const { botType, action } = paramsSchema.parse(params);

    // 2. Аутентифицируем пользователя
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Не авторизован: отсутствует токен' }, { status: 401 });
    }

    const user = await verifySession(token);
    if (!user) {
      return NextResponse.json({ error: 'Сессия недействительна' }, { status: 401 });
    }

    // 3. Маршрутизация к соответствующему обработчику
    switch (action) {
      case 'history':
        return handleHistoryAction(request, user, botType);
      case 'stats':
        return handleStatsAction(user, botType);
      case 'settings':
        return handleSettingsAction(request, user, botType);
      case 'recent-activity':
        return handleRecentActivityAction(request, user, botType);
      default:
        // Эта строка теоретически недостижима из-за zod, но для надежности оставим
        return NextResponse.json({ error: 'Неверное действие' }, { status: 400 });
    }
  } catch (error) {
    console.error(`API Error for [${params.botType}]/[${params.action}]:`, error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Ошибка валидации URL', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}

// Если у вас будут POST-запросы (например, для сохранения настроек)
export async function POST(
  request: NextRequest,
  { params }: { params: { botType: string; action: string } }
) {
  try {
    const { botType, action } = paramsSchema.parse(params);
    const token = request.cookies.get('auth-token')?.value;
    if (!token) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });

    const user = await verifySession(token);
    if (!user) return NextResponse.json({ error: 'Сессия недействительна' }, { status: 401 });

    switch (action) {
      case 'settings':
        return handleSettingsAction(request, user, botType); // Обработчик будет поддерживать GET и POST
      // ... другие POST-действия
      default:
        return NextResponse.json({ error: 'Неверное действие для POST-запроса' }, { status: 400 });
    }
  } catch (error) {
    // ... обработка ошибок как в GET
  }
}