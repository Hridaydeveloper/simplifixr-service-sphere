
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Send, Phone, Star, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

interface ChatNegotiationProps {
  onShowAuth?: (authFlow: { show: boolean; role?: 'customer' | 'provider' }) => void;
}

interface Message {
  id: number;
  sender: 'user' | 'provider';
  message: string;
  timestamp: Date;
  type?: 'text' | 'price_offer';
  priceOffer?: {
    original: string;
    offered: string;
  };
}

const ChatNegotiation = ({ onShowAuth }: ChatNegotiationProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { provider, service } = location.state || {};
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentOffer, setCurrentOffer] = useState(service?.basePrice || "₹499");

  // Initialize chat with provider greeting
  useEffect(() => {
    const initialMessages: Message[] = [
      {
        id: 1,
        sender: 'provider',
        message: `Hello! I'm ${provider?.name || 'the service provider'}. I see you're interested in ${service?.serviceName || 'our service'}. I'd be happy to discuss the details and pricing with you.`,
        timestamp: new Date(),
      },
      {
        id: 2,
        sender: 'provider',
        message: `The standard price for ${service?.serviceName || 'this service'} is ${service?.basePrice || '₹499'}. However, I'm open to discussing the price based on your specific requirements.`,
        timestamp: new Date(),
        type: 'price_offer',
        priceOffer: {
          original: service?.basePrice || '₹499',
          offered: service?.basePrice || '₹499'
        }
      }
    ];
    setMessages(initialMessages);
  }, [provider, service]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      sender: 'user',
      message: newMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage("");

    // Simulate provider response
    setTimeout(() => {
      const providerResponse: Message = {
        id: messages.length + 2,
        sender: 'provider',
        message: getProviderResponse(newMessage),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, providerResponse]);
    }, 1000);
  };

  const getProviderResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('₹')) {
      return "I understand you'd like to discuss pricing. What budget did you have in mind? I'm flexible and we can work something out.";
    } else if (lowerMessage.includes('time') || lowerMessage.includes('when')) {
      return "I'm available most days of the week. When would be convenient for you? I can adjust my schedule to accommodate your needs.";
    } else if (lowerMessage.includes('discount') || lowerMessage.includes('lower')) {
      return "I appreciate your interest! Let me see what I can offer. For a valued customer like you, I can provide a special rate.";
    } else {
      return "Thank you for your message! I'm here to help make this work for both of us. What specific aspects would you like to discuss?";
    }
  };

  const handlePriceOffer = (newPrice: string) => {
    const offerMessage: Message = {
      id: messages.length + 1,
      sender: 'user',
      message: `I'd like to offer ${newPrice} for this service.`,
      timestamp: new Date(),
      type: 'price_offer',
      priceOffer: {
        original: currentOffer,
        offered: newPrice
      }
    };

    setMessages(prev => [...prev, offerMessage]);
    setCurrentOffer(newPrice);

    // Provider response to price offer
    setTimeout(() => {
      const response: Message = {
        id: messages.length + 2,
        sender: 'provider',
        message: `Thanks for your offer of ${newPrice}. Let me consider this and get back to you shortly.`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, response]);
    }, 1500);
  };

  const handleAcceptDeal = () => {
    navigate('/booking-payment', { 
      state: { 
        provider, 
        service: { ...service, negotiatedPrice: currentOffer },
        fromNegotiation: true
      } 
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  if (!provider || !service) {
    return <div>Provider or service information not found</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-20 pb-8 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold mb-2">
                Chat with {provider.name}
              </h1>
              <p className="text-muted-foreground">
                Negotiate pricing for {service.serviceName}
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Chat Area */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="flex-shrink-0 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{provider.image}</div>
                    <div>
                      <CardTitle className="text-lg">{provider.name}</CardTitle>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span>{provider.rating}</span>
                        <span>•</span>
                        <MapPin className="w-3 h-3" />
                        <span>{provider.location}</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Online
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.sender === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm">{message.message}</p>
                      {message.type === 'price_offer' && message.priceOffer && (
                        <div className="mt-2 p-2 bg-white/10 rounded border">
                          <div className="text-xs opacity-75">Price Offer:</div>
                          <div className="font-semibold">{message.priceOffer.offered}</div>
                        </div>
                      )}
                      <p className="text-xs opacity-75 mt-1">
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </CardContent>

              <div className="flex-shrink-0 border-t p-4">
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} size="sm">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Service Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Service Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-medium">{service.serviceName}</p>
                  <p className="text-sm text-muted-foreground">Time: {service.timeRequired}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Original Price:</span>
                    <span className="line-through text-muted-foreground">{service.basePrice}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Current Offer:</span>
                    <span className="text-primary">{currentOffer}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Price Offers */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Offers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {['₹399', '₹449', '₹350'].map((price) => (
                  <Button
                    key={price}
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => handlePriceOffer(price)}
                  >
                    Offer {price}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <Button 
                  onClick={handleAcceptDeal}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Accept & Book Now
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call Provider
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

export default ChatNegotiation;
