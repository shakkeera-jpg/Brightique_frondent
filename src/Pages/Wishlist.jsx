import React, { useContext } from "react";
import { ShopContext } from "../Context/ShopContext";
import { TrashIcon, ShoppingCartIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

export default function Wishlist() {
  const {
    wishlist,
    removeFromWishlist,
    addToCartFromWishlist,
    isOutOfStock,
  } = useContext(ShopContext);

  const goldClassic = "#AF8F42";

  return (
    <div className="min-h-screen bg-[#FCFCFC] pt-22 pb-20 px-6">
      <div className="container mx-auto max-w-7xl">
        
        {/* Header Section */}
        <div className="flex flex-col items-center mb-20">
          <span className="text-[10px] uppercase tracking-[0.5em] text-[#AF8F42] font-bold mb-4">
            Curated Collection
          </span>
          <h1 
            className="text-4xl md:text-5xl font-light text-gray-900 italic"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Saved Pieces
          </h1>
          <div className="w-12 h-[1px] bg-[#AF8F42] mt-6 mb-4"></div>
          <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium">
            {wishlist.length} {wishlist.length === 1 ? 'Masterpiece' : 'Pieces'} in your gallery
          </p>
        </div>

        {wishlist.length === 0 ? (
          /* Empty State: Boutique Style */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 mb-8 border border-gray-100 flex items-center justify-center rounded-full bg-white shadow-sm">
              <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-light text-gray-900 mb-4 tracking-tight italic" style={{ fontFamily: "'Playfair Display', serif" }}>
              Your gallery is empty
            </h3>
            <Link
              to="/products"
              className="group flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] font-bold text-[#AF8F42] border-b border-transparent hover:border-[#AF8F42] pb-1 transition-all"
            >
              Discover Lighting <ArrowRightIcon className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        ) : (
          /* Wishlist Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
            {wishlist.map((item) => {
              const outOfStock = isOutOfStock(item.product.id);
              
              return (
                <div
                  key={item.product.id}
                  className="group flex flex-col"
                >
                  {/* Image Container */}
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#F7F7F7] border border-gray-50 mb-6">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className={`w-full h-full object-contain mix-blend-multiply transition-transform duration-1000 group-hover:scale-110 ${outOfStock ? 'opacity-40 grayscale' : ''}`}
                    />
                    
                    {outOfStock && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="bg-white/90 backdrop-blur-md text-[8px] uppercase tracking-[0.4em] px-4 py-2 font-bold text-gray-400 border border-gray-100 shadow-sm">
                          Archived
                        </span>
                      </div>
                    )}

                    {/* Quick Remove Top-Right */}
                    <button
                      onClick={() => removeFromWishlist(item.product.id)}
                      className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-md text-gray-400 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Info Section */}
                  <div className="flex flex-col flex-1">
                    <h2 className="text-[11px] uppercase tracking-[0.2em] font-bold text-gray-900 mb-2 line-clamp-1">
                      {item.product.name}
                    </h2>
                    <p className="text-sm font-light text-[#AF8F42] mb-6 tracking-tight">
                      ₹{item.product.price.toLocaleString()}
                    </p>

                    {/* Actions Row */}
                    <div className="mt-auto pt-4 border-t border-gray-50 flex gap-2">
                      <button
                        onClick={() => addToCartFromWishlist(item.product)}
                        disabled={outOfStock}
                        className={`flex-1 h-11 text-[9px] uppercase tracking-[0.2em] font-bold transition-all
                          ${outOfStock
                            ? "bg-gray-50 text-gray-300 cursor-not-allowed"
                            : "bg-black text-white hover:bg-[#AF8F42] active:scale-95"
                          }`}
                      >
                        {outOfStock ? "Out of Stock" : "Acquire Piece"}
                      </button>
                      
                      <Link 
                        to={`/product/${item.product.id}`}
                        className="w-11 h-11 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-black hover:border-black transition-all"
                      >
                         <ArrowRightIcon className="w-4 h-4 -rotate-45" />
                      </Link>
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