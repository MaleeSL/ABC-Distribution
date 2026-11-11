const API_URL = "http://localhost:5000/api/orders";

export const orderService = {
  createOrder: async function (orderData) {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });
    return await response.json();
  },

  getOrders: async function () {
    const response = await fetch(API_URL);
    return await response.json();
  },

  getOrderById: async function (id) {
    const response = await fetch(API_URL + "/" + id);
    return await response.json();
  },

  updateStatus: async function (id, status) {
    const response = await fetch(API_URL + "/" + id + "/status", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: status }),
    });
    return await response.json();
  },
};
