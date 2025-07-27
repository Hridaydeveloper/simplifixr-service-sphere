import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Star, 
  Phone, 
  Mail, 
  MessageCircle,
  Calendar,
  CheckCircle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { ImageCarousel } from "@/components/ui/image-carousel";
import { serviceService, ProviderService } from "@/services/serviceService";

interface ProviderServiceDetailsProps {
  onShowAuth?: (authFlow: { show: boolean; role?: 'customer' | 'provider' }) => void;
}

const ProviderServiceDetails = ({ onShowAuth }: ProviderServiceDetailsProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { serviceId } = useParams();
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Get service data from location state or fetch from API
    if (location.state?.service) {
      setService(location.state.service);
      setLoading(false);
    } else if (serviceId) {
      // Fetch service data by ID
      fetchServiceData(serviceId);
    } else {
      navigate('/services');
    }
  }, [serviceId, location.state, navigate]);

  const fetchServiceData = async (id: string) => {
    try {
      setLoading(true);
      const services = await serviceService.getProviderServices();
      const foundService = services.find(s => s.id === id);
      
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
      console.error('Error fetching service:', error);
      toast({
        title: "Error",
        description: "Failed to load service details.",
        variant: "destructive"
      });
      navigate('/services');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p>Loading service details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p>Service not found</p>
          </div>
        </div>
      </div>
    );
  }

  const serviceName = service.master_service?.name || service.custom_service_name || 'Service';
  const provider = location.state?.provider || service.provider_profile;
  
  const handleBookNow = () => {
    navigate('/booking-payment', { 
      state: { 
        service,
        provider
      } 
    });
  };

  const handleChatNegotiation = () => {
    navigate('/chat-negotiation', { 
      state: { 
        service,
        provider
      } 
    });
  };

  const handleCallEmail = (type: 'call' | 'email') => {
    toast({
      title: "Contact Provider",
      description: "You can ask the provider for call and email",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation onShowAuth={onShowAuth} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Services
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {serviceName}
                    </h1>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        {service.master_service?.category || 'Custom Service'}
                      </Badge>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                        <span>4.8 (120+ reviews)</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary">
                      {service.price_range?.includes('₹') ? service.price_range : `₹${service.price_range}`}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">per service</p>
                  </div>
                </div>

                {/* Service Images */}
                {service.images && service.images.length > 0 && (
                  <div className="mb-6">
                    <ImageCarousel
                      images={service.images}
                      alt={serviceName}
                      className="h-64 w-full rounded-lg overflow-hidden"
                    />
                  </div>
                )}

                {/* Service Details */}
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">Estimated Time</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{service.estimated_time}</p>
                      </div>
                    </div>
                    {provider?.location && (
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-5 h-5 text-primary" />
                        <div>
                          <p className="font-medium">Service Area</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{provider.location}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {service.description && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Description</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Provider Card */}
            {provider && (
              <Card>
                <CardHeader>
                  <CardTitle>Service Provider</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={provider.profile_picture_url} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {provider.full_name?.charAt(0) || 'P'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{provider.full_name || 'Service Provider'}</h3>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                        <span>4.8 (120+ reviews)</span>
                      </div>
                    </div>
                  </div>

                  {provider.location && (
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{provider.location}</span>
                    </div>
                  )}

                  <div className="pt-4 border-t space-y-3">
                    <Button 
                      onClick={handleBookNow}
                      className="w-full bg-primary hover:bg-primary/90"
                      size="lg"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Book Service
                    </Button>
                    
                    <Button 
                      onClick={handleChatNegotiation}
                      variant="outline" 
                      className="w-full"
                      size="lg"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Chat & Negotiate
                    </Button>

                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleCallEmail('call')}
                      >
                        <Phone className="w-4 h-4 mr-1" />
                        Call
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleCallEmail('email')}
                      >
                        <Mail className="w-4 h-4 mr-1" />
                        Email
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Price Summary */}
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">Service Price</h3>
                  <div className="text-3xl font-bold text-primary mb-2">
                    {service.price_range?.includes('₹') ? service.price_range : `₹${service.price_range}`}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    💬 Price may vary based on requirements
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Service Features */}
            <Card>
              <CardHeader>
                <CardTitle>What's Included</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-3" />
                  Professional service delivery
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-3" />
                  Quality guarantee
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-3" />
                  Flexible scheduling
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-3" />
                  Customer support
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProviderServiceDetails;