import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  CreditCard, 
  Smartphone, 
  Shield,
  Lock,
  CheckCircle
} from "lucide-react";
import Navigation from "@/components/Navigation";
import { toast } from "@/hooks/use-toast";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const order = location.state?.order;
  const [processing, setProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [upiId, setUpiId] = useState('');

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p>Payment information not found. Redirecting to shop...</p>
          </div>
        </div>
      </div>
    );
  }

  const handlePayment = async () => {
    if (order.paymentMethod === 'card') {
      if (!cardNumber || !expiryDate || !cvv || !cardholderName) {
        toast({
          title: "Missing Information",
          description: "Please fill in all card details",
          variant: "destructive"
        });
        return;
      }
    } else if (order.paymentMethod === 'upi') {
      if (!upiId) {
        toast({
          title: "Missing Information",
          description: "Please enter your UPI ID",
          variant: "destructive"
        });
        return;
      }
    }

    setProcessing(true);

    // Simulate payment processing
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast({
        title: "Payment Successful!",
        description: "Your order has been confirmed",
      });

      navigate('/order-success', { 
        state: { 
          order: {
            ...order,
            paymentStatus: 'paid',
            transactionId: `TXN${Math.random().toString(36).substr(2, 9).toUpperCase()}`
          },
          paymentRequired: false 
        }
      });
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Complete Payment</h1>
          
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={order.product.image}
                    alt={order.product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{order.product.name}</h3>
                    <p className="text-sm text-gray-600">{order.product.category}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-[#00B896]">
                      ₹{order.totalAmount.toLocaleString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Payment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {order.paymentMethod === 'card' && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                      <span className="font-medium">Credit/Debit Card</span>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                        />
                      </div>
                      <div>
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input
                          id="expiryDate"
                          value={expiryDate}
                          onChange={(e) => setExpiryDate(e.target.value)}
                          placeholder="MM/YY"
                          maxLength={5}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                          placeholder="123"
                          maxLength={4}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="cardholderName">Cardholder Name</Label>
                        <Input
                          id="cardholderName"
                          value={cardholderName}
                          onChange={(e) => setCardholderName(e.target.value)}
                          placeholder="John Doe"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {order.paymentMethod === 'upi' && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                      <Smartphone className="w-5 h-5 text-green-600" />
                      <span className="font-medium">UPI Payment</span>
                    </div>
                    
                    <div>
                      <Label htmlFor="upiId">UPI ID</Label>
                      <Input
                        id="upiId"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="yourname@paytm"
                      />
                    </div>
                  </div>
                )}

                {/* Security Note */}
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <Shield className="w-5 h-5 text-gray-600" />
                  <span className="text-sm text-gray-600">
                    Your payment information is secure and encrypted
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Payment Button */}
            <Button 
              onClick={handlePayment}
              disabled={processing}
              className="w-full bg-[#00B896] hover:bg-[#00A085] text-white"
              size="lg"
            >
              {processing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing Payment...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Pay ₹{order.totalAmount.toLocaleString()}
                </div>
              )}
            </Button>

            <p className="text-center text-sm text-gray-500">
              By proceeding, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;