import { useState, useEffect } from "react";
import { ArrowLeft, Star, MapPin, Clock, CheckCircle, XCircle, Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useLocation, useNavigate } from "react-router-dom";

interface ServiceProvidersProps {
  onShowAuth?: (authFlow: { show: boolean; role?: 'customer' | 'provider'; fromBooking?: boolean }) => void;
}

const ServiceProviders = ({ onShowAuth }: ServiceProvidersProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { serviceName, serviceCategory } = location.state || {};
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("rating");

  // Mock service providers data
  const allProviders = [
    {
      id: 1,
      name: "QuickFix Pro Services",
      rating: 4.9,
      reviews: 150,
      location: "2.5 km away",
      price: "₹299-599",
      image: "👨‍🔧",
      available: true,
      specialties: ["Plumbing", "Electrical", "AC Repair"],
      experience: "5+ years",
      responseTime: "Within 30 minutes"
    },
    {
      id: 2,
      name: "Elite Home Services",
      rating: 4.8,
      reviews: 200,
      location: "1.8 km away",
      price: "₹399-699",
      image: "🔧",
      available: true,
      specialties: ["Cleaning", "Maintenance", "Repairs"],
      experience: "8+ years",
      responseTime: "Within 45 minutes"
    },
    {
      id: 3,
      name: "Metro Care Solutions",
      rating: 4.7,
      reviews: 89,
      location: "3.2 km away",
      price: "₹249-549",
      image: "🛠️",
      available: false,
      specialties: ["Car Wash", "Automotive", "Detailing"],
      experience: "3+ years",
      responseTime: "Within 1 hour"
    },
    {
      id: 4,
      name: "Premium Service Hub",
      rating: 4.9,
      reviews: 300,
      location: "1.2 km away",
      price: "₹499-899",
      image: "⭐",
      available: true,
      specialties: ["Healthcare", "Beauty", "Wellness"],
      experience: "10+ years",
      responseTime: "Within 20 minutes"
    },
    {
      id: 5,
      name: "Smart Fix Express",
      rating: 4.6,
      reviews: 120,
      location: "4.5 km away",
      price: "₹199-399",
      image: "📱",
      available: true,
      specialties: ["Device Repair", "Tech Support", "Mobile"],
      experience: "4+ years",
      responseTime: "Within 1 hour"
    }
  ];

  const filteredProviders = allProviders
    .filter(provider => 
      provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.specialties.some(specialty => 
        specialty.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "price":
          return parseInt(a.price.split('-')[0].replace('₹', '')) - parseInt(b.price.split('-')[0].replace('₹', ''));
        case "distance":
          return parseFloat(a.location) - parseFloat(b.location);
        default:
          return 0;
      }
    });

  const handleProviderSelect = (provider: any) => {
    navigate(`/provider-service-details/${provider.id}`, { 
      state: { 
        provider, 
        serviceName, 
        serviceCategory 
      } 
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation onShowAuth={onShowAuth} />
      
      <div className="pt-20 pb-8 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                {serviceName || "Service"} Providers
              </h1>
              <p className="text-muted-foreground text-base lg:text-lg">
                Choose from {filteredProviders.length} available providers
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <Input 
                placeholder="Search providers..." 
                className="pl-10" 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
              />
            </div>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-input rounded-md bg-background"
            >
              <option value="rating">Sort by Rating</option>
              <option value="price">Sort by Price</option>
              <option value="distance">Sort by Distance</option>
            </select>
          </div>
        </div>

        {/* Providers Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProviders.map(provider => (
            <Card key={provider.id} className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{provider.image}</div>
                  <div className="flex items-center space-x-2">
                    {provider.available ? (
                      <Badge variant="default" className="bg-green-500">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Available
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        <XCircle className="w-3 h-3 mr-1" />
                        Busy
                      </Badge>
                    )}
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {provider.name}
                </h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      <span className="font-medium">{provider.rating}</span>
                      <span className="text-muted-foreground ml-1">({provider.reviews} reviews)</span>
                    </div>
                    <span className="font-semibold text-primary">{provider.price}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-1" />
                    {provider.location}
                  </div>

                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 mr-1" />
                    {provider.responseTime}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-2">Specialties:</p>
                  <div className="flex flex-wrap gap-1">
                    {provider.specialties.slice(0, 3).map((specialty, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={() => handleProviderSelect(provider)}
                  className="w-full bg-primary hover:bg-primary/90 group-hover:scale-105 transition-transform"
                  disabled={!provider.available}
                >
                  {provider.available ? "View Details" : "Currently Unavailable"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProviders.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground text-lg mb-2">No providers found</div>
            <p className="text-muted-foreground">Try adjusting your search criteria</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ServiceProviders;
