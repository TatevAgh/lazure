const router = require('express').Router()
const { sendOtp, verifyOtp, getMe, updateMe } = require('../controllers/authController')
const { authenticate } = require('../middleware/auth')

router.post('/send-otp',   sendOtp)                       // POST /api/auth/send-otp
router.post('/verify-otp', verifyOtp)                     // POST /api/auth/verify-otp
router.get('/me',          authenticate, getMe)           // GET  /api/auth/me
router.patch('/me',        authenticate, updateMe)        // PATCH /api/auth/me

module.exports = router
