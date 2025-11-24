# Конфигурация приложения

## Обзор

Приложение использует централизованную систему конфигурации, которая позволяет управлять всеми важными параметрами через переменные окружения и конфигурационные файлы.

## Файлы конфигурации

### Основной конфигурационный файл
- **Расположение**: `src/config/index.ts`
- **Назначение**: Централизованное хранение всех настроек приложения

### Файл переменных окружения
- **Расположение**: `.env.example` (шаблон)
- **Рабочий файл**: `.env.local` (создается разработчиком)
- **Назначение**: Переменные окружения для разных окружений

## Структура конфигурации

### 1. Настройки приложения (`app`)
```typescript
app: {
  name: 'Telegram Bot Dashboard',
  version: '1.0.0',
  description: 'Панель управления для Telegram ботов',
}
```

### 2. Базы данных (`databases`)
```typescript
databases: {
  main: {
    url: process.env.DATABASE_URL || 'file:./dev.db',
    provider: 'sqlite',
  },
  botTemplate: process.env.BOT_DATABASE_TEMPLATE || 'file:./bots/{botId}.db',
  botDirectory: process.env.BOT_DATABASE_DIR || './bots',
  botPrefix: process.env.BOT_DATABASE_PREFIX || 'bot_',
  botSuffix: process.env.BOT_DATABASE_SUFFIX || '_db',
}
```

#### Пути к базам данных
- **Основная база**: `file:./dev.db` (по умолчанию)
- **Базы ботов**: `file:./bots/{botId}.db` (шаблон)
- **Пример**: `file:./bots/my-telegram-bot.db`

### 3. Аутентификация (`auth`)
```typescript
auth: {
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  tokenExpiry: 24, // часы
  maxLoginAttempts: 5,
  lockoutDuration: 15, // минуты
}
```

### 4. Сообщения (`messages`)
```typescript
messages: {
  pageSize: 50,
  maxMessages: 1000,
  maxMessageLength: 4000,
  autoRefreshInterval: 30, // секунды
}
```

### 5. Настройки ботов (`bots`)
```typescript
bots: {
  maxBotsPerUser: 10,
  botIdMinLength: 3,
  botIdMaxLength: 50,
  botIdPattern: /^[a-zA-Z0-9_-]+$/,
  apiTimeout: 10000, // миллисекунды
}
```

## Вспомогательные функции

### Работа с путями баз данных
```typescript
import { getBotDatabasePath, getBotDatabaseUrl, isValidBotId } from '@/config';

// Получить путь к базе данных бота
const path = getBotDatabasePath('my-bot'); // "file:./bots/my-bot.db"

// Получить полный URL для подключения
const url = getBotDatabaseUrl('my-bot'); // "file:./bots/my-bot.db"

// Проверить валидность ID бота
const isValid = isValidBotId('my-bot'); // true
```

### Работа с API
```typescript
import { getApiUrl } from '@/config';

const apiUrl = getApiUrl('/messages'); // "/api/v1/messages"
```

### Определение окружения
```typescript
import { isDevelopment, isProduction, isTest } from '@/config';

if (isDevelopment()) {
  console.log('Development mode');
}
```

## Переменные окружения

### Обязательные переменные
- `DATABASE_URL`: URL основной базы данных
- `JWT_SECRET`: Секретный ключ для JWT токенов

### Опциональные переменные
- `BOT_DATABASE_TEMPLATE`: Шаблон пути к базам ботов
- `BOT_DATABASE_DIR`: Директория для баз ботов
- `NODE_ENV`: Окружение (development/production/test)
- `PORT`: Порт сервера
- `LOG_LEVEL`: Уровень логирования

## Использование в коде

### Импорт конфигурации
```typescript
import { config } from '@/config';

// Использование настроек
const pageSize = config.messages.pageSize;
const jwtSecret = config.auth.jwtSecret;
```

### Использование Database Manager
```typescript
import { databaseManager } from '@/lib/database-manager';

// Получение основной базы данных
const mainDb = databaseManager.getMainDatabase();

// Получение базы данных бота
const botDb = databaseManager.getBotDatabase('my-bot');
```

## Безопасность

### JWT секрет
- Используйте сильный случайный ключ в production
- Храните в переменных окружения, не в коде
- Регулярно обновляйте ключ

### Базы данных
- Разделяйте базы данных разных ботов
- Используйте разные файлы для разных окружений
- Ограничивайте доступ к файлам баз данных

## Рекомендации

### Development
- Используйте `.env.local` для локальных настроек
- Включите подробное логирование
- Используйте SQLite для простоты

### Production
- Используйте внешнюю базу данных (PostgreSQL)
- Настройте ротацию логов
- Используйте HTTPS
- Настройте резервное копирование

### Тестирование
- Используйте отдельную тестовую базу данных
- Изолируйте тестовые данные
- Используйте in-memory базы данных для юнит-тестов

## Примеры конфигурации

### Разработка (.env.local)
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="dev-secret-key"
NODE_ENV="development"
LOG_LEVEL="debug"
```

### Продакшн (.env.production)
```env
DATABASE_URL="postgresql://user:pass@localhost:5432/telegram_bots"
JWT_SECRET="super-secure-production-key"
NODE_ENV="production"
LOG_LEVEL="info"
PORT=3000
```

### Тестирование (.env.test)
```env
DATABASE_URL="file:./test.db"
JWT_SECRET="test-secret-key"
NODE_ENV="test"
LOG_LEVEL="error"
```