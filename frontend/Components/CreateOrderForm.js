"use client";

import { useState } from "react";
import { orderService } from "@/services/orderService";

export default function CreateOrderForm({
  customers,
  products,
  onOrderCreated,
  onCancel,
}) {
  const [customerId, setCustomerId] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);


  function handleAddToCart() {
    if (!selectedProductId) {
      alert("Please select a product first");
      return;
    }

    if (quantity <= 0) {
      alert("Quantity must be 1 or more");
      return;
    }

    const product = products.find(function (p) {
      return p.id === parseInt(selectedProductId);
    });

    if (!product) {
      return;
    }

    if (quantity > product.stock_qty) {
      alert("Insufficient stock. Available: " + product.stock_qty);
      return;
    }

    const newItem = {
      productId: product.id,
      name: product.name,
      unitPrice: Number(product.unit_price),
      quantity: parseInt(quantity),
      lineTotal: Number(product.unit_price) * parseInt(quantity),
    };

    setCart([...cart, newItem]);
    setSelectedProductId("");
    setQuantity(1);
  }


  function handleRemoveItem(indexToRemove) {
    const updatedCart = cart.filter(function (item, index) {
      return index !== indexToRemove;
    });
    setCart(updatedCart);
  }


  let grandTotal = 0;
  for (let i = 0; i < cart.length; i++) {
    grandTotal = grandTotal + cart[i].lineTotal;
  }

  
  async function handleCreateOrder(e) {
    e.preventDefault();

    if (!customerId) {
      alert("Please select a customer");
      return;
    }

    if (cart.length === 0) {
      alert("Please add at least one item");
      return;
    }

    setLoading(true);

    const itemsList = [];
    for (let i = 0; i < cart.length; i++) {
      itemsList.push({
        productId: cart[i].productId,
        quantity: cart[i].quantity,
      });
    }

    const newOrder = {
      customerId: parseInt(customerId),
      items: itemsList,
    };

    try {
      const res = await orderService.createOrder(newOrder);

      if (res.success) {
        const orderNumber = res.orderNo || res.order?.order_no;
        alert("Order created successfully. Order No: " + orderNumber);
        setCart([]);
        setCustomerId("");
        onOrderCreated();
      } else {
        alert(res.message);
      }
    } catch (err) {
      alert("Error: " + err.message);
    }

    setLoading(false);
  }

  const activeProduct = products.find(function (p) {
    return p.id === parseInt(selectedProductId);
  });

  return (
    <div className="bg-white p-6 rounded-lg border shadow-sm space-y-4">
      <h2 className="font-bold text-lg text-gray-900">Create New Order</h2>

      
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">
          Customer
        </label>
        <select
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          className="w-full border rounded p-2 text-sm bg-white text-gray-900"
        >
          <option value="">-- Choose Customer --</option>
          {customers.map(function (c) {
            return (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            );
          })}
        </select>
      </div>

      
      <div className="p-4 bg-gray-50 rounded border space-y-2">
        <div className="flex justify-between text-xs text-gray-600">
          <span>Add Product</span>
          {activeProduct && (
            <span className="font-bold text-gray-800">
              Available Stock: {activeProduct.stock_qty}
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="flex-1 border rounded p-2 text-sm bg-white text-gray-900"
          >
            <option value="">-- Select Product --</option>
            {products.map(function (p) {
              return (
                <option key={p.id} value={p.id}>
                  {p.name} - LKR {p.unit_price} (Stock: {p.stock_qty})
                </option>
              );
            })}
          </select>

          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-20 border rounded p-2 text-sm text-center bg-white text-gray-900"
          />

          <button
            type="button"
            onClick={handleAddToCart}
            className="bg-black text-white px-4 py-2 rounded text-xs font-bold"
          >
            Add
          </button>
        </div>
      </div>

      
      {cart.length > 0 && (
        <table className="w-full text-sm border">
          <thead className="bg-gray-100 text-xs text-left">
            <tr>
              <th className="p-2">Item</th>
              <th className="p-2">Price</th>
              <th className="p-2 text-center">Qty</th>
              <th className="p-2">Total</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {cart.map(function (item, idx) {
              return (
                <tr key={idx} className="border-t">
                  <td className="p-2 font-medium">{item.name}</td>
                  <td className="p-2">LKR {item.unitPrice}</td>
                  <td className="p-2 text-center">{item.quantity}</td>
                  <td className="p-2 font-bold">LKR {item.lineTotal}</td>
                  <td className="p-2 text-right">
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      className="text-red-600 text-xs font-medium"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

   
      <div className="flex justify-between items-center pt-3 border-t">
        <span className="font-bold text-lg text-gray-900">
          Total: LKR {grandTotal.toFixed(2)}
        </span>
        <div className="space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded text-xs font-bold border text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCreateOrder}
            disabled={loading || cart.length === 0}
            className="bg-black text-white px-6 py-2.5 rounded text-xs font-bold disabled:bg-gray-300"
          >
            {loading ? "Processing..." : "Confirm Order"}
          </button>
        </div>
      </div>
    </div>
  );
}
