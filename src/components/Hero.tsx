import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import HeroBannerSlider from "./HeroBannerSlider";

const Hero = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedService, setSelectedService] = useState("");

  // Service categories data
  const serviceCategories = [
    { icon: "👩‍💼", name: "Women's Salon & Spa", category: "salon" },
    { icon: "👨‍💼", name: "Men's Salon & Massage", category: "salon" },
    { icon: "❄️", name: "AC & Appliance Repair", category: "repair" },
    { icon: "🧹", name: "Cleaning & Pest Control", category: "cleaning" },
    { icon: "⚡", name: "Electrician & Plumber", category: "maintenance" },
    { icon: "💧", name: "Water Purifier", category: "purifier" },
    { icon: "🎨", name: "Painting & Waterproofing", category: "painting" },
    { icon: "🏗️", name: "Wall Panels & Woodwork", category: "construction" },
  ];

  const handleSearch = () => {
    navigate('/services', {
      state: {
        searchQuery: selectedService,
        location: selectedLocation,
        scrollToTop: true
      }
    });
  };

  const handleCategoryClick = (category: string) => {
    navigate('/services', {
      state: {
        searchQuery: category,
        scrollToTop: true
      }
    });
  };

  return (
    <section id="home" className="bg-background">
      {/* Hero Banner Slider */}
      <HeroBannerSlider />

      {/* Search Bar & Categories Section */}
      <div className="relative z-20 -mt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Premium Search Bar */}
          <div className="glass-effect-strong p-6 sm:p-8 rounded-3xl shadow-2xl glow-border mb-12">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="relative md:col-span-5">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary w-5 h-5" />
                <Input
                  placeholder={isMobile ? "What service?" : "What service do you need?"}
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 h-14 bg-secondary/50 border-border focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl text-base placeholder:text-muted-foreground transition-all duration-300"
                />
              </div>
              
              <div className="relative md:col-span-4">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-primary w-5 h-5" />
                <Input
                  placeholder="Your location"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 h-14 bg-secondary/50 border-border focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl text-base placeholder:text-muted-foreground transition-all duration-300"
                />
              </div>
              
              <div className="md:col-span-3">
                <Button
                  onClick={handleSearch}
                  size="lg"
                  className="w-full h-14 rounded-xl font-semibold text-base shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </div>

          {/* Service Categories Grid */}
          <div className="space-y-6">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground text-center">
              Popular <span className="text-gradient">Categories</span>
            </h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
              {serviceCategories.map((service, index) => (
                <button
                  key={index}
                  onClick={() => handleCategoryClick(service.category)}
                  className="group flex flex-col items-center p-5 rounded-2xl bg-card border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 card-hover"
                >
                  <div className="text-3xl sm:text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                    {service.icon}
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-foreground text-center leading-tight">
                    {service.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
