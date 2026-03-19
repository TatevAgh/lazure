const pool = require('../db')

// ─────────────────────────────────────────────
// СПИСОК ВСЕХ МАСТЕРОВ
// GET /api/artists
// Query params: ?available=today&max_price=10000
// ─────────────────────────────────────────────
const getArtists = async (req, res) => {
    const { available, max_price } = req.query

    try {
        let query = `
            SELECT 
                a.id,
                a.username,
                a.specialty,
                a.rating,
                a.reviews_count AS reviews,
                a.price_from AS "priceFrom",
                a.available,
                a.photo_url AS photo,
                a.is_verified,
                u.name
            FROM artists a
            JOIN users u ON a.user_id = u.id
            WHERE 1=1
        `
        const params = []

        if (available) {
            params.push(available)
            query += ` AND a.available = $${params.length}`
        }
        if (max_price) {
            params.push(Number(max_price))
            query += ` AND a.price_from <= $${params.length}`
        }

        query += ' ORDER BY a.rating DESC'

        const result = await pool.query(query, params)
        res.json(result.rows)
    } catch (err) {
        console.error('getArtists error:', err)
        res.status(500).json({ error: err.message })
    }
}

// ─────────────────────────────────────────────
// ПРОФИЛЬ ОДНОГО МАСТЕРА
// GET /api/artists/:username
// ─────────────────────────────────────────────
const getArtistByUsername = async (req, res) => {
    const { username } = req.params

    try {
        const artistResult = await pool.query(
            `SELECT a.*, u.name, u.phone
             FROM artists a
             JOIN users u ON a.user_id = u.id
             WHERE a.username = $1`,
            [username]
        )

        if (artistResult.rows.length === 0) {
            return res.status(404).json({ error: 'Artist not found' })
        }

        const artist = artistResult.rows[0]

        // Получаем услуги этого мастера
        const servicesResult = await pool.query(
            'SELECT * FROM services WHERE artist_id = $1 ORDER BY price',
            [artist.id]
        )

        res.json({ ...artist, services: servicesResult.rows })
    } catch (err) {
        console.error('getArtistByUsername error:', err)
        res.status(500).json({ error: err.message })
    }
}

