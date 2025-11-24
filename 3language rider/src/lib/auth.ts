import bcrypt from 'bcryptjs';
import { db } from './db';
import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'telegram-bot-secret-key-2024');

export interface User {
  id: string;
  username: string;
  email: string;
  botDatabaseId?: string | null;
  createdAt: Date;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function createUser(username: string, email: string, password: string): Promise<User> {
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

  return user;
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
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
    return null;
  }

  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) {
    return null;
  }

  const { passwordHash, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

export async function createSession(user: User): Promise<string> {
  const payload = {
    userId: user.id,
    username: user.username,
    email: user.email,
    exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 дней
  };

  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

export async function verifySession(token: string): Promise<User | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    
    const user = await db.user.findUnique({
      where: { id: payload.userId as string },
      select: {
        id: true,
        username: true,
        email: true,
        botDatabaseId: true,
        createdAt: true,
      },
    });

    return user;
  } catch (error) {
    return null;
  }
}

export async function updateUserBotDatabaseId(userId: string, botDatabaseId: string | null): Promise<User> {
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

  return user;
}