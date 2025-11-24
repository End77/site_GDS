import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json({ user: null })
    }

    // Decode token (в реальном приложении используй JWT verify)
    try {
      const decoded = JSON.parse(Buffer.from(token, 'base64').toString())
      
      // Проверяем срок действия токена (7 дней)
      if (Date.now() - decoded.timestamp > 60 * 60 * 24 * 7 * 1000) {
        return NextResponse.json({ user: null })
      }

      // Mock данные пользователей (в реальном приложении загружай из базы)
      const mockUsers: Record<string, any> = {
        '1': {
          id: '1',
          email: 'admin@gentledroid.com',
          username: 'Администратор',
          name: 'Admin User',
          role: 'admin',
          company: 'Gentle Droid Solutions'
        },
        '2': {
          id: '2',
          email: 'demo@gentledroid.com',
          username: 'Демо Пользователь',
          name: 'Demo User',
          role: 'user',
          company: 'Gentle Droid Solutions'
        }
      }

      const user = mockUsers[decoded.userId]

      if (!user) {
        return NextResponse.json({ user: null })
      }

      return NextResponse.json({
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

    } catch (decodeError) {
      console.error('Token decode error:', decodeError)
      return NextResponse.json({ user: null })
    }

  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json({ user: null })
  }
}