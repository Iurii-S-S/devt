-- Добавление тестовых пользователей (пароль: 123456)
INSERT INTO users (full_name, email, phone, password_hash, role) VALUES
('Иван Иванов', 'ivan@mail.ru', '+79161234567', '$2a$10$N9qo8uLOickgx2ZMRZoMye.MWq.BM6QO2Z2IqKqQYdL6QZ7Q1qJ1K', 'user'),
('Мария Петрова', 'maria@mail.ru', '+79161234568', '$2a$10$N9qo8uLOickgx2ZMRZoMye.MWq.BM6QO2Z2IqKqQYdL6QZ7Q1qJ1K', 'user'),
('Админ Админов', 'admin@traveldream.ru', '+79161234569', '$2a$10$N9qo8uLOickgx2ZMRZoMye.MWq.BM6QO2Z2IqKqQYdL6QZ7Q1qJ1K', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Добавление тестовых туров
INSERT INTO tours (name, description, country, city, price, duration_days, available_spots, features) VALUES
('Турция, Анталия', 'Все включено 5* отель на берегу моря с бассейном и спа', 'Турция', 'Анталия', 25000.00, 7, 15, '["all_inclusive", "pool", "spa", "wifi"]'),
('Египет, Хургада', 'Дайвинг и экскурсии к пирамидам. Отель 4* на первой линии', 'Египет', 'Хургада', 30000.00, 10, 20, '["breakfast", "pool", "diving", "excursions"]'),
('Тайланд, Пхукет', 'Экзотический отдых на островах. Отель 5* с частным пляжем', 'Тайланд', 'Пхукет', 45000.00, 14, 10, '["breakfast", "private_beach", "spa", "transfer"]'),
('Турция, Стамбул', 'Экскурсионный тур по историческим местам. Отель в центре города', 'Турция', 'Стамбул', 35000.00, 5, 25, '["breakfast", "city_center", "excursions", "wifi"]'),
('Египет, Шарм-эль-Шейх', 'Роскошный отдых на Красном море. Отель 5* премиум класса', 'Египет', 'Шарм-эль-Шейх', 40000.00, 8, 12, '["all_inclusive", "luxury", "spa", "diving"]'),
('Тайланд, Бангкок', 'Городской тур + пляжный отдых. Знакомство с культурой Тайланда', 'Тайланд', 'Бангкок', 50000.00, 12, 8, '["breakfast", "city_tour", "cultural", "shopping"]')
ON CONFLICT DO NOTHING;

-- Добавление тестовых бронирований
INSERT INTO bookings (user_id, tour_id, travelers_count, total_price, status) VALUES
(1, 1, 2, 50000.00, 'confirmed'),
(1, 3, 1, 45000.00, 'pending'),
(2, 2, 3, 90000.00, 'confirmed')
ON CONFLICT DO NOTHING;