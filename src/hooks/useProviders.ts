
import { useState, useMemo } from "react";

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

export const useProviders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("rating");

  // Mock service providers data
  const allProviders: Provider[] = [
    {
      id: 1,
      name: "QuickFix Pro Services",
      rating: 4.9,
      reviews: 150,
      location: "2.5 km away",
      price: "₹299-599",
      image: "👨‍🔧",
      available: true,
      specialties: ["Plumbing", "Electrical", "AC Repair"],
      experience: "5+ years",
      responseTime: "Within 30 minutes"
    },
    {
      id: 2,
      name: "Elite Home Services",
      rating: 4.8,
      reviews: 200,
      location: "1.8 km away",
      price: "₹399-699",
      image: "🔧",
      available: true,
      specialties: ["Cleaning", "Maintenance", "Repairs"],
      experience: "8+ years",
      responseTime: "Within 45 minutes"
    },
    {
      id: 3,
      name: "Metro Care Solutions",
      rating: 4.7,
      reviews: 89,
      location: "3.2 km away",
      price: "₹249-549",
      image: "🛠️",
      available: false,
      specialties: ["Car Wash", "Automotive", "Detailing"],
      experience: "3+ years",
      responseTime: "Within 1 hour"
    },
    {
      id: 4,
      name: "Premium Service Hub",
      rating: 4.9,
      reviews: 300,
      location: "1.2 km away",
      price: "₹499-899",
      image: "⭐",
      available: true,
      specialties: ["Healthcare", "Beauty", "Wellness"],
      experience: "10+ years",
      responseTime: "Within 20 minutes"
    },
    {
      id: 5,
      name: "Smart Fix Express",
      rating: 4.6,
      reviews: 120,
      location: "4.5 km away",
      price: "₹199-399",
      image: "📱",
      available: true,
      specialties: ["Device Repair", "Tech Support", "Mobile"],
      experience: "4+ years",
      responseTime: "Within 1 hour"
    }
  ];

  const filteredProviders = useMemo(() => {
    return allProviders
      .filter(provider => 
        provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.specialties.some(specialty => 
          specialty.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
      .sort((a, b) => {
        switch (sortBy) {
          case "rating":
            return b.rating - a.rating;
          case "price":
            return parseInt(a.price.split('-')[0].replace('₹', '')) - parseInt(b.price.split('-')[0].replace('₹', ''));
          case "distance":
            return parseFloat(a.location) - parseFloat(b.location);
          default:
            return 0;
        }
      });
  }, [searchTerm, sortBy]);

  return {
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    filteredProviders
  };
};
