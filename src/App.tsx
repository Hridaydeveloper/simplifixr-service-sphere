
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
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
import "./App.css";
import AuthContainer from "./components/auth/AuthContainer";
import { useAuth } from "./contexts/AuthContext";
import { useState, useEffect } from "react";

const queryClient = new QueryClient();

function AppContent() {
  const { user, loading } = useAuth();
  const [guestMode, setGuestMode] = useState(false);
  const [authFlow, setAuthFlow] = useState<{ show: boolean; role?: 'customer' | 'provider' }>({ show: false });

  // Check for guest mode in localStorage
  useEffect(() => {
    const isGuest = localStorage.getItem('guestMode') === 'true';
    setGuestMode(isGuest);
  }, []);

  console.log('App state - user:', user, 'loading:', loading, 'guestMode:', guestMode);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#00B896] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth flow if explicitly requested
  if (authFlow.show) {
    return (
      <div className="min-h-screen bg-background">
        <AuthContainer 
          defaultRole={authFlow.role}
          onAuthComplete={(role) => {
            console.log('Auth completed with role:', role);
            setAuthFlow({ show: false });
            
            if (role === 'guest') {
              localStorage.setItem('guestMode', 'true');
              setGuestMode(true);
            }
            // Don't redirect here - let the auth state change handle it
          }} 
        />
      </div>
    );
  }

  // Show auth flow if not authenticated and not in guest mode
  if (!user && !guestMode) {
    return (
      <div className="min-h-screen bg-background">
        <AuthContainer 
          onAuthComplete={(role) => {
            console.log('Auth completed with role:', role);
            if (role === 'guest') {
              localStorage.setItem('guestMode', 'true');
              setGuestMode(true);
            }
            // Don't redirect here - let the auth state change handle it
          }} 
        />
      </div>
    );
  }

  // Show main app if authenticated or in guest mode
  return (
    <Router>
      <AppRouter onShowAuth={setAuthFlow} />
    </Router>
  );
}

function AppRouter({ onShowAuth }: { onShowAuth: (authFlow: { show: boolean; role?: 'customer' | 'provider' }) => void }) {
  const { user } = useAuth();
  
  // Handle redirects after authentication
  useEffect(() => {
    if (user) {
      const userRole = user.user_metadata?.role;
      const currentPath = window.location.pathname;
      
      // Only redirect if we're on the root path to avoid disrupting navigation
      if (currentPath === '/') {
        if (userRole === 'customer') {
          window.location.href = '/services';
        } else if (userRole === 'provider') {
          window.location.href = '/become-provider';
        }
      }
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/" element={<Index onShowAuth={onShowAuth} />} />
        <Route path="/services" element={<Services onShowAuth={onShowAuth} />} />
        <Route path="/become-provider" element={<BecomeProvider />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/press" element={<Press />} />
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
