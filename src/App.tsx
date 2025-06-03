
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Services from "./pages/Services";
import NotFound from "./pages/NotFound";
import AboutUs from "./pages/AboutUs";
import Careers from "./pages/Careers";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Blog from "./pages/Blog";
import Press from "./pages/Press";
import BecomeProvider from "./pages/BecomeProvider";
import ProviderRegistration from "./pages/ProviderRegistration";
import Shop from "./pages/Shop";
import HelpCommunity from "./pages/HelpCommunity";
import AuthConfirm from "./pages/AuthConfirm";
import "./App.css";
import AuthContainer from "./components/auth/AuthContainer";
import { useAuth } from "./contexts/AuthContext";
import { useState, useEffect } from "react";
import { Loader2, Settings } from "lucide-react";

const queryClient = new QueryClient();

function AppContent() {
  const { user, loading } = useAuth();
  const [guestMode, setGuestMode] = useState(false);
  const [authFlow, setAuthFlow] = useState<{ show: boolean; role?: 'customer' | 'provider'; fromBooking?: boolean }>({ show: false });
  const [initialLoading, setInitialLoading] = useState(true);

  // Check for guest mode in localStorage
  useEffect(() => {
    const isGuest = localStorage.getItem('guestMode') === 'true';
    setGuestMode(isGuest);
  }, []);

  // Initial loading animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  console.log('App state - user:', user, 'loading:', loading, 'guestMode:', guestMode);

  // Show initial loading animation
  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#00B896]/5 to-[#00C9A7]/5 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <Settings className="w-16 h-16 text-[#00B896] mx-auto animate-spin" />
            <Loader2 className="w-8 h-8 text-[#00C9A7] absolute top-4 left-1/2 transform -translate-x-1/2 animate-pulse" />
          </div>
          <p className="mt-6 text-gray-700 text-xl font-semibold">Simplifixr</p>
          <p className="mt-2 text-gray-500 text-sm">Your Trusted Service Partner</p>
        </div>
      </div>
    );
  }

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#00B896]/5 to-[#00C9A7]/5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#00B896] mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading Simplifixr...</p>
        </div>
      </div>
    );
  }

  // Show auth flow if explicitly requested OR if not authenticated and not in guest mode
  if (authFlow.show || (!user && !guestMode)) {
    return (
      <div className="min-h-screen bg-background">
        <AuthContainer 
          defaultRole={authFlow.role}
          fromBooking={authFlow.fromBooking}
          onAuthComplete={(role) => {
            console.log('Auth completed with role:', role);
            setAuthFlow({ show: false });
            
            if (role === 'guest') {
              localStorage.setItem('guestMode', 'true');
              setGuestMode(true);
            } else {
              // Clear guest mode if user logs in
              localStorage.removeItem('guestMode');
              setGuestMode(false);
            }
          }}
          onBack={() => {
            if (authFlow.fromBooking) {
              setAuthFlow({ show: false });
            }
          }} 
        />
      </div>
    );
  }

  // Show main app if authenticated or in guest mode
  return (
    <AppRouter onShowAuth={setAuthFlow} />
  );
}

function AppRouter({ onShowAuth }: { onShowAuth: (authFlow: { show: boolean; role?: 'customer' | 'provider'; fromBooking?: boolean }) => void }) {
  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/" element={<Index onShowAuth={onShowAuth} />} />
        <Route path="/services" element={<Services onShowAuth={onShowAuth} />} />
        <Route path="/become-provider" element={<BecomeProvider />} />
        <Route path="/provider-registration" element={<ProviderRegistration />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/help-community" element={<HelpCommunity />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/press" element={<Press />} />
        <Route path="/auth/confirm" element={<AuthConfirm />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <AppContent />
          <Toaster />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
