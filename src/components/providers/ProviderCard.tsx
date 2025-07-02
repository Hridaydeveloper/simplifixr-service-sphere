
import { Star, MapPin, Clock, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Provider {
  id: number;
  name: string;
  rating: number;
  reviews: number;
  location: string;
  price: string;
  image: string;
  available: boolean;
  specialties: string[];
  experience: string;
  responseTime: string;
}

interface ProviderCardProps {
  provider: Provider;
  onSelect: (provider: Provider) => void;
}

const ProviderCard = ({ provider, onSelect }: ProviderCardProps) => {
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-md">
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
          onClick={() => onSelect(provider)}
          className="w-full bg-primary hover:bg-primary/90 group-hover:scale-105 transition-transform"
          disabled={!provider.available}
        >
          {provider.available ? "View Details" : "Currently Unavailable"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProviderCard;
