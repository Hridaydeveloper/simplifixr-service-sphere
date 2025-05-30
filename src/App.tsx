import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
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
import { useState } from "react";

const queryClient = new QueryClient();

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'customer' | 'provider' | 'guest' | null>(null);

  const handleAuthComplete = (role: 'customer' | 'provider' | 'guest') => {
    setUserRole(role);
    setIsAuthenticated(true);
  };

  // Show auth flow if not authenticated
  if (!isAuthenticated) {
    return (
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-background">
          <AuthContainer onAuthComplete={handleAuthComplete} />
          <Toaster />
        </div>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/services" element={<Services />} />
            <Route path="/become-provider" element={<BecomeProvider />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/press" element={<Press />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
