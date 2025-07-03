
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useLocation, useNavigate } from "react-router-dom";
import SearchAndFilters from "@/components/providers/SearchAndFilters";
import ProvidersList from "@/components/providers/ProvidersList";
import { useProviders } from "@/hooks/useProviders";

interface ServiceProvidersProps {
  onShowAuth?: (authFlow: { show: boolean; role?: 'customer' | 'provider'; fromBooking?: boolean }) => void;
}

const ServiceProviders = ({ onShowAuth }: ServiceProvidersProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { serviceName, serviceCategory } = location.state || {};
  
  const {
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    filteredProviders
  } = useProviders();

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
      
      <div className="pt-16 sm:pt-20 pb-6 sm:pb-8 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="w-full sm:w-auto">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
                {serviceName || "Service"} Providers
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base lg:text-lg">
                Choose from {filteredProviders.length} available providers
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <SearchAndFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        <ProvidersList
          providers={filteredProviders}
          onProviderSelect={handleProviderSelect}
        />
      </div>

      <Footer />
    </div>
  );
};

export default ServiceProviders;
