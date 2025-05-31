
import { Search, MapPin, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import Map from "./Map";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const Hero = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [showMap, setShowMap] = useState(false);

  const handleBookService = () => {
    navigate('/services', {
      state: {
        scrollToTop: true
      }
    });
  };

  const handleBecomeProvider = () => {
    navigate('/become-provider');
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

  const handleLocationSearch = () => {
    if (selectedLocation.trim()) {
      setShowMap(true);
    }
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
    <section id="home" className="pt-20 pb-16 bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[80vh]">
          <div className="space-y-6 lg:space-y-8 animate-fade-in">
            <div className="space-y-4 lg:space-y-6">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#00B896]/20 to-[#00C9A7]/20 rounded-full border border-[#00B896]/30 backdrop-blur-sm">
                <span className="w-2 h-2 bg-gradient-to-r from-[#00B896] to-[#00C9A7] rounded-full mr-3 animate-pulse"></span>
                <span className="text-[#00B896] text-sm font-semibold tracking-wide">Services at Your Fingertips</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight xl:text-4xl">
                Simplify Your Life,{" "}
                <span className="bg-gradient-to-r from-[#00B896] to-[#00C9A7] bg-clip-text text-transparent">
                  One Service
                </span>{" "}
                at a Time
              </h1>
              
              <p className="text-lg lg:text-xl text-gray-600 leading-relaxed max-w-lg">
                Connect with verified local service providers for all your needs. From cleaning to repairs, education to events - we've got you covered with trust and excellence.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={handleBookService} className="bg-gradient-to-r from-[#00B896] to-[#00C9A7] hover:from-[#009985] hover:to-[#00B896] px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-white">
                Book a Service
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button onClick={handleBecomeProvider} variant="outline" className="border-2 border-[#00B896] hover:bg-[#00B896] hover:text-white px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 text-[#00B896]">
                Become a Provider
              </Button>
            </div>

            {/* Enhanced Search Bar */}
            <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-gray-200/50 max-w-2xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#00B896] z-10" />
                  <Input 
                    placeholder={isMobile ? "What service do you need?" : "Search services..."} 
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="pl-12 pr-4 py-4 border-gray-200 focus:border-[#00B896] focus:ring-[#00B896]/20 rounded-lg text-base placeholder:text-gray-400 transition-all duration-300 hover:border-[#00B896]/50" 
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#00B896] z-10" />
                  <Input 
                    placeholder="Your location" 
                    value={selectedLocation} 
                    onChange={(e) => setSelectedLocation(e.target.value)} 
                    className="pl-12 pr-4 py-4 border-gray-200 rounded-lg focus:border-[#00B896] focus:ring-[#00B896]/20 text-base placeholder:text-gray-400 transition-all duration-300 hover:border-[#00B896]/50" 
                  />
                </div>
                <Button 
                  onClick={handleSearch} 
                  className="bg-gradient-to-r from-[#00B896] to-[#00C9A7] hover:from-[#009985] hover:to-[#00B896] py-4 rounded-lg font-semibold text-white text-base transition-all duration-300"
                >
                  Search
                </Button>
              </div>
            </div>

            {/* Show Map when location is searched */}
            {showMap && selectedLocation && (
              <div className="max-w-2xl">
                <Map location={selectedLocation} onLocationSelect={handleLocationSelect} />
              </div>
            )}

            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-8 text-sm">
              <div className="flex items-center bg-white/70 backdrop-blur-sm px-4 py-3 rounded-full shadow-md">
                <div className="w-10 h-10 bg-gradient-to-r from-[#00B896] to-[#00C9A7] rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">4.8</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">Average Rating</div>
                  <div className="text-gray-600 text-xs">Trusted by thousands</div>
                </div>
              </div>
              <div className="flex items-center bg-white/70 backdrop-blur-sm px-4 py-3 rounded-full shadow-md">
                <div className="w-10 h-10 bg-gradient-to-r from-[#00B896] to-[#00C9A7] rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">1K+</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">Verified Providers</div>
                  <div className="text-gray-600 text-xs">Background checked</div>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative order-first lg:order-last">
            <div className="relative w-full h-64 lg:h-[600px] bg-gradient-to-br from-[#00B896]/30 via-[#00C9A7]/20 to-transparent rounded-3xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00B896]/10 to-transparent"></div>
              
              {/* Floating Cards */}
              <div className="absolute top-4 lg:top-12 left-4 lg:left-8 bg-white/95 backdrop-blur-sm p-3 lg:p-6 rounded-xl lg:rounded-2xl shadow-xl border border-gray-100">
                <div className="text-xs lg:text-sm text-gray-600 mb-1">Choose a service</div>
                <div className="font-bold text-sm lg:text-lg text-gray-900">Cleaning • Repairs</div>
                <div className="w-8 lg:w-12 h-1 bg-gradient-to-r from-[#00B896] to-[#00C9A7] rounded-full mt-2"></div>
              </div>
              
              <div className="absolute bottom-4 lg:bottom-12 right-4 lg:right-8 bg-white/95 backdrop-blur-sm p-3 lg:p-6 rounded-xl lg:rounded-2xl shadow-xl border border-gray-100">
                <div className="text-xs lg:text-sm text-gray-600 mb-1">Book instantly</div>
                <div className="font-bold text-sm lg:text-lg text-[#00B896]">Available now</div>
                <div className="flex items-center mt-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  <span className="text-xs text-gray-500">Live tracking</span>
                </div>
              </div>
              
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-sm p-4 lg:p-8 rounded-2xl lg:rounded-3xl shadow-2xl border border-gray-200">
                <div className="text-center">
                  <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-[#00B896] to-[#00C9A7] rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white font-bold text-lg lg:text-xl">S</span>
                  </div>
                  <div className="font-bold text-lg lg:text-xl text-gray-900">Simplifixr</div>
                  <div className="text-sm text-gray-600">Your trusted partner</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
