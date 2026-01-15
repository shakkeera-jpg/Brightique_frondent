import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ShopContext } from "../Context/ShopContext";
import { AuthContext } from "../Context/UserContext";

export default function CheckOut() {
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    paymentMethod: "cod",
  });
   const [orderPlaced, setOrderPlaced] = useState(false);

  const { cart, fetchCart } = useContext(ShopContext);
  const { user, Authloading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({ ...prev, name: user.name }));
    }
  }, [user]);

  useEffect(() => {
    if (!Authloading && !user) {
      navigate("/login");
    }
  }, [Authloading, user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const required = ["name", "phone", "street", "city", "state", "zip", "country"];
    for (let field of required) {
      if (!formData[field].trim()) {
        alert(`Please fill ${field}`);
        return false;
      }
    }
    if (!/^[0-9]{10}$/.test(formData.phone)) {
      alert("Enter valid 10-digit phone number");
      return false;
    }
    return true;
  };

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  useEffect(() => {
  if (!orderPlaced && (!cart || cart.length === 0)) {
    navigate("/products", { replace: true });
  }
}, [cart, orderPlaced, navigate]);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoadingOrder(true);
      const res = await axios.post(
        "http://127.0.0.1:8000/api/create-order/",
        {
          amount: totalAmount,
          payment_method: formData.paymentMethod,
          name: formData.name,
          phone: formData.phone,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          country: formData.country,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        }
      );

      if (formData.paymentMethod === "cod") {
        setOrderPlaced(true);
        await axios.post(
          `http://127.0.0.1:8000/api/confirm-cod/${res.data.order_id}/`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access")}`,
            },
          }
        );
        await fetchCart();
        navigate(`/order-confirmation/${res.data.order_id}`,{ replace: true });
        return;
      }

      const { razorpay_order_id, razorpay_key } = res.data;
      const options = {
        key: razorpay_key,
        currency: "INR",
        order_id: razorpay_order_id,

        handler: async function (response) {
         
          try {
            setOrderPlaced(true);
            const verifyRes = await axios.post(
              "http://127.0.0.1:8000/api/verify-payment/",
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,

                
                name: formData.name,
                phone: formData.phone,
                street: formData.street,
                city: formData.city,
                state: formData.state,
                zip: formData.zip,
                country: formData.country,
              },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("access")}`,
                },
              }
            );

            await fetchCart();
            navigate(`/order-confirmation/${verifyRes.data.order_id}`,{ replace: true });
          } catch (err) {
            alert(err.response?.data?.error || "Payment verification failed");
          } finally {
            setLoadingOrder(false);
          }
        },

        modal: {
          ondismiss: function () {
            
            console.log("Payment popup closed by user");
            setLoadingOrder(false);
          }
        },

        prefill: {
          name: formData.name,
          email: user?.email,
          contact: formData.phone,
        },

        theme: { color: "#AF8F42" },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        alert("Payment failed. Amount not deducted.");
        setLoadingOrder(false);
      });
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Order failed. Try again.");
    }
  };

  if (Authloading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FCFCFC]">
        <div className="animate-spin h-8 w-8 border-2 border-[#AF8F42] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCFCFC] pt-32 pb-20 px-6 sm:px-10">
      <div className="max-w-6xl mx-auto">

        
        <div className="mb-16 border-b border-gray-100 pb-10">
          <span className="text-[10px] uppercase tracking-[0.4em] text-[#AF8F42] font-bold mb-3 block">
            Final Step
          </span>
          <h1
            className="text-4xl md:text-5xl font-light text-gray-900 italic"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Checkout
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

          
          <div className="lg:col-span-7">
            <form onSubmit={handlePlaceOrder} className="space-y-16">

             
              <section>
                <div className="flex items-center gap-4 mb-10">
                  <span className="text-[10px] w-6 h-6 border border-gray-300 flex items-center justify-center rounded-full text-gray-400 font-bold">1</span>
                  <h2 className="text-xs uppercase tracking-[0.3em] font-bold text-gray-900">Shipping Details</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                  {["name", "phone", "street", "city", "state", "zip", "country"].map(field => (
                    <div key={field} className={field === "street" ? "md:col-span-2" : ""}>
                      <label className="block text-[9px] uppercase tracking-widest text-gray-400 font-bold mb-3">
                        {field === "zip" ? "Postal Code" : field}
                      </label>
                      <input
                        type="text"
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        className="w-full bg-transparent border-b border-gray-200 py-3 text-sm focus:border-[#AF8F42] transition-colors outline-none placeholder:text-gray-200"
                        placeholder={`Your ${field}...`}
                      />
                    </div>
                  ))}
                </div>
              </section>

              
              <section>
                <div className="flex items-center gap-4 mb-10">
                  <span className="text-[10px] w-6 h-6 border border-gray-300 flex items-center justify-center rounded-full text-gray-400 font-bold">2</span>
                  <h2 className="text-xs uppercase tracking-[0.3em] font-bold text-gray-900">Payment Selection</h2>
                </div>
                <div className="space-y-6">
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    className="w-full bg-white border border-gray-100 p-4 text-xs uppercase tracking-widest font-bold focus:ring-1 focus:ring-[#AF8F42] outline-none appearance-none cursor-pointer"
                  >
                    <option value="cod">Cash on Delivery</option>
                    <option value="razorpay">Online Credit/Debit (Razorpay)</option>
                  </select>

                  <div className="p-6 bg-gray-50 border border-gray-100 italic font-light text-gray-500 text-sm">
                    "Your acquisition is protected by 256-bit encryption. We prioritize your privacy above all."
                  </div>
                </div>
              </section>

              <button
                type="submit"
                disabled={loadingOrder}
                className="w-full h-16 bg-black text-white text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-[#AF8F42] transition-all duration-500 shadow-xl disabled:opacity-50"
              >
                {loadingOrder ? "Processing Order..." : `Complete Purchase — ₹${totalAmount.toLocaleString()}`}
              </button>
            </form>
          </div>

          
          <div className="lg:col-span-5">
            <div className="bg-white border border-gray-100 p-8 sticky top-32">
              <h2 className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-900 mb-8 border-b border-gray-50 pb-4">
                Manifest Content
              </h2>

              <div className="max-h-[400px] overflow-y-auto no-scrollbar space-y-8 mb-10">
                {cart.map((item, index) => (
                  <div key={index} className="flex gap-6">
                    <div className="w-20 h-24 bg-[#F7F7F7] flex-shrink-0 border border-gray-50">
                      <img src={item.product.image} alt={item.product.name} className="w-full h-full object-contain mix-blend-multiply" />
                    </div>
                    <div className="flex flex-col justify-center flex-1">
                      <h3 className="text-[10px] uppercase tracking-widest font-bold text-gray-900 line-clamp-1">{item.product.name}</h3>
                      <p className="text-[10px] text-[#AF8F42] mt-1">QTY: {item.quantity} • {item.product.meterial}</p>
                      <p className="text-xs font-medium mt-2 text-gray-400">₹{(item.product.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-50 pt-8 space-y-3">
                <div className="flex justify-between text-[10px] uppercase tracking-widest text-gray-400">
                  <span>Subtotal</span>
                  <span>₹{totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[10px] uppercase tracking-widest text-[#AF8F42]">
                  <span>Shipping</span>
                  <span>Complimentary</span>
                </div>
                <div className="flex justify-between text-lg font-light text-gray-900 pt-4 border-t border-gray-50 mt-4">
                  <span style={{ fontFamily: "'Playfair Display', serif" }} className="italic">Total</span>
                  <span className="font-sans font-bold">₹{totalAmount.toLocaleString()}</span>
                </div>
              </div>

              
              <div className="mt-8 flex items-center justify-center gap-2 opacity-30 grayscale">
                <div className="w-1 h-1 bg-black rounded-full"></div>
                <span className="text-[8px] uppercase tracking-[0.3em] font-bold">Secure Global Fulfillment</span>
                <div className="w-1 h-1 bg-black rounded-full"></div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}