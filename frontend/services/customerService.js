import { apiRequest } from './api';

export const customerService = {
    getCustomers(search = '') {
        const query = new URLSearchParams();
        if (search) query.set('search', search);
        const suffix = query.toString();
        return apiRequest(`customers${suffix ? `?${suffix}` : ''}`);
    },

    createCustomer(customerData) {
        return apiRequest('customers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(customerData),
        });
    },

    updateCustomer(id, customerData) {
        return apiRequest(`customers/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(customerData),
        });
    },
};