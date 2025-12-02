import Database from 'better-sqlite3';
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
}

export interface MessageStats {
  total: number;
  incoming: number;
  outgoing: number;
  textMessages: number;
  mediaMessages: number;
}

export interface MessageFilters {
  messageType?: string;
  direction?: 'incoming' | 'outgoing';
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

export class BotDatabaseManager {
  private botDatabaseId: string;
  private dbPath: string;

  constructor(botDatabaseId: string) {
    this.botDatabaseId = botDatabaseId;
    this.dbPath = join(process.cwd(), 'bot_databases', botDatabaseId, 'telegram_bot.db');
  }

  /**
   * Проверяет существование базы данных бота
   */
  exists(): boolean {
    return existsSync(this.dbPath);
  }

  /**
   * Проверяет наличие таблицы message_history в базе данных
   */
  hasMessageHistoryTable(): boolean {
    if (!this.exists()) {
      return false;
    }

    try {
      const db = new Database(this.dbPath);
      const result = db.prepare(`
        SELECT name FROM sqlite_master 
        WHERE type='table' AND name='message_history'
      `).get();
      db.close();
      return !!result;
    } catch (error) {
      console.error('Error checking table:', error);
      return false;
    }
  }

  /**
   * Получает сообщения с пагинацией и фильтрацией из существующей таблицы
   */
  async getMessages(
    userId: number | null, 
    options: {
      page?: number;
      limit?: number;
      filters?: MessageFilters;
    } = {}
  ): Promise<{ messages: BotMessage[]; total: number }> {
    if (!this.exists() || !this.hasMessageHistoryTable()) {
      return { messages: [], total: 0 };
    }

    const db = new Database(this.dbPath);
    const page = options.page || 1;
    const limit = Math.min(options.limit || 50, 100);
    const offset = (page - 1) * limit;
    const filters = options.filters || {};

    try {
      // Строим WHERE условия
      const conditions = [];
      const params: any[] = [];

      // Если userId указан, фильтруем по нему, иначе получаем все сообщения
      if (userId !== null) {
        conditions.push('user_id = ?');
        params.push(userId);
      }

      if (filters.messageType) {
        conditions.push('message_type = ?');
        params.push(filters.messageType);
      }

      if (filters.direction) {
        conditions.push('direction = ?');
        params.push(filters.direction);
      }

      if (filters.search) {
        conditions.push('(message_text LIKE ? OR media_file_id LIKE ?)');
        params.push(`%${filters.search}%`, `%${filters.search}%`);
      }

      if (filters.dateFrom) {
        conditions.push('created_at >= ?');
        params.push(filters.dateFrom);
      }

      if (filters.dateTo) {
        conditions.push('created_at <= ?');
        params.push(filters.dateTo);
      }

      const whereClause = conditions.length > 0 ? conditions.join(' AND ') : '1=1';

      // Получаем общее количество
      const countQuery = `SELECT COUNT(*) as total FROM message_history WHERE ${whereClause}`;
      const countResult = db.prepare(countQuery).get(...params) as { total: number };

      // Получаем сообщения с пагинацией
      const messagesQuery = `
        SELECT * FROM message_history 
        WHERE ${whereClause}
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
      `;
      const messages = db.prepare(messagesQuery).all(...params, limit, offset) as BotMessage[];

      return {
        messages,
        total: countResult.total
      };
    } catch (error) {
      console.error('Error getting messages:', error);
      return { messages: [], total: 0 };
    } finally {
      db.close();
    }
  }

