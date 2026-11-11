const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'API is running' });
});

// Products routes (Maleesha)
const productRoutes = require('./src/routes/product.routes');
app.use('/api/products', productRoutes);

// Orders routes (Thushani)
const orderRoutes = require('./src/routes/order.routes');
app.use('/api/orders', orderRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ success: false, message: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
    console.log(`Backend Server running on port ${PORT}`);
});
