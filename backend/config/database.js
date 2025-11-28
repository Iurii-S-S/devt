const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  // Настройки для Docker
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  // Повторные попытки подключения
  retryDelay: 5000,
  retryCount: 5
});

// Функция для проверки подключения с повторными попытками
const testConnection = async (retries = 5) => {
  for (let i = 0; i < retries; i++) {
    try {
      const client = await pool.connect();
      console.log('✅ База данных подключена успешно');
      client.release();
      return true;
    } catch (error) {
      console.log(`❌ Попытка ${i + 1}/${retries} - Ошибка подключения к БД:`, error.message);
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
  }
  return false;
};

// Функция для выполнения запросов
const query = (text, params) => {
  return pool.query(text, params);
};

// Обработка ошибок подключения
pool.on('error', (err) => {
  console.error('❌ Неожиданная ошибка базы данных:', err);
});

module.exports = {
  pool,
  query,
  testConnection
};