const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { testConnection } = require('./config/database');

// Загрузка переменных окружения
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/health', async (req, res) => {
  const dbStatus = await testConnection();
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    database: dbStatus ? 'Connected' : 'Disconnected',
    environment: process.env.NODE_ENV
  });
});

// Маршруты
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tours', require('./routes/tours'));
app.use('/api/users', require('./routes/users'));
app.use('/api/bookings', require('./routes/bookings'));

// Главная страница API
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 TravelDream API',
    version: '1.0.0',
    documentation: '/api/docs',
    health: '/health'
  });
});

// Обработка 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Маршрут не найден' });
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    error: process.env.NODE_ENV === 'production' 
      ? 'Внутренняя ошибка сервера' 
      : err.message 
  });
});

// Запуск сервера
const startServer = async () => {
  try {
    // Проверяем подключение к БД
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.log('⏳ Ожидание подключения к базе данных...');
      setTimeout(startServer, 5000);
      return;
    }

    app.listen(PORT, () => {
      console.log(`🚀 Сервер запущен на порту ${PORT}`);
      console.log(`📊 Окружение: ${process.env.NODE_ENV}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Не удалось запустить сервер:', error);
    process.exit(1);
  }
};

startServer();