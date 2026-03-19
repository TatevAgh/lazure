const router = require('express').Router()
const { createBooking, getMyBookings, updateBookingStatus } = require('../controllers/bookingController')
const { authenticate } = require('../middleware/auth')

// Все маршруты бронирований требуют авторизации
router.post('/', authenticate, createBooking)                      // POST  /api/bookings
router.get('/my', authenticate, getMyBookings)                     // GET   /api/bookings/my
router.patch('/:id/status', authenticate, updateBookingStatus)     // PATCH /api/bookings/:id/status

module.exports = router
