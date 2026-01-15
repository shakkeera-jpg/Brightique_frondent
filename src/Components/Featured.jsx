import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Featured() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("https://brightique.onrender.com/Bestseller")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="py-24 px-6 md:px-10 lg:px-20 bg-[#FCFCFC] overflow-hidden">
      
      
      <div className="flex flex-col items-center mb-16 text-center">
        <span className="text-[10px] uppercase tracking-[0.5em] text-[#AF8F42] font-bold mb-4">
          The Curated List
        </span>
        <h2 
          className="text-4xl md:text-5xl font-light text-gray-900 italic"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Golden Treasures
        </h2>
        <div className="w-12 h-[1px] bg-[#AF8F42] mt-6"></div>
      </div>

      
      <div className="flex space-x-10 overflow-x-auto pb-12 pt-4 no-scrollbar scroll-smooth">
        {products.map((product) => (
          <div
            key={product.id}
            onClick={() => navigate(`/product/${product.id}`)}
            className="w-[280px] group cursor-pointer flex-shrink-0"
          >
            
            <div className="relative aspect-[4/5] overflow-hidden bg-[#F7F7F7] mb-6 border border-gray-100">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain mix-blend-multiply transition-transform duration-[1.5s] ease-out group-hover:scale-110"
              />
              
              
              <div className="absolute top-4 left-4">
                <span className="bg-white/90 backdrop-blur-sm text-[8px] uppercase tracking-[0.2em] px-3 py-1 font-bold text-gray-400 border border-gray-100">
                  Best Seller
                </span>
              </div>

              
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                <span className="bg-white text-[9px] uppercase tracking-widest px-6 py-3 font-bold shadow-xl translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  Acquire Piece
                </span>
              </div>
            </div>

            
            <div className="space-y-2">
              <h3 className="text-[11px] uppercase tracking-[0.25em] font-semibold text-gray-800 line-clamp-1 group-hover:text-[#AF8F42] transition-colors">
                {product.name}
              </h3>
              <div className="flex items-center justify-between border-t border-gray-50 pt-2">
                <p className="text-[#AF8F42] text-sm font-light tracking-tight">
                  ₹{product.price.toLocaleString()}
                </p>
                <div className="w-1.5 h-1.5 rounded-full bg-gray-200 group-hover:bg-[#AF8F42] transition-colors"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      
      <div className="flex justify-center mt-4">
        <div className="w-48 h-[1px] bg-gray-100 relative overflow-hidden">
          <div className="absolute left-0 top-0 h-full bg-[#AF8F42] w-1/3 animate-scroll-hint"></div>
        </div>
      </div>
    </div>
  );
}