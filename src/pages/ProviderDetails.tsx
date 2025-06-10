
import { useState } from "react";
import { ArrowLeft, Star, MapPin, Clock, Phone, Mail, Calendar, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

interface ProviderDetailsProps {
  onShowAuth?: (authFlow: { show: boolean; role?: 'customer' | 'provider'; fromBooking?: boolean }) => void;
}

const ProviderDetails = ({ onShowAuth }: ProviderDetailsProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { provider, serviceName } = location.state || {};
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const isGuest = !user && localStorage.getItem('guestMode') === 'true';

  const timeSlots = [
    "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
  ];

  const handleBookNow = () => {
    if (!selectedDate || !selectedTime) {
      toast({
        variant: "destructive",
        title: "Please select date and time",
        description: "Choose your preferred appointment slot to continue.",
      });
      return;
    }

    if (isGuest || !user) {
      if (onShowAuth) {
        onShowAuth({ show: true, role: 'customer', fromBooking: true });
      }
    } else {
      navigate('/payment', { 
        state: { 
          provider, 
          serviceName,
          selectedDate,
          selectedTime
        } 
      });
    }
  };

  if (!provider) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Provider not found</h2>
          <Button onClick={() => navigate('/services')}>
            Back to Services
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation onShowAuth={onShowAuth} />
      
      <div className="pt-20 pb-8 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                {provider.name}
              </h1>
              <p className="text-muted-foreground text-base lg:text-lg">
                Professional {serviceName} Service
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
          {/* Provider Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start space-x-4">
                  <div className="text-6xl">{provider.image}</div>
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2">{provider.name}</CardTitle>
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="flex items-center">
                        <Star className="w-5 h-5 text-yellow-400 fill-current mr-1" />
                        <span className="font-medium">{provider.rating}</span>
                        <span className="text-muted-foreground ml-1">({provider.reviews} reviews)</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="w-4 h-4 mr-1" />
                        {provider.location}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {provider.specialties.map((specialty: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-muted-foreground mr-2" />
                    <div>
                      <p className="font-medium">Response Time</p>
                      <p className="text-sm text-muted-foreground">{provider.responseTime}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-muted-foreground mr-2" />
                    <div>
                      <p className="font-medium">Experience</p>
                      <p className="text-sm text-muted-foreground">{provider.experience}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>About This Provider</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Professional service provider with extensive experience in {serviceName.toLowerCase()} services. 
                  Committed to delivering high-quality work with customer satisfaction as our top priority. 
                  All work comes with a satisfaction guarantee and we use only premium materials and equipment.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Services & Pricing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{serviceName}</p>
                      <p className="text-sm text-muted-foreground">Professional service with guarantee</p>
                    </div>
                    <span className="font-bold text-primary">{provider.price}</span>
                  </div>
                  <Separator />
                  <div className="text-sm text-muted-foreground">
                    <p>✓ Free consultation</p>
                    <p>✓ Material included</p>
                    <p>✓ 30-day warranty</p>
                    <p>✓ Satisfaction guarantee</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Schedule Service</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Select Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Select Time</label>
                  <div className="grid grid-cols-2 gap-2">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`px-3 py-2 text-sm border rounded-md transition-colors ${
                          selectedTime === time
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-background border-input hover:bg-muted'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Service Price:</span>
                    <span className="font-medium">{provider.price}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Platform Fee:</span>
                    <span>₹29</span>
                  </div>
                </div>

                <Separator />

                <Button 
                  onClick={handleBookNow}
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={!provider.available}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  {provider.available ? "Proceed to Payment" : "Currently Unavailable"}
                </Button>

                <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-1" />
                    <span>Call Support</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-1" />
                    <span>Email</span>
                  </div>
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

export default ProviderDetails;
