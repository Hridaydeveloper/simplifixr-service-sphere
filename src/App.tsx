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
import { Loader2, Settings, Cog } from "lucide-react";

const queryClient = new QueryClient();

function AppContent() {
  const { user, loading } = useAuth();
  const [guestMode, setGuestMode] = useState(false);
  const [authFlow, setAuthFlow] = useState<{ show: boolean; role?: 'customer' | 'provider'; fromBooking?: boolean }>({ show: false });
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasShownPopup, setHasShownPopup] = useState(false);

  // Check for guest mode and popup state
  useEffect(() => {
    const isGuest = localStorage.getItem('guestMode') === 'true';
    const hasSeenPopup = localStorage.getItem('hasSeenLoginPopup') === 'true';
    setGuestMode(isGuest);
    setHasShownPopup(hasSeenPopup);
  }, []);

  // Initial loading animation - always show for 1 second
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  console.log('App state - user:', user, 'loading:', loading, 'guestMode:', guestMode, 'initialLoading:', initialLoading);

  // Show initial loading animation
  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#00B896]/5 to-[#00C9A7]/5 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-6">
            <Settings className="w-20 h-20 text-[#00B896] mx-auto animate-spin" style={{ animationDuration: '3s' }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <Cog className="w-8 h-8 text-[#00C9A7] animate-pulse" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#00B896] to-[#00C9A7] bg-clip-text text-transparent">
              Simplifixr
            </h1>
            <p className="text-gray-600 text-lg">Your Trusted Service Partner</p>
            <div className="flex items-center justify-center space-x-1 mt-4">
              <div className="w-2 h-2 bg-[#00B896] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-[#00B896] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-[#00B896] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state while checking authentication (after initial animation)
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#00B896]/5 to-[#00C9A7]/5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#00B896] mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth flow if explicitly requested from services page
  if (authFlow.show) {
    return (
      <Router>
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
              
              // Mark popup as seen
              localStorage.setItem('hasSeenLoginPopup', 'true');
              setHasShownPopup(true);
            }}
            onBack={() => {
              setAuthFlow({ show: false });
            }} 
          />
        </div>
      </Router>
    );
  }

  // Show main app - authenticated users or guest mode users see the full app
  return (
    <Router>
      <AppRouter onShowAuth={setAuthFlow} hasShownPopup={hasShownPopup} setHasShownPopup={setHasShownPopup} />
    </Router>
  );
}

function AppRouter({ 
  onShowAuth, 
  hasShownPopup, 
  setHasShownPopup 
}: { 
  onShowAuth: (authFlow: { show: boolean; role?: 'customer' | 'provider'; fromBooking?: boolean }) => void;
  hasShownPopup: boolean;
  setHasShownPopup: (value: boolean) => void;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route 
          path="/" 
          element={
            <Index 
              onShowAuth={onShowAuth} 
              hasShownPopup={hasShownPopup}
              setHasShownPopup={setHasShownPopup}
            />
          } 
        />
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
        <AppContent />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
