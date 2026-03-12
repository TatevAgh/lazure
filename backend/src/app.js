const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({
    origin: [process.env.FRONTEND_URL, 'http://localhost:5173'],
    credentials: true,
}));

app.use(express.json());

const authRoutes = require('./routes/auth');
const artistRoutes = require('./routes/artists');
const bookingRoutes = require('./routes/bookings');

app.use('/api/auth', authRoutes);
app.use('/api/artists', artistRoutes);
app.use('/api/bookings', bookingRoutes);

// test route
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'LaZure API is running 💅' })
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`)});


