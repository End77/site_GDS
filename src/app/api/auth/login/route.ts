import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser, createSession } from '@/lib/auth-server'; // <-- Импорт из auth-server

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const user = await authenticateUser(email, password);

    if (!user) {
      return NextResponse.json({ error: 'Неверные учетные данные' }, { status: 401 });
    }

    const token = await createSession(user);

    const response = NextResponse.json({ user });
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}