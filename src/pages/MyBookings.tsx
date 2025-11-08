import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock, IndianRupee, ArrowRight, Trash2 } from "lucide-react";
import { Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { bookingService, Booking } from "@/services/bookingService";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const MyBookings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [otpTimers, setOtpTimers] = useState<{[key: string]: number}>({});

  const handleDeleteBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to delete this booking? This action cannot be undone.')) {
      return;
    }

    try {
      await bookingService.deleteBooking(bookingId);
      setBookings(prev => prev.filter(booking => booking.id !== bookingId));
      toast({
        title: "Booking Deleted",
        description: "Booking has been deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting booking:', error);
      toast({
        title: "Error",
        description: "Failed to delete booking",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchBookings();
  }, [user, navigate]);

  // Poll for OTP updates every 10 seconds for bookings that might have OTP
  useEffect(() => {
    const interval = setInterval(() => {
      const hasActiveBookings = bookings.some(booking => 
        booking.status === 'confirmed' && !booking.completion_otp
      );
      
      if (hasActiveBookings) {
        fetchBookings();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [bookings]);

  // Timer countdown for OTP expiry
  useEffect(() => {
    const intervals: {[key: string]: NodeJS.Timeout} = {};
    
    bookings.forEach(booking => {
      if (booking.completion_otp && booking.completion_otp_expires_at) {
        const expiryTime = new Date(booking.completion_otp_expires_at).getTime();
        const now = Date.now();
        const timeLeft = Math.max(0, Math.floor((expiryTime - now) / 1000));
        
        if (timeLeft > 0) {
          setOtpTimers(prev => ({ ...prev, [booking.id]: timeLeft }));
          
          intervals[booking.id] = setInterval(() => {
            setOtpTimers(prev => {
              const newTime = prev[booking.id] - 1;
              if (newTime <= 0) {
                // OTP expired, refresh bookings to clear it
                fetchBookings();
                return { ...prev, [booking.id]: 0 };
              }
              return { ...prev, [booking.id]: newTime };
            });
          }, 1000);
        }
      }
    });

    return () => {
      Object.values(intervals).forEach(interval => clearInterval(interval));
    };
  }, [bookings]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const bookingsData = await bookingService.getMyBookings();
      setBookings(bookingsData || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({
        title: "Error",
        description: "Failed to load bookings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-foreground">Loading your bookings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Bookings</h1>
          <p className="text-muted-foreground">Track all your service bookings in one place</p>
        </div>

        {bookings.length === 0 ? (
          <Card className="max-w-2xl mx-auto text-center">
            <CardContent className="p-12">
              <div className="text-6xl mb-6">📅</div>
              <h3 className="text-2xl font-semibold text-foreground mb-4">No bookings right now</h3>
              <p className="text-muted-foreground mb-8 text-lg">
                You can book services from our wide range of trusted providers
              </p>
              <Button 
                onClick={() => navigate('/services')}
                className="px-8 py-3 text-lg"
              >
                Book a Service
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <Card key={booking.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <CardTitle className="text-xl">
                        {booking.provider_service?.master_service?.name || 
                         booking.provider_service?.custom_service_name || 
                         'Service Booking'}
                      </CardTitle>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1).replace('_', ' ')}
                      </Badge>
                    </div>
                     <div className="flex items-center space-x-2">
                       <div className="text-right">
                         <div className="text-sm text-gray-500">Booking ID</div>
                         <div className="text-sm font-mono">{booking.id.slice(0, 8)}</div>
                       </div>
                       {(booking.status === 'cancelled' || booking.status === 'completed') && (
                         <Button
                           size="sm"
                           variant="outline"
                           onClick={() => handleDeleteBooking(booking.id)}
                           className="text-red-600 hover:text-red-700 hover:bg-red-50"
                         >
                           <Trash2 className="w-4 h-4" />
                         </Button>
                       )}
                     </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                   {/* Provider Info */}
                  <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                    <div>
                      <div className="font-medium text-foreground">
                        {booking.provider_profile?.full_name || 'Service Provider'}
                      </div>
                      {booking.provider_profile?.location && (
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <MapPin className="w-4 h-4 mr-1" />
                          {booking.provider_profile.location}
                        </div>
                      )}
                    </div>
                    {booking.total_amount && (
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Total Amount</div>
                        <div className="text-xl font-bold text-primary flex items-center">
                          <IndianRupee className="w-5 h-5" />
                          {booking.total_amount}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Booking Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {booking.scheduled_date && (
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-foreground">
                          <span className="font-medium">Date:</span> {formatDate(booking.scheduled_date)}
                        </span>
                      </div>
                    )}
                    
                    {booking.scheduled_time && (
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-foreground">
                          <span className="font-medium">Time:</span> {booking.scheduled_time}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Address */}
                  {booking.address && (
                    <div className="p-3 bg-accent/10 rounded-lg">
                      <div className="text-sm font-medium text-foreground mb-1">Service Address</div>
                      <div className="text-sm text-muted-foreground">{booking.address}</div>
                    </div>
                  )}

                  {/* Notes */}
                  {booking.notes && (
                    <div className="p-3 bg-secondary rounded-lg">
                      <div className="text-sm font-medium text-foreground mb-1">Notes</div>
                      <div className="text-sm text-muted-foreground">{booking.notes}</div>
                    </div>
                  )}

                   {/* Service Details */}
                   <div className="p-3 bg-primary/10 rounded-lg">
                     <div className="text-sm font-medium text-foreground mb-2">Service Details</div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                        {booking.provider_service?.price_range && (
                          <div>
                            <span className="font-medium">Price Range:</span> {booking.provider_service.price_range?.includes('₹') 
                              ? booking.provider_service.price_range 
                              : `₹${booking.provider_service.price_range}`}
                          </div>
                        )}
                       {booking.payment_method && (
                         <div>
                           <span className="font-medium">Payment:</span> {booking.payment_method.toUpperCase()}
                         </div>
                       )}
                     </div>

                     {/* OTP Display in Service Details */}
                     {booking.completion_otp && otpTimers[booking.id] > 0 && (
                       <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                         <div className="text-sm font-bold text-blue-900 mb-2">
                           Your OTP is: <span className="text-2xl font-black text-blue-700 tracking-widest">{booking.completion_otp}</span>
                         </div>
                         <div className="text-xs text-blue-800 mb-2">
                           Only share this OTP with the provider after service completion
                         </div>
                         <div className="text-xs text-red-600 font-semibold">
                           Expires in: {Math.floor(otpTimers[booking.id] / 60)}:{(otpTimers[booking.id] % 60).toString().padStart(2, '0')}
                         </div>
                       </div>
                     )}
                   </div>

                   {/* OTP Display - Positioned in Service Details */}

                   {/* Service Complete Indicator */}
                   {booking.status === 'completed' && (
                     <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                       <div className="flex items-center justify-center">
                         <div className="text-center">
                            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                              <Check className="w-8 h-8 text-white" />
                            </div>
                           <div className="text-lg font-bold text-green-800">Service Complete</div>
                           <div className="text-sm text-green-600">This service has been successfully completed</div>
                         </div>
                       </div>
                     </div>
                   )}

                   {/* OTP Expired Message */}
                   {booking.completion_otp && otpTimers[booking.id] === 0 && (
                     <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                       <div className="text-sm font-medium text-red-900 mb-1">⏰ OTP Expired</div>
                       <div className="text-xs text-red-700">
                         The service completion OTP has expired. Please ask your service provider to generate a new one.
                       </div>
                     </div>
                   )}
                   
                   {/* Completion Status */}
                   {booking.status === 'completed' && (
                     <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                       <div className="text-sm font-medium text-green-900">✅ Service Completed</div>
                       <div className="text-xs text-green-700">
                         Thank you for using our service! We hope you had a great experience.
                       </div>
                     </div>
                   )}

                    {/* Booking Date */}
                   <div className="text-xs text-muted-foreground text-right">
                     Booked on {formatDate(booking.created_at)}
                   </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MyBookings;