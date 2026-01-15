import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShopContext } from "../Context/ShopContext";
import { TrashIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

export default function Cart() {
  const {
    cart,
    removeFromCart,
    decreaseQuantity,
    increaseQuantity,
    getProductStock,
  } = useContext(ShopContext);

  const navigate = useNavigate();
  const goldClassic = "#AF8F42";

  const handleCheckOut = () => {
    navigate("/CheckOut");
  };


  const handleRemoveFromCart = (item) => {
    removeFromCart(item.id);
    toast.success(`${item.product.name} removed from cart`);
  };

  const totalPrice = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FCFCFC] px-4">
        <div className="text-center max-w-md mx-auto">
          <div className="w-20 h-20 mx-auto mb-8 border border-gray-100 flex items-center justify-center rounded-full bg-white shadow-sm">
            <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h2 className="text-3xl font-light text-gray-900 mb-4 italic" style={{ fontFamily: "'Playfair Display', serif" }}>
            Your bag is empty
          </h2>
          <p className="text-gray-400 text-sm mb-8 tracking-wide">Refinement awaits. Discover our latest collections.</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] font-bold text-[#AF8F42] border-b border-[#AF8F42] pb-1 hover:text-black hover:border-black transition-all"
          >
            Browse Products <ArrowRightIcon className="w-3 h-3" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCFCFC] pt-20 pb-20 px-6">
      <div className="container mx-auto max-w-5xl">

        
        <div className="flex flex-col items-center mb-16">
          <span className="text-[10px] uppercase tracking-[0.5em] text-[#AF8F42] font-bold mb-4">
            Shopping Bag
          </span>
          <h1
            className="text-4xl md:text-5xl font-light text-gray-900 italic"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Review Your Order
          </h1>
          <div className="w-12 h-[1px] bg-[#AF8F42] mt-6"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

         
          <div className="lg:col-span-2 space-y-8">
            {cart.map((item) => (
              <div
                key={item.product.id}
                className="group flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-gray-100 transition-all"
              >
                
                <div className="w-32 h-40 flex-shrink-0 bg-[#F7F7F7] border border-gray-50 overflow-hidden">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-700"
                  />
                </div>

                
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-[11px] uppercase tracking-[0.2em] font-bold text-gray-900 mb-1">
                    {item.product.name}
                  </h3>
                  <p className="text-xs text-gray-400 font-light italic mb-4">
                    {item.product.meterial || "Signature Edition"}
                  </p>

                  <div className="flex items-center justify-center sm:justify-start gap-6">
                    
                    <div className="flex items-center border border-gray-200 h-10">
                      
                      <button
                        onClick={() => decreaseQuantity(item.id)}
                        disabled={item.quantity <= 1}
                        className={`w-10 h-full transition-colors ${item.quantity <= 1
                          ? "text-gray-200 cursor-not-allowed"
                          : "text-gray-400 hover:text-black"
                          }`}
                      >
                        —
                      </button>

                      <span className="w-8 text-center text-[11px] font-bold text-gray-900">
                        {item.quantity}
                      </span>

                      
                      <button
                        onClick={() => increaseQuantity(item.id)}
                        disabled={item.quantity >= item.product.stock}
                        className={`w-10 h-full transition-colors ${item.quantity >= item.product.stock
                          ? "text-gray-200 cursor-not-allowed"
                          : "text-gray-400 hover:text-black"
                          }`}
                      >
                        +
                      </button>
                    </div>

                    <p className="text-sm font-medium text-[#AF8F42] tracking-tight">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>
                </div>

                
                <button
                  onClick={() => handleRemoveFromCart(item)}
                  className="p-3 text-gray-300 hover:text-red-400 transition-colors"
                  title="Remove item"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-100 p-8 sticky top-32 shadow-[0_10px_40px_rgba(0,0,0,0.03)]">
              <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-900 mb-8 border-b border-gray-50 pb-4">
                Summary
              </h4>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-[11px] uppercase tracking-widest text-gray-400 font-medium">
                  <span>Subtotal ({cart.length} items)</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-[11px] uppercase tracking-widest text-gray-400 font-medium">
                  <span>Shipping</span>
                  <span className="text-[#AF8F42]">Complimentary</span>
                </div>
              </div>

              <div className="flex justify-between items-baseline mb-10 border-t border-gray-50 pt-6">
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-900">Total</span>
                <span className="text-2xl font-light text-[#AF8F42] tracking-tighter">
                  {formatPrice(totalPrice)}
                </span>
              </div>

              <button
                onClick={handleCheckOut}
                className="w-full h-14 bg-black text-white text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-[#AF8F42] transition-all duration-500 shadow-xl active:scale-[0.98]"
              >
                Proceed to Checkout
              </button>

              <div className="mt-6 flex flex-col items-center gap-2">
                <p className="text-[9px] text-gray-300 uppercase tracking-widest text-center">
                  Secure Checkout • Worldwide Express
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}