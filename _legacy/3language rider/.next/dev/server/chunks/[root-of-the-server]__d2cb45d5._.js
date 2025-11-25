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
"[project]/src/app/api/auth/login/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auth.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-route] (ecmascript) <export * as z>");
;
;
;
const loginSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    email: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().email('Введите корректный email'),
    password: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, 'Введите пароль')
});
async function POST(request) {
    try {
        const body = await request.json();
        const { email, password } = loginSchema.parse(body);
        const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["authenticateUser"])(email, password);
        if (!user) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Неверный email или пароль'
            }, {
                status: 401
            });
        }
        const token = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createSession"])(user);
        const response = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            message: 'Вход выполнен успешно',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                botDatabaseId: user.botDatabaseId
            }
        });
        response.cookies.set('session-token', token, {
            httpOnly: true,
            secure: ("TURBOPACK compile-time value", "development") === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60
        });
        return response;
    } catch (error) {
        console.error('Login error:', error);
        if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].ZodError) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Ошибка валидации',
                details: error.errors
            }, {
                status: 400
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Внутренняя ошибка сервера'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__d2cb45d5._.js.map