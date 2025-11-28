const express = require('express');
const { body } = require('express-validator');
const { register, login, getProfile } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Валидация для регистрации
const registerValidation = [
  body('full_name')
    .isLength({ min: 2, max: 100 })
    .withMessage('ФИО должно содержать от 2 до 100 символов'),
  body('email')
    .isEmail()
    .withMessage('Введите корректный email'),
  body('phone')
    .isLength({ min: 5, max: 20 })
    .withMessage('Телефон должен содержать от 5 до 20 символов'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Пароль должен содержать минимум 6 символов')
];

// Валидация для входа
const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Введите корректный email'),
  body('password')
    .notEmpty()
    .withMessage('Пароль обязателен')
];

// Маршруты
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/profile', authenticateToken, getProfile);

module.exports = router;