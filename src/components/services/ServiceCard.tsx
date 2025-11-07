
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, MapPin } from "lucide-react";
import { ProviderService } from "@/services/serviceService";
import { ImageCarousel } from "@/components/ui/image-carousel";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface ServiceCardProps {
  service: ProviderService;
  onBook?: (service: ProviderService) => void;
  onViewDetails?: (service: ProviderService) => void;
  onShowAuth?: () => void;
}

const ServiceCard = ({ service, onBook, onViewDetails, onShowAuth }: ServiceCardProps) => {
  const { user } = useAuth();
  const isGuest = localStorage.getItem('guestMode') === 'true';
  const serviceName = service.master_service?.name || service.custom_service_name || 'Custom Service';
  const baseImage = (service.images && service.images.length > 0) ? service.images[0] : service.master_service?.image_url;
  const [gallery, setGallery] = useState<string[]>([]);

  useEffect(() => {
    let initial: string[] = [];
    if (service.images && service.images.length > 0) initial = service.images;
    else if (service.master_service?.image_url) initial = [service.master_service.image_url];
    setGallery(initial || []);
  }, [service]);
  
  // Get a placeholder image based on service category
  const getServiceImage = () => {
    if (baseImage && baseImage !== '🔧') return baseImage;
    const category = service.master_service?.category?.toLowerCase() || serviceName.toLowerCase();
    if (category.includes('clean')) return 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop';
    if (category.includes('repair') || category.includes('fix')) return 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop';
    if (category.includes('electric')) return 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop';
    if (category.includes('plumb')) return 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400&h=300&fit=crop';
    if (category.includes('cook') || category.includes('food')) return 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop';
    if (category.includes('garden')) return 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop';
    if (category.includes('car') || category.includes('auto')) return 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=300&fit=crop';
    if (category.includes('tuition') || category.includes('teach')) return 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop';
    return 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=400&h=300&fit=crop';
  };

  // Don't show services from unavailable providers
  if (!service.is_available) {
    return null;
  }

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-md hover:scale-[1.02] bg-card cursor-pointer rounded-2xl"
          onClick={() => onBook?.(service)}>
      <div className="relative h-72">
        {/* Image Section - Full width background */}
        <div className="absolute inset-0">
          {gallery && gallery.length > 1 ? (
            <ImageCarousel
              images={gallery}
              alt={serviceName}
              className="w-full h-full"
            />
          ) : (gallery && gallery.length === 1) ? (
            <img 
              src={gallery[0]}
              alt={serviceName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                e.currentTarget.src = getServiceImage();
              }}
              loading="lazy"
              decoding="async"
            />
          ) : (
            <img 
              src={getServiceImage()}
              alt={serviceName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              decoding="async"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        </div>
        
        {/* Top badges */}
        <div className="absolute top-4 left-4 right-4 flex items-start justify-between z-10">
          <Badge variant="secondary" className="text-xs bg-primary text-primary-foreground font-semibold shadow-lg">
            {service.master_service?.category || 'Custom'}
          </Badge>
          <div className="flex items-center bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 shadow-lg">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-1" />
            <span className="text-xs font-semibold text-gray-800">4.8</span>
            <span className="text-xs text-gray-600 ml-1">(120+)</span>
          </div>
        </div>
        
        {/* Content Section - Overlaid at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-5 text-white z-10">
          <CardTitle className="text-xl font-bold mb-2 text-white drop-shadow-lg">
            {serviceName}
          </CardTitle>
          
          <div className="flex items-center gap-4 mb-3 text-sm">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1 text-white/90" />
              <span className="text-white/90">{service.estimated_time}</span>
            </div>
            
            {service.provider_profile && (
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1 text-white/90" />
                <span className="text-white/90">{service.provider_profile.location}</span>
              </div>
            )}
          </div>
          
          {service.description && (
            <p className="text-sm text-white/80 line-clamp-2 mb-4 drop-shadow">
              {service.description}
            </p>
          )}
          
          <div className="flex items-center justify-between">
            <div className="text-left">
              <div className="text-2xl font-bold text-white drop-shadow-lg">
                {service.price_range?.includes('₹') ? service.price_range : `₹${service.price_range}`}
              </div>
              <div className="text-xs text-white/80 font-medium">
                per service
              </div>
            </div>
            <Button 
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-3 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              onClick={(e) => {
                e.stopPropagation();
                if (!user && !isGuest) {
                  onShowAuth?.();
                } else {
                  onBook?.(service);
                }
              }}
            >
              Book Now
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ServiceCard;
