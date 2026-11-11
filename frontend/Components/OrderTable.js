"use client";

export default function OrderTable({
  ordersList,
  selectedOrder,
  onViewDetails,
  onStatusChange,
  onCloseDetails,
}) {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-xs uppercase text-gray-600">
            <tr>
              <th className="p-3">Order No</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {ordersList.map(function (o) {
              return (
                <tr key={o.id} className="hover:bg-gray-50">
                  <td className="p-3 font-semibold text-gray-900">
                    {o.order_no}
                  </td>
                  <td className="p-3">
                    {o.customer_name || "Customer #" + o.customer_id}
                  </td>
                  <td className="p-3 font-bold text-gray-900">
                    LKR {Number(o.total).toFixed(2)}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-bold ${
                        o.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-1.5">
                    <button
                      onClick={() => onViewDetails(o.id)}
                      className="px-2.5 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded font-medium"
                    >
                      Details
                    </button>

                    {o.status !== "Completed" && (
                      <button
                        onClick={() => onStatusChange(o.id, "Completed")}
                        className="px-2.5 py-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium"
                      >
                        Complete
                      </button>
                    )}

                    <button
                      onClick={() => onStatusChange(o.id, "Cancelled")}
                      className="px-2.5 py-1 text-xs bg-rose-600 hover:bg-rose-700 text-white rounded font-medium"
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {ordersList.length === 0 && (
          <p className="p-6 text-center text-xs text-gray-400">
            No active orders found.
          </p>
        )}
      </div>

      {selectedOrder && (
        <div className="bg-white border-2 border-blue-500 p-4 rounded-lg space-y-2 shadow-sm">
          <div className="flex justify-between items-center pb-2 border-b">
            <span className="font-bold text-sm text-gray-900">
              Order Details: {selectedOrder.order_no} ({selectedOrder.status})
            </span>
            <button
              onClick={onCloseDetails}
              className="text-xs text-gray-500 hover:text-black font-bold"
            >
              ✕ Close
            </button>
          </div>

          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-gray-50 border-b text-gray-600">
                <th className="p-2">Product</th>
                <th className="p-2">Price</th>
                <th className="p-2 text-center">Qty</th>
                <th className="p-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {selectedOrder.items &&
                selectedOrder.items.map(function (item) {
                  return (
                    <tr key={item.id} className="border-b">
                      <td className="p-2 font-medium text-gray-800">
                        {item.product_name}
                      </td>
                      <td className="p-2 text-gray-600">
                        LKR {item.unit_price}
                      </td>
                      <td className="p-2 text-center font-bold text-gray-800">
                        {item.quantity}
                      </td>
                      <td className="p-2 text-right font-bold text-gray-900">
                        LKR {item.line_total}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
