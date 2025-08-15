
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import LoadingScreen from "@/components/LoadingScreen";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Services from "./pages/Services";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import ServiceProviders from "./pages/ServiceProviders";
import ProviderDetails from "./pages/ProviderDetails";
import ProviderServiceDetails from "./pages/ProviderServiceDetails";
import ChatNegotiation from "./pages/ChatNegotiation";
import BookingPayment from "./pages/BookingPayment";
import BookingSuccess from "./pages/BookingSuccess";
import AboutUs from "./pages/AboutUs";
import Shop from "./pages/Shop";
import HelpCommunity from "./pages/HelpCommunity";
import BecomeProvider from "./pages/BecomeProvider";
import ProviderRegistration from "./pages/ProviderRegistration";
import ProviderDashboard from "./pages/ProviderDashboard";
import AuthConfirm from "./pages/AuthConfirm";
import NotFound from "./pages/NotFound";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Blog from "./pages/Blog";
import Careers from "./pages/Careers";
import Press from "./pages/Press";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Payment from "./pages/Payment";
import ServiceDetails from "./pages/ServiceDetails";
import MyBookings from "./pages/MyBookings";

const queryClient = new QueryClient();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const loadTimer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(loadTimer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/services/:serviceId" element={<ServiceDetails />} />
                <Route path="/services" element={<Services />} />
                <Route path="/service-providers" element={<ServiceProviders />} />
                <Route path="/provider/:id" element={<ProviderDetails />} />
                <Route path="/provider-service-details/:id" element={<ProviderServiceDetails />} />
                <Route path="/chat-negotiation" element={<ChatNegotiation />} />
                <Route path="/booking-payment" element={<BookingPayment />} />
                <Route path="/booking-success" element={<BookingSuccess />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/my-bookings" element={<MyBookings />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/about-us" element={<AboutUs />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/order-success" element={<OrderSuccess />} />
                <Route path="/help-community" element={<HelpCommunity />} />
                <Route path="/become-provider" element={<BecomeProvider />} />
                <Route path="/provider-registration" element={<ProviderRegistration />} />
                <Route path="/provider-dashboard" element={<ProviderDashboard />} />
                <Route path="/auth/confirm" element={<AuthConfirm />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/press" element={<Press />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
