const productRepo = require('../repositories/product.repo');

class ProductController {
    async getProducts(req, res) {
        try {
            const products = await productRepo.findAll(req.query);
            res.status(200).json({ success: true, data: products });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async getProductById(req, res) {
        try {
            const product = await productRepo.findById(req.params.id);
            if (!product) {
                return res.status(404).json({ success: false, message: 'Product not found' });
            }
            res.status(200).json({ success: true, data: product });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async createProduct(req, res) {
        try {
            const { sku, name, unitPrice, stockQty } = req.body;
            if (!sku || !name || unitPrice == null || stockQty == null) {
                return res.status(400).json({ success: false, message: 'Missing required fields (sku, name, unitPrice, stockQty)' });
            }
            if (unitPrice < 0 || stockQty < 0) {
                return res.status(400).json({ success: false, message: 'Price and quantity cannot be negative' });
            }

            const newProduct = await productRepo.create(req.body);
            res.status(201).json({ success: true, data: newProduct });
        } catch (error) {
            if (error.code === '23505') { // Unique violation for SKU
                return res.status(409).json({ success: false, message: 'Product with this SKU already exists' });
            }
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async updateProduct(req, res) {
        try {
            const updated = await productRepo.update(req.params.id, req.body);
            if (!updated) {
                return res.status(404).json({ success: false, message: 'Product not found' });
            }
            res.status(200).json({ success: true, data: updated });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async adjustStock(req, res) {
        try {
            const { quantity, movementType, note } = req.body;
            if (quantity == null || !movementType) {
                return res.status(400).json({ success: false, message: 'Quantity and movementType are required' });
            }

            const updated = await productRepo.updateStock(req.params.id, quantity, movementType, note || 'Stock adjustment');
            res.status(200).json({ success: true, data: updated });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
}

module.exports = new ProductController();