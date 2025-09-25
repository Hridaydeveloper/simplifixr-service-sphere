
import { useState, useEffect } from "react";
import { Home, Wrench, GraduationCap, Heart, Truck, PartyPopper, Sparkles, Car, Smartphone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { serviceService, ProviderService } from "@/services/serviceService";

interface ServicesGridProps {
  onShowAuth?: (authFlow: { show: boolean; role?: 'customer' | 'provider' }) => void;
}

const ServicesGrid = ({ onShowAuth }: ServicesGridProps) => {
  const navigate = useNavigate();
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [categoryServices, setCategoryServices] = useState<{[key: string]: ProviderService[]}>({});
  const [loading, setLoading] = useState(false);
  
  const services = [{
    icon: Sparkles,
    title: "Cleaning & Sanitation",
    description: "Deep cleaning, bathroom, kitchen & more",
    color: "bg-blue-50 text-blue-600",
    category: "cleaning"
  }, {
    icon: Wrench,
    title: "Repairs & Maintenance",
    description: "Plumbing, electrical, AC & appliances",
    color: "bg-orange-50 text-orange-600",
    category: "repairs"
  }, {
    icon: GraduationCap,
    title: "Education & Tech",
    description: "Home tutoring, tech support & training",
    color: "bg-purple-50 text-purple-600",
    category: "education"
  }, {
    icon: Heart,
    title: "Healthcare & Wellness",
    description: "Nursing, physiotherapy, salon at home",
    color: "bg-pink-50 text-pink-600",
    category: "healthcare"
  }, {
    icon: PartyPopper,
    title: "Events & Religious",
    description: "Puja services, party helpers & catering",
    color: "bg-yellow-50 text-yellow-600",
    category: "events"
  }, {
    icon: Truck,
    title: "Logistics & Moving",
    description: "Packers & movers, delivery services",
    color: "bg-green-50 text-green-600",
    category: "logistics"
  }, {
    icon: Car,
    title: "Automotive",
    description: "Car wash, detailing & maintenance",
    color: "bg-red-50 text-red-600",
    category: "automotive"
  }, {
    icon: Smartphone,
    title: "Device Repair",
    description: "Mobile, laptop & electronics repair",
    color: "bg-indigo-50 text-indigo-600",
    category: "repair"
  }];

  const fetchCategoryServices = async (category: string) => {
    if (categoryServices[category]) return; // Already fetched
    
    try {
      setLoading(true);
      const services = await serviceService.getProviderServices(category);
      setCategoryServices(prev => ({
        ...prev,
        [category]: services
      }));
    } catch (error) {
      console.error('Error fetching category services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleServiceHover = (service: any) => {
    setHoveredCategory(service.category);
    fetchCategoryServices(service.category);
  };

  const handleServiceLeave = () => {
    setHoveredCategory(null);
  };
  
  const handleServiceClick = () => {
    navigate('/services');
  };
  
  return <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            All Services in{" "}
            <span className="bg-gradient-to-r from-[#00D4AA] to-[#00F5D4] bg-clip-text text-teal-500">
              One Place
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From everyday tasks to specialized services, find verified professionals for every need
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 relative">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer border-0 shadow-md relative z-10" 
              onClick={handleServiceClick}
              onMouseEnter={() => handleServiceHover(service)}
              onMouseLeave={handleServiceLeave}
            >
              <CardContent className="p-4 sm:p-6">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${service.color} flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform`}>
                  <service.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 leading-tight">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                  {service.description}
                </p>
                
                {/* Hover popup for category services */}
                {hoveredCategory === service.category && (
                  <div className="absolute top-full left-0 mt-2 w-80 bg-white shadow-2xl rounded-lg border border-gray-200 p-4 z-50">
                    <h4 className="font-semibold text-gray-900 mb-3">{service.title} Services</h4>
                    {loading ? (
                      <div className="flex items-center justify-center py-4">
                        <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    ) : categoryServices[service.category]?.length > 0 ? (
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {categoryServices[service.category].slice(0, 5).map((providerService, idx) => (
                          <div key={idx} className="p-2 hover:bg-gray-50 rounded border-l-2 border-teal-500">
                            <div className="font-medium text-sm text-gray-900">
                              {providerService.master_service?.name || providerService.custom_service_name}
                            </div>
                            <div className="text-xs text-gray-600">
                              {providerService.description || 'Professional service available'}
                            </div>
                            <div className="text-xs text-teal-600 font-medium">
                              ₹{providerService.price_range} • {providerService.estimated_time}
                            </div>
                          </div>
                        ))}
                        {categoryServices[service.category].length > 5 && (
                          <div className="text-xs text-gray-500 text-center pt-2">
                            +{categoryServices[service.category].length - 5} more services available
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 py-2">
                        No services available in this category yet.
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <button onClick={handleServiceClick} className="font-semibold transition-colors text-teal-500">
            View All Services →
          </button>
        </div>
      </div>
    </section>;
};

export default ServicesGrid;
