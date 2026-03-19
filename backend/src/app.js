const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()

// ─── CORS ─────────────────────────────────────────────────
// Разрешаем запросы с фронта
app.use(cors({
    origin: [
        process.env.FRONTEND_URL,
        'http://localhost:5173',  // Vite dev
        'http://localhost:4173',  // Vite preview
    ],
    credentials: true,
}))

// ─── BODY PARSER ──────────────────────────────────────────
app.use(express.json())

// ─── МАРШРУТЫ ─────────────────────────────────────────────
const authRoutes    = require('./routes/auth')
const artistRoutes  = require('./routes/artists')
const bookingRoutes = require('./routes/bookings')
const adminRoutes   = require('./routes/admin')

app.use('/api/auth',     authRoutes)
app.use('/api/artists',  artistRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/admin',    adminRoutes)

// ─── HEALTH CHECK ─────────────────────────────────────────
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'LaZure API is running 💅' })
})

// ─── ЗАПУСК ───────────────────────────────────────────────
const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`)
    console.log(`📋 Routes:`)
    console.log(`   POST   /api/auth/register`)
    console.log(`   POST   /api/auth/login`)
    console.log(`   GET    /api/auth/me`)
    console.log(`   GET    /api/artists`)
    console.log(`   GET    /api/artists/:username`)
    console.log(`   POST   /api/bookings`)
    console.log(`   GET    /api/bookings/my`)
    console.log(`   PATCH  /api/bookings/:id/status`)
    console.log(`   GET    /api/admin/stats`)
})

module.exports = app
