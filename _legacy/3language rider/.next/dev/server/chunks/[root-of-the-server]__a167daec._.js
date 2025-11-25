module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/@prisma/client [external] (@prisma/client, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("@prisma/client", () => require("@prisma/client"));

module.exports = mod;
}),
"[project]/src/config/index.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Конфигурация приложения
__turbopack_context__.s([
    "config",
    ()=>config,
    "default",
    ()=>__TURBOPACK__default__export__,
    "getApiUrl",
    ()=>getApiUrl,
    "getBotDatabasePath",
    ()=>getBotDatabasePath,
    "getBotDatabaseUrl",
    ()=>getBotDatabaseUrl,
    "isDevelopment",
    ()=>isDevelopment,
    "isProduction",
    ()=>isProduction,
    "isTest",
    ()=>isTest,
    "isValidBotId",
    ()=>isValidBotId
]);
const config = {
    // Настройки приложения
    app: {
        name: 'Telegram Bot Dashboard',
        version: '1.0.0',
        description: 'Панель управления для Telegram ботов'
    },
    // Базы данных
    databases: {
        // Основная база данных приложения
        main: {
            url: process.env.DATABASE_URL || 'file:../db/users.db',
            provider: 'sqlite'
        },
        // Шаблон пути для баз данных ботов
        botTemplate: process.env.BOT_DATABASE_TEMPLATE || 'file:./bot_databases/{botId}/telegram_bot.db',
        // Директория для баз данных ботов
        botDirectory: process.env.BOT_DATABASE_DIR || './bots',
        // Префикс для имен баз ботов
        botPrefix: process.env.BOT_DATABASE_PREFIX || 'bot_',
        // Суффикс для имен баз ботов
        botSuffix: process.env.BOT_DATABASE_SUFFIX || '_db'
    },
    // Настройки аутентификации
    auth: {
        // Секретный ключ для JWT
        jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
        // Время жизни токена (в часах)
        tokenExpiry: process.env.TOKEN_EXPIRY_HOURS ? parseInt(process.env.TOKEN_EXPIRY_HOURS) : 24,
        // Максимальное количество попыток входа
        maxLoginAttempts: 5,
        // Время блокировки после неудачных попыток (в минутах)
        lockoutDuration: 15
    },
    // Настройки сообщений
    messages: {
        // Количество сообщений на странице
        pageSize: 50,
        // Максимальное количество сообщений для загрузки
        maxMessages: 1000,
        // Максимальная длина сообщения
        maxMessageLength: 4000,
        // Время автообновления (в секундах)
        autoRefreshInterval: 30
    },
    // Настройки ботов
    bots: {
        // Максимальное количество ботов на пользователя
        maxBotsPerUser: 10,
        // Длина ID базы данных бота
        botIdMinLength: 3,
        botIdMaxLength: 50,
        // Разрешенные символы для ID бота
        botIdPattern: /^[a-zA-Z0-9_-]+$/,
        // Таймаут ответа от API бота (в миллисекундах)
        apiTimeout: 10000
    },
    // Настройки сервера
    server: {
        // Порт сервера
        port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
        // Хост сервера
        host: process.env.HOST || 'localhost',
        // Режим разработки
        development: ("TURBOPACK compile-time value", "development") === 'development',
        // CORS настройки
        cors: {
            origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
            credentials: true
        }
    },
    // Настройки логирования
    logging: {
        // Уровень логирования
        level: process.env.LOG_LEVEL || 'info',
        // Файл для логов
        file: process.env.LOG_FILE || './logs/app.log',
        // Максимальный размер файла логов (в байтах)
        maxFileSize: 10 * 1024 * 1024,
        // Количество файлов для ротации
        maxFiles: 5
    },
    // Настройки кэширования
    cache: {
        // Время жизни кэша (в секундах)
        ttl: 300,
        // Максимальный размер кэша
        maxSize: 1000,
        // Интервал очистки кэша (в секундах)
        cleanupInterval: 600
    },
    // Настройки UI
    ui: {
        // Количество элементов на странице в таблицах
        tablePageSize: 20,
        // Задержка перед показом загрузчика (в миллисекундах)
        loadingDelay: 200,
        // Время показа уведомлений (в миллисекундах)
        notificationDuration: 5000,
        // Максимальная длина текста для превью
        previewMaxLength: 100
    },
    // API эндпоинты
    api: {
        // Базовый URL для API
        baseUrl: process.env.API_BASE_URL || '/api',
        // Версия API
        version: 'v1',
        // Таймаут для запросов (в миллисекундах)
        timeout: 30000
    },
    // Настройки безопасности
    security: {
        // Максимальный размер запроса (в байтах)
        maxRequestSize: 10 * 1024 * 1024,
        // Ограничение частоты запросов
        rateLimit: {
            windowMs: 15 * 60 * 1000,
            max: 100
        },
        // Настройки CSRF
        csrf: {
            enabled: true,
            secret: process.env.CSRF_SECRET || 'csrf-secret-key'
        }
    }
};
const getBotDatabasePath = (botId)=>{
    return config.databases.botTemplate.replace('{botId}', botId);
};
const getBotDatabaseUrl = (botId)=>{
    const path = getBotDatabasePath(botId);
    return `file:${path}`;
};
const isValidBotId = (botId)=>{
    return botId.length >= config.bots.botIdMinLength && botId.length <= config.bots.botIdMaxLength && config.bots.botIdPattern.test(botId);
};
const getApiUrl = (endpoint)=>{
    return `${config.api.baseUrl}/${config.api.version}${endpoint}`;
};
const isDevelopment = ()=>config.server.development;
const isProduction = ()=>("TURBOPACK compile-time value", "development") === 'production';
const isTest = ()=>("TURBOPACK compile-time value", "development") === 'test';
const __TURBOPACK__default__export__ = config;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[project]/src/lib/db.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "db",
    ()=>db
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/config/index.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
;
;
;
// Ensure we have a proper database URL
const getDatabaseUrl = ()=>{
    if (process.env.DATABASE_URL) {
        // If it's already an absolute path, use it as is
        if (process.env.DATABASE_URL.startsWith('file:/')) {
            return process.env.DATABASE_URL;
        }
        // If it's a relative path, convert to absolute
        if (process.env.DATABASE_URL.startsWith('file:')) {
            const relativePath = process.env.DATABASE_URL.replace('file:', '');
            const absolutePath = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["join"])(process.cwd(), relativePath);
            return `file:${absolutePath}`;
        }
    }
    // Use config fallback
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["config"].databases.main.url;
};
const globalForPrisma = globalThis;
const db = globalForPrisma.prisma ?? new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__["PrismaClient"]({
    log: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["config"].server.development ? [
        'query'
    ] : [
        'error'
    ],
    datasources: {
        db: {
            url: getDatabaseUrl()
        }
    }
});
if ("TURBOPACK compile-time truthy", 1) globalForPrisma.prisma = db;
}),
"[project]/src/lib/auth.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "authenticateUser",
    ()=>authenticateUser,
    "createSession",
    ()=>createSession,
    "createUser",
    ()=>createUser,
    "hashPassword",
    ()=>hashPassword,
    "updateUserBotDatabaseId",
    ()=>updateUserBotDatabaseId,
    "verifyPassword",
    ()=>verifyPassword,
    "verifySession",
    ()=>verifySession
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/bcryptjs/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/db.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$sign$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/webapi/jwt/sign.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$verify$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/webapi/jwt/verify.js [app-route] (ecmascript)");
;
;
;
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'telegram-bot-secret-key-2024');
async function hashPassword(password) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].hash(password, 12);
}
async function verifyPassword(password, hashedPassword) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].compare(password, hashedPassword);
}
async function createUser(username, email, password) {
    const hashedPassword = await hashPassword(password);
    const user = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].user.create({
        data: {
            username,
            email,
            passwordHash: hashedPassword
        },
        select: {
            id: true,
            username: true,
            email: true,
            botDatabaseId: true,
            createdAt: true
        }
    });
    return user;
}
async function authenticateUser(email, password) {
    const user = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].user.findUnique({
        where: {
            email
        },
        select: {
            id: true,
            username: true,
            email: true,
            passwordHash: true,
            botDatabaseId: true,
            createdAt: true
        }
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
async function createSession(user) {
    const payload = {
        userId: user.id,
        username: user.username,
        email: user.email,
        exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60
    };
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$sign$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SignJWT"](payload).setProtectedHeader({
        alg: 'HS256'
    }).setIssuedAt().setExpirationTime('7d').sign(JWT_SECRET);
}
async function verifySession(token) {
    try {
        const { payload } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$verify$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jwtVerify"])(token, JWT_SECRET);
        const user = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].user.findUnique({
            where: {
                id: payload.userId
            },
            select: {
                id: true,
                username: true,
                email: true,
                botDatabaseId: true,
                createdAt: true
            }
        });
        return user;
    } catch (error) {
        return null;
    }
}
async function updateUserBotDatabaseId(userId, botDatabaseId) {
    const user = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].user.update({
        where: {
            id: userId
        },
        data: {
            botDatabaseId
        },
        select: {
            id: true,
            username: true,
            email: true,
            botDatabaseId: true,
            createdAt: true
        }
    });
    return user;
}
}),
"[externals]/better-sqlite3 [external] (better-sqlite3, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("better-sqlite3", () => require("better-sqlite3"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[project]/src/lib/bot-database.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BotDatabaseManager",
    ()=>BotDatabaseManager,
    "createBotDatabaseManager",
    ()=>createBotDatabaseManager,
    "loadBotHistory",
    ()=>loadBotHistory,
    "saveBotMessage",
    ()=>saveBotMessage,
    "validateBotDatabaseId",
    ()=>validateBotDatabaseId
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$better$2d$sqlite3__$5b$external$5d$__$28$better$2d$sqlite3$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/better-sqlite3 [external] (better-sqlite3, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
;
;
;
class BotDatabaseManager {
    botDatabaseId;
    dbPath;
    constructor(botDatabaseId){
        this.botDatabaseId = botDatabaseId;
        this.dbPath = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["join"])(process.cwd(), 'bot_databases', botDatabaseId, 'telegram_bot.db');
    }
    /**
   * Проверяет существование базы данных бота
   */ exists() {
        return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["existsSync"])(this.dbPath);
    }
    /**
   * Проверяет наличие таблицы message_history в базе данных
   */ hasMessageHistoryTable() {
        if (!this.exists()) {
            return false;
        }
        try {
            const db = new __TURBOPACK__imported__module__$5b$externals$5d2f$better$2d$sqlite3__$5b$external$5d$__$28$better$2d$sqlite3$2c$__cjs$29$__["default"](this.dbPath);
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
   */ async getMessages(userId, options = {}) {
        if (!this.exists() || !this.hasMessageHistoryTable()) {
            return {
                messages: [],
                total: 0
            };
        }
        const db = new __TURBOPACK__imported__module__$5b$externals$5d2f$better$2d$sqlite3__$5b$external$5d$__$28$better$2d$sqlite3$2c$__cjs$29$__["default"](this.dbPath);
        const page = options.page || 1;
        const limit = Math.min(options.limit || 50, 100);
        const offset = (page - 1) * limit;
        const filters = options.filters || {};
        try {
            // Строим WHERE условия
            const conditions = [];
            const params = [];
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
            const countResult = db.prepare(countQuery).get(...params);
            // Получаем сообщения с пагинацией
            const messagesQuery = `
        SELECT * FROM message_history 
        WHERE ${whereClause}
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
      `;
            const messages = db.prepare(messagesQuery).all(...params, limit, offset);
            return {
                messages,
                total: countResult.total
            };
        } catch (error) {
            console.error('Error getting messages:', error);
            return {
                messages: [],
                total: 0
            };
        } finally{
            db.close();
        }
    }
    /**
   * Получает статистику по сообщениям из существующей таблицы
   */ async getMessageStats(userId) {
        if (!this.exists() || !this.hasMessageHistoryTable()) {
            return {
                total: 0,
                incoming: 0,
                outgoing: 0,
                textMessages: 0,
                mediaMessages: 0
            };
        }
        const db = new __TURBOPACK__imported__module__$5b$externals$5d2f$better$2d$sqlite3__$5b$external$5d$__$28$better$2d$sqlite3$2c$__cjs$29$__["default"](this.dbPath);
        try {
            const whereClause = userId !== null ? 'WHERE user_id = ?' : '';
            const params = userId !== null ? [
                userId
            ] : [];
            const stats = db.prepare(`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN direction = 'incoming' THEN 1 ELSE 0 END) as incoming,
          SUM(CASE WHEN direction = 'outgoing' THEN 1 ELSE 0 END) as outgoing,
          SUM(CASE WHEN is_media = 0 THEN 1 ELSE 0 END) as textMessages,
          SUM(CASE WHEN is_media = 1 THEN 1 ELSE 0 END) as mediaMessages
        FROM message_history 
        ${whereClause}
      `).get(...params);
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
        } finally{
            db.close();
        }
    }
    /**
   * Сохраняет сообщение в базу данных
   */ async saveMessage(message) {
        if (!this.exists()) {
            // Создаем базу данных если ее нет
            this.createDatabase();
        }
        if (!this.hasMessageHistoryTable()) {
            // Создаем таблицу если ее нет
            this.createMessageHistoryTable();
        }
        const db = new __TURBOPACK__imported__module__$5b$externals$5d2f$better$2d$sqlite3__$5b$external$5d$__$28$better$2d$sqlite3$2c$__cjs$29$__["default"](this.dbPath);
        try {
            const stmt = db.prepare(`
        INSERT INTO message_history (
          user_id, message_id, sender_id, message_text, message_type, 
          media_file_id, is_media, is_bot, direction, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
            const result = stmt.run(message.user_id, Date.now(), message.sender_id, message.message_text || null, message.message_type, message.media_file_id || null, message.is_media ? 1 : 0, message.is_bot ? 1 : 0, message.direction, message.created_at);
            const insertedMessage = db.prepare(`
        SELECT * FROM message_history WHERE rowid = ?
      `).get(result.lastInsertRowid);
            return insertedMessage;
        } catch (error) {
            console.error('Error saving message:', error);
            throw error;
        } finally{
            db.close();
        }
    }
    /**
   * Создает базу данных и таблицу
   */ createDatabase() {
        const dbDir = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["join"])(process.cwd(), 'bot_databases', this.botDatabaseId);
        if (!(0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["existsSync"])(dbDir)) {
            (0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["mkdirSync"])(dbDir, {
                recursive: true
            });
        }
        const db = new __TURBOPACK__imported__module__$5b$externals$5d2f$better$2d$sqlite3__$5b$external$5d$__$28$better$2d$sqlite3$2c$__cjs$29$__["default"](this.dbPath);
        this.createMessageHistoryTable();
        db.close();
    }
    /**
   * Создает таблицу message_history
   */ createMessageHistoryTable() {
        const db = new __TURBOPACK__imported__module__$5b$externals$5d2f$better$2d$sqlite3__$5b$external$5d$__$28$better$2d$sqlite3$2c$__cjs$29$__["default"](this.dbPath);
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
   */ async createMessage(message) {
        if (!this.exists()) {
            // Создаем базу данных если ее нет
            this.createDatabase();
        }
        if (!this.hasMessageHistoryTable()) {
            // Создаем таблицу если ее нет
            this.createMessageHistoryTable();
        }
        const db = new __TURBOPACK__imported__module__$5b$externals$5d2f$better$2d$sqlite3__$5b$external$5d$__$28$better$2d$sqlite3$2c$__cjs$29$__["default"](this.dbPath);
        try {
            const stmt = db.prepare(`
        INSERT INTO message_history (
          user_id, message_id, sender_id, message_text, message_type, 
          media_file_id, is_media, is_bot, direction, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
            const result = stmt.run(message.user_id, message.message_id, message.sender_id, message.message_text || null, message.message_type, message.media_file_id || null, message.is_media ? 1 : 0, message.is_bot ? 1 : 0, message.direction, message.created_at);
            const insertedMessage = db.prepare(`
        SELECT * FROM message_history WHERE rowid = ?
      `).get(result.lastInsertRowid);
            return insertedMessage;
        } catch (error) {
            console.error('Error creating message:', error);
            throw error;
        } finally{
            db.close();
        }
    }
    /**
   * Инициализирует базу данных (создает если необходимо)
   */ async initialize() {
        if (!this.exists()) {
            this.createDatabase();
        }
    }
    /**
   * Закрывает соединение с базой данных
   */ async close() {
    // Для better-sqlite3 закрытие происходит автоматически
    // Но оставим метод для совместимости
    }
    /**
   * Получает информацию о базе данных
   */ getDatabaseInfo() {
        return {
            exists: this.exists(),
            hasTable: this.hasMessageHistoryTable(),
            path: this.dbPath
        };
    }
}
function createBotDatabaseManager(botDatabaseId) {
    return new BotDatabaseManager(botDatabaseId);
}
function validateBotDatabaseId(botDatabaseId) {
    // Только буквы, цифры и дефисы, минимум 3 символа
    return /^[a-zA-Z0-9-]{3,}$/.test(botDatabaseId);
}
async function loadBotHistory(userId, botDatabaseId, options = {}) {
    if (!botDatabaseId) {
        return {
            messages: [],
            total: 0,
            stats: null
        };
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
async function saveBotMessage(userId, botDatabaseId, message) {
    const botDb = createBotDatabaseManager(botDatabaseId);
    return await botDb.saveMessage({
        user_id: userId,
        ...message
    });
}
}),
"[project]/src/app/api/messages/history/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auth.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$bot$2d$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/bot-database.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-route] (ecmascript) <export * as z>");
;
;
;
;
const historyQuerySchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    page: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().transform((val)=>val ? parseInt(val) : 1),
    limit: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional().transform((val)=>val ? parseInt(val) : 50),
    chatId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    senderId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    direction: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        'inbound',
        'outbound',
        'all'
    ]).optional(),
    dateFrom: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    dateTo: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    search: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
});
async function GET(request) {
    try {
        const token = request.cookies.get('session-token')?.value;
        if (!token) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Не авторизован'
            }, {
                status: 401
            });
        }
        const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verifySession"])(token);
        if (!user) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Сессия недействительна'
            }, {
                status: 401
            });
        }
        if (!user.botDatabaseId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Бот не подключен'
            }, {
                status: 400
            });
        }
        const { searchParams } = new URL(request.url);
        const queryData = Object.fromEntries(searchParams.entries());
        const { page, limit, chatId, senderId, direction, dateFrom, dateTo, search } = historyQuerySchema.parse(queryData);
        // Преобразуем фильтры в формат для loadBotHistory
        const filters = {};
        if (chatId && chatId !== 'all') {
            // Для bot БД chatId соответствует user_id
            filters.userId = parseInt(chatId);
        }
        if (senderId && senderId !== 'all') {
            filters.senderId = parseInt(senderId);
        }
        if (direction && direction !== 'all') {
            filters.direction = direction === 'inbound' ? 'incoming' : 'outgoing';
        }
        if (dateFrom) {
            filters.dateFrom = dateFrom;
        }
        if (dateTo) {
            filters.dateTo = dateTo;
        }
        if (search) {
            filters.search = search;
        }
        // Получаем все сообщения (для всех пользователей)
        const userId = null;
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$bot$2d$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["loadBotHistory"])(userId, user.botDatabaseId, {
            page,
            limit,
            filters
        });
        // Если есть ошибка (например, БД не найдена), возвращаем пустые данные
        if (result.error) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                messages: [],
                pagination: {
                    page,
                    limit,
                    total: 0,
                    totalPages: 0,
                    hasNext: false,
                    hasPrev: false
                },
                filters: {
                    chats: [],
                    senders: []
                }
            });
        }
        // Обрабатываем сообщения: убираем ведущие нули из sender_id и заменяем ID бота на "bot"
        const processedMessages = result.messages.map((msg)=>{
            let processedSenderId = msg.sender_id.toString();
            // Убираем ведущие нули, но оставляем хотя бы одну цифру
            processedSenderId = processedSenderId.replace(/^0+/, '') || '0';
            // Заменяем 0 на 1 для корректного отображения
            if (processedSenderId === '0') {
                processedSenderId = '1';
            }
            // Если sender_id соответствует ID бота (большие числа или специфические ID)
            if (msg.sender_id === msg.bot_id || processedSenderId.startsWith('100') || processedSenderId.length > 10) {
                processedSenderId = 'bot';
            }
            return {
                ...msg,
                sender_id: processedSenderId
            };
        });
        // Группируем сообщения для фильтров
        const chatsMap = new Map();
        const sendersMap = new Map();
        processedMessages.forEach((msg)=>{
            // Группировка по чатам (user_id)
            const chatKey = msg.user_id.toString();
            if (!chatsMap.has(chatKey)) {
                chatsMap.set(chatKey, {
                    chat_id: chatKey,
                    last_message_date: msg.created_at,
                    message_count: 0,
                    last_message: msg.message_text || 'Медиа файл'
                });
            }
            chatsMap.get(chatKey).message_count++;
            if (new Date(msg.created_at) > new Date(chatsMap.get(chatKey).last_message_date)) {
                chatsMap.get(chatKey).last_message_date = msg.created_at;
                chatsMap.get(chatKey).last_message = msg.message_text || 'Медиа файл';
            }
            // Группировка по отправителям (с уже обработанными sender_id)
            const senderKey = msg.sender_id;
            if (!sendersMap.has(senderKey)) {
                sendersMap.set(senderKey, {
                    sender_id: senderKey,
                    message_count: 0,
                    last_message_date: msg.created_at
                });
            }
            sendersMap.get(senderKey).message_count++;
            if (new Date(msg.created_at) > new Date(sendersMap.get(senderKey).last_message_date)) {
                sendersMap.get(senderKey).last_message_date = msg.created_at;
            }
        });
        const chats = Array.from(chatsMap.values()).sort((a, b)=>new Date(b.last_message_date).getTime() - new Date(a.last_message_date).getTime());
        const senders = Array.from(sendersMap.values()).sort((a, b)=>new Date(b.last_message_date).getTime() - new Date(a.last_message_date).getTime());
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            messages: processedMessages,
            pagination: {
                page,
                limit,
                total: result.total,
                totalPages: Math.ceil(result.total / limit),
                hasNext: page * limit < result.total,
                hasPrev: page > 1
            },
            filters: {
                chats,
                senders
            }
        });
    } catch (error) {
        console.error('History fetch error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to fetch message history'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__a167daec._.js.map