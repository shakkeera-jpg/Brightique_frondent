import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { HeartIcon } from "@heroicons/react/24/outline";
import { ShopContext } from "../Context/ShopContext";
import { AuthContext } from "../Context/UserContext";


export default function ProductCard() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);

  const {
    products: shopProducts,
    addToWishlist,
    removeFromWishlist,
    wishlist,
    addToCart,
    cart,
    decreaseQuantity,
    increaseQuantity,
  } = useContext(ShopContext);
  const { isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    const existing = shopProducts.find((p) => p.id === id);
    if (existing) {
      setProduct(existing);
    } else {
      axios
        .get(`https://brightique.onrender.com/products/${id}`)
        .catch((err) => console.error(err));
    }                                 
  }, [id, shopProducts]);

  const cartItem = product ? cart?.find((item) => item.id === product.id):null;
  const isInCart = !!cartItem;

  if (!product) return <p className="p-6 text-gray-600 text-sm">Loading product...</p>;

  const isInWishlist = wishlist.some((item) => item.id === product.id);
 const handleWishlist=()=>{
  if (!isLoggedIn) {
      navigate("/login");
      return;
    }
 }

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    if (product.stock === 0) return;
    addToCart(product);
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <div className="min-h-screen flex items-center justify-center py-8 px-4 bg-gradient-to-br from-yellow-50 to-white">
      <div className="bg-white max-w-2xl w-full rounded-xl shadow-lg overflow-hidden border border-yellow-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Product Image */}
          <div className="relative p-6 bg-gradient-to-br from-yellow-50 to-white">
            <div className="relative rounded-lg overflow-hidden bg-white shadow-md">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-64 object-contain p-4"
              />
              {product.price > 100000 && (
                <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-semibold">

                  Premium
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="p-6 space-y-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 font-serif leading-tight mb-1">
                {product.name}
              </h2>
              <p className="text-yellow-600 text-xs uppercase tracking-wide font-medium">
                {product.meterial}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <p className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-500 bg-clip-text text-transparent">
                {formatPrice(product.price)}
              </p>
              <div className="h-6 w-px bg-yellow-200"></div>
              {product.stock > 0 ? (
                <span className="text-green-600 font-medium text-xs bg-green-50 px-2 py-1 rounded">
                  In Stock ({product.stock})
                </span>
              ) : (
                <span className="text-red-600 font-medium text-xs bg-red-50 px-2 py-1 rounded">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-2">
              {product.size && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 text-sm font-medium min-w-12">Size:</span>
                  <span className="text-gray-900 text-sm">{product.size}</span>
                </div>
              )}

              {product.warranty && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 text-sm font-medium min-w-12">Warranty:</span>
                  <span className="text-gray-900 text-sm">{product.warranty}</span>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              {!isInCart ? (
                <button
                  className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-white transition-all duration-300 text-sm ${product.stock === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-300 hover:shadow-md"
                    }`}
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => decreaseQuantity(product.id)}
                    className="w-8 h-8 bg-black text-yellow-500 rounded-lg hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center font-semibold"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-semibold text-gray-900">{cartItem?.quantity || 1}</span>
                  <button
                    onClick={() => increaseQuantity(product.id)}
                    className="w-8 h-8 bg-black text-yellow-500 rounded-lg hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center font-semibold"
                  >
                    +
                  </button>
                </div>

              )}
              {isLoggedIn ?(
              <button
                onClick={() =>
                  isInWishlist
                    ? removeFromWishlist(product.id)
                    : addToWishlist(product)
                }
                className={`flex items-center justify-center gap-1 px-3 py-2.5 rounded-lg border transition-all duration-300 text-sm font-medium ${isInWishlist
                  ? "bg-yellow-500 border-yellow-500 text-white hover:bg-yellow-600"
                  : "border-yellow-400 text-yellow-600 hover:bg-yellow-50"
                  }`}
              >
                <HeartIcon className={`w-4 h-4 ${isInWishlist ? "text-white" : "text-yellow-600"}`} />
                {isInWishlist ? "Saved" : "Save"}
              </button>
              ):(
                <button
                onClick={handleWishlist}
                className={`flex items-center justify-center gap-1 px-3 py-2.5 rounded-lg border transition-all duration-300 text-sm font-medium ${isInWishlist
                  ? "bg-yellow-500 border-yellow-500 text-white hover:bg-yellow-600"
                  : "border-yellow-400 text-yellow-600 hover:bg-yellow-50"
                  }`}
              >
                <HeartIcon className={`w-4 h-4 ${isInWishlist ? "text-white" : "text-yellow-600"}`} />
                {isInWishlist ? "Saved" : "Save"}
              </button>
              )}
            </div>

            {/* Premium Features */}
            <div className="pt-4 border-t border-yellow-100">
              <div className="flex items-center gap-4 text-xs text-gray-600">
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                  Free Shipping
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                  Secure Payment
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}