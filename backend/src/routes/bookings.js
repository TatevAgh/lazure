const router = require('express').Router()
const { createBooking, getMyBookings } = require('../controllers/bookingController')
const { authenticate } = require('../middleware/auth')

// Все маршруты бронирований требуют авторизации
router.post('/', authenticate, createBooking)
router.get('/my', authenticate, getMyBookings)

module.exports = router
