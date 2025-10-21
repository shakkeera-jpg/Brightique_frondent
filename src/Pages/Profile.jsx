import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../Context/UserContext";
import { ShopContext } from "../Context/ShopContext";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user } = useContext(AuthContext);
  const { cart, wishlist } = useContext(ShopContext);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate()

  useEffect(() => {
    if (user?.id) {
      axios.get(`https://brightique.onrender.com/users/${user.id}`)
        .then(res => setProfile(res.data))
        .catch(err => console.error(err));
    }
  }, [user]);
 
  useEffect(() => {
    if (!user) {
      navigate("/Login")
    }
  }, [user, navigate])


  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 mt-20">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column - Profile, Wishlist & Cart */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Header */}
          <div className="bg-white rounded-xl shadow-lg border  overflow-hidden" style={{ border: "#c9a64e" }}>
            <div className=" p-6 text-white" style={{ backgroundColor: "#c9a64e" }}>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md">
                  <span className="text-2xl font-bold text-yellow-600">
                    {profile?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{profile?.name}</h2>
                  <p className="text-yellow-100">{profile?.username}</p>
                  <p className="text-yellow-100">{profile?.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Wishlist */}
          <div className="bg-white rounded-xl shadow-lg border  p-6" style={{ border: "#c9a64e" }}>
            <div className="flex items-center mb-4">

              <h3 className="text-lg font-semibold text-gray-800">Wishlist</h3>
            </div>
            {profile?.wishlist?.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {profile.wishlist.map((product) => (
                  <div key={product.id} className="bg-yellow-50 rounded-lg px-4 py-3 border border-yellow-100">
                    <span className="text-gray-700">Product Name: </span>
                    <span className="font-semibold text-yellow-700">{product.name}</span>
                    <br />

                    <span className="text-gray-700">Product ID: </span>
                    <span className="font-semibold text-yellow-700">{product.id}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No items in wishlist</p>
            )}
          </div>

          {/* Cart */}
          <div className="bg-white rounded-xl shadow-lg border border-yellow-200 p-6">
            <div className="flex items-center mb-4">

              <h3 className="text-lg font-semibold text-gray-800">Shopping Cart</h3>
            </div>
            {profile?.cart?.length ? (
              <div className="space-y-3">
                {profile.cart.map((item) => (
                  <div key={item.productId} className="flex items-center justify-between bg-yellow-50 rounded-lg px-4 py-3 border border-yellow-100">
                    <div>
                      <span className="text-gray-700">Product </span>
                      <span className="font-semibold text-yellow-700">{item.productId}</span>
                    </div>
                    <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Qty: {item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Your cart is empty</p>
            )}
          </div>
        </div>

        {/* Right Column - Orders */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg border border-yellow-200 p-6 sticky top-6">
            <div className="flex items-center mb-6">

              <h3 className="text-xl font-bold text-gray-800">Order History</h3>
            </div>

            {profile?.orders?.length ? (
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {profile.orders.map((order) => (
                  <div key={order.orderId} className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:shadow-md transition-shadow">
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600">Order ID</p>
                        <p className="font-semibold text-yellow-700 text-sm">{order.id}</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-600">Status</p>
                          <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${order.status === 'completed' ? 'bg-green-200 text-green-800' :
                              order.status === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                                'bg-blue-200 text-blue-800'
                            }`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Date</p>
                          <p className="text-xs font-semibold text-gray-700">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="border-t border-gray-200 pt-3">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Items:</p>
                        <div className="space-y-2">
                          {order.items.map((prod) => (
                            <div key={prod.productId} className="flex justify-between items-center bg-white rounded px-3 py-2 border border-gray-100">
                              <span className="text-xs text-gray-600">
                                Product {prod.productId}
                              </span>
                              <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs font-semibold">
                                {prod.quantity}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">

                <p className="text-gray-500">No orders yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}