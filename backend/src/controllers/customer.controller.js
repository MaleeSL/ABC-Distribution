 
const pool = require('../config/db');

// Get all customers and search customers
async function getCustomers(req, res) {
    try {
        const search = req.query.search || '';

        const result = await pool.query(
            `SELECT * FROM customers
             WHERE name ILIKE $1
             OR phone ILIKE $1
             OR business_name ILIKE $1
             ORDER BY id DESC`,
            ['%' + search + '%']
        );

        res.json({
            success: true,
            data: result.rows
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// Add new customer
async function createCustomer(req, res) {
    try {
        const { name, business_name, phone, email, address } = req.body;

        if (!name || !phone) {
            return res.status(400).json({
                success: false,
                message: 'Name and Phone are required'
            });
        }

        const result = await pool.query(
            `INSERT INTO customers
            (name, business_name, phone, email, address)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`,
            [name, business_name, phone, email, address]
        );

        res.status(201).json({
            success: true,
            message: 'Customer added successfully',
            data: result.rows[0]
        });

    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({
                success: false,
                message: 'Phone number already exists'
            });
        }

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// Update customer
async function updateCustomer(req, res) {
    try {
        const id = req.params.id;
        const { name, business_name, phone, email, address } = req.body;

        if (!name || !phone) {
            return res.status(400).json({
                success: false,
                message: 'Name and Phone are required'
            });
        }

        const result = await pool.query(
            `UPDATE customers
             SET name = $1,
                 business_name = $2,
                 phone = $3,
                 email = $4,
                 address = $5
             WHERE id = $6
             RETURNING *`,
            [name, business_name, phone, email, address, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Customer not found'
            });
        }

        res.json({
            success: true,
            message: 'Customer updated successfully',
            data: result.rows[0]
        });

    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({
                success: false,
                message: 'Phone number already exists'
            });
        }

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = {
    getCustomers,
    createCustomer,
    updateCustomer
};
