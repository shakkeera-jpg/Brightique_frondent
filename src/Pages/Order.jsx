import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../Context/UserContext";
import { Link } from "react-router-dom";

export default function Order() {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      setLoading(true);
      axios
        .get(`https://brightique.onrender.com/users/${user.id}`)
        .then((res) => {
          console.log("User data:", res.data);
          setOrders(res.data.orders || []);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [user]);

  // Inside your Order component
 // --- Cancel Handler ---
const handleCancel = (orderId) => {
  const confirmCancel = window.confirm("Do you really want to cancel this order?");
  if (!confirmCancel) return; // Stop if user clicked "No"

  // Update locally first
  setOrders((prevOrders) =>
    prevOrders.map((order) =>
      order.id === orderId ? { ...order, status: "Cancelled" } : order
    )
  );

  // Update on the backend
  axios
    .patch(`https://brightique.onrender.com/users/${user.id}`, {
      orders: orders.map((order) =>
        order.id === orderId ? { ...order, status: "Cancelled" } : order
      ),
    })
    .then((res) => {
      console.log("Order cancelled:", res.data);
    })
    .catch((err) => {
      console.error("Error cancelling order:", err);
      // Optional: revert status if API fails
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: "Confirmed" } : order
        )
      );
    });
};



  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-8 px-4 sm:px-6 lg:px-8 mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 font-serif">My Orders</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-500 to-yellow-300 mx-auto rounded-full mb-4"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Track and manage all your purchases in one place
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-2xl p-12 text-center border border-yellow-100">
            <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3 font-serif">No Orders Yet</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              You haven't placed any orders yet. Start shopping to see your orders here.
            </p>
            <Link
              to="/"
              className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-white px-8 py-3 rounded-xl font-bold hover:from-yellow-400 hover:to-yellow-300 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 inline-block"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => {
              const total = order.items
                ? order.items.reduce(
                  (sum, item) => sum + item.price * item.quantity,
                  0
                )
                : 0;

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-300 border border-yellow-100"
                >
                  {/* Order Header */}
                  <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 px-8 py-6 border-b border-yellow-200">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex items-center gap-4 mb-3 lg:mb-0">
                        <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center shadow-lg">
                          <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                        </div>
                        <div>
                          <h2 className="font-bold text-2xl text-gray-900 font-serif">Order #{order.id}</h2>
                          <p className="text-gray-600 text-sm font-medium">
                            {order.createdAt
                              ? new Date(order.createdAt).toLocaleString()
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold ${order.status === "Confirmed"
                            ? "bg-gradient-to-r from-green-100 to-green-50 text-green-700 border border-green-200"
                            : "bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-700 border border-yellow-200"
                          }`}>
                          {order.status || "Pending"}
                        </span>
                        <span className="inline-flex items-center px-4 py-2 bg-black text-yellow-500 rounded-full text-sm font-bold shadow-lg">
                          ₹{total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-8">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                      {/* Order Items */}
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-3 font-serif">
                          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                          </div>
                          Order Items
                        </h3>
                        {order.items && order.items.length > 0 ? (
                          <div className="space-y-4">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200">
                                <div className="w-16 h-16 bg-black rounded-lg flex items-center justify-center flex-shrink-0 p-2">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="object-contain w-full h-full rounded"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-bold text-gray-900 truncate">{item.name}</h4>
                                  <p className="text-yellow-600 text-sm font-medium">{item.meterial}</p>
                                  <p className="text-sm text-gray-600 font-medium">Quantity: {item.quantity}</p>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold text-gray-900">₹{item.price.toFixed(2)}</p>
                                  <p className="text-lg font-bold bg-gradient-to-r from-yellow-600 to-yellow-500 bg-clip-text text-transparent">
                                    ₹{(item.price * item.quantity).toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200">
                            <p className="text-gray-500 font-medium">No items in this order</p>
                          </div>
                        )}
                      </div>

                      {/* Customer Details */}
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-3 font-serif">
                          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          Customer Details
                        </h3>
                        <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 p-6 space-y-4">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                              <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Name</p>
                              <p className="font-bold text-gray-900">{order.customerDetails?.name || "N/A"}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                              <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Phone</p>
                              <p className="font-bold text-gray-900">{order.customerDetails?.phone || "N/A"}</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                              <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Shipping Address</p>
                              <p className="font-bold text-gray-900 leading-relaxed">
                                {order.customerDetails
                                  ? `${order.customerDetails.street}, ${order.customerDetails.city}, ${order.customerDetails.state}, ${order.customerDetails.zip}, ${order.customerDetails.country}`
                                  : "N/A"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                              <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Payment Method</p>
                              <p className="font-bold text-gray-900 capitalize">
                                {order.customerDetails?.paymentMethod?.toLowerCase() || "N/A"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-4 mt-8 pt-8 border-t border-gray-200">
                      {order.status !== "Cancelled" && (
                        <button
                          className="bg-gradient-to-r from-black to-gray-800 text-yellow-500 px-6 py-3 rounded-xl font-bold hover:from-gray-800 hover:to-black transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                          onClick={() => handleCancel(order.id)}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}