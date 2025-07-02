
import ProviderCard from "./ProviderCard";

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

interface ProvidersListProps {
  providers: Provider[];
  onProviderSelect: (provider: Provider) => void;
}

const ProvidersList = ({ providers, onProviderSelect }: ProvidersListProps) => {
  if (providers.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground text-lg mb-2">No providers found</div>
        <p className="text-muted-foreground">Try adjusting your search criteria</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {providers.map(provider => (
        <ProviderCard 
          key={provider.id} 
          provider={provider} 
          onSelect={onProviderSelect} 
        />
      ))}
    </div>
  );
};

export default ProvidersList;
