import { apiRequest } from './api';

export const orderService = {
  createOrder: async function (orderData) {
    return apiRequest('orders', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });
  },

  getOrders: async function () {
    return apiRequest('orders');
  },

  getOrderById: async function (id) {
    return apiRequest(`orders/${id}`);
  },

  updateStatus: async function (id, status) {
    return apiRequest(`orders/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: status }),
    });
  },
};
