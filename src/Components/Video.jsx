import { useNavigate } from "react-router-dom";

export default function Video() {
  const navigate = useNavigate();

  const handleExplore = () => {
    navigate("/products");
  };

  return (
    <div className="relative w-full h-[85vh] overflow-hidden group">
     
      <div className="absolute inset-0 bg-black/40 z-10" /> 
      <video
        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      >
        <source src="https://www.whiteteak.com/media/customimages/homepage/video_banner_new_standard.mp4" type="video/mp4" />
      </video>

      
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-20">
        
        
        <span className="text-[#c9a64e] uppercase tracking-[0.4em] text-xs mb-4 animate-pulse">
          Exquisite Lighting
        </span>

        <h2 
          className="text-white text-4xl md:text-7xl mb-6 max-w-4xl leading-tight"
          style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
        >
          Illuminate Your Space <br /> 
          <span className="italic">With A Touch Of Luxury</span>
        </h2>

        
        <div className="w-24 h-[1px] bg-[#c9a64e] mb-8"></div>

        <p className="text-white/90 text-sm md:text-lg font-light tracking-wide max-w-2xl mb-10 leading-relaxed uppercase">
          Explore our curated collection of lighting <br /> designed to transform your world.
        </p>

        
        <button
          onClick={handleExplore}
          className="relative overflow-hidden border border-white/50 text-white 
                     px-10 py-4 tracking-[0.2em] uppercase text-xs font-bold
                     transition-all duration-500 hover:border-[#c9a64e] hover:text-white
                     before:absolute before:inset-0 before:bg-[#c9a64e] before:scale-x-0 
                     before:origin-right before:transition-transform before:duration-500 
                     hover:before:scale-x-100 hover:before:origin-left"
        >
          <span className="relative z-10">Explore Collection</span>
        </button>

        
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
            <span className="text-white/40 text-[10px] uppercase tracking-widest">Scroll</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-[#c9a64e] to-transparent"></div>
        </div>
      </div>
    </div>
  );
}