import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  // Matching Navbar & Video Gold
  const goldClassic = "#AF8F42";

  return (
    <footer className="bg-black py-16">
      {/* Decreased width from container mx-auto to max-w-6xl for a more "Classic" feel */}
      <div className="max-w-6xl mx-auto px-10">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Section */}
          <div className="md:col-span-2">
            <h2 
              className="text-2xl mb-5 tracking-[0.2em] uppercase"
              style={{ color: goldClassic, fontFamily: "'Playfair Display', serif" }}
            >
              Brightique
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm tracking-wide font-light">
              Redefining luxury lighting through curated excellence. 
              Our pieces are designed to be the jewelry of your home.
            </p>
            
            {/* Social Icons with Thin Minimalist Styling */}
            <div className="flex gap-5 mt-8">
              {[
                { icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z", label: "Like" },
                { icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z", label: "Chat" },
                { icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", label: "Email" }
              ].map((item, index) => (
                <button
                  key={index}
                  className="transition-all duration-300 hover:opacity-60"
                  aria-label={item.label}
                >
                  <svg 
                    className="w-5 h-5 transition-colors" 
                    fill="none" 
                    stroke={goldClassic} 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d={item.icon} />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[11px] font-bold text-white mb-6 uppercase tracking-[0.3em]">Navigation</h3>
            <div className="space-y-3">
              {['Home', 'Products', 'Collections', 'About'].map((item) => (
                <Link
                  key={item}
                  to={`/${item === 'Home' ? '' : item.toLowerCase()}`}
                  className="block text-gray-500 hover:text-white transition-all duration-300 text-[12px] tracking-widest uppercase"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-[11px] font-bold text-white mb-6 uppercase tracking-[0.3em]">Legal</h3>
            <div className="space-y-3">
              {['Privacy Policy', 'Terms', 'Cookies'].map((item) => (
                <Link
                  key={item}
                  to={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                  className="block text-gray-500 hover:text-white transition-all duration-300 text-[12px] tracking-widest uppercase"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Thin Divider matching Navbar's subtle border style */}
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#AF8F42]/30 to-transparent mb-10"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-600 text-[10px] uppercase tracking-[0.2em]">
            © {new Date().getFullYear()} Brightique • Luxury Heritage
          </p>
          
          <div className="flex items-center gap-6">
            <span className="text-gray-600 text-[10px] uppercase tracking-[0.2em]">Kochi, India</span>
            <div className="w-1 h-1 rounded-full" style={{ backgroundColor: goldClassic }}></div>
            <p className="text-white text-[11px] tracking-widest uppercase">support@brightique.com</p>
          </div>
        </div>
      </div>
    </footer>
  );
}