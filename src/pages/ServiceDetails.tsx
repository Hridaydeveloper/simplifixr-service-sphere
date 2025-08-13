import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, Star, Phone, Mail } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImageCarousel } from "@/components/ui/image-carousel";
import { serviceService, MasterService } from "@/services/serviceService";
import { toast } from "@/hooks/use-toast";

const ServiceDetails = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState<MasterService | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (serviceId) {
      fetchServiceDetails();
    }
  }, [serviceId]);

  const fetchServiceDetails = async () => {
    try {
      const services = await serviceService.getMasterServices();
      const foundService = services.find(s => s.id === serviceId);
      if (foundService) {
        setService(foundService);
      } else {
        toast({
          title: "Service not found",
          description: "The requested service could not be found.",
          variant: "destructive"
        });
        navigate('/services');
      }
    } catch (error) {
      console.error('Error fetching service details:', error);
      toast({
        title: "Error",
        description: "Failed to load service details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBookService = () => {
    navigate('/services', {
      state: {
        searchQuery: service?.name,
        scrollToTop: true
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading service details...</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Service not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button 
          onClick={() => navigate(-1)} 
          variant="ghost" 
          className="mb-6 hover:bg-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Service Image */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-2xl overflow-hidden shadow-lg">
              {service.image_url ? (
                <img 
                  src={service.image_url} 
                  alt={service.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <span className="text-gray-400">No image available</span>
                </div>
              )}
            </div>
          </div>

          {/* Service Details */}
          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-2">
                {service.category}
              </Badge>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {service.name}
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                {service.description}
              </p>
            </div>

            {/* Service Info Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Estimated Time</p>
                  <p className="font-semibold">{service.estimated_time || 'Varies'}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Star className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Starting Price</p>
                  <p className="font-semibold">₹{service.base_price_range || 'Contact for quote'}</p>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={handleBookService}
                className="w-full bg-gradient-to-r from-[#00B896] to-[#00C9A7] hover:from-[#009985] hover:to-[#00B896] text-white py-6 text-lg font-semibold rounded-xl"
              >
                Find Providers for This Service
              </Button>
              <Button 
                variant="outline" 
                className="w-full py-6 text-lg"
                onClick={() => navigate('/become-provider')}
              >
                Become a Provider for This Service
              </Button>
            </div>

            {/* Additional Info */}
            <Card>
              <CardHeader>
                <CardTitle>What's Included</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-gray-600">✓ Professional service delivery</p>
                <p className="text-gray-600">✓ Quality guaranteed</p>
                <p className="text-gray-600">✓ Customer support</p>
                <p className="text-gray-600">✓ Secure payment options</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;