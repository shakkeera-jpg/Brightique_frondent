import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ShopContext } from "../Context/ShopContext";
import { AuthContext } from "../Context/UserContext";

export default function CheckOut() {
  const { cart, setCart } = useContext(ShopContext);
  const { user, loading, setUser } = useContext(AuthContext);
  const [loadingOrder, setLoadingOrder] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    paymentMethod: "Cash on Delivery",
    upiId: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    bankAccount: "",
  });

  const navigate = useNavigate();

  const Handlebutton = () => {
    navigate("/login");
  };

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({ ...prev, name: user.name }));
    }
  }, [user]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
    </div>
  );

  if (!user) {
    navigate('/login')
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.name.trim()) return alert("Enter your name.");
    if (!/^\d{10}$/.test(formData.phone)) return alert("Enter a valid 10-digit phone number.");
    if (!formData.street.trim() || !formData.city.trim() || !formData.state.trim() || !formData.zip.trim() || !formData.country.trim())
      return alert("Please complete all address fields.");
    if (!/^\d{5,6}$/.test(formData.zip)) return alert("Enter a valid ZIP code.");

    if (formData.paymentMethod === "UPI" && !/^[\w.\-]+@[\w]+$/.test(formData.upiId))
      return alert("Enter a valid UPI ID (example: name@bank).");

    if (formData.paymentMethod === "Credit Card") {
      if (!/^\d{16}$/.test(formData.cardNumber)) return alert("Enter a valid 16-digit card number.");
      if (!/^\d{2}\/\d{2}$/.test(formData.expiry)) return alert("Enter expiry as MM/YY.");
      if (!/^\d{3}$/.test(formData.cvv)) return alert("Enter a valid 3-digit CVV.");
    }

    if (formData.paymentMethod === "Net Banking" && !/^\d{9,18}$/.test(formData.bankAccount))
      return alert("Enter a valid bank account number.");

    return true;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!user?.id) {
      alert("Please log in to place an order.");
      return;
    }

    const orderData = {
      id: Math.random().toString(36).substring(2, 9),
      userId: user.id,
      items: cart,
      customerDetails: formData,
      paymentMethod: formData.paymentMethod,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    try {
      setLoadingOrder(true);
      const userRes = await axios.get(`https://brightique.onrender.com/users/${user.id}`);
      const existingUser = userRes.data;

      const updatedOrders = [...(existingUser.orders || []), orderData];

      const patchRes = await axios.patch(
        `https://brightique.onrender.com/users/${user.id}`,
        {
          orders: updatedOrders,
          cart: [],
        }
      );

      const updatedUser = patchRes.data;
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setCart([]);

      navigate(`/OrderConfirmed/${orderData.id}`);
    } catch (error) {
      console.error("Order placement failed:", error);
      alert(" Failed to place order. Please try again.");
    } finally {
      setLoadingOrder(false);
    }
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-8 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-6xl mx-auto">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3 font-serif">Checkout</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-500 to-yellow-300 mx-auto rounded-full"></div>
          <p className="text-gray-600 mt-4">Complete your purchase with confidence</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-yellow-100">
            <form onSubmit={handlePlaceOrder} className="space-y-8">
              
              <section>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-yellow-500 text-lg font-bold">1</span>
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900 font-serif">Shipping Information</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {["name", "phone", "street", "city", "state", "zip", "country"].map((field) => (
                    <div key={field} className={field === "street" ? "md:col-span-2" : ""}>
                      <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                        {field === "zip" ? "ZIP Code" : field}
                      </label>
                      <input
                        type="text"
                        name={field}
                        placeholder={field === "zip" ? "Enter ZIP code" : `Enter your ${field}`}
                        value={formData[field]}
                        onChange={handleChange}
                        className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-300 bg-white"
                      />
                    </div>
                  ))}
                </div>
              </section>

              
              <section>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-yellow-500 text-lg font-bold">2</span>
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900 font-serif">Payment Method</h2>
                </div>

                <div className="space-y-6">
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-300 bg-white font-medium"
                  >
                    <option value="Cash on Delivery">Cash on Delivery</option>
                    <option value="UPI">UPI</option>
                    <option value="Net Banking">Net Banking</option>
                    <option value="Credit Card">Credit/Debit Card</option>
                  </select>

                 
                  {formData.paymentMethod === "UPI" && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">UPI ID</label>
                      <input
                        type="text"
                        name="upiId"
                        placeholder="name@bank"
                        value={formData.upiId}
                        onChange={handleChange}
                        className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-300 bg-white"
                      />
                    </div>
                  )}

                  {formData.paymentMethod === "Credit Card" && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Card Number</label>
                        <input
                          type="text"
                          name="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={formData.cardNumber}
                          onChange={handleChange}
                          className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-300 bg-white"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Expiry Date</label>
                          <input
                            type="text"
                            name="expiry"
                            placeholder="MM/YY"
                            value={formData.expiry}
                            onChange={handleChange}
                            className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-300 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">CVV</label>
                          <input
                            type="text"
                            name="cvv"
                            placeholder="123"
                            value={formData.cvv}
                            onChange={handleChange}
                            className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-300 bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {formData.paymentMethod === "Net Banking" && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Bank Account Number</label>
                      <input
                        type="text"
                        name="bankAccount"
                        placeholder="Enter your account number"
                        value={formData.bankAccount}
                        onChange={handleChange}
                        className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-300 bg-white"
                      />
                    </div>
                  )}
                </div>
              </section>

              <button
                type="submit"
                disabled={loadingOrder}
                className="w-full bg-gradient-to-r from-black to-gray-800 text-yellow-500 py-4 px-6 rounded-xl font-bold text-lg hover:from-gray-800 hover:to-black focus:ring-4 focus:ring-yellow-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl hover:shadow-3xl hover:scale-105"
              >
                {loadingOrder ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-6 h-6 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                    Processing Order...
                  </div>
                ) : (
                  `Place Order - ₹${totalAmount}`
                )}
              </button>
            </form>
          </div>

          {/* Right Column - Order Summary */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 h-fit sticky top-8 border border-yellow-100">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center shadow-lg">
                <span className="text-yellow-500 text-lg font-bold">3</span>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 font-serif">Order Summary</h2>
            </div>

            <div className="space-y-6 mb-8">
              {cart.map((item, index) => (
                <div key={index} className="flex items-center gap-4 py-4 border-b border-gray-100 last:border-b-0">
                  <div className="w-20 h-20 bg-black rounded-xl flex items-center justify-center flex-shrink-0 p-2">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{item.meterial}</p>
                    <p className="text-sm text-yellow-600 font-medium">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">₹{item.price}</p>
                    <p className="text-lg font-bold bg-gradient-to-r from-yellow-600 to-yellow-500 bg-clip-text text-transparent">
                      ₹{item.price * item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-600 font-medium">Subtotal</span>
                <span className="text-gray-900 font-semibold">₹{totalAmount}</span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-600 font-medium">Shipping</span>
                <span className="text-green-600 font-semibold">Free</span>
              </div>
              <div className="flex justify-between items-center text-xl font-bold mt-6 pt-6 border-t border-gray-200">
                <span className="text-gray-900">Total Amount</span>
                <span className="text-2xl bg-gradient-to-r from-yellow-600 to-yellow-500 bg-clip-text text-transparent">
                  ₹{totalAmount}
                </span>
              </div>
            </div>

            {/* Security Badge */}
            <div className="mt-8 p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl flex items-center gap-4 border border-yellow-200">
              <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm text-gray-700 font-medium">Secure checkout. Your information is protected.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}