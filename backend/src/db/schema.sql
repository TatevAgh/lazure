-- =============================================
-- LaZure Database Schema
-- Запустить: psql -U postgres -d lazure_db -f schema.sql
-- =============================================

-- Удаляем старые таблицы если есть (для чистого старта)
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS artists CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ─────────────────────────────────────────────
-- USERS
-- ─────────────────────────────────────────────
CREATE TABLE users (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100),
    phone       VARCHAR(20) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role        VARCHAR(20) DEFAULT 'client' CHECK (role IN ('client', 'artist', 'admin')),
    is_active   BOOLEAN DEFAULT true,
    created_at  TIMESTAMP DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- ARTISTS (профиль мастера, связан с users)
-- ─────────────────────────────────────────────
CREATE TABLE artists (
    id            SERIAL PRIMARY KEY,
    user_id       INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    username      VARCHAR(50) UNIQUE NOT NULL,
    specialty     TEXT[],
    rating        DECIMAL(3,2) DEFAULT 5.0,
    reviews_count INTEGER DEFAULT 0,
    price_from    INTEGER DEFAULT 0,
    bio           TEXT,
    photo_url     TEXT,
    available     VARCHAR(20) DEFAULT 'this-week'
                    CHECK (available IN ('today', 'tomorrow', 'this-week')),
    is_verified   BOOLEAN DEFAULT false,
    created_at    TIMESTAMP DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- SERVICES (услуги мастера)
-- ─────────────────────────────────────────────
CREATE TABLE services (
    id        SERIAL PRIMARY KEY,
    artist_id INTEGER REFERENCES artists(id) ON DELETE CASCADE,
    name      VARCHAR(100) NOT NULL,
    duration  VARCHAR(50),
    price     INTEGER NOT NULL,
    icon      VARCHAR(10) DEFAULT '💅'
);

-- ─────────────────────────────────────────────
-- BOOKINGS (бронирования)
-- ─────────────────────────────────────────────
CREATE TABLE bookings (
    id         SERIAL PRIMARY KEY,
    artist_id  INTEGER REFERENCES artists(id) ON DELETE CASCADE,
    client_id  INTEGER REFERENCES users(id) ON DELETE CASCADE,
    service_id INTEGER REFERENCES services(id) ON DELETE SET NULL,
    date       DATE NOT NULL,
    time       TIME NOT NULL,
    status     VARCHAR(20) DEFAULT 'pending'
                 CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    notes      TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- Тестовые данные (можно удалить потом)
-- ─────────────────────────────────────────────
-- Пароль для всех тестовых пользователей: "password123"
-- (bcrypt hash для "password123")
INSERT INTO users (name, phone, password_hash, role) VALUES
    ('Admin LaZure',  '+37400000000', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'),
    ('Gaya Nails',    '+37491111111', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'artist'),
    ('Ani Vardanyan', '+37492222222', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'artist'),
    ('Test Client',   '+37493333333', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'client');

INSERT INTO artists (user_id, username, specialty, rating, reviews_count, price_from, bio, available) VALUES
    (2, 'nails_by_gaya',  ARRAY['Gel Manicure', 'Nail Art', 'Acrylic'], 4.9, 124, 8000,  'Профессиональный мастер с 5-летним опытом', 'today'),
    (3, 'ani_nails',       ARRAY['Gel', 'French', 'Pedicure'],           4.7, 89,  6500,  'Специализируюсь на натуральном маникюре',   'tomorrow'),
    (4, 'lian_nails', ARRAY['Gel', 'French', 'Pedicure'],   4.7, 89,  6500, 'Специализируюсь на натуральном маникюре',   'tomorrow');

INSERT INTO services (artist_id, name, duration, price, icon) VALUES
    (1, 'Gel Manicure',  '60 min', 8000,  '💅'),
    (1, 'Nail Art',      '90 min', 12000, '🎨'),
    (1, 'Acrylic Set',   '120 min', 15000, '✨'),
    (2, 'Gel Manicure',  '60 min', 6500,  '💅'),
    (2, 'French Manicure','75 min', 9000, '🤍'),
    (2, 'Pedicure',      '60 min', 7000,  '🦶');
