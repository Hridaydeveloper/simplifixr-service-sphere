import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock, IndianRupee, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { bookingService, Booking } from "@/services/bookingService";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const MyBookings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchBookings();
  }, [user, navigate]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      // Get bookings with OTP data
      const { data: bookingsData, error } = await supabase
        .from('bookings')
        .select(`
          *,
          provider_service:provider_services(*,
            master_service:master_services(*)
          ),
          customer_profile:profiles!customer_id(*),
          provider_profile:profiles!provider_id(*)
        `)
        .eq('customer_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
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
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-[#00B896] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p>Loading your bookings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-600">Track all your service bookings in one place</p>
        </div>

        {bookings.length === 0 ? (
          <Card className="max-w-2xl mx-auto text-center">
            <CardContent className="p-12">
              <div className="text-6xl mb-6">📅</div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-4">No bookings right now</h3>
              <p className="text-gray-500 mb-8 text-lg">
                You can book services from our wide range of trusted providers
              </p>
              <Button 
                onClick={() => navigate('/services')}
                className="bg-[#00B896] hover:bg-[#00A085] text-white px-8 py-3 text-lg"
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
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Booking ID</div>
                      <div className="text-sm font-mono">{booking.id.slice(0, 8)}</div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Provider Info */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">
                        {booking.provider_profile?.full_name || 'Service Provider'}
                      </div>
                      {booking.provider_profile?.location && (
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <MapPin className="w-4 h-4 mr-1" />
                          {booking.provider_profile.location}
                        </div>
                      )}
                    </div>
                    {booking.total_amount && (
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Total Amount</div>
                        <div className="text-xl font-bold text-[#00B896] flex items-center">
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
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">
                          <span className="font-medium">Date:</span> {formatDate(booking.scheduled_date)}
                        </span>
                      </div>
                    )}
                    
                    {booking.scheduled_time && (
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">
                          <span className="font-medium">Time:</span> {booking.scheduled_time}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Address */}
                  {booking.address && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="text-sm font-medium text-gray-700 mb-1">Service Address</div>
                      <div className="text-sm text-gray-600">{booking.address}</div>
                    </div>
                  )}

                  {/* Notes */}
                  {booking.notes && (
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <div className="text-sm font-medium text-gray-700 mb-1">Notes</div>
                      <div className="text-sm text-gray-600">{booking.notes}</div>
                    </div>
                  )}

                  {/* Service Details */}
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="text-sm font-medium text-gray-700 mb-2">Service Details</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                      {booking.provider_service?.price_range && (
                        <div>
                          <span className="font-medium">Price Range:</span> {booking.provider_service.price_range}
                        </div>
                      )}
                      {booking.payment_method && (
                        <div>
                          <span className="font-medium">Payment:</span> {booking.payment_method.toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>

                   {/* OTP Display */}
                   {booking.completion_otp && (
                     <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                       <div className="text-sm font-medium text-blue-900 mb-1">Service Completion OTP:</div>
                       <div className="text-2xl font-bold text-blue-600 tracking-wider mb-2">{booking.completion_otp}</div>
                       <div className="text-xs text-blue-700">
                         Share this OTP with your service provider to mark the service as completed.
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
                   <div className="text-xs text-gray-500 text-right">
                     Booked on {formatDate(booking.created_at)}
                   </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;