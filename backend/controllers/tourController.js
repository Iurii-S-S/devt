const { query } = require('../config/database');

// Получить все туры
const getAllTours = async (req, res) => {
  try {
    const { country, minPrice, maxPrice, page = 1, limit = 10 } = req.query;
    
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

    // Получаем туры
    const toursResult = await query(
      `SELECT * FROM tours ${whereClause} ORDER BY created_at DESC LIMIT $${paramCount - 1} OFFSET $${paramCount}`,
      queryParams
    );

    // Получаем общее количество для пагинации
    const countResult = await query(
      `SELECT COUNT(*) FROM tours ${whereClause}`,
      queryParams.slice(0, -2)
    );

    const total = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(total / limit);

    res.json({
      tours: toursResult.rows,
      pagination: {
        current: parseInt(page),
        total: totalPages,
        totalItems: total,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Ошибка получения туров:', error);
    res.status(500).json({ error: 'Ошибка при получении туров' });
  }
};

// Получить тур по ID
const getTourById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      'SELECT * FROM tours WHERE id = $1 AND is_active = true',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Тур не найден' });
    }

    res.json({ tour: result.rows[0] });
  } catch (error) {
    console.error('Ошибка получения тура:', error);
    res.status(500).json({ error: 'Ошибка при получении тура' });
  }
};

// Создать новый тур (только для админов)
const createTour = async (req, res) => {
  try {
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
    } = req.body;

    const result = await query(
      `INSERT INTO tours (name, description, country, city, price, duration_days, image_url, available_spots, features)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [name, description, country, city, price, duration_days, image_url, available_spots, features || []]
    );

    res.status(201).json({
      message: 'Тур успешно создан',
      tour: result.rows[0]
    });
  } catch (error) {
    console.error('Ошибка создания тура:', error);
    res.status(500).json({ error: 'Ошибка при создании тура' });
  }
};

// Обновить тур (только для админов)
const updateTour = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Проверяем существование тура
    const existingTour = await query(
      'SELECT id FROM tours WHERE id = $1',
      [id]
    );

    if (existingTour.rows.length === 0) {
      return res.status(404).json({ error: 'Тур не найден' });
    }

    // Динамическое построение запроса
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

    res.json({
      message: 'Тур успешно обновлен',
      tour: result.rows[0]
    });
  } catch (error) {
    console.error('Ошибка обновления тура:', error);
    res.status(500).json({ error: 'Ошибка при обновлении тура' });
  }
};

// Удалить тур (только для админов)
const deleteTour = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      'DELETE FROM tours WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Тур не найден' });
    }

    res.json({ message: 'Тур успешно удален' });
  } catch (error) {
    console.error('Ошибка удаления тура:', error);
    res.status(500).json({ error: 'Ошибка при удалении тура' });
  }
};

module.exports = {
  getAllTours,
  getTourById,
  createTour,
  updateTour,
  deleteTour
};