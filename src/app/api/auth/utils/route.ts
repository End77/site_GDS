import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { jwtVerify, SignJWT } from 'jose';

const JWT_SECRET = new TextEncoder().encode('telegram-bot-secret-key-2024');

export interface User {
  id: string;
  username: string;
  email: string;
  botDatabaseId?: string | null;
  createdAt: Date;
}

// Helper functions
async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// API handlers
export async function POST(request: NextRequest) {
  try {
    const { action, ...data } = await request.json();

    switch (action) {
      case 'createUser':
        return await handleCreateUser(data);
      case 'authenticateUser':
        return await handleAuthenticateUser(data);
      case 'createSession':
        return await handleCreateSession(data);
      case 'verifySession':
        return await handleVerifySession(data);
      case 'updateUserBotDatabaseId':
        return await handleUpdateUserBotDatabaseId(data);
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Auth utils error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function handleCreateUser(data: { username: string; email: string; password: string }) {
  const { username, email, password } = data;

  // Check if user already exists
  const existingUser = await db.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    return NextResponse.json({ error: 'User already exists' }, { status: 409 });
  }

  const hashedPassword = await hashPassword(password);

  const user = await db.user.create({
    data: {
      username,
      email,
      passwordHash: hashedPassword,
    },
    select: {
      id: true,
      username: true,
      email: true,
      botDatabaseId: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ user });
}

async function handleAuthenticateUser(data: { email: string; password: string }) {
  const { email, password } = data;

  const user = await db.user.findUnique({
    where: { email },
    select: {
      id: true,
      username: true,
      email: true,
      passwordHash: true,
      botDatabaseId: true,
      createdAt: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const { passwordHash, ...userWithoutPassword } = user;
  return NextResponse.json({ user: userWithoutPassword });
}

async function handleCreateSession(data: { user: User }) {
  const { user } = data;

  const payload = {
    userId: user.id,
    username: user.username,
    email: user.email,
    exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 дней
  };

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);

  return NextResponse.json({ token });
}

async function handleVerifySession(data: { token: string }) {
  const { token } = data;

  if (!token) {
    return NextResponse.json({ error: 'No token provided' }, { status: 401 });
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);

    const userId = payload.userId as string;
    if (!userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        botDatabaseId: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    return NextResponse.json({ user });

  } catch (error) {
    if (error.code === 'ERR_JWT_EXPIRED') {
      console.error('--- [verifySession] ОШИБКА: Срок действия токена истек. ---');
      return NextResponse.json({ error: 'Token expired' }, { status: 401 });
    } else {
      console.error('--- [verifySession] ОШИБКА: Токен невалиден.', error.message);
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  }
}

async function handleUpdateUserBotDatabaseId(data: { userId: string; botDatabaseId: string | null }) {
  const { userId, botDatabaseId } = data;

  const user = await db.user.update({
    where: { id: userId },
    data: { botDatabaseId },
    select: {
      id: true,
      username: true,
      email: true,
      botDatabaseId: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ user });
}