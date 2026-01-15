import React, { useContext, useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../Context/UserContext";
import api from "../api/axios";

export default function OrderConfirmed() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, Authloading } = useContext(AuthContext);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const goldClassic = "#AF8F42";

  useEffect(() => {
  window.history.pushState(null, "", window.location.href);
  window.onpopstate = function () {
    window.location.replace("/products");
  };
}, []);

  useEffect(() => {
    if (Authloading || !user || !id) return;

    let isMounted = true;

    const fetchOrder = async () => {
      try {
        const res = await api.get(`orders/${id}/`);
        if (isMounted) setOrder(res.data);
      } catch (err) {
        console.error("Order fetch failed:", err.response?.data || err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchOrder();

    return () => {
      isMounted = false;
    };
  }, [id, user, Authloading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FCFCFC]">
        <div className="animate-spin h-8 w-8 border-2 border-[#AF8F42] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!order || !Array.isArray(order.items)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FCFCFC]">
        <div className="text-center">
          <h2 className="text-xl font-light italic mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Manifest not found</h2>
          <Link to="/" className="text-[10px] uppercase tracking-widest font-bold border-b border-black pb-1">Return to Boutique</Link>
        </div>
      </div>
    );
  }

  const totalAmount = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-[#FCFCFC] pt-20 pb-20 px-6 sm:px-10">
      <div className="max-w-5xl mx-auto">
        
        
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center w-16 h-16 border border-[#AF8F42] rounded-full mb-8">
            <svg className="w-6 h-6 text-[#AF8F42]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="block text-[10px] uppercase tracking-[0.5em] text-[#AF8F42] font-bold mb-4">Acquisition Complete</span>
          <h1 
            className="text-4xl md:text-6xl font-light text-gray-900 italic mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            A Choice Well Made.
          </h1>
          <p className="text-gray-400 text-sm max-w-lg mx-auto leading-relaxed tracking-wide">
            Your selection has been logged into our archives. Our artisans are now preparing your pieces for their journey to you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8 space-y-12">
            
            
            <div className="border border-gray-100 bg-white p-10">
              <div className="flex items-center gap-4 mb-10 border-b border-gray-50 pb-6">
                <h2 className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-900">Order Metadata</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-gray-400 font-bold mb-2">Reference ID</label>
                  <p className="text-sm font-mono font-medium text-gray-900">#{order.id}</p>
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-gray-400 font-bold mb-2">Transaction Method</label>
                  <p className="text-xs uppercase tracking-widest font-bold text-[#AF8F42]">{order.payment_method}</p>
                </div>
              </div>
            </div>

            
            <div className="space-y-6">
              <h2 className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 px-2">The Manifest</h2>
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center gap-8 p-6 bg-white border border-gray-50 group hover:border-gray-200 transition-colors">
                  <div className="w-24 h-24 bg-[#F7F7F7] p-2 flex-shrink-0">
                    <img src={item.image} alt={item.name} className="object-contain w-full h-full mix-blend-multiply" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[11px] uppercase tracking-widest font-bold text-gray-900 mb-1">{item.name}</h3>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right text-sm font-light text-gray-900">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          
          <div className="lg:col-span-4">
            <div className="bg-white border border-gray-100 p-8 sticky top-32 shadow-[0_10px_40px_rgba(0,0,0,0.02)]">
              <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-900 mb-8 border-b border-gray-50 pb-4">Financial Summary</h3>
              
              <div className="flex justify-between items-baseline mb-12">
                <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Total Investment</span>
                <span className="text-2xl font-light text-[#AF8F42]">₹{totalAmount.toLocaleString()}</span>
              </div>

              <div className="space-y-4">
                <Link 
                  to="/Order" 
                  className="block text-center w-full bg-black text-white py-4 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-[#AF8F42] transition-all duration-500 shadow-xl"
                >
                  View Archives
                </Link>
                <Link 
                  to="/" 
                  className="block text-center w-full border border-gray-200 text-gray-400 py-4 text-[10px] uppercase tracking-[0.3em] font-bold hover:text-black hover:border-black transition-all"
                >
                  Return to Boutique
                </Link>
              </div>

              <div className="mt-10 pt-6 border-t border-gray-50 text-center">
                <p className="text-[9px] text-gray-300 uppercase tracking-[0.2em] leading-relaxed">
                  A confirmation email has been dispatched to your registered address.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}