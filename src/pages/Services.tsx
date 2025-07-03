import { useState, useEffect } from "react";
import { ArrowLeft, Search, Filter, Star, Clock, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Sparkles, Wrench, GraduationCap, Heart, Truck, PartyPopper, Car, Smartphone, Home, Utensils, PaintBucket, Scissors, Camera, Music, Dumbbell, Baby, TreePine, Dog, Shield } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

interface ServicesProps {
  onShowAuth?: (authFlow: { show: boolean; role?: 'customer' | 'provider'; fromBooking?: boolean }) => void;
}

interface ServiceItem {
  id: string | number;
  category: string;
  name: string;
  price: string;
  rating: number;
  time: string;
  image: string;
  description: string;
  isProviderService?: boolean;
  providerImages?: string[];
}

const Services = ({ onShowAuth }: ServicesProps) => {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  const [isMobileSearchActive, setIsMobileSearchActive] = useState(false);
  const [providerServices, setProviderServices] = useState<any[]>([]);
  const locationState = useLocation();
  const navigate = useNavigate();

  // Check if user is a guest
  const isGuest = !user && localStorage.getItem('guestMode') === 'true';

  useEffect(() => {
    if (locationState.state?.scrollToTop) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Load provider services from localStorage
    const savedServices = localStorage.getItem('providerServices');
    if (savedServices) {
      setProviderServices(JSON.parse(savedServices));
    }
  }, [locationState]);

  const categories = [
    { id: "all", name: "All Services", icon: null },
    { id: "cleaning", name: "Cleaning & Sanitation", icon: Sparkles },
    { id: "repairs", name: "Repairs & Maintenance", icon: Wrench },
    { id: "education", name: "Education & Tech", icon: GraduationCap },
    { id: "healthcare", name: "Healthcare & Wellness", icon: Heart },
    { id: "events", name: "Events & Religious", icon: PartyPopper },
    { id: "logistics", name: "Logistics & Moving", icon: Truck },
    { id: "automotive", name: "Automotive", icon: Car },
    { id: "device", name: "Device Repair", icon: Smartphone },
    { id: "home", name: "Home Improvement", icon: Home },
    { id: "food", name: "Food & Catering", icon: Utensils },
    { id: "beauty", name: "Beauty & Personal Care", icon: Scissors },
    { id: "photography", name: "Photography & Media", icon: Camera },
    { id: "entertainment", name: "Entertainment", icon: Music },
    { id: "fitness", name: "Fitness & Sports", icon: Dumbbell },
    { id: "childcare", name: "Childcare & Elderly", icon: Baby },
    { id: "garden", name: "Gardening & Landscaping", icon: TreePine },
    { id: "pet", name: "Pet Services", icon: Dog },
    { id: "security", name: "Security Services", icon: Shield },
    { id: "art", name: "Art & Design", icon: PaintBucket }
  ];

  const staticServices: ServiceItem[] = [
    // Cleaning & Sanitation
    { id: 1, category: "cleaning", name: "Kitchen Deep Cleaning", price: "₹499-899", rating: 4.8, time: "2-3 hrs", image: "🍳", description: "Professional kitchen cleaning with degreasing", isProviderService: false, providerImages: [] },
    { id: 2, category: "cleaning", name: "Bathroom Cleaning", price: "₹299-599", rating: 4.9, time: "1-2 hrs", image: "🚿", description: "Complete bathroom sanitization", isProviderService: false, providerImages: [] },
    { id: 3, category: "cleaning", name: "Living Room Cleaning", price: "₹399-699", rating: 4.7, time: "2 hrs", image: "🛋️", description: "Thorough living room cleaning", isProviderService: false, providerImages: [] },
    { id: 4, category: "cleaning", name: "Garden Maintenance", price: "₹599-1299", rating: 4.6, time: "3-4 hrs", image: "🌱", description: "Garden cleaning and maintenance", isProviderService: false, providerImages: [] },
    { id: 5, category: "cleaning", name: "Full House Cleaning", price: "₹1499-2999", rating: 4.9, time: "4-6 hrs", image: "🏠", description: "Complete house cleaning service", isProviderService: false, providerImages: [] },
    { id: 6, category: "cleaning", name: "Office Cleaning", price: "₹999-1999", rating: 4.8, time: "3-5 hrs", image: "🏢", description: "Professional office cleaning", isProviderService: false, providerImages: [] },
    { id: 7, category: "cleaning", name: "Carpet Cleaning", price: "₹299-699", rating: 4.7, time: "2-3 hrs", image: "🧽", description: "Deep carpet cleaning and stain removal", isProviderService: false, providerImages: [] },
    { id: 8, category: "cleaning", name: "Window Cleaning", price: "₹199-499", rating: 4.6, time: "1-2 hrs", image: "🪟", description: "Window and glass cleaning", isProviderService: false, providerImages: [] },

    // Repairs & Maintenance
    { id: 9, category: "repairs", name: "Plumbing Services", price: "₹299-899", rating: 4.8, time: "1-3 hrs", image: "🔧", description: "Pipe repair, leak fixing, installation", isProviderService: false, providerImages: [] },
    { id: 10, category: "repairs", name: "Electrical Work", price: "₹399-1299", rating: 4.7, time: "2-4 hrs", image: "⚡", description: "Wiring, switch repair, installation", isProviderService: false, providerImages: [] },
    { id: 11, category: "repairs", name: "AC Repair & Service", price: "₹499-1599", rating: 4.8, time: "2-3 hrs", image: "❄️", description: "AC installation, repair, maintenance", isProviderService: false, providerImages: [] },
    { id: 12, category: "repairs", name: "Carpentry Work", price: "₹599-1999", rating: 4.6, time: "3-5 hrs", image: "🔨", description: "Furniture repair, custom carpentry", isProviderService: false, providerImages: [] },
    { id: 13, category: "repairs", name: "Appliance Repair", price: "₹399-1199", rating: 4.7, time: "2-3 hrs", image: "🔧", description: "Washing machine, fridge, microwave repair", isProviderService: false, providerImages: [] },
    { id: 14, category: "repairs", name: "Door & Lock Repair", price: "₹299-799", rating: 4.8, time: "1-2 hrs", image: "🚪", description: "Door installation, lock repair", isProviderService: false, providerImages: [] },

    // Education & Tech
    { id: 15, category: "education", name: "Home Tutoring - Math", price: "₹299-699/hr", rating: 4.9, time: "1-2 hrs", image: "📚", description: "Mathematics tutoring all levels", isProviderService: false, providerImages: [] },
    { id: 16, category: "education", name: "Computer Training", price: "₹499-999/hr", rating: 4.7, time: "2 hrs", image: "💻", description: "Basic to advanced computer skills", isProviderService: false, providerImages: [] },
    { id: 17, category: "education", name: "Language Classes", price: "₹399-799/hr", rating: 4.8, time: "1-2 hrs", image: "🗣️", description: "English, Hindi, regional languages", isProviderService: false, providerImages: [] },
    { id: 18, category: "education", name: "Music Lessons", price: "₹599-1199/hr", rating: 4.9, time: "1 hr", image: "🎵", description: "Guitar, piano, vocals, tabla", isProviderService: false, providerImages: [] },
    { id: 19, category: "education", name: "Coding Classes", price: "₹799-1499/hr", rating: 4.8, time: "2 hrs", image: "💻", description: "Programming languages, web development", isProviderService: false, providerImages: [] },

    // Healthcare & Wellness
    { id: 20, category: "healthcare", name: "Salon at Home", price: "₹799-1999", rating: 4.8, time: "2-3 hrs", image: "💇", description: "Hair cut, styling, facial", isProviderService: false, providerImages: [] },
    { id: 21, category: "healthcare", name: "Massage Therapy", price: "₹999-2499", rating: 4.9, time: "1-2 hrs", image: "💆", description: "Therapeutic massage services", isProviderService: false, providerImages: [] },
    { id: 22, category: "healthcare", name: "Physiotherapy", price: "₹599-1299", rating: 4.7, time: "1 hr", image: "🏥", description: "Physical therapy at home", isProviderService: false, providerImages: [] },
    { id: 23, category: "healthcare", name: "Nursing Care", price: "₹899-1999", rating: 4.9, time: "4-8 hrs", image: "👩‍⚕️", description: "Professional nursing services", isProviderService: false, providerImages: [] },
    { id: 24, category: "healthcare", name: "Elder Care", price: "₹699-1499", rating: 4.8, time: "4-12 hrs", image: "👴", description: "Elderly care and assistance", isProviderService: false, providerImages: [] },

    // Events & Religious
    { id: 25, category: "events", name: "Puja Services", price: "₹1999-4999", rating: 4.9, time: "3-5 hrs", image: "🕉️", description: "Hindu religious ceremonies", isProviderService: false, providerImages: [] },
    { id: 26, category: "events", name: "Party Helpers", price: "₹799-1599", rating: 4.6, time: "4-6 hrs", image: "🎉", description: "Event setup and management", isProviderService: false, providerImages: [] },
    { id: 27, category: "events", name: "Catering Services", price: "₹199-499/person", rating: 4.8, time: "varies", image: "🍽️", description: "Food catering for events", isProviderService: false, providerImages: [] },
    { id: 28, category: "events", name: "Wedding Planning", price: "₹9999-49999", rating: 4.9, time: "varies", image: "💒", description: "Complete wedding planning", isProviderService: false, providerImages: [] },
    { id: 29, category: "events", name: "DJ Services", price: "₹2999-9999", rating: 4.7, time: "4-8 hrs", image: "🎧", description: "Music and DJ for events", isProviderService: false, providerImages: [] },

    // Logistics & Moving
    { id: 30, category: "logistics", name: "Packers & Movers", price: "₹2999-9999", rating: 4.7, time: "4-8 hrs", image: "📦", description: "Home and office relocation", isProviderService: false, providerImages: [] },
    { id: 31, category: "logistics", name: "Delivery Services", price: "₹99-499", rating: 4.8, time: "1-3 hrs", image: "🚚", description: "Local delivery services", isProviderService: false, providerImages: [] },
    { id: 32, category: "logistics", name: "Courier Services", price: "₹49-299", rating: 4.6, time: "same day", image: "📦", description: "Document and package delivery", isProviderService: false, providerImages: [] },

    // Automotive
    { id: 33, category: "automotive", name: "Car Wash & Detailing", price: "₹399-1299", rating: 4.8, time: "2-4 hrs", image: "🚗", description: "Complete car cleaning service", isProviderService: false, providerImages: [] },
    { id: 34, category: "automotive", name: "Bike Service", price: "₹299-899", rating: 4.6, time: "2-3 hrs", image: "🏍️", description: "Motorcycle maintenance", isProviderService: false, providerImages: [] },
    { id: 35, category: "automotive", name: "Car Mechanic", price: "₹599-1999", rating: 4.7, time: "2-5 hrs", image: "🔧", description: "Car repair and maintenance", isProviderService: false, providerImages: [] },
    { id: 36, category: "automotive", name: "Tire Services", price: "₹199-799", rating: 4.8, time: "1-2 hrs", image: "🛞", description: "Tire repair and replacement", isProviderService: false, providerImages: [] },

    // Device Repair
    { id: 37, category: "device", name: "Mobile Repair", price: "₹299-1999", rating: 4.7, time: "1-2 hrs", image: "📱", description: "Screen, battery, software issues", isProviderService: false, providerImages: [] },
    { id: 38, category: "device", name: "Laptop Repair", price: "₹599-2999", rating: 4.8, time: "2-4 hrs", image: "💻", description: "Hardware and software repair", isProviderService: false, providerImages: [] },
    { id: 39, category: "device", name: "TV Repair", price: "₹499-1999", rating: 4.6, time: "2-3 hrs", image: "📺", description: "Television repair services", isProviderService: false, providerImages: [] },
    { id: 40, category: "device", name: "Gaming Console Repair", price: "₹799-2499", rating: 4.7, time: "2-4 hrs", image: "🎮", description: "PlayStation, Xbox repair", isProviderService: false, providerImages: [] },

    // Home Improvement
    { id: 41, category: "home", name: "Painting Services", price: "₹999-4999", rating: 4.8, time: "4-8 hrs", image: "🎨", description: "Interior and exterior painting", isProviderService: false, providerImages: [] },
    { id: 42, category: "home", name: "Interior Design", price: "₹4999-19999", rating: 4.9, time: "varies", image: "🏠", description: "Home interior designing", isProviderService: false, providerImages: [] },
    { id: 43, category: "home", name: "Flooring Services", price: "₹1999-9999", rating: 4.7, time: "4-8 hrs", image: "🏠", description: "Tile, wood, carpet installation", isProviderService: false, providerImages: [] },
    { id: 44, category: "home", name: "Waterproofing", price: "₹1499-5999", rating: 4.6, time: "4-6 hrs", image: "💧", description: "Roof and wall waterproofing", isProviderService: false, providerImages: [] },

    // Food & Catering
    { id: 45, category: "food", name: "Personal Chef", price: "₹1999-4999", rating: 4.9, time: "3-5 hrs", image: "👨‍🍳", description: "Professional cooking at home", isProviderService: false, providerImages: [] },
    { id: 46, category: "food", name: "Meal Prep Service", price: "₹599-1499", rating: 4.8, time: "2-3 hrs", image: "🥘", description: "Weekly meal preparation", isProviderService: false, providerImages: [] },
    { id: 47, category: "food", name: "Baking Services", price: "₹499-1999", rating: 4.7, time: "2-4 hrs", image: "🧁", description: "Custom cakes and pastries", isProviderService: false, providerImages: [] },

    // Beauty & Personal Care
    { id: 48, category: "beauty", name: "Manicure & Pedicure", price: "₹399-899", rating: 4.8, time: "1-2 hrs", image: "💅", description: "Nail care services", isProviderService: false, providerImages: [] },
    { id: 49, category: "beauty", name: "Makeup Artist", price: "₹1999-4999", rating: 4.9, time: "2-3 hrs", image: "💄", description: "Professional makeup", isProviderService: false, providerImages: [] },
    { id: 50, category: "beauty", name: "Hair Styling", price: "₹599-1999", rating: 4.7, time: "2-3 hrs", image: "💇‍♀️", description: "Hair cut, color, styling", isProviderService: false, providerImages: [] },

    // Photography & Media
    { id: 51, category: "photography", name: "Event Photography", price: "₹4999-19999", rating: 4.9, time: "4-8 hrs", image: "📸", description: "Wedding, party photography", isProviderService: false, providerImages: [] },
    { id: 52, category: "photography", name: "Product Photography", price: "₹1999-7999", rating: 4.8, time: "2-4 hrs", image: "📷", description: "Professional product shoots", isProviderService: false, providerImages: [] },
    { id: 53, category: "photography", name: "Video Editing", price: "₹999-3999", rating: 4.7, time: "varies", image: "🎬", description: "Video post-production", isProviderService: false, providerImages: [] },

    // Entertainment
    { id: 54, category: "entertainment", name: "Party Entertainment", price: "₹2999-9999", rating: 4.8, time: "3-5 hrs", image: "🎭", description: "Magicians, clowns, performers", isProviderService: false, providerImages: [] },
    { id: 55, category: "entertainment", name: "Dance Classes", price: "₹699-1499/session", rating: 4.9, time: "1-2 hrs", image: "💃", description: "Classical, western, bollywood", isProviderService: false, providerImages: [] },

    // Fitness & Sports
    { id: 56, category: "fitness", name: "Personal Trainer", price: "₹999-2499/session", rating: 4.8, time: "1-2 hrs", image: "🏋️", description: "Home fitness training", isProviderService: false, providerImages: [] },
    { id: 57, category: "fitness", name: "Yoga Instructor", price: "₹699-1499/session", rating: 4.9, time: "1 hr", image: "🧘", description: "Yoga and meditation", isProviderService: false, providerImages: [] },
    { id: 58, category: "fitness", name: "Sports Coaching", price: "₹799-1999/session", rating: 4.7, time: "1-2 hrs", image: "⚽", description: "Cricket, football, tennis", isProviderService: false, providerImages: [] },

    // Childcare & Elderly
    { id: 59, category: "childcare", name: "Babysitting", price: "₹299-699/hr", rating: 4.8, time: "4-8 hrs", image: "👶", description: "Professional childcare", isProviderService: false, providerImages: [] },
    { id: 60, category: "childcare", name: "Child Tutoring", price: "₹399-799/hr", rating: 4.9, time: "1-2 hrs", image: "📚", description: "Academic support for kids", isProviderService: false, providerImages: [] },

    // Gardening & Landscaping
    { id: 61, category: "garden", name: "Garden Design", price: "₹2999-9999", rating: 4.8, time: "varies", image: "🌺", description: "Landscape design and planning", isProviderService: false, providerImages: [] },
    { id: 62, category: "garden", name: "Plant Care", price: "₹299-799", rating: 4.7, time: "1-2 hrs", image: "🪴", description: "Plant maintenance and care", isProviderService: false, providerImages: [] },
    { id: 63, category: "garden", name: "Lawn Mowing", price: "₹199-599", rating: 4.6, time: "1-2 hrs", image: "🌱", description: "Grass cutting and maintenance", isProviderService: false, providerImages: [] },

    // Pet Services
    { id: 64, category: "pet", name: "Pet Grooming", price: "₹599-1499", rating: 4.8, time: "2-3 hrs", image: "🐕", description: "Pet bathing and grooming", isProviderService: false, providerImages: [] },
    { id: 65, category: "pet", name: "Pet Sitting", price: "₹399-899/day", rating: 4.9, time: "varies", image: "🐱", description: "Pet care at your home", isProviderService: false, providerImages: [] },
    { id: 66, category: "pet", name: "Dog Walking", price: "₹199-499", rating: 4.7, time: "1 hr", image: "🐕‍🦺", description: "Daily dog walking service", isProviderService: false, providerImages: [] },

    // Security Services
    { id: 67, category: "security", name: "Security Guard", price: "₹999-2499/day", rating: 4.8, time: "8-12 hrs", image: "👮", description: "Professional security services", isProviderService: false, providerImages: [] },
    { id: 68, category: "security", name: "CCTV Installation", price: "₹2999-9999", rating: 4.7, time: "3-5 hrs", image: "📹", description: "Security camera setup", isProviderService: false, providerImages: [] },

    // Art & Design
    { id: 69, category: "art", name: "Wall Art Painting", price: "₹1999-7999", rating: 4.9, time: "4-8 hrs", image: "🎨", description: "Custom wall murals and art", isProviderService: false, providerImages: [] },
    { id: 70, category: "art", name: "Graphic Design", price: "₹999-4999", rating: 4.8, time: "varies", image: "🖌️", description: "Logo, poster, banner design", isProviderService: false, providerImages: [] }
  ];

  // Convert provider services to match the format and add them to the services list
  const convertedProviderServices: ServiceItem[] = providerServices.map((service, index) => ({
    id: `provider-${service.id}`,
    category: service.category === 'other' ? 'art' : service.category, // Map 'other' to a valid category
    name: service.title,
    price: service.price,
    rating: 4.5, // Default rating for provider services
    time: service.timeNeeded,
    image: service.images.length > 0 ? service.images[0] : "🔧", // Use first image or default emoji
    description: service.description || "Professional service",
    isProviderService: true,
    providerImages: service.images
  }));

  const allServices: ServiceItem[] = [...staticServices, ...convertedProviderServices];

  const filteredServices = allServices.filter(service => {
    const matchesCategory = selectedCategory === "all" || service.category === selectedCategory;
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (window.innerWidth < 1024 && value.trim()) {
      setIsMobileSearchActive(true);
      setShowFilters(false);
    } else if (window.innerWidth < 1024 && !value.trim()) {
      setIsMobileSearchActive(false);
      setShowFilters(true);
    }
  };

  const handleFilterToggle = () => {
    setShowFilters(!showFilters);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setIsMobileSearchActive(false);
    setShowFilters(true);
  };

  const handleBookService = (service: ServiceItem) => {
    if (!user && !isGuest) {
      // Show auth with "Continue for Now" option
      if (onShowAuth) {
        onShowAuth({ show: true, role: 'customer', fromBooking: true });
      }
    } else {
      // Navigate to service providers page
      navigate('/service-providers', { 
        state: { 
          serviceName: service.name,
          serviceCategory: service.category 
        } 
      });
    }
  };

  const handleContinueAsGuest = (service: ServiceItem) => {
    // Set guest mode
    localStorage.setItem('guestMode', 'true');
    // Navigate to service providers
    navigate('/service-providers', { 
      state: { 
        serviceName: service.name,
        serviceCategory: service.category 
      } 
    });
    toast({
      title: "Browsing as Guest",
      description: "You can explore services. Sign up to book appointments.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation onShowAuth={onShowAuth} />
      
      {/* Header */}
      <div className="pt-20 pb-8 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold mb-2">All Services</h1>
              <p className="text-muted-foreground text-base lg:text-lg">Find the perfect service for your needs</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-card shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <Input 
                placeholder="Search services..." 
                className="pl-10 pr-10" 
                value={searchTerm} 
                onChange={(e) => handleSearch(e.target.value)} 
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <Button 
              variant="outline" 
              className="md:w-auto"
              onClick={handleFilterToggle}
            >
              <Filter className="w-4 h-4 mr-2" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          {showFilters && (
            <div className="lg:col-span-1">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">Categories</h3>
                {isMobileSearchActive && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={clearSearch}
                    className="lg:hidden"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Clear
                  </Button>
                )}
              </div>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center text-sm ${
                      selectedCategory === category.id 
                        ? 'bg-primary text-primary-foreground' 
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    {category.icon && <category.icon className="w-4 h-4 mr-3" />}
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Services Grid */}
          <div className={`${showFilters ? 'lg:col-span-3' : 'lg:col-span-4'} ${!showFilters ? 'col-span-full' : ''}`}>
            {/* Search Results Header for Mobile */}
            {isMobileSearchActive && searchTerm && (
              <div className="mb-6 lg:hidden">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 dark:bg-blue-900/20 dark:border-blue-800">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">Search Results</h3>
                  <p className="text-blue-700 dark:text-blue-200 text-sm">
                    Found {filteredServices.length} services for "{searchTerm}"
                  </p>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {searchTerm ? `Search Results` : selectedCategory === "all" ? "All Services" : categories.find(c => c.id === selectedCategory)?.name}
              </h2>
              <span className="text-muted-foreground">{filteredServices.length} services found</span>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredServices.map(service => (
                <Card key={service.id} className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-md">
                  <CardContent className="p-6">
                    <div className="mb-4">
                      {service.isProviderService && service.providerImages && service.providerImages.length > 0 ? (
                        <img
                          src={service.providerImages[0]}
                          alt={service.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="text-4xl">{service.image}</div>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                      {service.name}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {service.description}
                    </p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-semibold text-primary">{service.price}</span>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                          <span className="text-muted-foreground">{service.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="w-4 h-4 mr-1" />
                        {service.time}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Button 
                        onClick={() => handleBookService(service)}
                        className="w-full bg-primary hover:bg-primary/90 group-hover:scale-105 transition-transform"
                      >
                        Find Providers
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                      
                      {!user && !isGuest && (
                        <Button 
                          onClick={() => handleContinueAsGuest(service)}
                          variant="outline"
                          className="w-full text-sm"
                        >
                          Continue for Now
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredServices.length === 0 && (
              <div className="text-center py-12">
                <div className="text-muted-foreground text-lg mb-2">No services found</div>
                <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
                {searchTerm && (
                  <Button 
                    variant="outline" 
                    onClick={clearSearch}
                    className="mt-4"
                  >
                    Clear Search
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Services;
