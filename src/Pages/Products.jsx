import React, { useEffect, useState, useContext, useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  ShoppingCartIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { ShopContext } from "../Context/ShopContext";
import { AuthContext } from "../Context/UserContext";
import toast from "react-hot-toast";
import axios from "axios";
import { base } from "../api/axios";

// --- Skeleton Component for Premium Look ---
const ProductSkeleton = () => (
  <div className="flex flex-col animate-pulse">
    <div className="aspect-[4/5] bg-gray-800 rounded-sm mb-4"></div>
    <div className="h-3 w-1/2 bg-gray-800 mb-2 mx-auto"></div>
    <div className="h-4 w-3/4 bg-gray-800 mb-2 mx-auto"></div>
    <div className="h-3 w-1/4 bg-gray-700 mx-auto"></div>
  </div>
);

export default function Products() {
  // --- NEW STATE FOR THE "LIGHTS ON" EFFECT ---
  const [isDark, setIsDark] = useState(true);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("none");

  // --- NEW STATE FOR CUSTOM DROPDOWN ---
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef(null);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);

  const {
    toggleWishlist,
    isInWishlist,
    addToCart,
    isOutOfStock,
  } = useContext(ShopContext);

  const goldClassic = "#AF8F42";
  const category = new URLSearchParams(location.search).get("category");

  // --- EFFECT FOR THE LIGHT TRANSITION ---
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDark(false);
    }, 2000); // 2 seconds delay
    return () => clearTimeout(timer);
  }, []);

  // --- EFFECT TO CLOSE DROPDOWN ON OUTSIDE CLICK ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchProducts = async (url = `${base}products/`) => {
    try {
      setLoading(true);
      const res = await axios.get(url, {
        params: {
          search: debouncedSearchTerm || undefined,
          category: categoryFilter !== "All" ? categoryFilter : undefined,
          ordering:
            sortOrder === "lowToHigh"
              ? "price"
              : sortOrder === "highToLow"
              ? "-price"
              : undefined,
        },
      });
      setProducts(res.data.products || []);
      setNext(res.data.pagination?.next || null);
      setPrevious(res.data.pagination?.previous || null);
      setCurrentPage(res.data.pagination?.current_page || 1);
      setTotalPages(res.data.pagination?.total_pages || 1);
    } catch (err) {
      setError("Failed to load products");
    } finally {
      setLoading(false);
      setLoadingInitial(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearchTerm(searchTerm), 200);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    fetchProducts();
  }, [debouncedSearchTerm, categoryFilter, sortOrder]);

  useEffect(() => {
    setCategoryFilter(category || "All");
  }, [category]);

  const handleBuyNow = (id) => navigate(`/product/${id}`);

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);

  const handleAddToCart = (product) => {
  if (!user) {
    navigate("/login");
    return;
  }

  if (isOutOfStock(product.id)) {
    toast.error("This item is out of stock");
    return;
  }

  addToCart(product)

  toast.success("Added to cart");
};


  const handleCategoryClick = (cat) => {
    setCategoryFilter(cat);
    const params = new URLSearchParams();
    if (cat !== "All") params.append("category", cat);
    if (searchTerm) params.append("search", searchTerm);
    navigate(`/products?${params.toString()}`);
  };

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center h-screen text-center transition-colors duration-1000 ${isDark ? "bg-black text-white" : "bg-[#fafafa] text-gray-900"}`}>
        <p className="text-gray-500 font-light mb-4 italic">{error}</p>
        <button onClick={() => fetchProducts()} className="border border-[#AF8F42] text-[#AF8F42] px-8 py-2 text-xs uppercase tracking-widest hover:bg-[#AF8F42] hover:text-white transition-all">Retry</button>
      </div>
    );
  }

  const sortOptions = [
    { value: "none", label: "Default Manifest" },
    { value: "lowToHigh", label: "Price: Ascending" },
    { value: "highToLow", label: "Price: Descending" },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-[1500ms] ease-in-out ${isDark ? "bg-[#0a0a0a]" : "bg-[#fafafa]"}`}>
      {/* Page Header */}
      <div className="pt-18 pb-12 text-center">
        <h1 
          className={`text-4xl md:text-5xl font-light mb-4 transition-colors duration-1000 ${isDark ? "text-white" : "text-gray-900"}`} 
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Curated Collection
        </h1>
        <div className="w-16 h-[1px] bg-[#AF8F42] mx-auto mb-6"></div>
      </div>

      <div className="container mx-auto px-6 lg:px-12">
        {/* Search & Filters */}
        <div className={`flex flex-col lg:flex-row justify-between items-center gap-8 mb-16 border-y py-8 transition-colors duration-1000 ${isDark ? "border-gray-800" : "border-gray-200"}`}>
          <div className="flex flex-wrap gap-x-8 gap-y-4 justify-center">
            {["All", "wall lights", "floor lamps", "table lamps", "pendant", "chandeliers"].map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`text-[11px] uppercase tracking-[0.2em] font-bold transition-all duration-300 relative pb-1 ${categoryFilter === cat ? "text-[#AF8F42]" : isDark ? "text-gray-600 hover:text-white" : "text-gray-400 hover:text-gray-900"}`}
              >
                {cat}
                {categoryFilter === cat && <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#AF8F42]"></span>}
              </button>
            ))}
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6 w-full lg:w-auto">
            <div className={`relative w-full md:w-64 border-b transition-colors duration-1000 ${isDark ? "border-gray-700 focus-within:border-[#AF8F42]" : "border-gray-300 focus-within:border-[#AF8F42]"}`}>
              <input
                type="text"
                placeholder="SEARCH..."
                className={`w-full bg-transparent pl-2 pr-8 py-2 text-[10px] tracking-widest outline-none uppercase transition-colors duration-1000 ${isDark ? "text-white placeholder:text-gray-700" : "text-gray-900 placeholder:text-gray-300"}`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute right-2 top-2" />
            </div>

            {/* UPGRADED PREMIUM SORT DROPDOWN */}
            <div className="relative inline-block text-left" ref={sortRef}>
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className={`flex items-center gap-3 py-2 bg-transparent text-[10px] tracking-[0.3em] uppercase font-bold outline-none transition-colors duration-1000 ${
                  isDark ? "text-gray-500 hover:text-white" : "text-gray-400 hover:text-gray-900"
                }`}
              >
                <span>
                  Sort By: {sortOptions.find((opt) => opt.value === sortOrder)?.label.split(':')[0] || "Default"}
                </span>
                <ChevronDownIcon 
                  className={`h-3 w-3 transition-transform duration-500 ${isSortOpen ? "rotate-180" : ""}`} 
                  style={{ color: goldClassic }}
                />
              </button>

              {isSortOpen && (
                <div 
                  className={`absolute right-0 mt-4 w-56 overflow-hidden z-[100] border shadow-2xl transition-all duration-500 animate-in fade-in slide-in-from-top-2 ${
                    isDark 
                    ? "bg-[#0a0a0a]/95 backdrop-blur-md border-gray-800" 
                    : "bg-white/95 backdrop-blur-md border-gray-100"
                  }`}
                >
                  <div className="py-1">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortOrder(option.value);
                          setIsSortOpen(false);
                        }}
                        className={`w-full text-left px-6 py-4 text-[9px] tracking-[0.2em] uppercase transition-all flex items-center justify-between group ${
                          sortOrder === option.value 
                            ? "text-[#AF8F42] font-black" 
                            : isDark ? "text-gray-500 hover:text-white hover:bg-white/5" : "text-gray-400 hover:text-gray-900 hover:bg-gray-50"
                        }`}
                      >
                        {option.label}
                        {sortOrder === option.value && (
                          <div className="h-1 w-1 rounded-full bg-[#AF8F42]"></div>
                        )}
                        {/* Hover accent line */}
                        <div className="absolute left-0 w-[1px] h-0 bg-[#AF8F42] group-hover:h-full transition-all duration-300"></div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Products Area */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
            {[...Array(8)].map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <div className={`text-center py-32 border border-dashed rounded-lg transition-colors duration-1000 ${isDark ? "border-gray-800" : "border-gray-200"}`}>
            <p className="text-[#AF8F42] text-[10px] tracking-[0.4em] uppercase font-bold mb-4">No Matches Found</p>
            <h2 className={`text-xl italic font-light max-w-md mx-auto transition-colors duration-1000 ${isDark ? "text-gray-600" : "text-gray-400"}`}>
              Our collection doesn't currently include masterpieces matching "{searchTerm || categoryFilter}".
            </h2>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
            {products.map((product) => (
              <div key={product.id} className="group relative flex flex-col">
                <div className={`relative aspect-[4/5] overflow-hidden transition-colors duration-1000 ${isDark ? "bg-[#111]" : "bg-gray-100"}`}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className={`w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 cursor-pointer ${isDark ? "opacity-40 grayscale group-hover:opacity-100 group-hover:grayscale-0" : "opacity-100"}`}
                    onClick={() => navigate(`/product/${product.id}`)}
                  />
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <button
                      onClick={() => handleBuyNow(product.id)}
                      className="w-full bg-white/90 backdrop-blur-sm text-[10px] tracking-[0.2em] uppercase font-bold py-3 text-gray-900 translate-y-4 group-hover:translate-y-0 transition-transform duration-500"
                    >
                      Quick View
                    </button>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!user) return navigate("/login");
                      toggleWishlist(product.id);
                      toast.success(isInWishlist(product.id) ? "Removed" : "Added");
                    }}
                    className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:scale-110 transition-transform"
                  >
                    {isInWishlist(product.id) ? (
                      <HeartSolid className="w-4 h-4 text-[#AF8F42]" />
                    ) : (
                      <HeartOutline className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>

                <div className="pt-6 text-center">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-[#AF8F42] font-bold mb-2 block">
                    {product.category || "Brightique Selection"}
                  </span>
                  <Link to={`/product/${product.id}`}>
                    <h3 className={`text-[13px] tracking-widest uppercase font-medium transition-colors duration-1000 mb-2 line-clamp-1 ${isDark ? "text-gray-300 hover:text-[#AF8F42]" : "text-gray-800 hover:text-[#AF8F42]"}`}>
                      {product.name}
                    </h3>
                  </Link>
                  <p className={`text-[12px] font-light tracking-widest transition-colors duration-1000 ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                    {formatPrice(product.price)}
                  </p>
                  <div className={`mt-4 flex justify-center gap-4 border-t pt-4 transition-colors duration-1000 ${isDark ? "border-gray-900" : "border-gray-100"}`}>
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={isOutOfStock(product.id)}
                      className={`text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 transition-colors duration-1000 ${isOutOfStock(product.id) ? "text-red-300" : isDark ? "text-gray-400 hover:text-[#AF8F42]" : "text-gray-900 hover:text-[#AF8F42]"}`}
                    >
                      <ShoppingCartIcon className="w-3.5 h-3.5" />
                      {isOutOfStock(product.id) ? "Sold Out" : "Add to Bag"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && products.length > 0 && (
          <div className={`flex justify-center mt-24 mb-20 gap-8 items-center border-t pt-10 transition-colors duration-1000 ${isDark ? "border-gray-900" : "border-gray-200"}`}>
            <button
              onClick={() => previous && fetchProducts(previous)}
              disabled={!previous}
              className={`text-[10px] uppercase tracking-widest font-bold disabled:opacity-20 hover:text-[#AF8F42] transition ${isDark ? "text-gray-500" : "text-gray-900"}`}
            >
              &larr; Previous
            </button>
            <div className="flex gap-4">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => fetchProducts(`${base}products/?page=${page}`)}
                  className={`text-[11px] font-bold w-8 h-8 rounded-full transition-all ${currentPage === page ? "bg-[#AF8F42] text-white" : "text-gray-400 hover:text-[#AF8F42]"}`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => next && fetchProducts(next)}
              disabled={!next}
              className={`text-[10px] uppercase tracking-widest font-bold disabled:opacity-20 hover:text-[#AF8F42] transition ${isDark ? "text-gray-500" : "text-gray-900"}`}
            >
              Next &rarr;
            </button>
          </div>
        )}
      </div>
    </div>
  );
}