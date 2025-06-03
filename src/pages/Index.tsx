
import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import ServicesGrid from "@/components/ServicesGrid";
import AboutSection from "@/components/AboutSection";
import ProviderSection from "@/components/ProviderSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import LoginPopup from "@/components/auth/LoginPopup";
import { useAuth } from "@/contexts/AuthContext";

interface IndexProps {
  onShowAuth?: (authFlow: { show: boolean; role?: 'customer' | 'provider' }) => void;
}

const Index = ({ onShowAuth }: IndexProps) => {
  const { user } = useAuth();
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  // Show login popup on first visit if user is not authenticated
  useEffect(() => {
    const hasSeenPopup = localStorage.getItem('hasSeenLoginPopup');
    const isGuest = localStorage.getItem('guestMode') === 'true';
    
    if (!user && !hasSeenPopup && !isGuest) {
      // Show popup after a short delay
      const timer = setTimeout(() => {
        setShowLoginPopup(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [user]);

  const handlePopupClose = () => {
    setShowLoginPopup(false);
    localStorage.setItem('hasSeenLoginPopup', 'true');
  };

  const handleSkip = () => {
    localStorage.setItem('guestMode', 'true');
    localStorage.setItem('hasSeenLoginPopup', 'true');
  };

  const handleAuthComplete = (role: 'customer' | 'provider' | 'guest') => {
    console.log('Auth completed from popup:', role);
    if (role === 'guest') {
      localStorage.setItem('guestMode', 'true');
    } else {
      localStorage.removeItem('guestMode');
    }
    localStorage.setItem('hasSeenLoginPopup', 'true');
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation onShowAuth={onShowAuth} />
      <Hero />
      <ServicesGrid onShowAuth={onShowAuth} />
      <AboutSection />
      <ProviderSection onShowAuth={onShowAuth} />
      <ContactSection />
      <Footer />
      
      <LoginPopup
        isOpen={showLoginPopup}
        onClose={handlePopupClose}
        onSkip={handleSkip}
        onAuthComplete={handleAuthComplete}
      />
    </div>
  );
};

export default Index;
