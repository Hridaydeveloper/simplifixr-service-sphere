import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  IndianRupee, 
  Check, 
  X,
  AlertCircle
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface BookingDetailsModalProps {
  booking: any;
  isOpen: boolean;
  onClose: () => void;
  onBookingUpdate: () => void;
}

export default function BookingDetailsModal({ 
  booking, 
  isOpen, 
  onClose, 
  onBookingUpdate 
}: BookingDetailsModalProps) {
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [loading, setLoading] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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

  const handleBookingAction = async (action: 'confirmed' | 'cancelled') => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .rpc('update_booking_status', {
          booking_id: booking.id,
          new_status: action
        });

      if (error) throw error;

      toast({
        title: "Booking Updated",
        description: `Booking has been ${action === 'confirmed' ? 'accepted' : 'rejected'}`
      });

      onBookingUpdate();
      onClose();
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast({
        title: "Error",
        description: "Failed to update booking status",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkServiceDone = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('service-completion', {
        body: {
          action: 'generate_otp',
          booking_id: booking.id
        }
      });

      if (error) throw error;

      toast({
        title: "OTP Generated Successfully",
        description: "OTP has been sent to the customer. It will appear in their booking for 60 seconds.",
      });

      onBookingUpdate();
      setShowOtpInput(true);
    } catch (error) {
      console.error('Error generating OTP:', error);
      toast({
        title: "Error",
        description: "Failed to generate OTP",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpInput || otpInput.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('service-completion', {
        body: {
          action: 'verify_otp',
          booking_id: booking.id,
          otp: otpInput
        }
      });

      if (error) throw error;

      toast({
        title: "Service Completed Successfully",
        description: "The service has been marked as completed!",
      });

      setShowOtpInput(false);
      setOtpInput("");
      onBookingUpdate();
      onClose();
    } catch (error) {
      console.error('Error verifying OTP:', error);
      toast({
        title: "Error",
        description: "Invalid OTP or verification failed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!booking) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Booking Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header with Service Name and Status */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {booking.provider_service?.master_service?.name || 
                 booking.provider_service?.custom_service_name || 'Service Booking'}
              </h3>
              <p className="text-sm text-gray-600">Booking #{booking.id.slice(0, 8).toUpperCase()}</p>
            </div>
            <Badge className={getStatusColor(booking.status)}>
              {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1).replace('_', ' ') || 'Pending'}
            </Badge>
          </div>

          {/* Customer Information */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-900">
                      {booking.customer_profile?.full_name || 'Customer'}
                    </div>
                    <div className="text-sm text-gray-600">Customer</div>
                  </div>
                </div>
                {booking.total_amount && (
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600 flex items-center">
                      <IndianRupee className="w-6 h-6" />
                      {booking.total_amount}
                    </div>
                    <div className="text-sm text-gray-500">Total Amount</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Booking Schedule */}
          <Card>
            <CardContent className="p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Schedule & Location</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {booking.scheduled_date && (
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Calendar className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-700">Scheduled Date</div>
                      <div className="text-gray-900">{formatDate(booking.scheduled_date)}</div>
                    </div>
                  </div>
                )}
                
                {booking.scheduled_time && (
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-700">Time</div>
                      <div className="text-gray-900">{booking.scheduled_time}</div>
                    </div>
                  </div>
                )}
              </div>

              {booking.address && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-gray-700">Service Address</div>
                      <div className="text-gray-900">{booking.address}</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Service Details */}
          <Card>
            <CardContent className="p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Service Details</h4>
              <div className="space-y-3">
                {booking.provider_service?.price_range && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price Range:</span>
                    <span className="font-medium">{booking.provider_service.price_range}</span>
                  </div>
                )}
                {booking.payment_method && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-medium">{booking.payment_method.toUpperCase()}</span>
                  </div>
                )}
                {booking.provider_service?.description && (
                  <div>
                    <div className="text-gray-600 mb-2">Description:</div>
                    <div className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                      {booking.provider_service.description}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Customer Notes */}
          {booking.notes && (
            <Card>
              <CardContent className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Customer Notes</h4>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-gray-900">{booking.notes}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <Card>
            <CardContent className="p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Actions</h4>
              
              {/* Pending Status Actions */}
              {booking.status === 'pending' && (
                <div className="flex gap-3">
                  <Button 
                    onClick={() => handleBookingAction('confirmed')}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    disabled={loading}
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Accept Booking
                  </Button>
                  <Button 
                    onClick={() => handleBookingAction('cancelled')}
                    variant="outline"
                    className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                    disabled={loading}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Reject Booking
                  </Button>
                </div>
              )}

              {/* Confirmed Status Actions */}
              {booking.status === 'confirmed' && !booking.completion_otp && (
                <Button
                  onClick={handleMarkServiceDone}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
                  disabled={loading}
                >
                  Mark Service Done
                </Button>
              )}

              {/* OTP Generated - Show input */}
              {booking.status === 'confirmed' && booking.completion_otp && (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Check className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-800">OTP sent successfully!</span>
                    </div>
                    <p className="text-sm text-green-700">
                      The customer has received a 6-digit OTP that will be visible in their booking for 60 seconds.
                      Ask the customer to provide this OTP to complete the service.
                    </p>
                  </div>

                  {showOtpInput && (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <AlertCircle className="w-4 h-4" />
                        <span>Enter the OTP provided by the customer:</span>
                      </div>
                      <div className="flex gap-3">
                        <Input
                          type="text"
                          placeholder="Enter 6-digit OTP"
                          value={otpInput}
                          onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          maxLength={6}
                          className="text-center text-lg tracking-widest font-mono"
                        />
                        <Button
                          onClick={handleVerifyOtp}
                          className="bg-green-600 hover:bg-green-700 px-6"
                          disabled={loading || otpInput.length !== 6}
                        >
                          Verify OTP
                        </Button>
                      </div>
                    </div>
                  )}

                  {!showOtpInput && (
                    <Button
                      onClick={() => setShowOtpInput(true)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      Enter Customer OTP
                    </Button>
                  )}
                </div>
              )}

              {/* Completed Status */}
              {booking.status === 'completed' && (
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Check className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-lg font-bold text-green-800">Service Completed</div>
                      <div className="text-sm text-green-600">Payment has been processed successfully</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Booking Timestamp */}
          <div className="text-xs text-gray-500 text-center py-2 border-t">
            Booking created on {new Date(booking.created_at).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}