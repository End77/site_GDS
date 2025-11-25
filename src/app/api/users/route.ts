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

    // Ищем текущего пользователя
    const currentUser = await db.user.findUnique({
      where: { id: token },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        company: true
      }
    })

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 401 }
      )
    }

    // Получаем всех пользователей кроме текущего
    const users = await db.user.findMany({
      where: {
        id: { not: currentUser.id }
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        company: true
      },
      orderBy: {
        username: 'asc'
      }
    })

    return NextResponse.json({ 
      currentUser,
      users 
    })
  } catch (error) {
    console.error('Get users error:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}