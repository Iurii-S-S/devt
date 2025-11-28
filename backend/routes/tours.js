const express = require('express');
const { body } = require('express-validator');
const {
  getAllTours,
  getTourById,
  createTour,
  updateTour,
  deleteTour
} = require('../controllers/tourController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// Валидация для создания/обновления тура
const tourValidation = [
  body('name')
    .isLength({ min: 2, max: 100 })
    .withMessage('Название тура должно содержать от 2 до 100 символов'),
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Описание не должно превышать 1000 символов'),
  body('country')
    .isLength({ min: 2, max: 50 })
    .withMessage('Название страны должно содержать от 2 до 50 символов'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Цена должна быть положительным числом'),
  body('duration_days')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Длительность должна быть положительным числом'),
  body('available_spots')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Количество мест должно быть неотрицательным числом')
];

// Публичные маршруты
router.get('/', getAllTours);
router.get('/:id', getTourById);

// Защищенные маршруты (только для админов)
router.post('/', authenticateToken, requireAdmin, tourValidation, handleValidationErrors, createTour);
router.put('/:id', authenticateToken, requireAdmin, tourValidation, handleValidationErrors, updateTour);
router.delete('/:id', authenticateToken, requireAdmin, deleteTour);

module.exports = router;