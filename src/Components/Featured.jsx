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
    <div className="py-16 px-6 md:px-10 lg:px-20 bg-transparent font-[Times_New_Roman]">
      
      <h2 className="text-3xl md:text-4xl font-bold text-[#c9a64e] text-center mb-10 relative">
        <span className="relative inline-block pb-2">
          Golden Treasures
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-[2px] bg-[#c9a64e]/60"></span>
        </span>
      </h2>

      
      <div className="flex space-x-4 overflow-x-auto py-4 no-scrollbar">
        {products.map((product) => (
          <div
            key={product.id}
            className="w-[300px] h-[250px] bg-gray-200 rounded-xl border border-gray-300 shadow-md hover:shadow-lg transition-all duration-500 flex-shrink-0 flex flex-col items-center justify-between p-2 bg-black"
          >
            
            <div className="mt-3">
              <div className="relative w-30 h-30 rounded-md overflow-hidden border-[2px] border-[#c9a64e] shadow-[0_0_5px_rgba(201,166,78,0.3)]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            
            <div className="text-center px-1 flex-1 flex flex-col justify-center">
              <h3 className="text-xs font-semibold text-gray-800 leading-snug mb-1 line-clamp-2">
                {product.name}
              </h3>
              <p className="text-[#c9a64e] text-sm font-medium mb-2">
                ₹{product.price.toLocaleString()}
              </p>
            </div>

            <button
              onClick={() => navigate(`/product/${product.id}`)}
              className="bg-[#c9a64e] text-white text-xs px-2 py-1 rounded-full font-medium hover:bg-[#b8933d] transition-all duration-300 w-full"
            >
              View
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
