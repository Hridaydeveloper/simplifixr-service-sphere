import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import ServicesGrid from "@/components/ServicesGrid";
import AboutSection from "@/components/AboutSection";
import ProviderSection from "@/components/ProviderSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <ServicesGrid />
      <AboutSection />
      <ProviderSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
