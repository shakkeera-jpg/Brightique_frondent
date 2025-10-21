import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../Context/UserContext";

export default function OrderConfirmed() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const { user, loading } = useContext(AuthContext);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (!user?.id) return;

        const res = await axios.get(`https://brightique.onrender.com/users/${user.id}`);
        const userOrders = res.data.orders || [];
        console.log(userOrders);

        const foundOrder = userOrders.find(o => o.id === id);
        console.log(foundOrder);

        if (!foundOrder) {
          alert("Order not found.");
          return;
        }

        setOrder(foundOrder);
      } catch (err) {
        console.error("Failed to fetch order:", err);
        alert("Could not find your order. Please try again.");
      }
    };

    if (!loading) fetchOrder();
  }, [id, user?.id, loading]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading your order...</p>
      </div>
    </div>
  );

  if (!order) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading order details...</p>
      </div>
    </div>
  );

  const totalAmount = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-8 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-6xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <svg className="w-12 h-12 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 font-serif">Order Confirmed!</h1>
          <div className="w-32 h-1 bg-gradient-to-r from-yellow-500 to-yellow-300 mx-auto rounded-full mb-4"></div>
          <p className="text-xl text-gray-600 mb-2">Thank you for your purchase!</p>
          <p className="text-gray-500">Your order has been placed successfully and is being processed.</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          <div className="xl:col-span-2 space-y-8">
            
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-yellow-100">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 font-serif">Order Details</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">Order ID</label>
                    <p className="text-lg font-bold text-gray-900">{order.id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">Order Date</label>
                    <p className="text-gray-900 font-medium">{new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">Payment Method</label>
                    <p className="text-gray-900 font-medium capitalize">{order.paymentMethod.toLowerCase()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">Status</label>
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-700 border border-yellow-200">
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-yellow-100">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 font-serif">Customer Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">Full Name</label>
                    <p className="text-gray-900 font-medium">{order.customerDetails.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">Phone</label>
                    <p className="text-gray-900 font-medium">{order.customerDetails.phone}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">Shipping Address</label>
                  <p className="text-gray-900 font-medium leading-relaxed">
                    {order.customerDetails.street}<br />
                    {order.customerDetails.city}, {order.customerDetails.state}<br />
                    {order.customerDetails.zip}, {order.customerDetails.country}
                  </p>
                </div>
              </div>
            </div>

            
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-yellow-100">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 font-serif">Order Items</h2>
              </div>

              <div className="space-y-6">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-6 py-6 border-b border-gray-100 last:border-b-0">
                    <div className="w-20 h-20 bg-black rounded-xl flex items-center justify-center flex-shrink-0 p-2">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="object-contain w-full h-full rounded-lg"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-lg mb-1">{item.name}</h3>
                      <p className="text-yellow-600 text-sm font-medium mb-2">{item.meterial}</p>
                      <p className="text-gray-600 font-medium">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">₹{item.price}</p>
                      <p className="text-lg font-bold bg-gradient-to-r from-yellow-600 to-yellow-500 bg-clip-text text-transparent">
                        ₹{item.price * item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          
          <div className="xl:col-span-1">
            <div className="bg-white rounded-2xl shadow-2xl p-8 sticky top-8 border border-yellow-100">
              <h3 className="text-2xl font-semibold text-gray-900 mb-8 font-serif">Order Summary</h3>
              
              <div className="space-y-4 mb-6">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 truncate flex-1 mr-3 font-medium">{item.name} × {item.quantity}</span>
                    <span className="font-bold text-gray-900 whitespace-nowrap">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 mt-6 pt-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Subtotal</span>
                  <span className="text-gray-900 font-bold">₹{totalAmount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Shipping</span>
                  <span className="text-green-600 font-bold">Free</span>
                </div>
                <div className="flex justify-between items-center text-xl font-bold pt-6 border-t border-gray-200">
                  <span className="text-gray-900">Total Amount</span>
                  <span className="text-2xl bg-gradient-to-r from-yellow-600 to-yellow-500 bg-clip-text text-transparent">
                    ₹{totalAmount}
                  </span>
                </div>
              </div>

              
              <div className="mt-8 space-y-4">
                <Link
                  to="/Order"
                  className="w-full bg-gradient-to-r from-black to-gray-800 text-yellow-500 py-4 px-6 rounded-xl font-bold hover:from-gray-800 hover:to-black focus:ring-4 focus:ring-yellow-200 transition-all duration-300 text-center block shadow-2xl hover:shadow-3xl hover:scale-105"
                >
                  View Orders
                </Link>
                <Link
                  to="/"
                  className="w-full bg-gradient-to-r from-yellow-500 to-yellow-400 text-white py-4 px-6 rounded-xl font-bold hover:from-yellow-400 hover:to-yellow-300 focus:ring-4 focus:ring-yellow-200 transition-all duration-300 text-center block shadow-2xl hover:shadow-3xl hover:scale-105"
                >
                  Continue Shopping
                </Link>
              </div>

              
              <div className="mt-8 p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200 text-center">
                <p className="text-sm text-gray-700 font-medium">
                  Need help?{" "}
                  <a href="mailto:support@example.com" className="text-yellow-600 hover:text-yellow-700 font-bold">
                    Contact Support
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}