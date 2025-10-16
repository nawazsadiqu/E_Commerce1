import React, { useEffect, useState } from "react";
import axios from "axios";

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch all orders (admin view)
  const fetchOrders = async () => {
    try {
      const res = await axios.get("https://e-commerce-03kf.onrender.com/getAllOrders");
      setOrders(res.data);
    } catch (err) {
      console.error("❌ Error fetching orders:", err);
      alert("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Update order status
  const updateStatus = async (orderId, newStatus) => {
    try {
      const res = await axios.put(
        `https://e-commerce-03kf.onrender.com/updateOrderStatus/${orderId}`,
        { status: newStatus }
      );
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? res.data.order : o))
      );
    } catch (err) {
      console.error("❌ Error updating status:", err);
      alert("Failed to update order status");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg font-semibold text-gray-700">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          📦 All Orders
        </h2>

        {orders.length === 0 ? (
          <p className="text-center text-gray-600 py-10">No orders found.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full bg-white text-sm">
              <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 text-left">Order ID</th>
                  <th className="px-4 py-3 text-left">User</th>
                  <th className="px-4 py-3 text-left">Total (₹)</th>
                  <th className="px-4 py-3 text-left">Address</th>
                  <th className="px-4 py-3 text-left">Phone</th>
                  <th className="px-4 py-3 text-left">Payment</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <React.Fragment key={order._id}>
                    <tr className="border-b hover:bg-gray-50 transition-all">
                      <td className="px-4 py-3 font-medium text-gray-800">
                        {order._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="px-4 py-3 text-gray-700">{order.user}</td>
                      <td className="px-4 py-3 text-green-700 font-semibold">
                        ₹{order.totalAmount}
                      </td>
                      <td className="px-4 py-3 text-gray-700">{order.address}</td>
                      <td className="px-4 py-3 text-gray-700">{order.phone}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            order.paymentMethod === "COD"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {order.paymentMethod}
                        </span>
                      </td>

                      {/* Status dropdown */}
                      <td className="px-4 py-3">
                        <select
                          value={order.status || "Pending"}
                          onChange={(e) =>
                            updateStatus(order._id, e.target.value)
                          }
                          className="border border-gray-300 rounded px-2 py-1 text-sm bg-gray-50 focus:ring focus:ring-blue-200"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Shipped">Confirmed</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>

                      <td className="px-4 py-3 text-gray-600">
                        {new Date(order.orderDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() =>
                            setExpandedOrder(
                              expandedOrder === order._id ? null : order._id
                            )
                          }
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          {expandedOrder === order._id
                            ? "Hide Items"
                            : "View Items"}
                        </button>
                      </td>
                    </tr>

                    {/* Expanded Items */}
                    {expandedOrder === order._id && (
                      <tr className="bg-gray-50">
                        <td colSpan="9" className="px-6 py-4">
                          <h4 className="text-lg font-semibold mb-3 text-gray-800">
                            Items in this order
                          </h4>
                          <ul className="divide-y divide-gray-200">
                            {order.items.map((item, index) => (
                              <li
                                key={index}
                                className="flex items-center justify-between py-3"
                              >
                                <div className="flex items-center gap-3">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-12 h-12 rounded-lg object-cover border"
                                  />
                                  <div>
                                    <p className="font-semibold text-gray-800">
                                      {item.name}
                                    </p>
                                    <p className="text-gray-600 text-sm">
                                      Qty: {item.quantity} × ₹{item.price}
                                    </p>
                                  </div>
                                </div>
                                <p className="font-bold text-gray-800">
                                  ₹{item.quantity * item.price}
                                </p>
                              </li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllOrders;
