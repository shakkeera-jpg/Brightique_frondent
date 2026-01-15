import { useNavigate } from "react-router-dom";
import chandeleiers from "../assets/chandeleiers.png";
import walllights from "../assets/walllights.png";
import tablelampImg from "../assets/tablelamps.png";
import pendant from "../assets/pendant.png";
import outdoorLightImg from "../assets/outdoor.png";
import floorLampImg from "../assets/floorlight.png";

export default function ShopByCategories() {
  const navigate = useNavigate();

  const categories = [
    { img: chandeleiers, title: "Chandeliers" },
    { img: walllights, title: "Wall Lights" },
    { img: tablelampImg, title: "Table Lamps" },
    { img: pendant, title: "Pendant" },
    { img: outdoorLightImg, title: "Outdoor Lamps" },
    { img: floorLampImg, title: "Floor Lamps" },
  ];

  const handleCategoryClick = (category) => {
    navigate(`/products?category=${encodeURIComponent(category)}`);
  };

  const goldClassic = "#AF8F42";

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        
        {/* Minimalist Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-gray-100 pb-8">
          <div className="max-w-xl">
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#AF8F42] font-bold mb-4 block">
              Curated Selection
            </span>
            <h2 
              className="text-4xl md:text-5xl font-light text-gray-900 leading-none"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Shop by <i>Category</i>
            </h2>
          </div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mt-4 md:mt-0">
            Heritage • Craftsmanship • Brilliance
          </p>
        </div>

        {/* Professional Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1">
          {categories.map((cat, index) => (
            <div
              key={index}
              onClick={() => handleCategoryClick(cat.title)}
              className="group relative cursor-pointer overflow-hidden aspect-[1/1] bg-gray-50"
            >
              {/* Image with subtle zoom */}
              <img
                src={cat.img}
                alt={cat.title}
                className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
              />
              
              {/* Luxury Overlay: Gradient from bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40 group-hover:opacity-70 transition-opacity duration-500"></div>

              {/* Content Overlay */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <div className="overflow-hidden">
                  <p className="text-[9px] uppercase tracking-[0.4em] text-[#AF8F42] font-bold mb-2 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    Discover
                  </p>
                </div>
                <h3 className="text-xl md:text-2xl text-white font-light tracking-wide transition-transform duration-500 group-hover:-translate-y-1">
                  {cat.title}
                </h3>
                
                {/* Minimalist Line that grows on hover */}
                <div className="w-0 h-[1px] bg-white/50 mt-4 group-hover:w-full transition-all duration-700"></div>
              </div>

              {/* Top Right Index (e.g., 01, 02...) */}
              <div className="absolute top-8 right-8 text-[10px] font-medium text-white/30 tracking-widest">
                0{index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}