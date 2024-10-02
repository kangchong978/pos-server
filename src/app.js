const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const manageRoutes = require('./routes/manageRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const saleRoutes = require('./routes/saleRoutes');
const cors = require('cors');
const { initializeDatabase } = require('./config/database');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(express.static('public'));
// Log incoming requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.use('/api/auth', authRoutes);
app.use('/api/manage', manageRoutes);
app.use('/api/product', productRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/sale', saleRoutes);

// Catch-all route for debugging
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Not Found', path: req.originalUrl });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    initializeDatabase();
});