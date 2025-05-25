
import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface MapProps {
  location: string;
  onLocationSelect?: (lat: number, lng: number, address: string) => void;
}

const Map: React.FC<MapProps> = ({ location, onLocationSelect }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initMap = async () => {
      try {
        const loader = new Loader({
          apiKey: 'YOUR_GOOGLE_MAPS_API_KEY', // User needs to add their API key
          version: 'weekly',
          libraries: ['places']
        });

        const google = await loader.load();
        
        if (!mapRef.current) return;

        // Initialize map
        const mapInstance = new google.maps.Map(mapRef.current, {
          center: { lat: 23.8315, lng: 91.2868 }, // Default to Agartala
          zoom: 13,
          styles: [
            {
              featureType: 'all',
              elementType: 'geometry.fill',
              stylers: [{ color: '#f5f5f5' }]
            },
            {
              featureType: 'water',
              elementType: 'geometry.fill',
              stylers: [{ color: '#00D4AA' }]
            }
          ]
        });

        setMap(mapInstance);

        // Search for the location if provided
        if (location) {
          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({ address: location }, (results, status) => {
            if (status === 'OK' && results && results[0]) {
              const position = results[0].geometry.location;
              mapInstance.setCenter(position);
              
              // Add marker
              new google.maps.Marker({
                position: position,
                map: mapInstance,
                title: location,
                icon: {
                  url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                    <svg fill="#00D4AA" height="40" width="40" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                  `),
                  scaledSize: new google.maps.Size(40, 40)
                }
              });

              if (onLocationSelect) {
                onLocationSelect(position.lat(), position.lng(), results[0].formatted_address);
              }
            }
          });
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error loading Google Maps:', error);
        setIsLoading(false);
      }
    };

    initMap();
  }, [location, onLocationSelect]);

  if (isLoading) {
    return (
      <div className="w-full h-64 bg-gray-100 rounded-xl flex items-center justify-center">
        <div className="text-[#00C49A] font-medium">Loading map...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-64 rounded-xl overflow-hidden shadow-lg border border-gray-200">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
};

export default Map;