  /**
   * Получает статистику по сообщениям из существующей таблицы
   */
  async getMessageStats(userId: number | null): Promise<MessageStats> {
    if (!this.exists() || !this.hasMessageHistoryTable()) {
      return {
        total: 0,
        incoming: 0,
        outgoing: 0,
        textMessages: 0,
        mediaMessages: 0
      };
    }

    const db = new Database(this.dbPath);

    try {
      const whereClause = userId !== null ? 'WHERE user_id = ?' : '';
      const params = userId !== null ? [userId] : [];

      const stats = db.prepare(`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN direction = 'incoming' THEN 1 ELSE 0 END) as incoming,
          SUM(CASE WHEN direction = 'outgoing' THEN 1 ELSE 0 END) as outgoing,
          SUM(CASE WHEN is_media = 0 THEN 1 ELSE 0 END) as textMessages,
          SUM(CASE WHEN is_media = 1 THEN 1 ELSE 0 END) as mediaMessages
        FROM message_history 
        ${whereClause}
      `).get(...params) as any;

      return {
        total: stats.total || 0,
        incoming: stats.incoming || 0,
        outgoing: stats.outgoing || 0,
        textMessages: stats.textMessages || 0,
        mediaMessages: stats.mediaMessages || 0
      };
    } catch (error) {
      console.error('Error getting stats:', error);
      return {
        total: 0,
        incoming: 0,
        outgoing: 0,
        textMessages: 0,
        mediaMessages: 0
      };
    } finally {
      db.close();
    }
  }

