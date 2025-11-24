const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, '../db/users.db');
const db = new Database(dbPath);

async function createDemoUsers() {
  try {
    console.log('Creating demo users...');
    
    // Clear existing users
    db.prepare('DELETE FROM users').run();
    console.log('Cleared existing users');
    
    // Hash passwords
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user 1 (no bot)
    db.prepare(`
      INSERT INTO users (id, username, email, password_hash, bot_database_id, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `).run(
      'user_1_id',
      'user1',
      'user1@example.com',
      hashedPassword,
      null
    );
    
    // Create user 2 (with bot)
    db.prepare(`
      INSERT INTO users (id, username, email, password_hash, bot_database_id, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `).run(
      'user_2_id',
      'user2',
      'user2@example.com',
      hashedPassword,
      'demo-bot'
    );
    
    console.log('✅ Demo users created successfully!');
    console.log('\n📋 Test Accounts:');
    console.log('1. User without bot:');
    console.log('   Email: user1@example.com');
    console.log('   Password: password123');
    console.log('\n2. User with bot:');
    console.log('   Email: user2@example.com');
    console.log('   Password: password123');
    console.log('   Bot Database ID: demo-bot');
    
  } catch (error) {
    console.error('❌ Error creating users:', error.message);
  } finally {
    db.close();
  }
}

createDemoUsers();