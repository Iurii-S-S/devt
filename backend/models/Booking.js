const { query } = require('../config/database');

class Booking {
  static async create(bookingData) {
    const { user_id, tour_id, travelers_count, total_price, special_requests } = bookingData;

    const result = await query(
      `INSERT INTO bookings (user_id, tour_id, travelers_count, total_price, special_requests)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [user_id, tour_id, travelers_count, total_price, special_requests]
    );

    return result.rows[0];
  }

  static async findByUserId(userId, page = 1, limit = 10) {
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

    return {
      bookings: bookingsResult.rows,
      total: parseInt(countResult.rows[0].count)
    };
  }

  static async findById(id) {
    const result = await query(
      `SELECT b.*, t.name as tour_name, t.country, t.city, t.duration_days,
              u.full_name as user_name, u.email as user_email
       FROM bookings b
       JOIN tours t ON b.tour_id = t.id
       JOIN users u ON b.user_id = u.id
       WHERE b.id = $1`,
      [id]
    );
    return result.rows[0];
  }

  static async updateStatus(id, status) {
    const result = await query(
      'UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    return result.rows[0];
  }

  static async getUserBooking(userId, bookingId) {
    const result = await query(
      `SELECT b.*, t.name as tour_name, t.country, t.city, t.duration_days
       FROM bookings b
       JOIN tours t ON b.tour_id = t.id
       WHERE b.id = $1 AND b.user_id = $2`,
      [bookingId, userId]
    );
    return result.rows[0];
  }
}

module.exports = Booking;