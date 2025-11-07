
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, Calendar, Clock, MapPin, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

interface BookingSuccessProps {
  onShowAuth?: (authFlow: { show: boolean; role?: 'customer' | 'provider' }) => void;
}

const BookingSuccess = ({ onShowAuth }: BookingSuccessProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { bookingData } = location.state || {};

  if (!bookingData) {
    return <div>Booking information not found</div>;
  }

  const { provider, service, selectedDate, selectedTime, address, totalAmount, bookingId } = bookingData;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Success Message */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Booking Confirmed!
            </h1>
            <p className="text-lg text-muted-foreground">
              Your service has been successfully booked
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Booking Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Booking Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Booking ID</Label>
                  <p className="font-mono text-lg">{bookingId}</p>
                </div>

                <div>
                  <Label className="text-sm font-medium">Service</Label>
                  <p className="text-lg">{service.serviceName}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Date</Label>
                    <p>{new Date(selectedDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Time</Label>
                    <p>{selectedTime}</p>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Address</Label>
                  <p className="text-sm text-muted-foreground">{address}</p>
                </div>

                <div>
                  <Label className="text-sm font-medium">Total Amount</Label>
                  <p className="text-xl font-bold text-primary">₹{totalAmount}</p>
                </div>

                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Payment Confirmed
                </Badge>
              </CardContent>
            </Card>

            {/* Provider Details */}
            <Card>
              <CardHeader>
                <CardTitle>Service Provider</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{provider.image}</div>
                  <div>
                    <h3 className="font-semibold text-lg">{provider.name}</h3>
                    <p className="text-muted-foreground">{provider.location}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{provider.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{provider.email}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                  <Button variant="outline" className="w-full">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Provider
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Mail className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Next Steps */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>What's Next?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-primary">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Provider Confirmation</h4>
                    <p className="text-sm text-muted-foreground">
                      {provider.name} will confirm your booking within 2 hours
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-primary">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Service Preparation</h4>
                    <p className="text-sm text-muted-foreground">
                      Provider will prepare for your service and may contact you for any clarifications
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-primary">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Service Delivery</h4>
                    <p className="text-sm text-muted-foreground">
                      Provider will arrive at your location on the scheduled date and time
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
            <Button onClick={() => navigate('/')} variant="outline" size="lg">
              Back to Home
            </Button>
            <Button onClick={() => navigate('/my-bookings')} size="lg">
              View My Bookings
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

const Label = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`text-sm font-medium text-muted-foreground mb-1 ${className}`}>
    {children}
  </div>
);

export default BookingSuccess;
