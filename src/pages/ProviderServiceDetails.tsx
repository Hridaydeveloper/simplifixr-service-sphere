
import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Star, MapPin, Clock, Phone, Mail, MessageCircle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

interface ProviderServiceDetailsProps {
  onShowAuth?: (authFlow: { show: boolean; role?: 'customer' | 'provider' }) => void;
}

const ProviderServiceDetails = ({ onShowAuth }: ProviderServiceDetailsProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Get provider data from navigation state or mock data
  const { provider, serviceName } = location.state || {};
  
  // Mock detailed service data
  const serviceDetails = {
    id: provider?.id || 1,
    serviceName: serviceName || "Home Cleaning",
    description: "Professional deep cleaning service for your home. Our experienced team uses eco-friendly products and advanced equipment to ensure your space is spotless and sanitized.",
    features: [
      "Deep cleaning of all rooms",
      "Kitchen and bathroom sanitization", 
      "Floor mopping and vacuuming",
      "Dusting furniture and surfaces",
      "Window cleaning (interior)",
      "Trash removal"
    ],
    timeRequired: "2-4 hours",
    basePrice: "₹499",
    negotiablePrice: true,
    availability: [
      "Monday - Friday: 9:00 AM - 6:00 PM",
      "Saturday: 10:00 AM - 4:00 PM", 
      "Sunday: Closed"
    ],
    aboutService: "Our comprehensive home cleaning service is designed to give you a spotless, healthy living environment. We use only eco-friendly, non-toxic cleaning products that are safe for your family and pets. Our trained professionals follow a detailed checklist to ensure consistent, high-quality results every time."
  };

  const providerInfo = provider || {
    id: 1,
    name: "QuickFix Pro Services",
    rating: 4.9,
    reviews: 150,
    location: "2.5 km away",
    phone: "+91 98765 43210",
    email: "contact@quickfixpro.com",
    experience: "5+ years",
    responseTime: "Within 30 minutes",
    image: "👨‍🔧"
  };

  const handleChatNegotiation = () => {
    navigate('/chat-negotiation', { 
      state: { 
        provider: providerInfo, 
        service: serviceDetails 
      } 
    });
  };

  const handleBookNow = () => {
    navigate('/booking-payment', { 
      state: { 
        provider: providerInfo, 
        service: serviceDetails 
      } 
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation onShowAuth={onShowAuth} />
      
      <div className="pt-20 pb-8 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                {serviceDetails.serviceName}
              </h1>
              <p className="text-muted-foreground text-base lg:text-lg">
                Service provided by {providerInfo.name}
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">{providerInfo.image}</span>
                  Service Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{serviceDetails.description}</p>
                
                <div>
                  <h4 className="font-semibold mb-2">What's Included:</h4>
                  <ul className="space-y-1">
                    {serviceDetails.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid md:grid-cols-2 gap-4 pt-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Time Required</p>
                      <p className="text-sm text-muted-foreground">{serviceDetails.timeRequired}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">💰</span>
                    <div>
                      <p className="font-medium">Starting Price</p>
                      <p className="text-sm text-muted-foreground">
                        {serviceDetails.basePrice} {serviceDetails.negotiablePrice && "(Negotiable)"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* About This Service */}
            <Card>
              <CardHeader>
                <CardTitle>About This Service</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {serviceDetails.aboutService}
                </p>
              </CardContent>
            </Card>

            {/* Availability */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Availability
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {serviceDetails.availability.map((time, index) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      {time}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Provider Card */}
            <Card>
              <CardHeader>
                <CardTitle>Service Provider</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl mb-2">{providerInfo.image}</div>
                  <h3 className="font-semibold text-lg">{providerInfo.name}</h3>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="font-medium">{providerInfo.rating}</span>
                    <span className="text-muted-foreground">({providerInfo.reviews} reviews)</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{providerInfo.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>Response: {providerInfo.responseTime}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">⭐</span>
                    <span>Experience: {providerInfo.experience}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{providerInfo.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{providerInfo.email}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card>
              <CardContent className="p-6 space-y-3">
                <Button 
                  onClick={handleBookNow}
                  className="w-full bg-primary hover:bg-primary/90"
                  size="lg"
                >
                  Book Now - {serviceDetails.basePrice}
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

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Phone className="w-4 h-4 mr-1" />
                    Call
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Mail className="w-4 h-4 mr-1" />
                    Email
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Price Badge */}
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    Starting from {serviceDetails.basePrice}
                  </Badge>
                  {serviceDetails.negotiablePrice && (
                    <p className="text-sm text-muted-foreground mt-2">
                      💬 Price negotiable via chat
                    </p>
                  )}
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
