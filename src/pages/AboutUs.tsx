
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button 
            onClick={() => navigate('/')}
            variant="outline" 
            className="mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-4">About Simplifixr</h1>
              <p className="text-xl text-muted-foreground">Connecting communities through trusted local services</p>
            </div>
            
            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Our Mission</h2>
              <p className="text-muted-foreground mb-6">
                At Simplifixr, we believe in simplifying life by connecting people with reliable local service providers. 
                Our platform ensures dignity in every job and simplicity in every booking.
              </p>
              
              <h2 className="text-2xl font-semibold text-foreground mb-4">Our Values</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
                <li>Trust and reliability in every service</li>
                <li>Fair compensation for service providers</li>
                <li>Transparent pricing and processes</li>
                <li>Community-first approach</li>
                <li>Quality assurance and customer satisfaction</li>
              </ul>
              
              <h2 className="text-2xl font-semibold text-foreground mb-4">Our Story</h2>
              <p className="text-muted-foreground">
                Founded with the vision to transform how local services are accessed and delivered, 
                Simplifixr has grown to become a trusted platform serving communities across India. 
                We're proud to support local entrepreneurs while providing customers with reliable, 
                quality services at their fingertips.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutUs;
