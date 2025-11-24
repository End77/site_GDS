import { NextRequest, NextResponse } from 'next/server';
import { createUser, createSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { z } from 'zod';

const registerSchema = z.object({
  username: z.string().min(3, 'Имя пользователя должно содержать минимум 3 символа').max(20, 'Максимум 20 символов'),
  email: z.string().email('Введите корректный email'),
  password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, email, password } = registerSchema.parse(body);

    // Проверяем существование пользователя
    const existingUser = await db.user.findFirst({
      where: {
        OR: [
          { email },
          { username },
        ],
      },
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return NextResponse.json(
          { error: 'Пользователь с таким email уже существует' },
          { status: 400 }
        );
      }
      if (existingUser.username === username) {
        return NextResponse.json(
          { error: 'Пользователь с таким именем уже существует' },
          { status: 400 }
        );
      }
    }

    const user = await createUser(username, email, password);
    const token = await createSession(user);

    const response = NextResponse.json({
      success: true,
      message: 'Регистрация прошла успешно',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        botDatabaseId: user.botDatabaseId,
      },
    });

    response.cookies.set('session-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 дней
    });

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    
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