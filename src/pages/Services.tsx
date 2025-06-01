import { useState, useEffect } from "react";
import { ArrowLeft, Search, Filter, Star, Clock, MapPin, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Sparkles, Wrench, GraduationCap, Heart, Truck, PartyPopper, Car, Smartphone } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

interface ServicesProps {
  onShowAuth?: (authFlow: { show: boolean; role?: 'customer' | 'provider' }) => void;
}

const Services = ({ onShowAuth }: ServicesProps) => {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  const [isMobileSearchActive, setIsMobileSearchActive] = useState(false);
  const locationState = useLocation();

  // Check if user is a guest
  const isGuest = !user && localStorage.getItem('guestMode') === 'true';

  useEffect(() => {
    if (locationState.state?.scrollToTop) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [locationState]);

  const categories = [
    { id: "all", name: "All Services", icon: null },
    { id: "cleaning", name: "Cleaning & Sanitation", icon: Sparkles },
    { id: "repairs", name: "Repairs & Maintenance", icon: Wrench },
    { id: "education", name: "Education & Tech", icon: GraduationCap },
    { id: "healthcare", name: "Healthcare & Wellness", icon: Heart },
    { id: "events", name: "Events & Religious", icon: PartyPopper },
    { id: "logistics", name: "Logistics & Moving", icon: Truck },
    { id: "automotive", name: "Automotive", icon: Car },
    { id: "device", name: "Device Repair", icon: Smartphone }
  ];

  // ... keep existing code (allServices array)

  const allServices = [
    // Cleaning & Sanitation
    { id: 1, category: "cleaning", name: "Kitchen Deep Cleaning", price: "₹499-899", rating: 4.8, time: "2-3 hrs", image: "🍳" },
    { id: 2, category: "cleaning", name: "Bathroom Cleaning", price: "₹299-599", rating: 4.9, time: "1-2 hrs", image: "🚿" },
    { id: 3, category: "cleaning", name: "Living Room Cleaning", price: "₹399-699", rating: 4.7, time: "2 hrs", image: "🛋️" },
    { id: 4, category: "cleaning", name: "Garden Maintenance", price: "₹599-1299", rating: 4.6, time: "3-4 hrs", image: "🌱" },
    { id: 5, category: "cleaning", name: "Full House Cleaning", price: "₹1499-2999", rating: 4.9, time: "4-6 hrs", image: "🏠" },
    // Repairs & Maintenance
    { id: 6, category: "repairs", name: "Plumbing Services", price: "₹299-899", rating: 4.8, time: "1-3 hrs", image: "🔧" },
    { id: 7, category: "repairs", name: "Electrical Work", price: "₹399-1299", rating: 4.7, time: "2-4 hrs", image: "⚡" },
    { id: 8, category: "repairs", name: "AC Repair & Service", price: "₹499-1599", rating: 4.8, time: "2-3 hrs", image: "❄️" },
    { id: 9, category: "repairs", name: "Carpentry Work", price: "₹599-1999", rating: 4.6, time: "3-5 hrs", image: "🔨" },
    // Education & Tech
    { id: 10, category: "education", name: "Home Tutoring - Math", price: "₹299-699/hr", rating: 4.9, time: "1-2 hrs", image: "📚" },
    { id: 11, category: "education", name: "Computer Training", price: "₹499-999/hr", rating: 4.7, time: "2 hrs", image: "💻" },
    { id: 12, category: "education", name: "Language Classes", price: "₹399-799/hr", rating: 4.8, time: "1-2 hrs", image: "🗣️" },
    // Healthcare & Wellness
    { id: 13, category: "healthcare", name: "Salon at Home", price: "₹799-1999", rating: 4.8, time: "2-3 hrs", image: "💇" },
    { id: 14, category: "healthcare", name: "Massage Therapy", price: "₹999-2499", rating: 4.9, time: "1-2 hrs", image: "💆" },
    { id: 15, category: "healthcare", name: "Physiotherapy", price: "₹599-1299", rating: 4.7, time: "1 hr", image: "🏥" },
    // Events & Religious
    { id: 16, category: "events", name: "Puja Services", price: "₹1999-4999", rating: 4.9, time: "3-5 hrs", image: "🕉️" },
    { id: 17, category: "events", name: "Party Helpers", price: "₹799-1599", rating: 4.6, time: "4-6 hrs", image: "🎉" },
    { id: 18, category: "events", name: "Catering Services", price: "₹199-499/person", rating: 4.8, time: "varies", image: "🍽️" },
    // Logistics & Moving
    { id: 19, category: "logistics", name: "Packers & Movers", price: "₹2999-9999", rating: 4.7, time: "4-8 hrs", image: "📦" },
    { id: 20, category: "logistics", name: "Delivery Services", price: "₹99-499", rating: 4.8, time: "1-3 hrs", image: "🚚" },
    // Automotive
    { id: 21, category: "automotive", name: "Car Wash & Detailing", price: "₹399-1299", rating: 4.8, time: "2-4 hrs", image: "🚗" },
    { id: 22, category: "automotive", name: "Bike Service", price: "₹299-899", rating: 4.6, time: "2-3 hrs", image: "🏍️" },
    // Device Repair
    { id: 23, category: "device", name: "Mobile Repair", price: "₹299-1999", rating: 4.7, time: "1-2 hrs", image: "📱" },
    { id: 24, category: "device", name: "Laptop Repair", price: "₹599-2999", rating: 4.8, time: "2-4 hrs", image: "💻" }
  ];

  const filteredServices = allServices.filter(service => {
    const matchesCategory = selectedCategory === "all" || service.category === selectedCategory;
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    // On mobile, hide filters when searching and show search results
    if (window.innerWidth < 1024 && value.trim()) {
      setIsMobileSearchActive(true);
      setShowFilters(false);
    } else if (window.innerWidth < 1024 && !value.trim()) {
      setIsMobileSearchActive(false);
      setShowFilters(true);
    }
  };

  const handleFilterToggle = () => {
    setShowFilters(!showFilters);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setIsMobileSearchActive(false);
    setShowFilters(true);
  };

  const handleBookService = () => {
    if (isGuest) {
      // Show auth flow for customer
      if (onShowAuth) {
        onShowAuth({ show: true, role: 'customer' });
      }
    } else {
      // Handle booking for authenticated users
      toast({
        title: "Booking Service",
        description: "Service booking functionality will be implemented soon!",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation onShowAuth={onShowAuth} />
      
      {/* Header */}
      <div className="pt-20 pb-8 bg-gradient-to-r from-[#00B896] to-[#00C9A7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold mb-2 text-white">All Services</h1>
              <p className="text-white/90 text-base lg:text-lg">Find the perfect service for your needs</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => window.history.back()} 
              className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-[#00B896] transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input 
                placeholder="Search services..." 
                className="pl-10 pr-10" 
                value={searchTerm} 
                onChange={(e) => handleSearch(e.target.value)} 
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <Button 
              variant="outline" 
              className="md:w-auto"
              onClick={handleFilterToggle}
            >
              <Filter className="w-4 h-4 mr-2" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Categories Sidebar - Responsive */}
          {showFilters && (
            <div className="lg:col-span-1">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">Categories</h3>
                {isMobileSearchActive && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={clearSearch}
                    className="lg:hidden"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Clear
                  </Button>
                )}
              </div>
              <div className="space-y-2">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center ${
                      selectedCategory === category.id 
                        ? 'bg-[#00B896] text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {category.icon && <category.icon className="w-4 h-4 mr-3" />}
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Services Grid */}
          <div className={`${showFilters ? 'lg:col-span-3' : 'lg:col-span-4'} ${!showFilters ? 'col-span-full' : ''}`}>
            {/* Search Results Header for Mobile */}
            {isMobileSearchActive && searchTerm && (
              <div className="mb-6 lg:hidden">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-1">Search Results</h3>
                  <p className="text-blue-700 text-sm">
                    Found {filteredServices.length} services for "{searchTerm}"
                  </p>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {searchTerm ? `Search Results` : selectedCategory === "all" ? "All Services" : categories.find(c => c.id === selectedCategory)?.name}
              </h2>
              <span className="text-gray-600">{filteredServices.length} services found</span>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredServices.map(service => (
                <Card key={service.id} className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-md">
                  <CardContent className="p-6">
                    <div className="text-4xl mb-4">{service.image}</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-[#00B896] transition-colors">
                      {service.name}
                    </h3>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-semibold text-[#00B896]">{service.price}</span>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                          <span className="text-gray-600">{service.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-1" />
                        {service.time}
                      </div>
                    </div>

                    <Button 
                      onClick={handleBookService}
                      className="w-full bg-[#00B896] hover:bg-[#009e85] group-hover:scale-105 transition-transform text-white"
                    >
                      Book Now
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredServices.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-2">No services found</div>
                <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                {searchTerm && (
                  <Button 
                    variant="outline" 
                    onClick={clearSearch}
                    className="mt-4"
                  >
                    Clear Search
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Services;
