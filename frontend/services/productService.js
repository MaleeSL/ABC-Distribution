import { apiRequest } from './api';

export const productService = {
    async getProducts(filters = {}) {
        const queryParams = new URLSearchParams();
        if (filters.search) queryParams.append('search', filters.search);
        if (filters.category) queryParams.append('category', filters.category);
        if (filters.lowStock) queryParams.append('lowStock', filters.lowStock);

        const query = queryParams.toString();
        return apiRequest(`products${query ? `?${query}` : ''}`);
    },

    async createProduct(productData) {
        return apiRequest('products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData),
        });
    },

    async updateProduct(id, productData) {
        return apiRequest(`products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData),
        });
    },

    async adjustStock(id, stockData) {
        return apiRequest(`products/${id}/stock`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(stockData),
        });
    }
};