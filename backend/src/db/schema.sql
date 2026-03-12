-- users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'client' CHECK (role IN ('client', 'artist', 'admin')),
    created_at TIMESTAMP DEFAULT NOW(),
)

-- artists profiles
CREATE TABLE artists {
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    username VARCHAR(50) UNIQUE NOT NULL,
    specialty TEXT[],
    rating DECIMAL(2,1) DEFAULT 5.0,
    reviews_count INTEGER DEFAULT 0,
    price_from INTEGER DEFAULT 0,
    bio TEXT,
    photo_url TEXT,
    available VARCHAR(20) DEFAULT 'this-week',
    created_at TIMESTAMP DEFAULT NOW(),
}

-- services
CREATE TABLE services {
    id SERIAL PRIMARY KEY,
    artist_id INTEGER REFERENCES artists(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    duration VARCHAR(50),
    price INTEGER NOT NULL,
    icon VARCHAR(18),
}

-- bookings
CREATE TABLE bookings {
    id SERIAL PRIMARY KEY,
    artist_id INTEGER REFERENCES artists(id),
    client_id INTEGER REFERENCES users(id),
    service_id INTEGER REFERENCES services(id),
    date DATE NOT NULL,
    time TIME NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    created_at TIMESTAMP DEFAULT NOW(),
}
