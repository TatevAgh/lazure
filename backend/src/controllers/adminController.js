// controllers/adminController.js
// Только для пользователей с role = 'admin'

const pool = require('../db')

// ─────────────────────────────────────────────
// statistic
// GET /api/admin/stats
// ─────────────────────────────────────────────
const getStats = async (req, res) => {
    try {
        const [users, artists, bookings, pending] = await Promise.all([
            pool.query('SELECT COUNT(*) FROM users'),
            pool.query('SELECT COUNT(*) FROM artists'),
            pool.query('SELECT COUNT(*) FROM bookings'),
            pool.query("SELECT COUNT(*) FROM bookings WHERE status = 'pending'"),
        ])

        res.json({
            total_users:    Number(users.rows[0].count),
            total_artists:  Number(artists.rows[0].count),
            total_bookings: Number(bookings.rows[0].count),
            pending_bookings: Number(pending.rows[0].count),
        })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// ─────────────────────────────────────────────
// ALL USERS
// GET /api/admin/users
// ─────────────────────────────────────────────
const getAllUsers = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, name, phone, role, is_active, created_at FROM users ORDER BY created_at DESC'
        )
        res.json(result.rows)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// ─────────────────────────────────────────────
// ALL BOOKINGS
// GET /api/admin/bookings
// ─────────────────────────────────────────────
const getAllBookings = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT
                b.*,
                uc.name  AS client_name,
                ua.name  AS artist_name,
                a.username AS artist_username,
                s.name   AS service_name
             FROM bookings b
             JOIN users uc ON b.client_id = uc.id
             JOIN artists a ON b.artist_id = a.id
             JOIN users ua ON a.user_id = ua.id
             LEFT JOIN services s ON b.service_id = s.id
             ORDER BY b.created_at DESC`
        )
        res.json(result.rows)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// ─────────────────────────────────────────────
// VERIFICATION MASTER
// PATCH /api/admin/artists/:id/verify
// ─────────────────────────────────────────────
const verifyArtist = async (req, res) => {
    try {
        const result = await pool.query(
            'UPDATE artists SET is_verified = true WHERE id = $1 RETURNING id, username, is_verified',
            [req.params.id]
        )
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Artist not found' })
        }
        res.json(result.rows[0])
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// ─────────────────────────────────────────────
// ЗАБЛОКИРОВАТЬ / РАЗБЛОКИРОВАТЬ ПОЛЬЗОВАТЕЛЯ
// PATCH /api/admin/users/:id/block
// ─────────────────────────────────────────────
const toggleBlock = async (req, res) => {
    try {
        const user = await pool.query('SELECT is_active FROM users WHERE id = $1', [req.params.id])
        if (user.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' })
        }
        const newStatus = !user.rows[0].is_active
        const result = await pool.query(
            'UPDATE users SET is_active = $1 WHERE id = $2 RETURNING id, name, is_active',
            [newStatus, req.params.id]
        )
        res.json(result.rows[0])
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

module.exports = { getStats, getAllUsers, getAllBookings, verifyArtist, toggleBlock }
