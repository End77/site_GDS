import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifySession } from '@/lib/auth-server' // <-- 1. Импортируем функцию

// GET - получение настроек
export async function GET(request: NextRequest) {
  try {
    // Получаем токен из cookie
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Не авторизован: отсутствует токен' },
        { status: 401 }
      )
    }

    // 2. Проверяем и расшифровываем токен, чтобы получить пользователя
    const currentUser = await verifySession(token)

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Сессия недействительна или пользователь не найден' },
        { status: 401 }
      )
    }

    // Если пользователь найден, продолжаем...
    console.log(`[/api/bot/bot-id/settings] Пользователь ${currentUser.username} запрашивает настройки.`);

    // Получаем настройки бота
    const botToken = await db.botSettings.findUnique({
      where: { key: 'bot_token' }
    })

    const botLanguage = await db.botSettings.findUnique({
      where: { key: 'bot_language' }
    })

    const settings = {
      bot_token: botToken?.value || '',
      bot_language: botLanguage?.value || 'ru'
    }

    return NextResponse.json({ settings })
  } catch (error) {
    console.error('Bot get settings error:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

// POST - сохранение настроек
export async function POST(request: NextRequest) {
  try {
    // Получаем токен из cookie
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Не авторизован: отсутствует токен' },
        { status: 401 }
      )
    }

    // 3. И здесь тоже используем verifySession
    const currentUser = await verifySession(token)

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Сессия недействительна или пользователь не найден' },
        { status: 401 }
      )
    }

    // Если пользователь найден, продолжаем...
    console.log(`[/api/bot/bot-id/settings] Пользователь ${currentUser.username} сохраняет настройки.`);

    const { bot_token, bot_language } = await request.json()

    // Обновляем токен бота
    if (bot_token !== undefined) {
      await db.botSettings.upsert({
        where: { key: 'bot_token' },
        update: { value: bot_token },
        create: {
          key: 'bot_token',
          value: bot_token,
          description: 'Telegram Bot API Token'
        }
      })
    }

    // Обновляем язык бота
    if (bot_language !== undefined) {
      await db.botSettings.upsert({
        where: { key: 'bot_language' },
        update: { value: bot_language },
        create: {
          key: 'bot_language',
          value: bot_language,
          description: 'Default bot language'
        }
      })
    }

    return NextResponse.json({ message: 'Настройки сохранены успешно' })
  } catch (error) {
    console.error('Bot save settings error:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}