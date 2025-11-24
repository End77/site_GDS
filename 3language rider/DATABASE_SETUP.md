# Настройка базы данных проекта

## Файлы конфигурации

### `.env` (основной файл)
```env
# Database
DATABASE_URL="file:db/users.db"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# JWT Secret
JWT_SECRET="your-jwt-secret-here"
```

### `.env.local` (локальные настройки)
```env
# Database
DATABASE_URL="file:db/users.db"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# JWT Secret
JWT_SECRET="your-jwt-secret-here"
```

## Структура базы данных

### Основная база данных пользователей
- **Файл**: `db/users.db`
- **Таблица**: `users`
- **Поля**:
  - `id` (TEXT, PRIMARY KEY)
  - `username` (TEXT, UNIQUE)
  - `email` (TEXT, UNIQUE)
  - `password_hash` (TEXT)
  - `bot_database_id` (TEXT, nullable)
  - `created_at` (DATETIME)
  - `updated_at` (DATETIME)
- **Примечание**: Все поля используют snake_case в базе данных, Prisma автоматически мапит их в camelCase

### Базы данных ботов
- **Расположение**: `bot_databases/{bot-id}/telegram_bot.db`
- **Таблица**: `message_history`
- **Автоматическое создание**: при подключении нового бота

## Тестовые пользователи

1. **Пользователь без бота**:
   - Email: `user1@example.com`
   - Пароль: `password123`

2. **Пользователь с ботом**:
   - Email: `user2@example.com`
   - Пароль: `password123`
   - ID бота: `demo-bot`

## Конфигурация в коде

### Улучшенная конфигурация Prisma (`src/lib/db.ts`)
Файл автоматически обрабатывает относительные пути и преобразует их в абсолютные:

```typescript
const getDatabaseUrl = () => {
  if (process.env.DATABASE_URL) {
    // Если уже абсолютный путь, используем как есть
    if (process.env.DATABASE_URL.startsWith('file:/')) {
      return process.env.DATABASE_URL
    }
    // Если относительный путь, преобразуем в абсолютный
    if (process.env.DATABASE_URL.startsWith('file:')) {
      const relativePath = process.env.DATABASE_URL.replace('file:', '')
      const absolutePath = join(process.cwd(), relativePath)
      return `file:${absolutePath}`
    }
  }
  // Запасной вариант
  return `file:${join(process.cwd(), 'db', 'users.db')}`
}
```

## Команды для управления базой данных

```bash
# Создать/обновить схему базы данных
npm run db:push

# Сгенерировать Prisma клиент
npm run db:generate

# Создать миграцию
npm run db:migrate

# Сбросить базу данных
npm run db:reset
```

## Примечания

- Относительные路径 работают в контексте Next.js приложения
- Для тестирования вне приложения используйте абсолютные пути
- Все базы данных используют SQLite
- Автоматическое резервное копирование не настроено