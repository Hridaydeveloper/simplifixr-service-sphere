
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, MapPin } from "lucide-react";
import { ProviderService } from "@/services/serviceService";

interface ServiceCardProps {
  service: ProviderService;
  onBook?: (service: ProviderService) => void;
  onViewDetails?: (service: ProviderService) => void;
}

const ServiceCard = ({ service, onBook, onViewDetails }: ServiceCardProps) => {
  const serviceName = service.master_service?.name || service.custom_service_name || 'Custom Service';
  const serviceImage = service.master_service?.image_url || service.images?.[0] || '🔧';

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="text-2xl">{serviceImage}</div>
          <Badge variant="secondary" className="text-xs">
            {service.master_service?.category || 'Custom'}
          </Badge>
        </div>
        <CardTitle className="text-lg line-clamp-2">{serviceName}</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center text-sm text-gray-600">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-2 flex-shrink-0" />
          <span>4.8 (120+ reviews)</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
          <span>{service.estimated_time}</span>
        </div>
        
        {service.provider_profile && (
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>{service.provider_profile.location}</span>
          </div>
        )}
        
        <div className="text-lg font-semibold text-[#00B896]">
          {service.price_range}
        </div>
        
        {service.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {service.description}
          </p>
        )}
        
        <div className="flex gap-2 pt-2">
          <Button 
            onClick={() => onViewDetails?.(service)}
            variant="outline" 
            className="flex-1"
          >
            View Details
          </Button>
          <Button 
            onClick={() => onBook?.(service)}
            className="flex-1 bg-[#00B896] hover:bg-[#00A085]"
          >
            Book Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
