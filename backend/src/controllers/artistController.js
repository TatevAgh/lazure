const pool = require('../db');

//get all artists
const getArtists = async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT 
        a.id, a.username, a.specialty, a.rating,
        a.reviews_count as reviews, a.price_from as "priceFrom",
        a.available, a.photo_url as photo,
        u.name
      FROM artists a
      JOIN users u ON a.user_id = u.id
      ORDER BY a.rating DESC
    `)
        res.json(result.rows)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

//get one artist by username
const getArtistByUsername = async (req, res) => {
    try {
        const { username } = req.params
        const artistResult = await pool.query(`
      SELECT a.*, u.name, u.phone
      FROM artists a
      JOIN users u ON a.user_id = u.id
      WHERE a.username = $1
    `, [username])

        if (artistResult.rows.length === 0) {
            return res.status(404).json({ error: 'Artist not found' })
        }

        // Также получаем услуги этого мастера
        const servicesResult = await pool.query(
            'SELECT * FROM services WHERE artist_id = $1',
            [artistResult.rows[0].id]
        )

        res.json({
            ...artistResult.rows[0],
            services: servicesResult.rows
        })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

module.exports = { getArtists, getArtistByUsername }


