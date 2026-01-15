import React, { useEffect, useState, useContext } from "react";
import { ShopContext } from "../Context/ShopContext";
import api from "../api/axios";
import { AuthContext } from "../Context/UserContext";
import { Link } from "react-router-dom";

export default function Order() {
  const { user } = useContext(AuthContext);
  const { cancelOrder } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        const res = await api.get("orders/");
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to load orders", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const handleCancel = (orderId) => {
    if (window.confirm("Cancel this order?")) {
      cancelOrder(orderId);
      // Update locally first
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: "Cancelled" } : order
        )
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-gray-400">Loading Manifest</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] py-20 px-4 sm:px-6 lg:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Editorial Header */}
        <div className="mb-20">
          <span className="text-[10px] tracking-[0.5em] uppercase text-yellow-600 font-bold block mb-4">Account Archive</span>
          <h1 className="text-5xl md:text-6xl font-light text-gray-900 font-serif mb-6 tracking-tight">Order History</h1>
          <div className="w-20 h-[1px] bg-gray-300"></div>
        </div>

        {orders.length === 0 ? (
          <div className="py-32 text-center border border-dashed border-gray-200 rounded-sm">
            <h3 className="text-2xl font-serif text-gray-400 mb-6 italic">The archive is currently empty.</h3>
            <Link
              to="/"
              className="inline-block text-[11px] tracking-[0.2em] uppercase font-bold border-b-2 border-yellow-500 pb-1 hover:text-yellow-600 transition-colors"
            >
              Discover Collections
            </Link>
          </div>
        ) : (
          <div className="space-y-24">
            {orders.map((order) => {
              const total = order.items
                ? order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
                : 0;

              return (
                <div key={order.id} className="group transition-all duration-700">
                  {/* Order Top Bar */}
                  <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-gray-200 pb-6 mb-8">
                    <div>
                      <h2 className="text-xs tracking-[0.3em] uppercase text-gray-400 font-bold mb-2">Reference ID</h2>
                      <p className="text-2xl font-serif text-gray-900 italic">#{order.id}</p>
                    </div>
                    <div className="mt-4 md:mt-0 flex gap-8 items-end">
                      <div className="text-right">
                        <h2 className="text-[10px] tracking-[0.3em] uppercase text-gray-400 font-bold mb-2">Timestamp</h2>
                        <p className="text-sm font-medium text-gray-600">
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}
                        </p>
                      </div>
                      <div className="text-right">
                        <h2 className="text-[10px] tracking-[0.3em] uppercase text-gray-400 font-bold mb-2">Status</h2>
                        <span className={`text-[10px] tracking-widest uppercase font-black ${
                          order.status === "Cancelled" ? "text-red-400" : "text-yellow-600"
                        }`}>
                          {order.status || "Processing"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order Content */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Items List */}
                    <div className="lg:col-span-7">
                      <div className="space-y-6">
                        {order.items?.map((item, index) => (
                          <div key={index} className="flex gap-6 items-center">
                            <div className="w-24 h-32 bg-gray-100 overflow-hidden flex-shrink-0">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                              />
                            </div>
                            <div className="flex-1 border-b border-gray-100 pb-4">
                              <h4 className="text-sm tracking-widest uppercase font-bold text-gray-900 mb-1">{item.name}</h4>
                              <p className="text-[11px] text-gray-400 italic mb-2">{item.meterial || 'Fine Selection'}</p>
                              <div className="flex justify-between items-center">
                                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                <p className="text-sm font-serif text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Meta Sidebar */}
                    <div className="lg:col-span-5 bg-white p-8 border border-gray-100 shadow-sm self-start">
                      <h3 className="text-[10px] tracking-[0.4em] uppercase text-gray-900 font-black mb-6 border-b border-yellow-500 w-fit pb-1">Delivery Protocol</h3>
                      <div className="space-y-6">
                        <div>
                          <p className="text-[9px] tracking-widest uppercase text-gray-400 mb-1">Addressee</p>
                          <p className="text-sm font-medium text-gray-800">{order.customerDetails?.name || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-[9px] tracking-widest uppercase text-gray-400 mb-1">Destination</p>
                          <p className="text-sm font-medium text-gray-800 leading-relaxed">
                            {order.customerDetails
                              ? `${order.customerDetails.street}, ${order.customerDetails.city}, ${order.customerDetails.zip}`
                              : "Address details missing"}
                          </p>
                        </div>
                        <div className="pt-6 border-t border-gray-100 flex justify-between items-end">
                          <div>
                            <p className="text-[9px] tracking-widest uppercase text-gray-400 mb-1">Total Valuation</p>
                            <p className="text-3xl font-serif text-gray-900">₹{total.toLocaleString()}</p>
                          </div>
                          {order.status !== "Cancelled" && (
                            <button
                              onClick={() => handleCancel(order.id)}
                              className="text-[10px] tracking-[0.2em] uppercase font-bold text-red-400 hover:text-red-600 transition-colors py-2"
                            >
                              Void Order
                            </button>
                          )}
                        </div>
                      </div>
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