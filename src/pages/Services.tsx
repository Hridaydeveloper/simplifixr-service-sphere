
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Filter, Star } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { serviceService, ServiceCategory, ProviderService } from "@/services/serviceService";
import ServiceCard from "@/components/services/ServiceCard";

const Services = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [services, setServices] = useState<ProviderService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [selectedCategory]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [categoriesData, servicesData] = await Promise.all([
        serviceService.getServiceCategories(),
        serviceService.getProviderServices(selectedCategory || undefined)
      ]);
      
      setCategories(categoriesData);
      setServices(servicesData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load services",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services.filter(service => {
    const serviceName = service.master_service?.name || service.custom_service_name || '';
    const searchMatch = serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       service.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return searchMatch;
  });

  const handleBookService = (service: ProviderService) => {
    navigate('/chat-negotiation', { 
      state: { 
        service: {
          id: service.id,
          name: service.master_service?.name || service.custom_service_name,
          price: service.price_range,
          provider: service.provider_profile?.full_name || 'Service Provider',
          category: service.master_service?.category || 'custom'
        }
      } 
    });
  };

  const handleViewDetails = (service: ProviderService) => {
    navigate(`/provider-service-details/${service.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-[#00B896] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p>Loading services...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Find the Perfect <span className="text-[#00B896]">Service</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover trusted local service providers for all your needs
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search for services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-3 text-lg border-2 border-gray-200 focus:border-[#00B896] rounded-xl"
            />
          </div>
        </div>

        {/* Categories Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            <Button
              variant={selectedCategory === "" ? "default" : "outline"}
              onClick={() => setSelectedCategory("")}
              className={selectedCategory === "" ? "bg-[#00B896] hover:bg-[#00A085]" : ""}
            >
              All Services
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.name ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.name)}
                className={selectedCategory === category.name ? "bg-[#00B896] hover:bg-[#00A085]" : ""}
              >
                {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No services found</h3>
            <p className="text-gray-500">Try adjusting your search or browse different categories</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onBook={handleBookService}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-[#00B896] to-[#00C9A7] text-white">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Become a Service Provider</h3>
              <p className="text-lg mb-6 opacity-90">
                Join our network of trusted professionals and grow your business
              </p>
              <Button
                onClick={() => navigate('/become-provider')}
                variant="secondary"
                size="lg"
                className="bg-white text-[#00B896] hover:bg-gray-100"
              >
                Start Earning Today
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Services;
