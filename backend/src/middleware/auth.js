// middleware/auth.js
// Проверяет JWT токен в заголовке Authorization

const jwt = require('jsonwebtoken')

// ─────────────────────────────────────────────
// ПРОВЕРКА ТОКЕНА (обязательная авторизация)
// Использование: router.get('/...', authenticate, controller)
// ─────────────────────────────────────────────
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' })
    }

    const token = authHeader.split(' ')[1]

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded  // { id, role }
        next()
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token' })
    }
}

// ─────────────────────────────────────────────
// ТОЛЬКО ДЛЯ АРТИСТА
// Использование: router.post('/...', authenticate, requireArtist, controller)
// ─────────────────────────────────────────────
const requireArtist = (req, res, next) => {
    if (req.user.role !== 'artist') {
        return res.status(403).json({ error: 'Artist access only' })
    }
    next()
}

// ─────────────────────────────────────────────
// ТОЛЬКО ДЛЯ АДМИНИСТРАТОРА
// ─────────────────────────────────────────────
const requireAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access only' })
    }
    next()
}

module.exports = { authenticate, requireArtist, requireAdmin }
