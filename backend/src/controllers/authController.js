const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');

//registration
const register = async (req, res) => {
    const { name, phone, password, role } = req.body;

    try {
        const existing = await pool.query('SELECT id FROM users WHERE phone = $1', [phone]);

        if (existing.rows.length > 0) {
            return res.status(400).json({ error: 'Phone already registered' });
        }

        const password_hash = await bcrypt.hash(password, 10);

        const result = await pool.query(
            'INSERT INTO users (name, phone, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, phone, role',
            [name, phone, password_hash, role || 'client']
        );

        const user = result.rows[0];

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }  // токен живёт 7 дней
        );

        res.status(201).json({user, token });
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}

//login
const login = async (req, res) => {
    const { name, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM users WHERE phone = $1', [phone]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' })
        }

        const user = result.rows[0];

        const valid = await bcrypt.compare(password, user.password_hash);
        if (!valid) {
            return res.status(401).json({ error: 'Invalid credentials' })
        };

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({ token, user: { id: user.id, name: user.name, phone: user.phone, role: user.role } });
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

//current user
const getMe = async (req, res) => {
    // req.user уже заполнен middleware'ом authenticate
    const result = await pool.query(
        'SELECT id, name, phone, role FROM users WHERE id = $1',
        [req.user.id]
    )
    res.json(result.rows[0])
}

module.exports = { register, login, getMe }
