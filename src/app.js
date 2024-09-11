const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const manageRoutes = require('./routes/manageRoutes');
const cors = require('cors');
const { initializeDatabase } = require('./config/database');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// Log incoming requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.use('/api/auth', authRoutes);
app.use('/api/manage', manageRoutes);

// Catch-all route for debugging
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Not Found', path: req.originalUrl });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    initializeDatabase();
});