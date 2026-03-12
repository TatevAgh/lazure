const pool = require('../db')

// Создать бронирование
const createBooking = async (req, res) => {
    const { artist_id, service_id, date, time } = req.body
    const client_id = req.user.id  // берём из JWT токена

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
            `INSERT INTO bookings (artist_id, client_id, service_id, date, time)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
            [artist_id, client_id, service_id, date, time]
        )

        res.status(201).json(result.rows[0])
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// Получить бронирования текущего пользователя
const getMyBookings = async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT 
        b.*,
        u.name as artist_name,
        a.username as artist_username,
        a.photo_url as artist_photo,
        s.name as service_name
      FROM bookings b
      JOIN artists a ON b.artist_id = a.id
      JOIN users u ON a.user_id = u.id
      JOIN services s ON b.service_id = s.id
      WHERE b.client_id = $1
      ORDER BY b.date DESC
    `, [req.user.id])

        res.json(result.rows)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

module.exports = { createBooking, getMyBookings }
