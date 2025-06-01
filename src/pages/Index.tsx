
import { useState } from "react";
import { Search, Star, Users, Shield, Award, ArrowRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import ServicesGrid from "@/components/ServicesGrid";
import AboutSection from "@/components/AboutSection";
import ProviderSection from "@/components/ProviderSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

interface IndexProps {
  onShowAuth?: (authFlow: { show: boolean; role?: 'customer' | 'provider' }) => void;
}

const Index = ({ onShowAuth }: IndexProps) => {
  return (
    <div className="min-h-screen bg-white">
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
