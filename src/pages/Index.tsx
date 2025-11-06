
import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import ServicesGrid from "@/components/ServicesGrid";
import AboutSection from "@/components/AboutSection";
import ProviderSection from "@/components/ProviderSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";

interface IndexProps {
  onShowAuth?: (authFlow: { show: boolean; role?: 'customer' | 'provider' }) => void;
}

const Index = ({ onShowAuth }: IndexProps) => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navigation onShowAuth={onShowAuth} />
      <Hero />
      <ServicesGrid onShowAuth={onShowAuth} />
      <AboutSection />
      <ProviderSection onShowAuth={onShowAuth} />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
