const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const productService = {
    async getProducts(filters = {}) {
        const queryParams = new URLSearchParams();
        if (filters.search) queryParams.append('search', filters.search);
        if (filters.category) queryParams.append('category', filters.category);
        if (filters.lowStock) queryParams.append('lowStock', filters.lowStock);

        const res = await fetch(`${API_BASE_URL}/products?${queryParams.toString()}`);
        const data = await res.json();
        return data;
    },

    async createProduct(productData) {
        const res = await fetch(`${API_BASE_URL}/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData),
        });
        return await res.json();
    },

    async updateProduct(id, productData) {
        const res = await fetch(`${API_BASE_URL}/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData),
        });
        return await res.json();
    },

    async adjustStock(id, stockData) {
        const res = await fetch(`${API_BASE_URL}/products/${id}/stock`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(stockData),
        });
        return await res.json();
    }
};