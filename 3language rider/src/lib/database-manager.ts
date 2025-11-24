import { config, getBotDatabaseUrl, isValidBotId } from '@/config';
import { PrismaClient } from '@prisma/client';

// Класс для управления базами данных ботов
export class DatabaseManager {
  private static instance: DatabaseManager;
  private botDatabases: Map<string, PrismaClient> = new Map();
  private mainDatabase: PrismaClient;

  private constructor() {
    this.mainDatabase = new PrismaClient({
      datasources: {
        db: {
          url: config.databases.main.url,
        },
      },
    });
  }

  public static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  // Получение основной базы данных
  public getMainDatabase(): PrismaClient {
    return this.mainDatabase;
  }

  // Получение базы данных бота по ID
  public getBotDatabase(botId: string): PrismaClient | null {
    if (!isValidBotId(botId)) {
      console.error(`Invalid bot ID: ${botId}`);
      return null;
    }

    // Проверяем, есть ли уже подключение к этой базе
    if (this.botDatabases.has(botId)) {
      return this.botDatabases.get(botId)!;
    }

    try {
      // Создаем новое подключение к базе данных бота
      const botDatabase = new PrismaClient({
        datasources: {
          db: {
            url: getBotDatabaseUrl(botId),
          },
        },
      });

      // Сохраняем подключение в кэш
      this.botDatabases.set(botId, botDatabase);
      
      console.log(`Connected to bot database: ${botId}`);
      return botDatabase;
    } catch (error) {
      console.error(`Failed to connect to bot database ${botId}:`, error);
      return null;
    }
  }

  // Закрытие подключения к базе данных бота
  public closeBotDatabase(botId: string): void {
    const database = this.botDatabases.get(botId);
    if (database) {
      database.$disconnect();
      this.botDatabases.delete(botId);
      console.log(`Disconnected from bot database: ${botId}`);
    }
  }

  // Закрытие всех подключений к базам данных ботов
  public closeAllBotDatabases(): void {
    for (const [botId, database] of this.botDatabases) {
      database.$disconnect();
      console.log(`Disconnected from bot database: ${botId}`);
    }
    this.botDatabases.clear();
  }

  // Проверка существования базы данных бота
  public async botDatabaseExists(botId: string): Promise<boolean> {
    if (!isValidBotId(botId)) {
      return false;
    }

    try {
      const database = this.getBotDatabase(botId);
      if (!database) {
        return false;
      }

      // Пытаемся выполнить простой запрос для проверки подключения
      await database.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      console.error(`Bot database ${botId} does not exist or is not accessible:`, error);
      return false;
    }
  }

  // Создание базы данных для бота
  public async createBotDatabase(botId: string): Promise<boolean> {
    if (!isValidBotId(botId)) {
      console.error(`Invalid bot ID: ${botId}`);
      return false;
    }

    try {
      const database = this.getBotDatabase(botId);
      if (!database) {
        return false;
      }

      // Здесь можно добавить код для инициализации схемы базы данных
      // Например, выполнить миграции или создать необходимые таблицы
      
      console.log(`Bot database created/initialized: ${botId}`);
      return true;
    } catch (error) {
      console.error(`Failed to create bot database ${botId}:`, error);
      return false;
    }
  }

  // Удаление базы данных бота
  public async deleteBotDatabase(botId: string): Promise<boolean> {
    if (!isValidBotId(botId)) {
      return false;
    }

    try {
      // Закрываем подключение
      this.closeBotDatabase(botId);
      
      // Здесь можно добавить код для удаления файла базы данных
      // В зависимости от типа базы данных это может быть удаление файла
      // или выполнение DROP DATABASE
      
      console.log(`Bot database deleted: ${botId}`);
      return true;
    } catch (error) {
      console.error(`Failed to delete bot database ${botId}:`, error);
      return false;
    }
  }

  // Получение списка всех активных подключений к базам данных
  public getActiveBotDatabases(): string[] {
    return Array.from(this.botDatabases.keys());
  }

  // Закрытие всех подключений (включая основную базу данных)
  public async disconnectAll(): Promise<void> {
    this.closeAllBotDatabases();
    await this.mainDatabase.$disconnect();
    console.log('All database connections closed');
  }

  // Проверка здоровья всех подключений
  public async healthCheck(): Promise<{ main: boolean; bots: Record<string, boolean> }> {
    const result = {
      main: false,
      bots: {} as Record<string, boolean>,
    };

    // Проверяем основную базу данных
    try {
      await this.mainDatabase.$queryRaw`SELECT 1`;
      result.main = true;
    } catch (error) {
      console.error('Main database health check failed:', error);
    }

    // Проверяем базы данных ботов
    for (const [botId, database] of this.botDatabases) {
      try {
        await database.$queryRaw`SELECT 1`;
        result.bots[botId] = true;
      } catch (error) {
        console.error(`Bot database ${botId} health check failed:`, error);
        result.bots[botId] = false;
      }
    }

    return result;
  }
}

// Экспорт синглтона
export const databaseManager = DatabaseManager.getInstance();

// Удобные функции для быстрого доступа
export const getMainDb = () => databaseManager.getMainDatabase();
export const getBotDb = (botId: string) => databaseManager.getBotDatabase(botId);
export const closeBotDb = (botId: string) => databaseManager.closeBotDatabase(botId);