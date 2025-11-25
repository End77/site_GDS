// Конфигурация приложения
export const config = {
  // Настройки приложения
  app: {
    name: 'Telegram Bot Dashboard',
    version: '1.0.0',
    description: 'Панель управления для Telegram ботов',
  },

  // Базы данных
  databases: {
    // Основная база данных приложения
    main: {
      url: process.env.DATABASE_URL || 'file:../db/users.db',
      provider: 'sqlite',
    },
    
    // Шаблон пути для баз данных ботов
    botTemplate: process.env.BOT_DATABASE_TEMPLATE || 'file:./bot_databases/{botId}/telegram_bot.db',
    
    // Директория для баз данных ботов
    botDirectory: process.env.BOT_DATABASE_DIR || './bots',
    
    // Префикс для имен баз ботов
    botPrefix: process.env.BOT_DATABASE_PREFIX || 'bot_',
    
    // Суффикс для имен баз ботов
    botSuffix: process.env.BOT_DATABASE_SUFFIX || '_db',
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
    lockoutDuration: 15,
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
    autoRefreshInterval: 30,
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
    apiTimeout: 10000,
  },

  // Настройки сервера
  server: {
    // Порт сервера
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
    
    // Хост сервера
    host: process.env.HOST || 'localhost',
    
    // Режим разработки
    development: process.env.NODE_ENV === 'development',
    
    // CORS настройки
    cors: {
      origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
      credentials: true,
    },
  },

  // Настройки логирования
  logging: {
    // Уровень логирования
    level: process.env.LOG_LEVEL || 'info',
    
    // Файл для логов
    file: process.env.LOG_FILE || './logs/app.log',
    
    // Максимальный размер файла логов (в байтах)
    maxFileSize: 10 * 1024 * 1024, // 10MB
    
    // Количество файлов для ротации
    maxFiles: 5,
  },

  // Настройки кэширования
  cache: {
    // Время жизни кэша (в секундах)
    ttl: 300, // 5 минут
    
    // Максимальный размер кэша
    maxSize: 1000,
    
    // Интервал очистки кэша (в секундах)
    cleanupInterval: 600, // 10 минут
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
    previewMaxLength: 100,
  },

  // API эндпоинты
  api: {
    // Базовый URL для API
    baseUrl: process.env.API_BASE_URL || '/api',
    
    // Версия API
    version: 'v1',
    
    // Таймаут для запросов (в миллисекундах)
    timeout: 30000,
  },

  // Настройки безопасности
  security: {
    // Максимальный размер запроса (в байтах)
    maxRequestSize: 10 * 1024 * 1024, // 10MB
    
    // Ограничение частоты запросов
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 минут
      max: 100, // максимум 100 запросов
    },
    
    // Настройки CSRF
    csrf: {
      enabled: true,
      secret: process.env.CSRF_SECRET || 'csrf-secret-key',
    },
  },
};

// Вспомогательные функции для работы с путями баз данных
export const getBotDatabasePath = (botId: string): string => {
  return config.databases.botTemplate.replace('{botId}', botId);
};

export const getBotDatabaseUrl = (botId: string): string => {
  const path = getBotDatabasePath(botId);
  return `file:${path}`;
};

export const isValidBotId = (botId: string): boolean => {
  return (
    botId.length >= config.bots.botIdMinLength &&
    botId.length <= config.bots.botIdMaxLength &&
    config.bots.botIdPattern.test(botId)
  );
};

// Получение полного URL для API
export const getApiUrl = (endpoint: string): string => {
  return `${config.api.baseUrl}/${config.api.version}${endpoint}`;
};

// Получение текущего окружения
export const isDevelopment = (): boolean => config.server.development;
export const isProduction = (): boolean => process.env.NODE_ENV === 'production';
export const isTest = (): boolean => process.env.NODE_ENV === 'test';

export default config;
