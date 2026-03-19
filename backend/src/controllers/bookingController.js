const pool = require('../db')

// ─────────────────────────────────────────────
// СОЗДАТЬ БРОНИРОВАНИЕ
// POST /api/bookings  — нужен токен
// Body: { artist_id, service_id, date, time, notes? }
// ─────────────────────────────────────────────
const createBooking = async (req, res) => {
    const { artist_id, service_id, date, time, notes } = req.body
    const client_id = req.user.id

    if (!artist_id || !date || !time) {
        return res.status(400).json({ error: 'artist_id, date and time are required' })
    }

    try {
        // Проверяем, не занят ли уже этот слот
        const conflict = await pool.query(
            `SELECT id FROM bookings
             WHERE artist_id = $1 AND date = $2 AND time = $3
             AND status != 'cancelled'`,
            [artist_id, date, time]
        )

        if (conflict.rows.length > 0) {
            return res.status(409).json({ error: 'This time slot is already booked' })
        }

        const result = await pool.query(
            `INSERT INTO bookings (artist_id, client_id, service_id, date, time, notes)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [artist_id, client_id, service_id || null, date, time, notes || null]
        )

        res.status(201).json(result.rows[0])
    } catch (err) {
        console.error('createBooking error:', err)
        res.status(500).json({ error: err.message })
    }
}

// ─────────────────────────────────────────────
// МОИ БРОНИРОВАНИЯ
// GET /api/bookings/my  — нужен токен
// Клиент видит свои записи, артист — записи к нему
// ─────────────────────────────────────────────
const getMyBookings = async (req, res) => {
    const { id, role } = req.user

    try {
        let result

        if (role === 'artist') {
            // Артист видит кто к нему записался
            result = await pool.query(
                `SELECT
                    b.*,
                    u.name    AS client_name,
                    u.phone   AS client_phone,
                    s.name    AS service_name,
                    s.duration,
                    s.price   AS service_price
                 FROM bookings b
                 JOIN users u ON b.client_id = u.id
                 LEFT JOIN services s ON b.service_id = s.id
                 WHERE b.artist_id = (
                     SELECT id FROM artists WHERE user_id = $1
                 )
                 ORDER BY b.date DESC, b.time DESC`,
                [id]
            )
        } else {
            // Клиент видит свои записи с данными мастера
            result = await pool.query(
                `SELECT
                    b.*,
                    u.name       AS artist_name,
                    a.username   AS artist_username,
                    a.photo_url  AS artist_photo,
                    s.name       AS service_name,
                    s.duration,
                    s.price      AS service_price
                 FROM bookings b
                 JOIN artists a ON b.artist_id = a.id
                 JOIN users u ON a.user_id = u.id
                 LEFT JOIN services s ON b.service_id = s.id
                 WHERE b.client_id = $1
                 ORDER BY b.date DESC, b.time DESC`,
                [id]
            )
        }

        res.json(result.rows)
    } catch (err) {
        console.error('getMyBookings error:', err)
        res.status(500).json({ error: err.message })
    }
}

// ─────────────────────────────────────────────
// ИЗМЕНИТЬ СТАТУС БРОНИРОВАНИЯ
// PATCH /api/bookings/:id/status  — нужен токен
// Body: { status: 'confirmed' | 'cancelled' | 'completed' }
// Артист может: confirmed, cancelled, completed
// Клиент может только: cancelled
// ─────────────────────────────────────────────
const updateBookingStatus = async (req, res) => {
    const { id } = req.params
    const { status } = req.body
    const { id: userId, role } = req.user

    const validStatuses = ['confirmed', 'cancelled', 'completed']
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: `Status must be one of: ${validStatuses.join(', ')}` })
    }

    try {
        // Получаем бронирование
        const booking = await pool.query(
            'SELECT * FROM bookings WHERE id = $1', [id]
        )
        if (booking.rows.length === 0) {
            return res.status(404).json({ error: 'Booking not found' })
        }

        const b = booking.rows[0]

        // Проверяем права доступа
        if (role === 'artist') {
            const artist = await pool.query(
                'SELECT id FROM artists WHERE user_id = $1', [userId]
            )
            if (!artist.rows.length || artist.rows[0].id !== b.artist_id) {
                return res.status(403).json({ error: 'Not your booking' })
            }
        } else if (role === 'client') {
            if (b.client_id !== userId) {
                return res.status(403).json({ error: 'Not your booking' })
            }
            if (status !== 'cancelled') {
                return res.status(403).json({ error: 'Clients can only cancel bookings' })
            }
        }

        const result = await pool.query(
            'UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        )

        res.json(result.rows[0])
    } catch (err) {
        console.error('updateBookingStatus error:', err)
        res.status(500).json({ error: err.message })
    }
}

module.exports = { createBooking, getMyBookings, updateBookingStatus }
