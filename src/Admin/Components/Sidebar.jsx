import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../Context/UserContext";


const DashboardIcon = ({ isActive }) => (
  <svg className={`w-5 h-5 transition-colors duration-300 ${isActive ? 'stroke-[#AF8F42]' : 'stroke-gray-500'}`} viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

const ProductsIcon = ({ isActive }) => (
  <svg className={`w-5 h-5 transition-colors duration-300 ${isActive ? 'stroke-[#AF8F42]' : 'stroke-gray-500'}`} viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 8V21H3V8M1 3H23V8H1V3Z" />
    <path d="M10 12H14" />
  </svg>
);

const OrdersIcon = ({ isActive }) => (
  <svg className={`w-5 h-5 transition-colors duration-300 ${isActive ? 'stroke-[#AF8F42]' : 'stroke-gray-500'}`} viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
    <path d="M3 6h18" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const UsersIcon = ({ isActive }) => (
  <svg className={`w-5 h-5 transition-colors duration-300 ${isActive ? 'stroke-[#AF8F42]' : 'stroke-gray-500'}`} viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const HomeIcon = ({ isActive }) => (
  <svg className={`w-5 h-5 transition-colors duration-300 ${isActive ? 'stroke-[#AF8F42]' : 'stroke-gray-500'}`} viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

export default function Sidebar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  const linkClasses = (path) => `
    group flex items-center gap-4 px-4 py-3 rounded-xl mb-2 relative transition-all duration-500
    text-[11px] uppercase tracking-[0.2em] font-bold
    ${isActive(path)
      ? 'text-[#AF8F42] bg-white/[0.03] shadow-[inset_0_0_20px_rgba(175,143,66,0.05)]'
      : 'text-gray-500 hover:text-gray-200 hover:bg-white/[0.02]'
    }
  `;

  return (
    <>
     
      <button
        className="md:hidden fixed top-6 left-6 z-[100] p-3 bg-[#1a1a1a] border border-white/10 rounded-full text-[#AF8F42] shadow-2xl"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
        </svg>
      </button>

      
      <div className={`
        w-72 h-screen bg-[#0D0D0D] text-gray-300
        p-8 fixed top-0 left-0 z-[90]
        border-r border-white/5
        transform transition-transform duration-700 cubic-bezier(0.4, 0, 0.2, 1)
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0
      `}>
        
        
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 border border-[#AF8F42]/30 rounded-full flex items-center justify-center bg-gradient-to-br from-[#AF8F42]/20 to-transparent">
              <span className="text-[#AF8F42] font-serif text-lg">B</span>
            </div>
            <div>
               <h2 className="text-sm font-bold tracking-[0.3em] uppercase text-white">Brightique</h2>
               <p className="text-[8px] tracking-[0.4em] uppercase text-[#AF8F42]">Management</p>
            </div>
          </div>
          <div className="h-px w-full bg-gradient-to-r from-white/10 to-transparent mt-6" />
        </div>

        
        <nav className="flex flex-col h-[calc(100%-250px)]">
          <div className="text-[9px] font-bold uppercase tracking-[0.3em] text-gray-600 mb-6 ml-4">Core Assets</div>
          
          <Link to="/admin/dashboard" className={linkClasses("/admin/dashboard")}>
            <DashboardIcon isActive={isActive("/admin/dashboard")} />
            Dashboard
            {isActive("/admin/dashboard") && <div className="absolute left-0 w-[2px] h-4 bg-[#AF8F42] rounded-full" />}
          </Link>

          <Link to="/admin/products" className={linkClasses("/admin/products")}>
            <ProductsIcon isActive={isActive("/admin/products")} />
            Products
            {isActive("/admin/products") && <div className="absolute left-0 w-[2px] h-4 bg-[#AF8F42] rounded-full" />}
          </Link>

          <Link to="/admin/orders" className={linkClasses("/admin/orders")}>
            <OrdersIcon isActive={isActive("/admin/orders")} />
            Orders
            {isActive("/admin/orders") && <div className="absolute left-0 w-[2px] h-4 bg-[#AF8F42] rounded-full" />}
          </Link>

          <Link to="/admin/user" className={linkClasses("/admin/user")}>
            <UsersIcon isActive={isActive("/admin/user")} />
            Members
            {isActive("/admin/user") && <div className="absolute left-0 w-[2px] h-4 bg-[#AF8F42] rounded-full" />}
          </Link>

          <div className="mt-auto pt-10 border-t border-white/5">
            <Link to="/" className={linkClasses("/")}>
              <HomeIcon isActive={isActive("/")} />
              Boutique Front
            </Link>
          </div>
        </nav>

        
        <div className="absolute bottom-12 left-8 right-8">
          <button 
            onClick={logout} 
            className="w-full py-4 border border-white/5 rounded-xl text-[10px] font-bold uppercase tracking-[0.4em] text-gray-500 hover:text-white hover:bg-red-950/20 hover:border-red-900/30 transition-all duration-500 cursor-pointer"
          >
            Sign Out
          </button>
        </div>
        
      </div>

      
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80] md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}