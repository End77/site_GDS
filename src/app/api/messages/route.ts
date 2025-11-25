import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - получение сообщений
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

    // Получаем параметр userId из URL
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'userId обязателен' },
        { status: 400 }
      )
    }

    // Получаем сообщения между текущим пользователем и выбранным
    const messages = await db.message.findMany({
      where: {
        OR: [
          {
            AND: [
              { fromUserId: currentUser.id },
              { toUserId: userId }
            ]
          },
          {
            AND: [
              { fromUserId: userId },
              { toUserId: currentUser.id }
            ]
          }
        ]
      },
      include: {
        fromUser: {
          select: {
            id: true,
            username: true,
            email: true
          }
        },
        toUser: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    return NextResponse.json({ messages })
  } catch (error) {
    console.error('Get messages error:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

// POST - отправка сообщения
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

    const { toUserId, text } = await request.json()

    if (!toUserId || !text?.trim()) {
      return NextResponse.json(
        { error: 'toUserId и text обязательны' },
        { status: 400 }
      )
    }

    // Проверяем существование получателя
    const toUser = await db.user.findUnique({
      where: { id: toUserId }
    })

    if (!toUser) {
      return NextResponse.json(
        { error: 'Получатель не найден' },
        { status: 404 }
      )
    }

    // Создаем сообщение
    const message = await db.message.create({
      data: {
        fromUserId: currentUser.id,
        toUserId: toUserId,
        text: text.trim(),
        messageType: 'text',
        direction: 'outgoing',
        createdAt: Date.now()
      },
      include: {
        fromUser: {
          select: {
            id: true,
            username: true,
            email: true
          }
        },
        toUser: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({ message })
  } catch (error) {
    console.error('Send message error:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}