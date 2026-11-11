"use client";

import { useState, useEffect } from "react";
import { orderService } from "@/services/orderService";
import { productService } from "@/services/productService";
import CreateOrderForm from "@/Components/CreateOrderForm";
import OrderTable from "@/Components/OrderTable";

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("list");
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [ordersList, setOrdersList] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  
  useEffect(() => {
    loadAllData();
  }, []);

  async function loadAllData() {
    try {
      const prodRes = await productService.getProducts();
      if (prodRes && prodRes.success) {
        setProducts(prodRes.data || []);
      }
    } catch (err) {
      console.log("Could not load products:", err);
    }

    try {
      const custRes = await fetch("http://localhost:5000/api/customers");
      const custData = await custRes.json();
      if (custData && custData.success) {
        setCustomers(custData.data || []);
      } else {
        setCustomers([]);
      }
    } catch (err) {
      setCustomers([]);
    }

    fetchOrders();
  }

 
  async function fetchOrders() {
    const res = await orderService.getOrders();
    if (res && res.success) {
      const allOrders = res.data || [];
      const activeOnly = allOrders.filter(function (order) {
        return order.status !== "Cancelled";
      });
      setOrdersList(activeOnly);
    }
  }


  async function handleStatusChange(orderId, status) {
    const isConfirmed = confirm("Are you sure you want to mark order as " + status + "?");
    if (!isConfirmed) {
      return;
    }

    const res = await orderService.updateStatus(orderId, status);
    if (res.success) {
      if (status === "Cancelled") {
        alert("Order cancelled and stock restored successfully!");
        setSelectedOrder(null);
      }
      fetchOrders();
      loadAllData();
    } else {
      alert(res.message);
    }
  }

 
  async function handleViewDetails(id) {
    const res = await orderService.getOrderById(id);
    if (res.success) {
      setSelectedOrder(res.data || res.order);
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 text-gray-800">
      <div className="flex justify-between items-center pb-3 border-b">
        <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
        <div className="space-x-2">
          <button
            onClick={() => {
              setActiveTab("list");
              setSelectedOrder(null);
            }}
            className={`px-3 py-1.5 rounded text-xs font-semibold ${
              activeTab === "list" ? "bg-black text-white" : "bg-gray-100"
            }`}
          >
            Active Orders ({ordersList.length})
          </button>
          <button
            onClick={() => setActiveTab("create")}
            className={`px-3 py-1.5 rounded text-xs font-semibold ${
              activeTab === "create" ? "bg-black text-white" : "bg-gray-100"
            }`}
          >
            + New Order
          </button>
        </div>
      </div>

      {activeTab === "create" && (
        <CreateOrderForm
          customers={customers}
          products={products}
          onOrderCreated={() => {
            loadAllData();
            fetchOrders();
            setActiveTab("list");
          }}
          onCancel={() => setActiveTab("list")}
        />
      )}

      {activeTab === "list" && (
        <OrderTable
          ordersList={ordersList}
          selectedOrder={selectedOrder}
          onViewDetails={handleViewDetails}
          onStatusChange={handleStatusChange}
          onCloseDetails={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}