// ─────────────────────────────────────────────
// СОЗДАТЬ ПРОФИЛЬ МАСТЕРА
// POST /api/artists/profile
// Нужен токен — только зарегистрированный user
// Body: { username, specialty[], price_from, bio? }
// ─────────────────────────────────────────────
const createArtistProfile = async (req, res) => {
    const { username, specialty, price_from, bio } = req.body
    const user_id = req.user.id

    if (!username || !price_from) {
        return res.status(400).json({ error: 'username and price_from are required' })
    }

    try {
        // Проверяем что профиля ещё нет
        const existing = await pool.query(
            'SELECT id FROM artists WHERE user_id = $1', [user_id]
        )
        if (existing.rows.length > 0) {
            return res.status(400).json({ error: 'Artist profile already exists' })
        }

        // Проверяем уникальность username
        const usernameCheck = await pool.query(
            'SELECT id FROM artists WHERE username = $1', [username]
        )
        if (usernameCheck.rows.length > 0) {
            return res.status(400).json({ error: 'Username already taken' })
        }

        const result = await pool.query(
            `INSERT INTO artists (user_id, username, specialty, price_from, bio)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [user_id, username, specialty || [], price_from, bio || null]
        )

        // Обновляем роль пользователя на 'artist'
        await pool.query(
            'UPDATE users SET role = $1 WHERE id = $2',
            ['artist', user_id]
        )

        res.status(201).json(result.rows[0])
    } catch (err) {
        console.error('createArtistProfile error:', err)
        res.status(500).json({ error: err.message })
    }
}

// ─────────────────────────────────────────────
// ОБНОВИТЬ СВОЙ ПРОФИЛЬ МАСТЕРА
// PATCH /api/artists/profile/me  — нужен токен
// Body: { bio?, specialty?, price_from?, available? }
// ─────────────────────────────────────────────
const updateMyProfile = async (req, res) => {
    const user_id = req.user.id
    const { bio, specialty, price_from, available, username } = req.body

    try {
        const artist = await pool.query(
            'SELECT id FROM artists WHERE user_id = $1', [user_id]
        )
        if (artist.rows.length === 0) {
            return res.status(404).json({ error: 'Artist profile not found' })
        }

        // Обновляем только переданные поля
        const updates = []
        const params = []

        if (bio !== undefined)        { params.push(bio);        updates.push(`bio = $${params.length}`) }
        if (specialty !== undefined)  { params.push(specialty);  updates.push(`specialty = $${params.length}`) }
        if (price_from !== undefined) { params.push(price_from); updates.push(`price_from = $${params.length}`) }
        if (available !== undefined)  { params.push(available);  updates.push(`available = $${params.length}`) }
        if (username !== undefined)   { params.push(username);   updates.push(`username = $${params.length}`) }

        if (updates.length === 0) {
            return res.status(400).json({ error: 'Nothing to update' })
        }

        params.push(artist.rows[0].id)
        const result = await pool.query(
            `UPDATE artists SET ${updates.join(', ')} WHERE id = $${params.length} RETURNING *`,
            params
        )

        res.json(result.rows[0])
    } catch (err) {
        console.error('updateMyProfile error:', err)
        res.status(500).json({ error: err.message })
    }
}

// ─────────────────────────────────────────────
// МОЙ ПРОФИЛЬ МАСТЕРА
// GET /api/artists/profile/me  — нужен токен
// ─────────────────────────────────────────────
const getMyProfile = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT a.*, u.name, u.phone
             FROM artists a
             JOIN users u ON a.user_id = u.id
             WHERE a.user_id = $1`,
            [req.user.id]
        )
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Artist profile not found' })
        }

        const artist = result.rows[0]
        const services = await pool.query(
            'SELECT * FROM services WHERE artist_id = $1', [artist.id]
        )

        res.json({ ...artist, services: services.rows })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// ─────────────────────────────────────────────
// ДОБАВИТЬ УСЛУГУ
// POST /api/artists/services  — нужен токен артиста
// Body: { name, duration, price, icon? }
// ─────────────────────────────────────────────
const addService = async (req, res) => {
    const { name, duration, price, icon } = req.body

    if (!name || !price) {
        return res.status(400).json({ error: 'name and price are required' })
    }

    try {
        const artist = await pool.query(
            'SELECT id FROM artists WHERE user_id = $1', [req.user.id]
        )
        if (artist.rows.length === 0) {
            return res.status(404).json({ error: 'Artist profile not found' })
        }

        const result = await pool.query(
            `INSERT INTO services (artist_id, name, duration, price, icon)
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [artist.rows[0].id, name, duration || null, price, icon || '💅']
        )

        res.status(201).json(result.rows[0])
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// ─────────────────────────────────────────────
// УДАЛИТЬ УСЛУГУ
// DELETE /api/artists/services/:id  — нужен токен
// ─────────────────────────────────────────────
const deleteService = async (req, res) => {
    const { id } = req.params
    try {
        const artist = await pool.query(
            'SELECT id FROM artists WHERE user_id = $1', [req.user.id]
        )
        if (artist.rows.length === 0) {
            return res.status(404).json({ error: 'Not found' })
        }

        const del = await pool.query(
            'DELETE FROM services WHERE id = $1 AND artist_id = $2 RETURNING id',
            [id, artist.rows[0].id]
        )

        if (del.rows.length === 0) {
            return res.status(404).json({ error: 'Service not found or not yours' })
        }

        res.json({ message: 'Service deleted' })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

module.exports = {
    getArtists,
    getArtistByUsername,
    createArtistProfile,
    updateMyProfile,
    getMyProfile,
    addService,
    deleteService,
}
