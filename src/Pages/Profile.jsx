import React, { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../Context/UserContext";
import { ShopContext } from "../Context/ShopContext";
import { useNavigate } from "react-router-dom";
import { 
  UserIcon, 
  ShoppingBagIcon, 
  HeartIcon, 
  ClockIcon, 
  IdentificationIcon 
} from "@heroicons/react/24/outline";

export default function Profile() {
  const { user, Authloading } = useContext(AuthContext);
  const { cart, wishlist } = useContext(ShopContext);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!Authloading && user) {
      api.get("profile/")
        .then((res) => setProfile(res.data))
        .catch((err) => console.error(err));
    }
  }, [user, Authloading]);

  useEffect(() => {
    if (!Authloading && !user) {
      navigate("/Login");
    }
  }, [user, Authloading, navigate]);

  return (
    <div className="min-h-screen bg-[#fafafa] pt-22 pb-24 px-6 font-sans antialiased">
      
      <style>
        {`
          .premium-border { border: 1px solid rgba(175, 143, 66, 0.2); }
          .gold-text { color: #AF8F42; }
          .gold-bg { background-color: #AF8F42; }
          .custom-scrollbar::-webkit-scrollbar { width: 3px; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #AF8F42; }
        `}
      </style>

      <div className="max-w-7xl mx-auto">
        
        
        <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-200 pb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-10 h-[1px] gold-bg"></span>
              <span className="text-[10px] tracking-[0.4em] gold-text uppercase font-bold">Client Profile</span>
            </div>
            <h1 className="text-5xl font-light text-gray-900 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              {profile?.name || "Member"}
            </h1>
            <p className="text-gray-400 font-light tracking-widest text-xs uppercase mt-2 italic">
              {profile?.email}
            </p>
          </div>
          
          <div className="flex gap-4">
            <div className="text-right hidden md:block">
              <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Status</p>
              <p className="text-xs font-bold tracking-widest uppercase text-gray-900">Premium Collector</p>
            </div>
            <div className="w-16 h-16 rounded-full border border-gray-200 flex items-center justify-center bg-white shadow-sm">
              <UserIcon className="w-6 h-6 text-gray-400" />
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          
          <div className="lg:col-span-8 space-y-12">
            
            
            <section>
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xs font-bold tracking-[0.3em] text-gray-900 uppercase">Personal Wishlist</h3>
                <span className="text-[10px] text-gray-400 uppercase tracking-widest">{profile?.wishlist?.length || 0} Saved Items</span>
              </div>

              {profile?.wishlist?.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.wishlist.map((item) => (
                    <div key={item.id} className="bg-white p-6 border border-gray-100 hover:border-[#AF8F42]/30 transition-all group cursor-pointer">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-[9px] gold-text uppercase font-bold tracking-widest mb-1">Brightique Select</p>
                          <h4 className="text-sm font-medium text-gray-800 tracking-wide uppercase group-hover:text-[#AF8F42] transition-colors">
                            {item.product.name}
                          </h4>
                        </div>
                        <HeartIcon className="w-4 h-4 text-[#AF8F42]" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-40 flex flex-col items-center justify-center border border-dashed border-gray-200 rounded-sm">
                  <p className="text-gray-400 italic text-xs tracking-widest uppercase">No saved masterpieces yet.</p>
                </div>
              )}
            </section>

            
            <section className="bg-white p-10 premium-border shadow-sm">
              <div className="flex items-center gap-4 mb-10">
                <ShoppingBagIcon className="w-5 h-5 text-gray-900" />
                <h3 className="text-xs font-bold tracking-[0.3em] text-gray-900 uppercase">Active Selection</h3>
              </div>

              {profile?.cart?.items?.length ? (
                <div className="divide-y divide-gray-100">
                  {profile.cart.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center py-6 group">
                      <div className="flex items-center gap-6">
                        <span className="text-[10px] font-mono text-gray-300">0{item.id.toString().slice(-1)}</span>
                        <span className="text-xs tracking-[0.1em] uppercase text-gray-700 font-medium group-hover:translate-x-2 transition-transform duration-300">
                          {item.product.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-8">
                        <div className="text-right">
                          <p className="text-[9px] text-gray-400 uppercase tracking-tighter">Quantity</p>
                          <p className="text-sm font-light text-gray-900">{item.quantity}</p>
                        </div>
                        <button className="text-[10px] gold-text font-bold uppercase tracking-widest border-b border-transparent hover:border-[#AF8F42] transition-all">Details</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 italic text-center py-4 text-xs tracking-widest uppercase font-light">Your shopping bag is empty.</p>
              )}
            </section>
          </div>

          
          <aside className="lg:col-span-4 space-y-8">
            
           
            <div className="bg-[#1a1a1a] text-white p-10 shadow-xl">
              <div className="flex items-center gap-3 mb-10">
                <ClockIcon className="w-5 h-5 gold-text" />
                <h3 className="text-xs font-bold tracking-[0.3em] uppercase">Order Archive</h3>
              </div>

              {profile?.orders?.length ? (
                <div className="space-y-10 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                  {profile.orders.map((order) => (
                    <div key={order.id} className="group border-b border-white/10 pb-8 last:border-0">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-[9px] gold-text uppercase font-bold mb-1 tracking-tighter">REF: #{order.id.toString().slice(-6).toUpperCase()}</p>
                          <p className="text-[11px] font-light text-white/80 tracking-widest uppercase">
                            {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                        <span className={`text-[8px] uppercase tracking-[0.2em] px-2 py-1 font-bold border ${order.status === "confirmed" ? "border-emerald-500/50 text-emerald-400" : "border-white/20 text-white/50"}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {order.items.map((prod) => (
                          <div key={prod.id} className="text-[10px] text-white/40 flex justify-between uppercase italic">
                            <span>{prod.name}</span>
                            <span>x{prod.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-white/20 italic text-xs tracking-[0.2em] uppercase">Archive Empty</p>
                </div>
              )}
            </div>

            
            <div className="bg-white border border-gray-100 p-8">
              <h4 className="text-[10px] font-bold tracking-[0.3em] text-gray-900 uppercase mb-6">Concierge Services</h4>
              <div className="space-y-4">
                <button className="w-full py-3 text-[10px] tracking-[0.2em] uppercase font-bold border border-gray-900 hover:bg-gray-900 hover:text-white transition-all">
                  Request Assistance
                </button>
                <button className="w-full py-3 text-[10px] tracking-[0.2em] uppercase font-bold text-gray-400 hover:text-red-800 transition-all">
                  Sign Out
                </button>
              </div>
            </div>
          </aside>
          
        </div>
      </div>
    </div>
  );
}