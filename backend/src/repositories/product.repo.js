const pool = require('../config/db');

class ProductRepository {
    async findAll(filters) {
        let query = `SELECT p.*, c.name AS category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE 1=1`;
        let values = [];
        let index = 1;

        if (filters.search) {
            query += ` AND (p.name ILIKE $${index} OR p.sku ILIKE $${index})`;
            values.push(`%${filters.search}%`);
            index++;
        }

        if (filters.category) {
            query += ` AND p.category_id = $${index}`;
            values.push(filters.category);
            index++;
        }

        if (filters.lowStock === 'true') {
            query += ` AND p.stock_qty <= p.reorder_level`;
        }

        query += ` ORDER BY p.id DESC`;
        const { rows } = await pool.query(query, values);
        return rows;
    }

    async findById(id) {
        const query = `SELECT p.*, c.name AS category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = $1`;
        const { rows } = await pool.query(query, [id]);
        return rows[0];
    }

    async create(productData) {
        const { sku, name, categoryId, unitPrice, stockQty, reorderLevel, description } = productData;
        const query = `
            INSERT INTO products (sku, name, category_id, unit_price, stock_qty, reorder_level, description)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
        `;
        const values = [sku, name, categoryId, unitPrice, stockQty, reorderLevel || 10, description];
        const { rows } = await pool.query(query, values);
        return rows[0];
    }

    async update(id, productData) {
        const { sku, name, categoryId, unitPrice, stockQty, reorderLevel, isActive, description } = productData;
        const query = `
            UPDATE products 
            SET sku = $1, name = $2, category_id = $3, unit_price = $4, stock_qty = $5, reorder_level = $6, is_active = $7, description = $8, updated_at = CURRENT_TIMESTAMP
            WHERE id = $9
            RETURNING *;
        `;
        const values = [sku, name, categoryId, unitPrice, stockQty, reorderLevel, isActive, description, id];
        const { rows } = await pool.query(query, values);
        return rows[0];
    }

    async updateStock(id, qtyChange, movementType, note) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // Update product stock
            const updateQuery = `
                UPDATE products 
                SET stock_qty = stock_qty + $1, updated_at = CURRENT_TIMESTAMP
                WHERE id = $2
                RETURNING *;
            `;
            const updatedProduct = await client.query(updateQuery, [qtyChange, id]);

            if (updatedProduct.rows.length === 0) {
                throw new Error('Product not found');
            }

            // Insert stock movement audit log
            const movementQuery = `
                INSERT INTO stock_movements (product_id, movement_type, quantity, note)
                VALUES ($1, $2, $3, $4)
            `;
            await client.query(movementQuery, [id, movementType, qtyChange, note]);

            await client.query('COMMIT');
            return updatedProduct.rows[0];
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }
}

module.exports = new ProductRepository();