import React from "react";
import { useNavigate } from "react-router-dom";

import img1 from "../assets/collage-1.webp";
import img2 from "../assets/image4.webp";
import img3 from "../assets/image3.webp";
import img4 from "../assets/collage-5.webp";
import img5 from "../assets/image5.webp";

export default function WhyChooseUs() {
  const navigate = useNavigate();
  const goldClassic = "#AF8F42"; 

  const handleNavigate = () => {
    navigate("/about");
  };

  return (
    <div className="py-24 px-6 md:px-10 lg:px-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* LEFT: MINIMALIST IMAGE DISPLAY */}
          <div className="w-full lg:w-1/2 relative">
            {/* The Main Hero Image */}
            <div className="relative z-10 aspect-[4/5] overflow-hidden border-[12px] border-[#f9f9f9]">
              <img 
                src={img3} 
                alt="Signature Lighting" 
                className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105" 
              />
            </div>
            
            {/* Decorative Floating Elements */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#AF8F42]/5 rounded-full -z-10 animate-pulse"></div>
            <div className="absolute -bottom-6 -right-6 w-3/4 h-3/4 border border-[#AF8F42]/20 -z-10"></div>
            
            {/* Accent Small Image */}
            <div className="absolute -bottom-12 -left-12 w-48 h-48 hidden xl:block shadow-2xl border-4 border-white">
               <img src={img5} alt="Detail" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* RIGHT: CONTENT & FEATURES */}
          <div className="w-full lg:w-1/2">
            <div className="space-y-8">
              <div>
                <span className="text-[10px] uppercase tracking-[0.5em] text-[#AF8F42] font-bold mb-4 block">
                  The Brightique Standard
                </span>
                <h2 
                  className="text-4xl md:text-5xl font-light text-gray-900 leading-tight"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Illuminating The <br /> <i>Fine Art</i> of Living
                </h2>
              </div>

              <p className="text-gray-500 leading-relaxed font-light text-lg">
                At <span className="text-gray-900 font-medium">Brightique</span>, we don't just sell lamps; we craft atmospheres. 
                Our designs serve as the bridge between functional utility and high-end artistic expression.
              </p>

              {/* Unique Professional Benefit Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-8 border-y border-gray-100">
                <div className="space-y-2">
                  <h4 className="text-[11px] uppercase tracking-widest font-bold text-gray-900">Artisan Crafted</h4>
                  <p className="text-xs text-gray-400 font-light">Hand-selected materials for a lifetime of brilliance.</p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-[11px] uppercase tracking-widest font-bold text-gray-900">Timeless Appeal</h4>
                  <p className="text-xs text-gray-400 font-light">Designs that transcend trends and define spaces.</p>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleNavigate}
                  className="group flex items-center gap-6"
                >
                  <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-900">
                    Discover Our Story
                  </span>
                  <div className="relative flex items-center justify-center">
                    <div className="w-12 h-[1px] bg-gray-300 group-hover:w-20 group-hover:bg-[#AF8F42] transition-all duration-500"></div>
                    <div className="absolute right-0 w-1 h-1 bg-[#AF8F42] rotate-45"></div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}