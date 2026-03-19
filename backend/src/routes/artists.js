const router = require('express').Router()
const {
    getArtists,
    getArtistByUsername,
    createArtistProfile,
    updateMyProfile,
    getMyProfile,
    addService,
    deleteService,
} = require('../controllers/artistController')
const { authenticate, requireArtist } = require('../middleware/auth')

// ── ПУБЛИЧНЫЕ ──────────────────────────────────────────────
router.get('/', getArtists)                          // GET /api/artists
router.get('/:username', getArtistByUsername)        // GET /api/artists/nails_by_gaya

// ── ТРЕБУЮТ ТОКЕН ──────────────────────────────────────────
// ВАЖНО: маршруты /profile/* должны быть ДО /:username
// иначе Express решит что "profile" — это username

router.post('/profile', authenticate, createArtistProfile)           // POST   /api/artists/profile
router.get('/profile/me', authenticate, getMyProfile)                // GET    /api/artists/profile/me
router.patch('/profile/me', authenticate, requireArtist, updateMyProfile) // PATCH  /api/artists/profile/me

router.post('/services', authenticate, requireArtist, addService)           // POST   /api/artists/services
router.delete('/services/:id', authenticate, requireArtist, deleteService)  // DELETE /api/artists/services/:id

module.exports = router
