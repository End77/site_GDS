import express from "express";
import sqlite3 from "sqlite3";
import bcrypt from "bcryptjs";
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Настройка multer для загрузки файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB максимум
});

// 🔹 Подключение к базе
const db = new sqlite3.Database("./telegram_bot.db", (err) => {
  if (err) console.error("❌ Ошибка подключения к БД:", err.message);
  else console.log("✅ Подключено к базе telegram_bot.db");
});

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

// 🔹 Таблица пользователей
db.run(`
  CREATE TABLE IF NOT EXISTS users_new (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    first_name TEXT,
    last_name TEXT,
    is_op BOOLEAN DEFAULT 0,
    is_login BOOLEAN DEFAULT 0,
    is_new BOOLEAN DEFAULT 1,
    lang_id INTEGER,
    message_count INTEGER DEFAULT 0,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    role TEXT,
    company TEXT,
    password TEXT,
    email TEXT,
    email_normalized TEXT
  )
`);

// 🔹 Обновляем email_normalized для существующих пользователей
db.run("UPDATE users_new SET email_normalized = LOWER(email) WHERE email_normalized IS NULL");

// === Регистрация ===
app.post("/api/register", async (req, res) => {
  try {
    const { email, username, password, company, role } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email и пароль обязательны" });

    const normalizedEmail = email.trim().toLowerCase();

    db.get("SELECT * FROM users_new WHERE email_normalized = ?", [normalizedEmail], async (err, row) => {
      if (err) return res.status(500).json({ error: "Ошибка сервера при проверке email" });
      if (row) return res.status(400).json({ error: "Такой email уже зарегистрирован" });

      const hashed = await bcrypt.hash(password, 10);

      db.run(
        `INSERT INTO users_new (email, email_normalized, username, password, company, role, is_login, is_new)
         VALUES (?, ?, ?, ?, ?, ?, 0, 1)`,
        [email.trim(), normalizedEmail, username || "", hashed, company || "", role || "user"],
        function (err) {
          if (err) return res.status(500).json({ error: "Ошибка при регистрации пользователя" });

          res.cookie("user_id", this.lastID, { httpOnly: true, sameSite: "lax" }).json({
            success: true,
            message: "Пользователь успешно зарегистрирован",
          });
        }
      );
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// === Логин ===
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Введите email и пароль" });

    const normalizedEmail = email.trim().toLowerCase();

    db.get("SELECT * FROM users_new WHERE email_normalized = ?", [normalizedEmail], async (err, user) => {
      if (err) return res.status(500).json({ error: "Ошибка сервера" });
      if (!user) return res.status(401).json({ error: "Пользователь не найден" });

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.status(401).json({ error: "Неверный пароль" });

      db.run("UPDATE users_new SET is_login = 1 WHERE user_id = ?", [user.user_id]);
      res.cookie("user_id", user.user_id, { httpOnly: true, sameSite: "lax" }).json({
        id: user.user_id.toString(),
        email: user.email,
        username: user.username,
        company: user.company,
        role: user.role || "user",
        success: true,
      });
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// === Logout ===
app.post("/api/logout", (req, res) => {
  try {
    const user_id = req.cookies.user_id;
    if (!user_id) return res.status(400).json({ error: "Нет user_id для logout" });

    db.run("UPDATE users_new SET is_login = 0 WHERE user_id = ?", [user_id], (err) => {
      if (err) return res.status(500).json({ error: "Ошибка при logout" });
      res.clearCookie("user_id").json({ success: true, message: "Пользователь вышел" });
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// === Получение текущего пользователя ===
app.get("/api/me", (req, res) => {
  try {
    const user_id = req.cookies.user_id;
    if (!user_id) return res.status(401).json({ error: "Пользователь не авторизован" });

    db.get(
      "SELECT user_id, email, username, company, role FROM users_new WHERE user_id = ?",
      [user_id],
      (err, user) => {
        if (err) return res.status(500).json({ error: "Ошибка сервера" });
        if (!user) return res.status(404).json({ error: "Пользователь не найден" });
        
        console.log("Отправляем пользователя:", user);
        
        res.json({ 
          success: true, 
          user: {
            id: user.user_id.toString(),
            email: user.email,
            username: user.username,
            company: user.company,
            role: user.role || "user"
          }
        });
      }
    );
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// === Получение списка пользователей (БЕЗ АВТОРИЗАЦИИ) ===
app.get("/users/all", (req, res) => {
  console.log("📥 Запрос списка пользователей");
  const sql = "SELECT user_id AS id, username, company, role, email FROM users_new";

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("❌ Ошибка при получении пользователей:", err);
      return res.status(500).json({ error: "Ошибка при получении пользователей" });
    }
    
    console.log(`✅ Найдено пользователей: ${rows.length}`);
    
    const users = rows.map(r => ({
      id: r.id.toString(),
      username: r.username,
      company: r.company,
      role: r.role,
      email: r.email
    }));
    
    console.log(`📤 Отправляем ${users.length} пользователей клиенту`);
    res.json(users);
  });
});

// === Получение сообщений из message_history (БЕЗ АВТОРИЗАЦИИ) ===
app.get("/notes", (req, res) => {
  const all = req.query.all === "true";
  const toUserId = req.query.toUserId ? Number(req.query.toUserId) : null;

  let sql = "";
  let params = [];

  if (all) {
    // Получаем все сообщения из message_history
    sql = "SELECT * FROM message_history ORDER BY created_at ASC";
    console.log("Запрос всех сообщений из message_history");
  } else if (toUserId) {
    // Получаем сообщения конкретного пользователя
    sql = `
      SELECT * FROM message_history
      WHERE user_id = ? OR sender_id = ?
      ORDER BY created_at ASC
    `;
    params = [toUserId, toUserId];
    console.log(`Запрос сообщений для пользователя ${toUserId}`);
  } else {
    console.log("Ошибка: не указан toUserId и all не true");
    return res.status(400).json({ error: "toUserId не указан и all не true" });
  }

  db.all(sql, params, (err, rows) => {
    if (err) {
      console.error("❌ Ошибка при получении сообщений:", err);
      return res.status(500).json({ error: "Ошибка при получении сообщений", details: err.message });
    }
    
    console.log(`✅ Найдено сообщений: ${rows.length}`);
    
    if (rows.length > 0) {
      console.log("Пример первой записи:", JSON.stringify(rows[0], null, 2));
    }
    
    const messages = rows.map((r, index) => ({
      id: (r.id || r.message_id || index).toString(),
      fromUserId: (r.sender_id || "unknown").toString(),
      toUserId: (r.user_id || "unknown").toString(),
      text: r.message_text || "",
      messageType: r.message_type || "text",
      mediaFileId: r.media_file_id || null,
      isMedia: Boolean(r.is_media),
      isBot: Boolean(r.is_bot),
      direction: r.direction || "incoming",
      createdAt: r.created_at ? new Date(r.created_at).getTime() : Date.now(),
    }));
    
    console.log(`📤 Отправляем ${messages.length} сообщений клиенту`);
    res.json(messages);
  });
});

// === Отправка сообщения в message_history ===
app.post("/notes", (req, res) => {
  const sender_id = Number(req.cookies.user_id);
  const { toUserId, text } = req.body;
  const user_id = Number(toUserId);
  
  if (!sender_id || !user_id || !text) {
    return res.status(400).json({ error: "Не хватает данных" });
  }

  db.run(
    `INSERT INTO message_history (user_id, sender_id, message_text, message_type, is_media, is_bot, direction)
     VALUES (?, ?, ?, 'text', 0, 0, 'outgoing')`,
    [user_id, sender_id, text],
    function (err) {
      if (err) return res.status(500).json({ error: "Ошибка при отправке сообщения" });

      res.json({
        success: true,
        message: {
          id: this.lastID.toString(),
          fromUserId: sender_id.toString(),
          toUserId: user_id.toString(),
          text,
          createdAt: Date.now(),
        },
      });
    }
  );
});

// === Тест ===
app.get("/", (req, res) => res.send("✅ Сервер работает"));

// === Временный endpoint для исправления роли ===
app.post("/api/fix-admin", (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: "userId required" });
  
  db.run("UPDATE users_new SET role = 'admin' WHERE user_id = ?", [userId], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, message: `User ${userId} is now admin` });
  });
});

// === Проверка роли ===
app.get("/api/check-role/:userId", (req, res) => {
  db.get("SELECT user_id, username, role, LENGTH(role) as role_length FROM users_new WHERE user_id = ?", 
    [req.params.userId], 
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(row);
    }
  );
});

// === Листинг всех пользователей для отладки ===
db.all("SELECT user_id, email, username, company, role, LENGTH(role) as role_length FROM users_new", [], (err, rows) => {
  if (err) return console.error(err);
  console.log("📋 Список всех пользователей в базе:");
  rows.forEach((row) => console.log(`ID: ${row.user_id}, Email: ${row.email}, Username: ${row.username}, Company: ${row.company}, Role: '${row.role}' (длина: ${row.role_length})`));
});

// === Проверка содержимого message_history ===
db.all("SELECT COUNT(*) as count FROM message_history", [], (err, rows) => {
  if (err) return console.error("Ошибка проверки message_history:", err);
  console.log(`📨 Всего сообщений в message_history: ${rows[0].count}`);
});

// Проверка структуры таблицы
db.all("PRAGMA table_info(message_history)", [], (err, columns) => {
  if (err) return console.error("Ошибка получения структуры таблицы:", err);
  console.log("📋 Структура таблицы message_history:");
  columns.forEach(col => console.log(`  - ${col.name} (${col.type})`));
});

// Показываем первые 3 записи для проверки
db.all("SELECT * FROM message_history LIMIT 3", [], (err, rows) => {
  if (err) return console.error("Ошибка получения примеров:", err);
  console.log("📝 Первые 3 записи из message_history:");
  console.log(JSON.stringify(rows, null, 2));
});

app.listen(4001, () => console.log("🚀 Сервер запущен на http://localhost:4001"));