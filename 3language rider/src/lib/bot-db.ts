import Database from 'better-sqlite3';
import { join } from 'path';
import { existsSync } from 'fs';

export interface BotMessage {
  id: number;
  userId: number;
  messageId: number;
  senderId: number;
  messageText?: string;
  messageType: string;
  mediaFileId?: string;
  isMedia: boolean;
  isBot: boolean;
  direction: 'incoming' | 'outgoing';
  createdAt: string;
}

export class BotDatabase {
  private dbPath: string;

  constructor(botDatabaseId: string) {
    this.dbPath = join(process.cwd(), 'bot_databases', `tg_bot_${botDatabaseId}`, 'telegram_bot.db');
  }

  exists(): boolean {
    return existsSync(this.dbPath);
  }

  async getMessages(userId: number, options: {
    page?: number;
    limit?: number;
    messageType?: string;
    direction?: 'incoming' | 'outgoing';
    search?: string;
  } = {}): Promise<{ messages: BotMessage[]; total: number }> {
    if (!this.exists()) {
      return { messages: [], total: 0 };
    }

    const db = new Database(this.dbPath);
    const page = options.page || 1;
    const limit = options.limit || 50;
    const offset = (page - 1) * limit;

    try {
      // Build WHERE clause
      const conditions = ['user_id = ?'];
      const params: any[] = [userId];

      if (options.messageType) {
        conditions.push('message_type = ?');
        params.push(options.messageType);
      }

      if (options.direction) {
        conditions.push('direction = ?');
        params.push(options.direction);
      }

      if (options.search) {
        conditions.push('(message_text LIKE ? OR media_file_id LIKE ?)');
        params.push(`%${options.search}%`, `%${options.search}%`);
      }

      const whereClause = conditions.join(' AND ');

      // Get total count
      const countQuery = `SELECT COUNT(*) as total FROM message_history WHERE ${whereClause}`;
      const countResult = db.prepare(countQuery).get(...params) as { total: number };

      // Get messages with pagination
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
    } finally {
      db.close();
    }
  }

  async getMessageStats(userId: number): Promise<{
    total: number;
    incoming: number;
    outgoing: number;
    textMessages: number;
    mediaMessages: number;
  }> {
    if (!this.exists()) {
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
      const stats = db.prepare(`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN direction = 'incoming' THEN 1 ELSE 0 END) as incoming,
          SUM(CASE WHEN direction = 'outgoing' THEN 1 ELSE 0 END) as outgoing,
          SUM(CASE WHEN is_media = 0 THEN 1 ELSE 0 END) as textMessages,
          SUM(CASE WHEN is_media = 1 THEN 1 ELSE 0 END) as mediaMessages
        FROM message_history 
        WHERE user_id = ?
      `).get(userId) as any;

      return {
        total: stats.total || 0,
        incoming: stats.incoming || 0,
        outgoing: stats.outgoing || 0,
        textMessages: stats.textMessages || 0,
        mediaMessages: stats.mediaMessages || 0
      };
    } finally {
      db.close();
    }
  }
}

export function createBotDatabase(botDatabaseId: string): BotDatabase {
  return new BotDatabase(botDatabaseId);
}

export function validateBotDatabaseId(botDatabaseId: string): boolean {
  // Only allow letters, numbers, and hyphens
  return /^[a-zA-Z0-9-]+$/.test(botDatabaseId);
}