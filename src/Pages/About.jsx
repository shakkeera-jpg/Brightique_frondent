import React from "react";

export default function About() {
  const goldClassic = "#AF8F42"; 

  return (
    <div className="bg-[#FCFCFC] min-h-screen pb-24 pt-40 px-6 text-gray-800 relative overflow-hidden">
      
      
      <div className="absolute top-40 right-[-5%] text-[15vw] font-serif italic text-gray-50 pointer-events-none select-none leading-none">
        Heritage
      </div>

      <div className="max-w-6xl mx-auto relative">
        
        
        <div className="mb-24 flex flex-col items-center">
          <span className="text-[10px] uppercase tracking-[0.5em] text-[#AF8F42] font-bold mb-4">
            Our Story
          </span>
          <h1 
            className="text-5xl md:text-7xl font-light text-gray-900 tracking-tight italic"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            The Art of Light
          </h1>
          <div className="w-12 h-[1px] bg-[#AF8F42] mt-8"></div>
        </div>

        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
          
          
          <div className="relative order-2 lg:order-1">
            <div className="relative z-10 aspect-[4/5] w-full max-w-md mx-auto overflow-hidden shadow-2xl">
              <img
                src="https://lostine.com/cdn/shop/files/LOSTINE_030325_DOGWOOD_T_LAMP_CHAMBRON_LOUNGE_CHAIR_HALF_MOON_S_TABLE_PAINTING_LIFESTYLE_278_500x.jpg?v=1741276312"
                alt="Brightique collection"
                className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-1000 scale-105 hover:scale-100"
              />
            </div>
            
            <div 
              className="absolute -bottom-6 -right-6 w-full h-full border border-[#AF8F42]/30 z-0 hidden md:block"
              style={{ maxWidth: '448px' }}
            ></div>
          </div>

          
          <div className="order-1 lg:order-2 space-y-8">
            <h2 className="text-2xl md:text-3xl font-serif italic text-gray-900 leading-snug">
              Brilliance meets <br /> boutique luxury.
            </h2>
            
            <p className="text-sm md:text-base leading-relaxed text-gray-500 font-light text-justify">
              Welcome to <span className="text-[#AF8F42] font-medium uppercase tracking-widest text-xs">Brightique</span>. 
              We are more than just a brand — we're a celebration of elegance, craftsmanship, and timeless design. 
              Every product we offer reflects our passion for beauty and attention to detail, ensuring that each piece 
              adds a touch of sophistication to your everyday life.
            </p>

            <div className="pl-6 border-l border-[#AF8F42]/40 py-2">
              <p className="text-sm italic text-gray-400 leading-relaxed">
                "True luxury lies in the harmony of quality and simplicity. We believe every shadow tells a story, and every light reveals a masterpiece."
              </p>
            </div>
          </div>
        </div>

        
        <div className="max-w-3xl mx-auto text-center space-y-10">
          <p className="text-base md:text-lg text-gray-600 leading-relaxed font-light">
            At Brightique, we strive to create a seamless experience that inspires confidence 
            and creativity. Our collections are thoughtfully curated, blending modern aesthetics 
            with classic charm. Whether you're seeking something bold and contemporary or subtle 
            and traditional, you'll find that every creation tells a story of refinement.
          </p>
          
          <div className="pt-10">
            <span 
              className="text-xl md:text-2xl text-[#AF8F42] italic"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Uniqueness, and charm — one piece at a time.
            </span>
          </div>
        </div>

        
        <div className="mt-40 flex flex-col items-center">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-px bg-gray-200"></div>
            <div className="w-2 h-2 rounded-full border border-[#AF8F42]"></div>
            <div className="w-12 h-px bg-gray-200"></div>
          </div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400">
            EST. MMXXIV • BRIGHTIQUE HERITAGE
          </p>
        </div>
      </div>
    </div>
  );
}