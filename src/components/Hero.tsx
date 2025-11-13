import { Search, MapPin, Calendar, ArrowRight, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import Map from "./Map";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useProviderStatus } from "@/hooks/useProviderStatus";
import { useAuth } from "@/contexts/AuthContext";
import { ImageCarousel } from "@/components/ui/image-carousel";
import { useHomePageImages } from "@/hooks/useHomePageImages";

const Hero = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const providerStatus = useProviderStatus();
  const { images: heroImages } = useHomePageImages();
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [showMap, setShowMap] = useState(false);

  // Service categories data
  const serviceCategories = [
    { icon: "👩‍💼", name: "Women's Salon & Spa", category: "salon" },
    { icon: "👨‍💼", name: "Men's Salon & Massage", category: "salon" },
    { icon: "❄️", name: "AC & Appliance Repair", category: "repair" },
    { icon: "🧹", name: "Cleaning & Pest Control", category: "cleaning" },
    { icon: "⚡", name: "Electrician, Plumber & Carpenter", category: "maintenance" },
    { icon: "💧", name: "Native Water Purifier", category: "purifier" },
    { icon: "🎨", name: "Painting & Waterproofing", category: "painting" },
    { icon: "🏗️", name: "Wall Panels & Woodwork", category: "construction" },
  ];

  // Extract image URLs and alt text for carousel
  const imageUrls = heroImages.map(img => img.image_url);
  const altText = heroImages.length > 0 ? heroImages[0].alt_text : "Popular services showcase";
  
  const handleBookService = () => {
    navigate('/services', {
      state: {
        scrollToTop: true
      }
    });
  };

  const handleBecomeProvider = () => {
    if (providerStatus.isProvider) {
      navigate('/provider-dashboard');
    } else {
      navigate('/become-provider');
    }
  };

  const getProviderButtonText = () => {
    if (!user) return "Become a Provider";
    if (providerStatus.loading) return "Loading...";
    if (providerStatus.isVerified) return "Provider Dashboard";
    if (providerStatus.hasRegistration) return "Dashboard (Pending)";
    return "Become a Provider";
  };

  const handleSearch = () => {
    // Navigate to services page with search parameters
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

  const handleLocationSelect = (lat: number, lng: number, address: string) => {
    console.log('Location selected:', {
      lat,
      lng,
      address
    });
    setSelectedLocation(address);
    setShowMap(false);
  };

  return (
    <section id="home" className="pt-20 pb-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[80vh]">
          <div className="space-y-6 lg:space-y-8 animate-fade-in">
            <div className="space-y-4 lg:space-y-6">
              <div className="inline-flex items-center px-4 py-2 glass-effect rounded-full glow-effect">
                <span className="w-2 h-2 bg-primary rounded-full mr-3 animate-pulse"></span>
                <span className="text-primary text-sm font-semibold tracking-wide uppercase">Services at Your Fingertips</span>
              </div>
              
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground leading-tight">
                Home services with{" "}
                <span className="text-gradient">
                  SimplifixR
                </span>
              </h1>
              
              <p className="text-base lg:text-lg text-muted-foreground leading-relaxed max-w-lg">
                What are you looking for?
              </p>
            </div>

            {/* Service Categories Grid */}
            <div className="glass-effect p-6 rounded-2xl shadow-xl max-w-2xl">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {serviceCategories.map((service, index) => (
                  <button
                    key={index}
                    onClick={() => handleCategoryClick(service.category)}
                    className="flex flex-col items-center p-4 rounded-xl bg-card/50 hover:bg-primary/10 hover:border-primary border border-transparent transition-all duration-300 group glow-effect-hover"
                  >
                    <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">
                      {service.icon}
                    </div>
                    <span className="text-sm font-semibold text-foreground text-center leading-tight">
                      {service.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Enhanced Search Bar */}
            <div className="glass-effect p-6 rounded-2xl shadow-xl max-w-2xl glow-effect">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary z-10" />
                  <Input 
                    placeholder={isMobile ? "What service do you need?" : "Search services..."} 
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="pl-12 pr-4 py-4 bg-secondary border-border focus:border-primary focus:ring-primary/20 rounded-xl text-base placeholder:text-muted-foreground transition-all duration-300 hover:border-primary/50" 
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary z-10" />
                  <Input 
                    placeholder="Your location" 
                    value={selectedLocation} 
                    onChange={(e) => setSelectedLocation(e.target.value)} 
                    className="pl-12 pr-4 py-4 bg-secondary border-border rounded-xl focus:border-primary focus:ring-primary/20 text-base placeholder:text-muted-foreground transition-all duration-300 hover:border-primary/50" 
                  />
                </div>
                <Button 
                  onClick={handleSearch} 
                  size="lg"
                  className="py-4 rounded-xl font-semibold text-base"
                >
                  Search
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={handleBookService} size="lg" className="px-8 text-lg">
                Book a Service
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                onClick={handleBecomeProvider} 
                variant={providerStatus.isVerified ? "default" : "outline"} 
                size="lg"
                className="px-8 text-lg"
                disabled={providerStatus.loading}
              >
                {providerStatus.isVerified && <Shield className="w-5 h-5 mr-2" />}
                {getProviderButtonText()}
                {!providerStatus.isVerified && <ArrowRight className="w-5 h-5 ml-2" />}
              </Button>
            </div>

            {/* Show Map when location is searched */}
            {showMap && selectedLocation && (
              <div className="max-w-2xl">
                <Map location={selectedLocation} onLocationSelect={handleLocationSelect} />
              </div>
            )}

            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-8 text-sm">
              <div className="flex items-center glass-effect px-4 py-3 rounded-full">
                <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mr-3">
                  <span className="text-primary-foreground font-bold text-sm">4.8</span>
                </div>
                <div>
                  <div className="font-semibold text-foreground text-sm">Service Rating*</div>
                </div>
              </div>
              <div className="flex items-center glass-effect px-4 py-3 rounded-full">
                <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mr-3">
                  <span className="text-primary-foreground font-bold text-xs">12M+</span>
                </div>
                <div>
                  <div className="font-semibold text-foreground text-sm">Customers Globally*</div>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative order-first lg:order-last">
            <div className="relative w-full h-64 lg:h-[600px] bg-gradient-to-br from-primary/20 via-accent/10 to-transparent rounded-3xl overflow-hidden shadow-2xl glow-effect">
              <div className="absolute inset-0">
                <ImageCarousel
                  images={imageUrls}
                  alt={altText}
                  className="w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-background/20 to-transparent pointer-events-none"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
