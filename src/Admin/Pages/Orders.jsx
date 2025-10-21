import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("https://brightique.onrender.com/users");
        const allUsers = res.data;

        const allOrders = allUsers.flatMap((user) =>
          user.orders.map((order) => ({
            ...order,
            userName: user.name,
            userEmail: user.email,
            userId: user.id,
          }))
        );

        allOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setOrders(allOrders);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  
  const handleStatusChange = async (userId, orderId, newStatus) => {
    try {
      const res = await axios.get(`http://localhost:5000/users/${userId}`);
      const user = res.data;

      const updatedOrders = user.orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      );

      await axios.put(`http://localhost:5000/users/${userId}`, {
        ...user,
        orders: updatedOrders,
      });

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      console.error("Failed to update order status:", err);
    }
  };

  
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const deliveredOrders = orders.filter((o) => o.status === "delivered").length;
  const cancelledOrders = orders.filter((o) => o.status === "Cancelled").length;

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-amber-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-gray-800">
            Loading orders...
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen p-6 bg-amber-50">
      
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold mb-2 text-gray-900">
          Order Management
        </h1>
        <p className="text-sm text-gray-600">
          Manage and track customer orders
        </p>
      </div>

      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
        <div className="bg-white border border-amber-200 rounded-xl p-4 text-center shadow-sm">
          <p className="text-gray-500 text-sm">Total Orders</p>
          <p className="text-2xl font-bold text-amber-600">{totalOrders}</p>
        </div>
        <div className="bg-white border border-yellow-200 rounded-xl p-4 text-center shadow-sm">
          <p className="text-gray-500 text-sm">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{pendingOrders}</p>
        </div>
        <div className="bg-white border border-green-200 rounded-xl p-4 text-center shadow-sm">
          <p className="text-gray-500 text-sm">Delivered</p>
          <p className="text-2xl font-bold text-green-600">{deliveredOrders}</p>
        </div>
        <div className="bg-white border border-red-200 rounded-xl p-4 text-center shadow-sm">
          <p className="text-gray-500 text-sm">Cancelled</p>
          <p className="text-2xl font-bold text-red-600">{cancelledOrders}</p>
        </div>
      </div>

      
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-amber-100">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-amber-500 text-white">
                <th className="px-4 py-3 text-left font-semibold text-sm">
                  Order ID
                </th>
                <th className="px-4 py-3 text-left font-semibold text-sm">
                  Customer
                </th>
                <th className="px-4 py-3 text-left font-semibold text-sm">
                  Items
                </th>
                <th className="px-4 py-3 text-left font-semibold text-sm">
                  Amount
                </th>
                <th className="px-4 py-3 text-left font-semibold text-sm">
                  Date
                </th>
                <th className="px-4 py-3 text-left font-semibold text-sm">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const totalAmount = order.items.reduce(
                  (sum, item) => sum + item.price * item.quantity,
                  0
                );
                return (
                  <tr
                    key={order.id}
                    className="border-b border-amber-50 hover:bg-amber-50 transition-colors duration-200"
                  >
                    <td className="px-4 py-3 font-medium text-gray-900 text-sm">
                      #{order.id}
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-medium text-gray-800 text-sm">
                          {order.userName}
                        </div>
                        <div className="text-gray-500 text-xs mt-0.5">
                          {order.userEmail}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 space-y-1">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="text-gray-700 text-sm"
                        >
                          {item.name} × {item.quantity}
                        </div>
                      ))}
                    </td>
                    <td className="px-4 py-3 font-semibold text-amber-600 text-sm">
                      {formatPrice(totalAmount)}
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-sm">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(
                            order.userId,
                            order.id,
                            e.target.value
                          )
                        }
                        className="border border-amber-300 rounded-lg px-3 py-1.5 text-sm bg-white text-gray-800 font-medium focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                      >
                        <option value="pending">Pending</option>
                        <option value="delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
