// Авторизация через 4-значный OTP код
//
// СЕЙЧАС (dev режим):
//   - код генерируется случайно и сохраняется в памяти (Map)
//   - код печатается в консоль и возвращается в ответе для удобства разработки
//
// ПОТОМ (prod режим):
//   - раскомментировать блок Twilio ниже
//   - убрать "code" из ответа send-otp
//   - убрать dev-подсказку из фронта Auth.tsx

const pool = require('../db')
const jwt  = require('jsonwebtoken')

// Временное хранилище OTP кодов { phone -> { code, expiresAt } }
// В проде заменить на Redis или таблицу в БД
const otpStore = new Map()

// ─────────────────────────────────────────────
// ОТПРАВИТЬ КОД
// POST /api/auth/send-otp
// Body: { phone }
// ─────────────────────────────────────────────
const sendOtp = async (req, res) => {
    const { phone } = req.body

    if (!phone) {
        return res.status(400).json({ error: 'Phone is required' })
    }

    // Генерируем 4-значный код
    const code = String(Math.floor(1000 + Math.random() * 9000))

    // Сохраняем код на 10 минут
    otpStore.set(phone, {
        code,
        expiresAt: Date.now() + 10 * 60 * 1000,
    })

    // Печатаем код в консоль (для разработки)
    console.log(`\n📱 OTP для ${phone}: ${code}\n`)

    // ── TWILIO (раскомментировать для SMS) ──────────
    // const twilio = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_TOKEN)
    // await twilio.messages.create({
    //     body: `Ваш код LaZure: ${code}`,
    //     from: process.env.TWILIO_PHONE,
    //     to: phone,
    // })
    // ────────────────────────────────────────────────

    res.json({
        message: 'Code sent',
        phone,
        // DEV: возвращаем код в ответе — убрать в проде!
        code,
    })
}

// ─────────────────────────────────────────────
// ПРОВЕРИТЬ КОД
// POST /api/auth/verify-otp
// Body: { phone, code }
// ─────────────────────────────────────────────
const verifyOtp = async (req, res) => {
    const { phone, code } = req.body

    if (!phone || !code) {
        return res.status(400).json({ error: 'Phone and code are required' })
    }

    // Проверяем код
    const stored = otpStore.get(phone)
    if (!stored) {
        return res.status(400).json({ error: 'Code not found. Request a new one.' })
    }
    if (Date.now() > stored.expiresAt) {
        otpStore.delete(phone)
        return res.status(400).json({ error: 'Code expired. Request a new one.' })
    }
    if (stored.code !== String(code)) {
        return res.status(400).json({ error: 'Invalid code' })
    }

    // Код верный — удаляем из хранилища
    otpStore.delete(phone)

    try {
        // Ищем или создаём пользователя
        let userResult = await pool.query(
            'SELECT id, name, phone, role FROM users WHERE phone = $1',
            [phone]
        )

        if (userResult.rows.length === 0) {
            // Новый пользователь — создаём
            userResult = await pool.query(
                `INSERT INTO users (phone, role)
                 VALUES ($1, 'client')
                 RETURNING id, name, phone, role`,
                [phone]
            )
            console.log(`✅ New User: ${phone}`)
        }

        const user = userResult.rows[0]

        // Проверяем не заблокирован ли
        const activeCheck = await pool.query('SELECT is_active FROM users WHERE id = $1', [user.id])
        if (activeCheck.rows[0] && !activeCheck.rows[0].is_active) {
            return res.status(403).json({ error: 'Account is blocked' })
        }

        // Генерируем JWT токен
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        res.json({ token, user })

    } catch (err) {
        console.error('verifyOtp error:', err)
        res.status(500).json({ error: err.message })
    }
}

// ─────────────────────────────────────────────
// МОЙ ПРОФИЛЬ
// GET /api/auth/me  — нужен токен
// ─────────────────────────────────────────────
const getMe = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, name, phone, role FROM users WHERE id = $1',
            [req.user.id]
        )
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' })
        }
        res.json(result.rows[0])
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// ─────────────────────────────────────────────
// ОБНОВИТЬ ИМЯ
// PATCH /api/auth/me  — нужен токен
// Body: { name }
// ─────────────────────────────────────────────
const updateMe = async (req, res) => {
    const { name } = req.body
    try {
        const result = await pool.query(
            'UPDATE users SET name = $1 WHERE id = $2 RETURNING id, name, phone, role',
            [name, req.user.id]
        )
        res.json(result.rows[0])
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

module.exports = { sendOtp, verifyOtp, getMe, updateMe }
