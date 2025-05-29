
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TermsOfService = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button 
            onClick={() => navigate('/')}
            variant="outline" 
            className="mb-8 border-[#008B73] text-[#008B73] hover:bg-[#008B73] hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
              <p className="text-lg text-gray-600">Last updated: January 2025</p>
            </div>
            
            <div className="prose prose-lg max-w-none space-y-6">
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                <p className="text-gray-600">
                  By accessing and using Simplifixr's services, you accept and agree to be bound by the terms 
                  and provision of this agreement.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Use License</h2>
                <p className="text-gray-600">
                  Permission is granted to temporarily use Simplifixr's services for personal, 
                  non-commercial transitory viewing only.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Service Provider Terms</h2>
                <p className="text-gray-600">
                  Service providers must maintain professional standards, complete background verification, 
                  and provide quality services as described in their profiles.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Customer Responsibilities</h2>
                <p className="text-gray-600">
                  Customers must provide accurate information, treat service providers with respect, 
                  and pay for services as agreed upon booking.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Payment Terms</h2>
                <p className="text-gray-600">
                  All payments are processed securely through our platform. Simplifixr reserves the right 
                  to charge service fees as outlined during the booking process.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Contact Information</h2>
                <p className="text-gray-600">
                  If you have any questions about these Terms of Service, please contact us at 
                  support@simplifixr.com
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TermsOfService;
