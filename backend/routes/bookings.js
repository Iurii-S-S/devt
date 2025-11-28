const express = require('express');
const { body } = require('express-validator');
const { query } = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');
const Booking = require('../models/Booking');

const router = express.Router();

// Валидация для бронирования
const bookingValidation = [
  body('tour_id')
    .isInt({ min: 1 })
    .withMessage('ID тура должен быть положительным числом'),
  body('travelers_count')
    .isInt({ min: 1, max: 10 })
    .withMessage('Количество путешественников должно быть от 1 до 10'),
  body('special_requests')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Особые пожелания не должны превышать 500 символов')
];

// Создать бронирование
const createBooking = async (req, res) => {
  try {
    const { tour_id, travelers_count, special_requests } = req.body;
    const user_id = req.userId;

    // Проверяем существование тура и получаем цену
    const tourResult = await query(
      'SELECT id, price, available_spots FROM tours WHERE id = $1 AND is_active = true',
      [tour_id]
    );

    if (tourResult.rows.length === 0) {
      return res.status(404).json({ error: 'Тур не найден' });
    }

    const tour = tourResult.rows[0];

    // Проверяем доступность мест
    if (tour.available_spots < travelers_count) {
      return res.status(400).json({ error: 'Недостаточно свободных мест' });
    }

    // Рассчитываем общую стоимость
    const total_price = tour.price * travelers_count;

    // Создаем бронирование
    const booking = await Booking.create({
      user_id,
      tour_id,
      travelers_count,
      total_price,
      special_requests
    });

    // Обновляем количество доступных мест
    await query(
      'UPDATE tours SET available_spots = available_spots - $1 WHERE id = $2',
      [travelers_count, tour_id]
    );

    res.status(201).json({
      message: 'Бронирование успешно создано',
      booking
    });
  } catch (error) {
    console.error('Ошибка создания бронирования:', error);
    res.status(500).json({ error: 'Ошибка при создании бронирования' });
  }
};

// Получить бронирование по ID
const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.userId;
    const user_role = req.userRole;

    let booking;
    if (user_role === 'admin') {
      booking = await Booking.findById(id);
    } else {
      booking = await Booking.getUserBooking(user_id, id);
    }

    if (!booking) {
      return res.status(404).json({ error: 'Бронирование не найдено' });
    }

    res.json({ booking });
  } catch (error) {
    console.error('Ошибка получения бронирования:', error);
    res.status(500).json({ error: 'Ошибка при получении бронирования' });
  }
};

// Обновить статус бронирования (только для админов)
const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Неверный статус бронирования' });
    }

    const booking = await Booking.updateStatus(id, status);

    if (!booking) {
      return res.status(404).json({ error: 'Бронирование не найдено' });
    }

    res.json({
      message: 'Статус бронирования успешно обновлен',
      booking
    });
  } catch (error) {
    console.error('Ошибка обновления статуса бронирования:', error);
    res.status(500).json({ error: 'Ошибка при обновлении статуса бронирования' });
  }
};

// Маршруты
router.post('/', authenticateToken, bookingValidation, handleValidationErrors, createBooking);
router.get('/:id', authenticateToken, getBookingById);
router.patch('/:id/status', authenticateToken, requireAdmin, updateBookingStatus);

module.exports = router;