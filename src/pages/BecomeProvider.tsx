import { CheckCircle, DollarSign, Users, Smartphone, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import AuthModal from "@/components/AuthModal";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

const BecomeProvider = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const benefits = [{
    icon: Users,
    title: "Digital Identity",
    description: "Build your professional profile and showcase your skills"
  }, {
    icon: DollarSign,
    title: "Fair Pricing",
    description: "Set your own rates and get paid directly, no middlemen"
  }, {
    icon: Smartphone,
    title: "Easy Bookings",
    description: "Receive bookings through app, WhatsApp, or missed calls"
  }, {
    icon: CheckCircle,
    title: "Verified Badge",
    description: "Build trust with customers through our verification system"
  }];
  
  const steps = [{
    step: "01",
    title: "Register",
    description: "Sign up with basic details - no tech skills needed"
  }, {
    step: "02",
    title: "Verify",
    description: "Complete simple verification process"
  }, {
    step: "03",
    title: "List Services",
    description: "Add your services and set availability"
  }, {
    step: "04",
    title: "Start Earning",
    description: "Receive bookings and grow your business"
  }];

  const handleRegister = () => {
    if (!user) {
      setShowAuthModal(true);
    } else {
      navigate('/provider-registration');
    }
  };

  const handleAuthSuccess = (role: 'customer' | 'provider') => {
    setShowAuthModal(false);
    navigate('/provider-registration');
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header with Back to Home Button */}
          <div className="flex items-center justify-between mb-8">
            <Button 
              onClick={() => navigate('/')}
              variant="outline" 
              className="border-2 border-[#00B896] text-[#00B896] hover:bg-[#00B896] hover:text-white transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>

          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-6 md:text-4xl">
              Got a Skill or Service to Offer?{" "}
              <span className="bg-gradient-to-r from-[#00C9A7] to-[#00B896] bg-clip-text text-transparent">
                Join Simplifixr
              </span>{" "}
              and Start Earning Today!
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Join thousands of professionals earning on their own terms. No commission fees, 
              direct payments, and complete control over your business.
            </p>
            <Button onClick={handleRegister} size="lg">
              Start Registration
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          {/* Benefits */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-[#00C9A7]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-6 h-6 text-[#00C9A7]" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Steps */}
          <div className="bg-gray-50 rounded-3xl p-8 md:p-12 mb-12">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-12">
              How to Get Started
            </h3>
            <div className="grid md:grid-cols-4 gap-8">
              {steps.map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-[#00C9A7] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    {item.step}
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gray-50 rounded-3xl p-8 md:p-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Start Your Journey?
            </h3>
            <p className="text-gray-600 mb-6">
              Complete our simple registration process and start earning within 24 hours
            </p>
            <Button onClick={handleRegister}>
              Complete Registration
            </Button>
            <p className="text-gray-600 mt-4">Questions? WhatsApp us at +91-XXXXX XXXXX</p>
          </div>
        </div>
      </div>
      
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default BecomeProvider;
