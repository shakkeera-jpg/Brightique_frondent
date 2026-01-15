import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { HeartIcon as HeartOutline, ChevronLeftIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { ShopContext } from "../Context/ShopContext";
import { AuthContext } from "../Context/UserContext";
import { base } from "../api/axios";

export default function ProductCard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const productId = Number(id);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const {
    products,
    wishlist = [],
    addToCart,
    toggleWishlist,
    isOutOfStock
  } = useContext(ShopContext);

  const { user } = useContext(AuthContext);
  const isLoggedIn = !!user;

  useEffect(() => {
    if (!productId) return;
    setLoading(true);

    const existing = products?.find((p) => p.id === productId);
    if (existing) {
      setProduct(existing);
      setLoading(false);
      return;
    }

    axios
      .get(`${base}products/${productId}/`)
      .then((res) => setProduct(res.data))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [productId, products]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <div className="w-8 h-8 border-t-2 border-[#AF8F42] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) return null;

  const isInWishlist = wishlist.some((item) => item.product?.id === product.id);
  const outOfStock = isOutOfStock ? isOutOfStock(product.id) : product.stock === 0;

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f4f4] px-4 py-20">
      
      <div className="bg-white w-full max-w-4xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] flex flex-col md:flex-row overflow-hidden border border-gray-100">
        
        
        <div className="md:w-5/12 bg-[#f9f9f9] relative flex items-center justify-center p-8 border-r border-gray-50">
          <button 
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 p-2 text-gray-400 hover:text-black transition-colors"
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </button>
          
          <img
            src={product.image}
            alt={product.name}
            className={`w-full h-auto object-contain mix-blend-multiply transition-transform duration-700 hover:scale-105 ${outOfStock ? 'opacity-40 grayscale' : ''}`}
          />
        </div>

        
        <div className="md:w-7/12 p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-6">
            <span className="text-[9px] tracking-[0.3em] text-[#AF8F42] uppercase font-bold block mb-2">
              {product.category || "Exclusive Collection"}
            </span>
            <h1 className="text-2xl md:text-3xl text-gray-900 leading-tight mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              {product.name}
            </h1>
            <p className="text-lg font-light text-gray-600 tracking-tight">
              {formatPrice(product.price)}
            </p>
          </div>

          <div className="space-y-4 mb-10">
            <div className="flex gap-8 text-[10px] uppercase tracking-widest text-gray-400">
              {product.size && (
                <p><span className="text-black font-semibold">Size:</span> {product.size}</p>
              )}
              {product.warranty && (
                <p><span className="text-black font-semibold">Warranty:</span> {product.warranty}</p>
              )}
            </div>
            <p className="text-xs text-gray-500 leading-relaxed font-light italic max-w-md">
              A masterfully crafted piece designed to bring a sophisticated atmosphere to any interior space.
            </p>
          </div>

          
          <div className="flex gap-3">
            <button
              onClick={() => !outOfStock && addToCart(product.id)}
              disabled={outOfStock}
              className={`flex-[3] h-12 text-[10px] uppercase tracking-[0.2em] font-bold transition-all
                ${outOfStock 
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                  : "bg-black text-white hover:bg-[#AF8F42]"}`}
            >
              {outOfStock ? "Sold Out" : "Add to Bag"}
            </button>

            <button
              onClick={() => {
                if (!isLoggedIn) return navigate("/login");
                toggleWishlist(product.id);
              }}
              className={`flex-1 h-12 border transition-all flex items-center justify-center
                ${isInWishlist 
                  ? "bg-[#AF8F42] border-[#AF8F42] text-white" 
                  : "border-gray-200 text-gray-400 hover:border-black hover:text-black"}`}
            >
              {isInWishlist ? <HeartSolid className="w-4 h-4" /> : <HeartOutline className="w-4 h-4" />}
            </button>
          </div>

          
          <div className="mt-8 pt-6 border-t border-gray-50 flex gap-6">
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 bg-[#AF8F42] rotate-45"></div>
              <span className="text-[9px] uppercase tracking-widest text-gray-400">Free Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 bg-[#AF8F42] rotate-45"></div>
              <span className="text-[9px] uppercase tracking-widest text-gray-400">Authentic Piece</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}