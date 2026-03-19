// routes/admin.js

const router = require('express').Router()
const { getStats, getAllUsers, getAllBookings, verifyArtist, toggleBlock } = require('../controllers/adminController')
const { authenticate, requireAdmin } = require('../middleware/auth')

// Все маршруты только для admin
router.get('/stats',            authenticate, requireAdmin, getStats)
router.get('/users',            authenticate, requireAdmin, getAllUsers)
router.get('/bookings',         authenticate, requireAdmin, getAllBookings)
router.patch('/artists/:id/verify', authenticate, requireAdmin, verifyArtist)
router.patch('/users/:id/block',    authenticate, requireAdmin, toggleBlock)

module.exports = router
