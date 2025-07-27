
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, MapPin } from "lucide-react";
import { ProviderService } from "@/services/serviceService";
import { ImageCarousel } from "@/components/ui/image-carousel";

interface ServiceCardProps {
  service: ProviderService;
  onBook?: (service: ProviderService) => void;
  onViewDetails?: (service: ProviderService) => void;
}

const ServiceCard = ({ service, onBook, onViewDetails }: ServiceCardProps) => {
  const serviceName = service.master_service?.name || service.custom_service_name || 'Custom Service';
  // Prioritize uploaded images over master service images
  const serviceImage = (service.images && service.images.length > 0) ? service.images[0] : service.master_service?.image_url;
  
  // Get a placeholder image based on service category
  const getServiceImage = () => {
    if (serviceImage && serviceImage !== '🔧') return serviceImage;
    
    const category = service.master_service?.category?.toLowerCase() || serviceName.toLowerCase();
    
    // Return appropriate placeholder based on service type
    if (category.includes('clean')) return 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop';
    if (category.includes('repair') || category.includes('fix')) return 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop';
    if (category.includes('electric')) return 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop';
    if (category.includes('plumb')) return 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400&h=300&fit=crop';
    if (category.includes('cook') || category.includes('food')) return 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop';
    if (category.includes('garden')) return 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop';
    if (category.includes('car') || category.includes('auto')) return 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=300&fit=crop';
    if (category.includes('tuition') || category.includes('teach')) return 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop';
    
    // Default service image
    return 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=400&h=300&fit=crop';
  };

  // Don't show services from unavailable providers
  if (!service.is_available) {
    return null;
  }

  return (
    <Card className="group h-full hover:shadow-lg transition-all duration-300 border-0 shadow-sm hover:scale-[1.01] bg-card cursor-pointer max-h-80"
          onClick={() => onViewDetails?.(service)}>
      <div className="flex h-full">
        {/* Image Section - Multiple images with navigation */}
        <div className="w-40 sm:w-48 relative overflow-hidden rounded-l-lg">
          {service.images && service.images.length > 1 ? (
            <ImageCarousel
              images={service.images}
              alt={serviceName}
              className="w-full h-full"
            />
          ) : serviceImage ? (
            <img 
              src={serviceImage} 
              alt={serviceName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.currentTarget.src = getServiceImage();
              }}
            />
          ) : (
            <img 
              src={getServiceImage()} 
              alt={serviceName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10"></div>
        </div>
        
        {/* Content Section */}
        <div className="flex-1 p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                {service.master_service?.category || 'Custom'}
              </Badge>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
              <span className="font-medium">4.8</span>
              <span className="text-xs ml-1">(120+)</span>
            </div>
          </div>
          
          <CardTitle className="text-xl font-bold line-clamp-2 mb-3 group-hover:text-primary transition-colors">
            {serviceName}
          </CardTitle>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="w-4 h-4 mr-2 flex-shrink-0 text-primary" />
              <span>{service.estimated_time}</span>
            </div>
            
            {service.provider_profile && (
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mr-2 flex-shrink-0 text-primary" />
                <span>{service.provider_profile.location}</span>
              </div>
            )}
          </div>
          
          {service.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
              {service.description}
            </p>
          )}
          
          <div className="mt-auto">
            <div className="text-2xl font-bold text-primary">
              {service.price_range}
              <span className="text-xs text-muted-foreground font-normal ml-1">per service</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ServiceCard;
