import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - получение настроек
export async function GET(request: NextRequest) {
  try {
    // Получаем токен из cookie
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Не авторизован' },
        { status: 401 }
      )
    }

    // Проверяем текущего пользователя
    const currentUser = await db.user.findUnique({
      where: { id: token }
    })

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 401 }
      )
    }

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
        { error: 'Не авторизован' },
        { status: 401 }
      )
    }

    // Проверяем текущего пользователя
    const currentUser = await db.user.findUnique({
      where: { id: token }
    })

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 401 }
      )
    }

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