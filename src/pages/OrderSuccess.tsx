import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Package, Truck, MapPin, Calendar, ShoppingBag } from "lucide-react";
import Navigation from "@/components/Navigation";

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const order = location.state?.order;
  const paymentRequired = location.state?.paymentRequired;

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p>Order information not found. Redirecting to shop...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {order.paymentMethod === 'cod' ? 'Order Placed Successfully!' : 'Payment Successful!'}
            </h1>
            <p className="text-gray-600">
              {order.paymentMethod === 'cod' 
                ? 'Your order has been confirmed. You can pay when the product is delivered.'
                : 'Thank you for your purchase. Your order has been confirmed.'
              }
            </p>
          </div>

          {/* Order Details */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Order Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Order ID</span>
                <span className="font-medium">#{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Order Date</span>
                <span className="font-medium">{new Date().toLocaleDateString()}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Payment Method</span>
                <Badge variant={order.paymentMethod === 'cod' ? 'secondary' : 'default'}>
                  {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 
                   order.paymentMethod === 'upi' ? 'UPI Payment' : 'Card Payment'}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Amount</span>
                <span className="font-bold text-lg text-[#00B896]">
                  ₹{order.totalAmount.toLocaleString()}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Product Details */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <img
                  src={order.product.image}
                  alt={order.product.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{order.product.name}</h3>
                  <p className="text-sm text-gray-600">{order.product.description}</p>
                  <div className="flex items-center mt-2">
                    <span className="text-lg font-bold text-[#00B896]">
                      ₹{order.product.price.toLocaleString()}
                    </span>
                    {order.product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through ml-2">
                        ₹{order.product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Information */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Delivery Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">Delivery Address</span>
                </div>
                <p className="text-sm text-gray-600 ml-6">{order.customer.address}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">Expected Delivery</span>
                </div>
                <p className="text-sm text-gray-600 ml-6">
                  {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()} - 
                  {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> You will receive SMS and email updates about your order status.
                  {order.paymentMethod === 'cod' && ' Please keep the exact change ready for delivery.'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="space-y-3">
            <Button 
              onClick={() => navigate('/shop')}
              className="w-full bg-[#00B896] hover:bg-[#00A085] text-white"
              size="lg"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
            
            <Button 
              onClick={() => navigate('/')}
              variant="outline"
              className="w-full"
              size="lg"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;