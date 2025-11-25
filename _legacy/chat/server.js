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

// CORS с поддержкой credentials
app.use(cors({ 
  origin: ["http://localhost:3000", "http://localhost:5173"], 
  credentials: true 
}));
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

// 🔹 Таблица сообщений
db.run(`
  CREATE TABLE IF NOT EXISTS new_message_history (
    message_id INTEGER PRIMARY KEY AUTOINCREMENT,
    from_user_id INTEGER NOT NULL,
    to_user_id INTEGER NOT NULL,
    message_text TEXT NOT NULL,
    message_type TEXT DEFAULT 'text',
    media_file_id TEXT,
    is_media BOOLEAN DEFAULT 0,
    is_bot BOOLEAN DEFAULT 0,
    direction TEXT DEFAULT 'outgoing',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

// 🔹 Обновляем email_normalized для существующих пользователей
db.run("UPDATE users_new SET email_normalized = LOWER(email) WHERE email_normalized IS NULL");

// ============================================
// MIDDLEWARE: Декодирование токена из Next.js
// ============================================
function decodeToken(token) {
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
    
    // Проверяем срок действия (7 дней)
    if (Date.now() - decoded.timestamp > 60 * 60 * 24 * 7 * 1000) {
      return null;
    }
    
    return decoded;
  } catch (e) {
    return null;
  }
}

// ============================================
// AUTH MIDDLEWARE
// ============================================
function authMiddleware(req, res, next) {
  // Проверяем токен из Next.js (auth-token)
  const nextToken = req.cookies['auth-token'];
  
  if (nextToken) {
    const decoded = decodeToken(nextToken);
    if (decoded && decoded.userId) {
      // Устанавливаем user_id из токена Next.js
      req.cookies.user_id = decoded.userId;
      return next();
    }
  }
  
  // Проверяем обычный user_id cookie (для локальной авторизации)
  const userId = req.cookies.user_id;
  if (userId) {
    return next();
  }
  
  return res.status(401).json({ error: "Не авторизован" });
}

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
app.get("/api/me", authMiddleware, (req, res) => {
  try {
    const user_id = req.cookies.user_id;

    db.get(
      "SELECT user_id, email, username, company, role FROM users_new WHERE user_id = ?",
      [user_id],
      (err, user) => {
        if (err) return res.status(500).json({ error: "Ошибка сервера" });
        if (!user) return res.status(404).json({ error: "Пользователь не найден" });
        
        console.log("✅ Отправляем пользователя:", user);
        
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

// === Verify endpoint для Next.js Dashboard ===
app.get("/api/auth/verify", authMiddleware, (req, res) => {
  try {
    const user_id = req.cookies.user_id;

    db.get(
      "SELECT user_id, email, username, company, role FROM users_new WHERE user_id = ?",
      [user_id],
      (err, user) => {
        if (err) return res.status(500).json({ error: "Ошибка сервера" });
        if (!user) return res.status(404).json({ error: "Пользователь не найден" });
        
        res.json({ 
          user: {
            id: user.user_id.toString(),
            email: user.email,
            username: user.username,
            name: user.username, // для совместимости
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

// === Получение списка пользователей (с фильтрацией по компании) ===
app.get("/users/all", authMiddleware, (req, res) => {
  const user_id = req.cookies.user_id;

  // Получаем информацию о текущем пользователе
  db.get("SELECT role, company FROM users_new WHERE user_id = ?", [user_id], (err, currentUser) => {
    if (err) return res.status(500).json({ error: "Ошибка получения пользователя" });
    if (!currentUser) return res.status(404).json({ error: "Пользователь не найден" });

    let sql = "";
    let params = [];

    // Если админ - показываем всех пользователей
    if (currentUser.role === "admin") {
      sql = "SELECT user_id AS id, username, company, role, email FROM users_new";
    } else {
      // Если обычный user - показываем только коллег по компании
      sql = "SELECT user_id AS id, username, company, role, email FROM users_new WHERE company = ?";
      params = [currentUser.company];
    }

    db.all(sql, params, (err, rows) => {
      if (err) return res.status(500).json({ error: "Ошибка при получении пользователей" });
      res.json(rows.map(r => ({
        id: r.id.toString(),
        username: r.username,
        company: r.company,
        role: r.role,
        email: r.email
      })));
    });
  });
});

// === Получение сообщений между пользователями ===
app.get("/notes", authMiddleware, (req, res) => {
  const user_id = Number(req.cookies.user_id);
  const toUserId = Number(req.query.toUserId);
  const all = req.query.all === "true";

  // Проверяем роль пользователя
  db.get("SELECT role FROM users_new WHERE user_id = ?", [user_id], (err, currentUser) => {
    if (err) return res.status(500).json({ error: "Ошибка проверки пользователя" });
    if (!currentUser) return res.status(404).json({ error: "Пользователь не найден" });

    let sql = "";
    let params = [];

    if (all && currentUser.role === "admin") {
      // Админ получает все сообщения
      sql = "SELECT * FROM new_message_history ORDER BY created_at ASC";
    } else if (toUserId) {
      // Обычный пользователь или админ просматривает конкретный диалог
      sql = `
        SELECT * FROM new_message_history
        WHERE (from_user_id = ? AND to_user_id = ?) OR (from_user_id = ? AND to_user_id = ?)
        ORDER BY created_at ASC
      `;
      params = [user_id, toUserId, toUserId, user_id];
    } else {
      return res.status(400).json({ error: "toUserId не указан" });
    }

    db.all(sql, params, (err, rows) => {
      if (err) return res.status(500).json({ error: "Ошибка при получении сообщений" });
      res.json(
        rows.map((r) => ({
          id: r.message_id.toString(),
          fromUserId: r.from_user_id.toString(),
          toUserId: r.to_user_id.toString(),
          text: r.message_text,
          createdAt: new Date(r.created_at).getTime(),
        }))
      );
    });
  });
});

// === Отправка сообщения ===
app.post("/notes", authMiddleware, (req, res) => {
  const from_user_id = Number(req.cookies.user_id);
  const { toUserId, text } = req.body;
  const to_user_id = Number(toUserId);
  if (!from_user_id || !to_user_id || !text) return res.status(400).json({ error: "Не хватает данных" });

  db.run(
    `INSERT INTO new_message_history (from_user_id, to_user_id, message_text, message_type)
     VALUES (?, ?, ?, 'text')`,
    [from_user_id, to_user_id, text],
    function (err) {
      if (err) return res.status(500).json({ error: "Ошибка при отправке сообщения" });

      res.json({
        success: true,
        message: {
          id: this.lastID.toString(),
          fromUserId: from_user_id.toString(),
          toUserId: to_user_id.toString(),
          text,
          createdAt: Date.now(),
        },
      });
    }
  );
});

// === Тест ===
app.get("/", (req, res) => res.send("✅ Сервер чата работает"));

// === Временный endpoint для исправления роли (удалить после использования) ===
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
  console.log("\n📋 Список всех пользователей в базе:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  rows.forEach((row) => {
    console.log(`ID: ${row.user_id} | Email: ${row.email} | Username: ${row.username} | Company: ${row.company} | Role: '${row.role}' (длина: ${row.role_length})`);
  });
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
});

app.listen(4001, () => {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🚀 Сервер чата запущен на http://localhost:4001");
  console.log("✅ CORS разрешён для: localhost:3000, localhost:5173");
  console.log("✅ Поддержка токенов из Next.js Dashboard");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
});