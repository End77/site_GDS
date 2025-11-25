import { config, getBotDatabaseUrl, isValidBotId } from '@/config';
import { PrismaClient } from '@prisma/client';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

export interface BotMessage {
  id: number;
  user_id: number;
  message_id: number;
  sender_id: number;
  message_text?: string;
  message_type: string;
  media_file_id?: string;
  is_media: boolean;
  is_bot: boolean;
  direction: 'incoming' | 'outgoing';
  created_at: string;
  updated_at: string;
}

export interface BotUser {
  id: number;
  telegram_id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export class BotDatabaseManager {
  private static instances: Map<string, PrismaClient> = new Map();

  // Получение экземпляра Prisma для базы данных бота
  public static getBotDatabase(botId: string): PrismaClient | null {
    if (!isValidBotId(botId)) {
      console.error(`Invalid bot ID: ${botId}`);
      return null;
    }

    // Проверяем, есть ли уже экземпляр для этого бота
    if (this.instances.has(botId)) {
      return this.instances.get(botId)!;
    }

    try {
      // Убеждаемся, что директория для баз данных существует
      const dbDir = join(process.cwd(), config.databases.botDirectory);
      if (!existsSync(dbDir)) {
        mkdirSync(dbDir, { recursive: true });
      }

      // Создаем новый экземпляр Prisma
      const prisma = new PrismaClient({
        datasources: {
          db: {
            url: getBotDatabaseUrl(botId),
          },
        },
        log: config.server.development ? ['query', 'info', 'warn', 'error'] : ['error'],
      });

      // Сохраняем экземпляр
      this.instances.set(botId, prisma);
      
      console.log(`Created database connection for bot: ${botId}`);
      return prisma;
    } catch (error) {
      console.error(`Failed to create database connection for bot ${botId}:`, error);
      return null;
    }
  }

  // Закрытие соединения с базой данных бота
  public static async closeBotDatabase(botId: string): Promise<void> {
    const prisma = this.instances.get(botId);
    if (prisma) {
      await prisma.$disconnect();
      this.instances.delete(botId);
      console.log(`Closed database connection for bot: ${botId}`);
    }
  }

  // Закрытие всех соединений
  public static async closeAllConnections(): Promise<void> {
    const closePromises = Array.from(this.instances.keys()).map(botId => 
      this.closeBotDatabase(botId)
    );
    await Promise.all(closePromises);
    console.log('All bot database connections closed');
  }

  // Инициализация базы данных бота
  public static async initializeBotDatabase(botId: string): Promise<boolean> {
    const prisma = this.getBotDatabase(botId);
    if (!prisma) {
      return false;
    }

    try {
      // Проверяем подключение
      await prisma.$connect();
      
      // Здесь можно добавить код для создания начальных данных
      // Например, настройки по умолчанию
      
      console.log(`Bot database initialized: ${botId}`);
      return true;
    } catch (error) {
      console.error(`Failed to initialize bot database ${botId}:`, error);
      return false;
    }
  }

  // Проверка существования базы данных
  public static async databaseExists(botId: string): Promise<boolean> {
    const prisma = this.getBotDatabase(botId);
    if (!prisma) {
      return false;
    }

    try {
      await prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      return false;
    }
  }

  // Получение статистики по базе данных
  public static async getDatabaseStats(botId: string): Promise<any> {
    const prisma = this.getBotDatabase(botId);
    if (!prisma) {
      throw new Error(`Database not found for bot: ${botId}`);
    }

    try {
      const [messageCount, userCount, incomingCount, outgoingCount] = await Promise.all([
        prisma.botMessage.count(),
        prisma.botUser.count(),
        prisma.botMessage.count({ where: { direction: 'incoming' } }),
        prisma.botMessage.count({ where: { direction: 'outgoing' } }),
      ]);

      return {
        totalMessages: messageCount,
        totalUsers: userCount,
        incomingMessages: incomingCount,
        outgoingMessages: outgoingCount,
      };
    } catch (error) {
      console.error(`Failed to get stats for bot ${botId}:`, error);
      throw error;
    }
  }

  // Очистка старых сообщений
  public static async cleanupOldMessages(botId: string, daysToKeep: number = 30): Promise<number> {
    const prisma = this.getBotDatabase(botId);
    if (!prisma) {
      throw new Error(`Database not found for bot: ${botId}`);
    }

    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

      const result = await prisma.botMessage.deleteMany({
        where: {
          created_at: {
            lt: cutoffDate,
          },
        },
      });

      console.log(`Cleaned up ${result.count} old messages from bot ${botId}`);
      return result.count;
    } catch (error) {
      console.error(`Failed to cleanup old messages for bot ${botId}:`, error);
      throw error;
    }
  }

  // Получение активных соединений
  public static getActiveConnections(): string[] {
    return Array.from(this.instances.keys());
  }

  // Проверка здоровья соединений
  public static async healthCheck(): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {};
    
    for (const [botId, prisma] of this.instances) {
      try {
        await prisma.$queryRaw`SELECT 1`;
        results[botId] = true;
      } catch (error) {
        results[botId] = false;
        console.error(`Health check failed for bot ${botId}:`, error);
      }
    }

    return results;
  }
}

// Удобные функции для экспорта
export const getBotDb = (botId: string) => BotDatabaseManager.getBotDatabase(botId);
export const closeBotDb = (botId: string) => BotDatabaseManager.closeBotDatabase(botId);
export const initBotDb = (botId: string) => BotDatabaseManager.initializeBotDatabase(botId);
export const botDbExists = (botId: string) => BotDatabaseManager.databaseExists(botId);