  /**
   * Сохраняет сообщение в базу данных
   */
  async saveMessage(message: {
    user_id: number;
    sender_id: number;
    message_text?: string;
    message_type: string;
    media_file_id?: string;
    is_media: boolean;
    is_bot: boolean;
    direction: 'incoming' | 'outgoing';
    created_at: string;
  }): Promise<BotMessage> {
    if (!this.exists()) {
      // Создаем базу данных если ее нет
      this.createDatabase();
    }

    if (!this.hasMessageHistoryTable()) {
      // Создаем таблицу если ее нет
      this.createMessageHistoryTable();
    }

    const db = new Database(this.dbPath);

    try {
      const stmt = db.prepare(`
        INSERT INTO message_history (
          user_id, message_id, sender_id, message_text, message_type, 
          media_file_id, is_media, is_bot, direction, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const result = stmt.run(
        message.user_id,
        Date.now(), // Используем timestamp как message_id
        message.sender_id,
        message.message_text || null,
        message.message_type,
        message.media_file_id || null,
        message.is_media ? 1 : 0,
        message.is_bot ? 1 : 0,
        message.direction,
        message.created_at
      );

      const insertedMessage = db.prepare(`
        SELECT * FROM message_history WHERE rowid = ?
      `).get(result.lastInsertRowid) as BotMessage;

      return insertedMessage;
    } catch (error) {
      console.error('Error saving message:', error);
      throw error;
    } finally {
      db.close();
    }
  }

  /**
   * Создает базу данных и таблицу
   */
  private createDatabase(): void {
    const dbDir = join(process.cwd(), 'bot_databases', this.botDatabaseId);
    
    if (!existsSync(dbDir)) {
      mkdirSync(dbDir, { recursive: true });
    }
    
    const db = new Database(this.dbPath);
    this.createMessageHistoryTable();
    db.close();
  }

  /**
   * Создает таблицу message_history
   */
  private createMessageHistoryTable(): void {
    const db = new Database(this.dbPath);
    
    db.prepare(`
      CREATE TABLE IF NOT EXISTS message_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        message_id INTEGER NOT NULL,
        sender_id INTEGER NOT NULL,
        message_text TEXT,
        message_type TEXT DEFAULT 'text',
        media_file_id TEXT,
        is_media INTEGER DEFAULT 0,
        is_bot INTEGER DEFAULT 0,
        direction TEXT DEFAULT 'incoming',
        created_at TEXT NOT NULL
      )
    `).run();

    // Создаем индексы для быстрого поиска
    db.prepare(`
      CREATE INDEX IF NOT EXISTS idx_message_history_user_id 
      ON message_history(user_id)
    `).run();

    db.prepare(`
      CREATE INDEX IF NOT EXISTS idx_message_history_sender_id 
      ON message_history(sender_id)
    `).run();

    db.prepare(`
      CREATE INDEX IF NOT EXISTS idx_message_history_created_at 
      ON message_history(created_at)
    `).run();

    db.close();
  }

  /**
   * Создает сообщение в базе данных (для тестовых данных)
   */
  async createMessage(message: {
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
  }): Promise<BotMessage> {
    if (!this.exists()) {
      // Создаем базу данных если ее нет
      this.createDatabase();
    }

    if (!this.hasMessageHistoryTable()) {
      // Создаем таблицу если ее нет
      this.createMessageHistoryTable();
    }

    const db = new Database(this.dbPath);

    try {
      const stmt = db.prepare(`
        INSERT INTO message_history (
          user_id, message_id, sender_id, message_text, message_type, 
          media_file_id, is_media, is_bot, direction, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const result = stmt.run(
        message.user_id,
        message.message_id,
        message.sender_id,
        message.message_text || null,
        message.message_type,
        message.media_file_id || null,
        message.is_media ? 1 : 0,
        message.is_bot ? 1 : 0,
        message.direction,
        message.created_at
      );

      const insertedMessage = db.prepare(`
        SELECT * FROM message_history WHERE rowid = ?
      `).get(result.lastInsertRowid) as BotMessage;

      return insertedMessage;
    } catch (error) {
      console.error('Error creating message:', error);
      throw error;
    } finally {
      db.close();
    }
  }

  /**
   * Инициализирует базу данных (создает если необходимо)
   */
  async initialize(): Promise<void> {
    if (!this.exists()) {
      this.createDatabase();
    }
  }

  /**
   * Закрывает соединение с базой данных
   */
  async close(): Promise<void> {
    // Для better-sqlite3 закрытие происходит автоматически
    // Но оставим метод для совместимости
  }

  /**
   * Получает информацию о базе данных
   */
  getDatabaseInfo(): { exists: boolean; hasTable: boolean; path: string } {
    return {
      exists: this.exists(),
      hasTable: this.hasMessageHistoryTable(),
      path: this.dbPath
    };
  }
}

/**
 * Фабрика для создания менеджеров баз данных ботов
 */
export function createBotDatabaseManager(botDatabaseId: string): BotDatabaseManager {
  return new BotDatabaseManager(botDatabaseId);
}

/**
 * Валидация ID базы данных бота
 */
export function validateBotDatabaseId(botDatabaseId: string): boolean {
  // Только буквы, цифры и дефисы, минимум 3 символа
  return /^[a-zA-Z0-9-]{3,}$/.test(botDatabaseId);
}

/**
 * Основная функция для загрузки истории бота
 */
export async function loadBotHistory(
  userId: number | null, 
  botDatabaseId: string | null,
  options: {
    page?: number;
    limit?: number;
    filters?: MessageFilters;
  } = {}
): Promise<{ messages: BotMessage[]; total: number; stats: MessageStats | null; databaseInfo?: any }> {
  if (!botDatabaseId) {
    return { messages: [], total: 0, stats: null };
  }

  const botDb = createBotDatabaseManager(botDatabaseId);
  const databaseInfo = botDb.getDatabaseInfo();
  
  if (!databaseInfo.exists) {
    return { 
      messages: [], 
      total: 0, 
      stats: null,
      error: 'База данных не найдена',
      databaseInfo 
    };
  }

  if (!databaseInfo.hasTable) {
    return { 
      messages: [], 
      total: 0, 
      stats: null,
      error: 'Таблица message_history не найдена',
      databaseInfo 
    };
  }

  try {
    const [messagesData, stats] = await Promise.all([
      botDb.getMessages(userId, options),
      botDb.getMessageStats(userId)
    ]);

    return {
      messages: messagesData.messages,
      total: messagesData.total,
      stats,
      databaseInfo
    };
  } catch (error) {
    console.error('Error loading bot history:', error);
    return { 
      messages: [], 
      total: 0, 
      stats: null,
      error: 'Ошибка при загрузке данных',
      databaseInfo 
    };
  }
}

/**
 * Основная функция для сохранения сообщения бота
 */
export async function saveBotMessage(
  userId: number, 
  botDatabaseId: string,
  message: {
    sender_id: number;
    message_text?: string;
    message_type: string;
    media_file_id?: string;
    is_media: boolean;
    is_bot: boolean;
    direction: 'incoming' | 'outgoing';
    created_at: string;
  }
): Promise<BotMessage> {
  const botDb = createBotDatabaseManager(botDatabaseId);
  
  return await botDb.saveMessage({
    user_id: userId,
    ...message
  });
}