import { useState, useContext, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ShoppingCartIcon,
  HeartIcon,
  UserIcon,
  Bars3Icon,
  ChevronDownIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";
import { AuthContext } from "../Context/UserContext";
import { ShopContext } from "../Context/ShopContext";
import NotificationBell from "../Pages/NotificationBell";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";
  const navigate = useNavigate();

  const { user, logout } = useContext(AuthContext);
  const isLoggedIn = !!user;
  const { wishlist, cart } = useContext(ShopContext);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  
  const goldClassic = "#AF8F42";
  
  
  const navPosition = isHome ? "absolute" : "sticky";
  const glassBg = "bg-white/80 backdrop-blur-xl border-b border-gray-100/50";
  const solidBg = "bg-white/95 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.03)] border-b border-gray-100";

  return (
    <nav className={`${navPosition} ${isHome ? glassBg : solidBg} top-0 left-0 w-full z-50 transition-all duration-700 ease-in-out`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6 flex justify-between items-center">
        
        
        <Link 
          to="/" 
          className="relative group flex flex-col items-center"
        >
          <span 
            className="text-2xl md:text-3xl tracking-[0.3em] uppercase transition-all duration-500 group-hover:tracking-[0.35em]"
            style={{ color: goldClassic, fontFamily: "'Playfair Display', serif" }}
          >
            Brightique
          </span>
          <div className="h-[1px] w-0 bg-[#AF8F42] transition-all duration-500 group-hover:w-full mt-1"></div>
        </Link>

        
        <div className="hidden md:flex items-center space-x-16">
          {["Home", "Products", "About"].map((item) => (
            <Link
              key={item}
              to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
              className={`relative text-[11px] font-bold tracking-[0.25em] uppercase transition-all duration-300 ${
                isHome ? "text-gray-900" : "text-gray-800"
              } hover:text-[#AF8F42] group`}
            >
              {item}
              <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-[#AF8F42] transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </div>

        
        <div className="flex items-center space-x-6 md:space-x-8">
          
          <Link to="/wishlist" className="relative group p-1">
            <HeartIcon className="h-5 w-5 text-gray-800 group-hover:scale-110 group-hover:text-[#AF8F42] transition-all duration-300" />
            {wishlist?.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-black text-[8px] font-bold text-white ring-2 ring-white">
                {wishlist.length}
              </span>
            )}
          </Link>

          
          <Link to="/cart" className="relative group p-1">
            <ShoppingCartIcon className="h-5 w-5 text-gray-800 group-hover:scale-110 group-hover:text-[#AF8F42] transition-all duration-300" />
            {cart?.length > 0 && (
              <span 
                className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full text-[8px] font-bold text-white ring-2 ring-white" 
                style={{ backgroundColor: goldClassic }}
              >
                {cart.reduce((total, item) => total + (Number(item.quantity) || 1), 0)}
              </span>
            )}
          </Link>

          {user && <NotificationBell />}

          
          <div className="relative border-l border-gray-100 pl-6 md:pl-8" ref={userMenuRef}>
            {isLoggedIn ? (
              <div className="flex items-center">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-3 text-[10px] font-bold tracking-[0.2em] uppercase text-gray-800 group transition-all"
                >
                  <div className="h-7 w-7 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center group-hover:border-[#AF8F42] transition-all">
                    <UserIcon className="h-4 w-4 text-gray-600 group-hover:text-[#AF8F42]" />
                  </div>
                  <span className="hidden lg:block">{user.name}</span>
                  <ChevronDownIcon className={`h-3 w-3 text-gray-400 transition-transform duration-500 ${userMenuOpen ? "rotate-180" : ""}`} />
                </button>

               
                {userMenuOpen && (
                  <div className="absolute right-0 mt-8 w-60 overflow-hidden bg-white shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-gray-50 z-50 transition-all duration-300">
                    <div className="px-6 py-5 bg-gray-50/50 border-b border-gray-50">
                      <p className="text-[8px] uppercase tracking-[0.3em] text-[#AF8F42] font-black mb-1">Authenticated</p>
                      <p className="text-sm font-serif italic text-gray-900 truncate" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {user.name}
                      </p>
                    </div>

                    <div className="py-2">
                      <Link 
                        to="/profile" 
                        className="flex items-center justify-between px-6 py-3 text-[10px] uppercase tracking-[0.2em] text-gray-600 hover:text-black hover:bg-gray-50 transition-all"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        My Profile
                        <span className="h-1 w-1 rounded-full bg-gray-200"></span>
                      </Link>
                      <Link 
                        to="/order" 
                        className="flex items-center justify-between px-6 py-3 text-[10px] uppercase tracking-[0.2em] text-gray-600 hover:text-black hover:bg-gray-50 transition-all"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Order History
                        <span className="h-1 w-1 rounded-full bg-gray-200"></span>
                      </Link>
                      {user.is_admin && (
                        <Link 
                          to="/admin" 
                          className="flex items-center px-6 py-3 text-[10px] uppercase tracking-[0.2em] font-bold text-[#AF8F42] hover:bg-gray-50 transition-all"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Administrative Panel
                        </Link>
                      )}
                    </div>

                    <div className="border-t border-gray-50 mt-1 bg-gray-50/30">
                      <button
                        onClick={() => { logout(); setUserMenuOpen(false); navigate("/Login"); }}
                        className="w-full text-left flex items-center justify-between px-6 py-4 text-[10px] uppercase tracking-[0.2em] text-red-700 font-bold hover:bg-red-50 transition-all"
                      >
                        Sign Out
                        <XMarkIcon className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="group">
                <UserIcon className="h-5 w-5 text-gray-700 group-hover:text-[#AF8F42] transition-colors" />
              </Link>
            )}
          </div>

          
          <div className="md:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 text-gray-900 transition-transform active:scale-90">
              {menuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

     
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 p-6 flex flex-col space-y-4 shadow-lg animate-in slide-in-from-top duration-300">
           {["Home", "Products", "About"].map((item) => (
            <Link
              key={item}
              to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
              className="text-[11px] font-bold tracking-[0.25em] uppercase text-gray-800"
              onClick={() => setMenuOpen(false)}
            >
              {item}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}