import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, MapPin, Star, CreditCard, Wallet, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { bookingService } from "@/services/bookingService";

const BookingPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { provider, service, fromNegotiation } = location.state || {};
  
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [address, setAddress] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const servicePrice = service?.negotiatedPrice || service?.price_range || service?.basePrice || "₹499";
  const cleanPrice = String(servicePrice).replace(/[₹INR,\s]/g, '');
  const numericPrice = parseFloat(cleanPrice) || 499;
  const discountAmount = (numericPrice * discount) / 100;
  const totalAmount = numericPrice - discountAmount;

  const handleApplyPromo = () => {
    if (promoCode.toLowerCase() === 'save10') {
      setDiscount(10);
    } else if (promoCode.toLowerCase() === 'first20') {
      setDiscount(20);
    } else {
      setDiscount(0);
    }
  };

  const handleBooking = async () => {
    const servicePrice = service?.negotiatedPrice || service?.price_range || service?.basePrice || "₹499";
    const cleanPrice = String(servicePrice).replace(/[₹INR,\s]/g, '');
    const numericPrice = parseFloat(cleanPrice) || 499;
    const finalTotalAmount = Math.round(numericPrice + 29 - discountAmount);

    try {
      const bookingId = await bookingService.createBooking({
        provider_id: service?.providerId,
        provider_service_id: service?.id,
        scheduled_date: selectedDate ? new Date(selectedDate).toISOString() : undefined,
        scheduled_time: selectedTime || undefined,
        address: address || 'To be confirmed',
        notes: specialRequests || undefined,
        total_amount: finalTotalAmount,
        payment_method: paymentMethod
      });

      const bookingData = {
        provider,
        service,
        selectedDate,
        selectedTime,
        address,
        specialRequests,
        paymentMethod,
        totalAmount: finalTotalAmount,
        bookingId: bookingId || ('BK' + Date.now()),
      };

      navigate('/booking-success', { state: { bookingData } });
    } catch (e) {
      console.error('Booking failed', e);
      // You can show a toast here if needed
    }
  };

  if (!provider || !service) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-20 pb-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Booking Information Not Found</h1>
            <p className="text-muted-foreground mb-6">
              We couldn't find the booking details. Please select a service from our providers page.
            </p>
            <Button 
              onClick={() => navigate('/service-providers')}
              className="bg-primary hover:bg-primary/90"
            >
              Browse Service Providers
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-20 pb-8 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold mb-2">
                Complete Your Booking
              </h1>
              <p className="text-muted-foreground">
                {service.serviceName} with {provider.name}
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Booking Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service Details */}
            <Card>
              <CardHeader>
                <CardTitle>Service Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{provider.image}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{service.serviceName}</h3>
                    <p className="text-muted-foreground">by {provider.name}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span>{provider.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{provider.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{service.timeRequired}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{servicePrice}</p>
                    {fromNegotiation && (
                      <p className="text-sm text-green-600">Negotiated Price</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Booking Details */}
            <Card>
              <CardHeader>
                <CardTitle>Booking Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Preferred Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <Label htmlFor="time">Preferred Time</Label>
                    <select
                      id="time"
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background"
                    >
                      <option value="">Select Time</option>
                      <option value="09:00">9:00 AM</option>
                      <option value="10:00">10:00 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="14:00">2:00 PM</option>
                      <option value="15:00">3:00 PM</option>
                      <option value="16:00">4:00 PM</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your contact number"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="address">Service Address</Label>
                  <Textarea
                    id="address"
                    placeholder="Enter your complete address where service is required"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="requests">Special Requests (Optional)</Label>
                  <Textarea
                    id="requests"
                    placeholder="Any specific requirements or instructions"
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <RadioGroupItem value="card" id="card" />
                    <CreditCard className="w-5 h-5 text-muted-foreground" />
                    <Label htmlFor="card" className="flex-1">Credit/Debit Card</Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <RadioGroupItem value="upi" id="upi" />
                    <Smartphone className="w-5 h-5 text-muted-foreground" />
                    <Label htmlFor="upi" className="flex-1">UPI Payment</Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <RadioGroupItem value="wallet" id="wallet" />
                    <Wallet className="w-5 h-5 text-muted-foreground" />
                    <Label htmlFor="wallet" className="flex-1">Digital Wallet</Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <RadioGroupItem value="cod" id="cod" />
                    <span className="text-xl">💰</span>
                    <Label htmlFor="cod" className="flex-1">Cash on Service</Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="space-y-6">
            {/* Price Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Price Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Service Charge</span>
                    <span>{servicePrice}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Platform Fee</span>
                    <span>₹29</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({discount}%)</span>
                      <span>-₹{discountAmount}</span>
                    </div>
                  )}
                </div>
                
                <Separator />
                
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total Amount</span>
                  <span>₹{Math.round(totalAmount + 29)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Promo Code */}
            <Card>
              <CardHeader>
                <CardTitle>Promo Code</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                  <Button variant="outline" onClick={handleApplyPromo}>
                    Apply
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground">
                  Try: SAVE10 or FIRST20
                </div>
              </CardContent>
            </Card>

            {/* Book Now */}
            <Card>
              <CardContent className="p-6">
                <Button 
                  onClick={handleBooking}
                  className="w-full bg-primary hover:bg-primary/90"
                  size="lg"
                  disabled={!selectedDate || !selectedTime || !address}
                >
                  Complete Booking - ₹{Math.round(totalAmount + 29)}
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  By booking, you agree to our Terms & Conditions
                </p>
              </CardContent>
            </Card>

            {/* Contact Provider */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full">
                  Contact {provider.name}
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  Customer Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BookingPayment;
