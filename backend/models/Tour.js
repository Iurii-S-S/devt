const { query } = require('../config/database');

class Tour {
  static async findAll(filters = {}) {
    const { country, minPrice, maxPrice, page = 1, limit = 10 } = filters;
    
    let whereConditions = ['is_active = true'];
    let queryParams = [];
    let paramCount = 0;

    if (country) {
      paramCount++;
      whereConditions.push(`country = $${paramCount}`);
      queryParams.push(country);
    }

    if (minPrice) {
      paramCount++;
      whereConditions.push(`price >= $${paramCount}`);
      queryParams.push(parseFloat(minPrice));
    }

    if (maxPrice) {
      paramCount++;
      whereConditions.push(`price <= $${paramCount}`);
      queryParams.push(parseFloat(maxPrice));
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
    
    const offset = (page - 1) * limit;
    paramCount++;
    queryParams.push(parseInt(limit));
    paramCount++;
    queryParams.push(offset);

    const toursResult = await query(
      `SELECT * FROM tours ${whereClause} ORDER BY created_at DESC LIMIT $${paramCount - 1} OFFSET $${paramCount}`,
      queryParams
    );

    const countResult = await query(
      `SELECT COUNT(*) FROM tours ${whereClause}`,
      queryParams.slice(0, -2)
    );

    return {
      tours: toursResult.rows,
      total: parseInt(countResult.rows[0].count)
    };
  }

  static async findById(id) {
    const result = await query(
      'SELECT * FROM tours WHERE id = $1 AND is_active = true',
      [id]
    );
    return result.rows[0];
  }

  static async create(tourData) {
    const {
      name,
      description,
      country,
      city,
      price,
      duration_days,
      image_url,
      available_spots,
      features
    } = tourData;

    const result = await query(
      `INSERT INTO tours (name, description, country, city, price, duration_days, image_url, available_spots, features)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [name, description, country, city, price, duration_days, image_url, available_spots, features || []]
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
      `UPDATE tours SET ${setClause.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      queryParams
    );

    return result.rows[0];
  }

  static async delete(id) {
    const result = await query(
      'DELETE FROM tours WHERE id = $1 RETURNING id',
      [id]
    );
    return result.rows[0];
  }
}

module.exports = Tour;