import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Mock пользователи (в реальном приложении подключайся к базе данных)
    const mockUsers = [
      {
        id: '1',
        email: 'admin@gentledroid.com',
        password: 'admin123',
        username: 'Администратор',
        name: 'Admin User',
        role: 'admin',
        company: 'Gentle Droid Solutions'
      },
      {
        id: '2',
        email: 'demo@gentledroid.com',
        password: 'demo123',
        username: 'Демо Пользователь',
        name: 'Demo User',
        role: 'user',
        company: 'Gentle Droid Solutions'
      }
    ]

    // Ищем пользователя
    const user = mockUsers.find(u => u.email === email && u.password === password)

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Неверный email или пароль' },
        { status: 401 }
      )
    }

    // Создаем токен сессии (в реальном приложении используй JWT)
    const token = Buffer.from(JSON.stringify({
      userId: user.id,
      email: user.email,
      role: user.role,
      timestamp: Date.now()
    })).toString('base64')

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        role: user.role,
        company: user.company
      }
    })

    // Устанавливаем HTTP-only cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 дней
      path: '/'
    })

    return response

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, error: 'Ошибка сервера' },
      { status: 500 }
    )
  }
}