const router = require('express').Router()
const { getArtists, getArtistByUsername } = require('../controllers/artistController')

router.get('/', getArtists)                    // GET /api/artists
router.get('/:username', getArtistByUsername)  // GET /api/artists/nails_by_gaya

module.exports = router
