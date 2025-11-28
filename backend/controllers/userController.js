const { query } = require('../config/database');

// Получить профиль пользователя
const getUserProfile = async (req, res) => {
  try {
    const userId = req.userId;

    const result = await query(
      `SELECT id, full_name, email, phone, role, created_at, updated_at 
       FROM users WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Ошибка получения профиля:', error);
    res.status(500).json({ error: 'Ошибка при получении профиля' });
  }
};

// Обновить профиль пользователя
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { full_name, phone } = req.body;

    const result = await query(
      `UPDATE users SET full_name = $1, phone = $2, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $3 
       RETURNING id, full_name, email, phone, role, created_at, updated_at`,
      [full_name, phone, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    res.json({
      message: 'Профиль успешно обновлен',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Ошибка обновления профиля:', error);
    res.status(500).json({ error: 'Ошибка при обновлении профиля' });
  }
};

// Получить бронирования пользователя
const getUserBookings = async (req, res) => {
  try {
    const userId = req.userId;
    const { page = 1, limit = 10 } = req.query;

    const offset = (page - 1) * limit;

    const bookingsResult = await query(
      `SELECT b.*, t.name as tour_name, t.country, t.city, t.duration_days
       FROM bookings b
       JOIN tours t ON b.tour_id = t.id
       WHERE b.user_id = $1
       ORDER BY b.created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    const countResult = await query(
      'SELECT COUNT(*) FROM bookings WHERE user_id = $1',
      [userId]
    );

    const total = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(total / limit);

    res.json({
      bookings: bookingsResult.rows,
      pagination: {
        current: parseInt(page),
        total: totalPages,
        totalItems: total,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Ошибка получения бронирований:', error);
    res.status(500).json({ error: 'Ошибка при получении бронирований' });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getUserBookings
};