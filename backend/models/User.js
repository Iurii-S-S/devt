const { query } = require('../config/database');

class User {
  static async findByEmail(email) {
    const result = await query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0];
  }

  static async findById(id) {
    const result = await query(
      'SELECT id, full_name, email, phone, role, created_at FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  static async create(userData) {
    const { full_name, email, phone, password_hash } = userData;
    
    const result = await query(
      `INSERT INTO users (full_name, email, phone, password_hash) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, full_name, email, phone, created_at`,
      [full_name, email, phone, password_hash]
    );
    
    return result.rows[0];
  }

  static async update(id, updates) {
    const setClause = [];
    const queryParams = [];
    let paramCount = 0;

    Object.keys(updates).forEach(key => {
      paramCount++;
      setClause.push(`${key} = $${paramCount}`);
      queryParams.push(updates[key]);
    });

    paramCount++;
    queryParams.push(id);

    const result = await query(
      `UPDATE users SET ${setClause.join(', ')}, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $${paramCount} 
       RETURNING id, full_name, email, phone, role, created_at, updated_at`,
      queryParams
    );

    return result.rows[0];
  }
}

module.exports = User;