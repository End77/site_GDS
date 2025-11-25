import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

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

    // Получаем статистику
    const totalUsers = await db.botUser.count()
    const activeUsers = await db.botUser.count({
      where: { isActive: true }
    })
    const totalMessages = await db.botMessage.count()
    const incomingMessages = await db.botMessage.count({
      where: { direction: 'incoming' }
    })
    const outgoingMessages = await db.botMessage.count({
      where: { direction: 'outgoing' }
    })

    const stats = {
      totalUsers,
      activeUsers,
      totalMessages,
      incomingMessages,
      outgoingMessages
    }

    return NextResponse.json({ stats })
  } catch (error) {
    console.error('Bot get stats error:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}