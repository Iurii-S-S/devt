const express = require('express');
const { body } = require('express-validator');
const {
  getUserProfile,
  updateUserProfile,
  getUserBookings
} = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// Валидация для обновления профиля
const updateProfileValidation = [
  body('full_name')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('ФИО должно содержать от 2 до 100 символов'),
  body('phone')
    .optional()
    .isLength({ min: 5, max: 20 })
    .withMessage('Телефон должен содержать от 5 до 20 символов')
];

// Защищенные маршруты
router.get('/profile', authenticateToken, getUserProfile);
router.put('/profile', authenticateToken, updateProfileValidation, handleValidationErrors, updateUserProfile);
router.get('/bookings', authenticateToken, getUserBookings);

module.exports = router;