import { CheckCircle, DollarSign, Users, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
const ProviderSection = () => {
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
  return <section id="provider" className="py-2 bg-white mx-">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Become a{" "}
            <span className="bg-gradient-to-r from-[#00F5D4] to-[#00D4AA] bg-clip-text text-transparent">
              Service Provider
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join thousands of professionals earning on their own terms. No commission fees, direct payments, and complete control over your business.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {benefits.map((benefit, index) => <Card key={index} className="text-center border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-[#00F5D4]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-6 h-6 text-[#00F5D4]" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {benefit.description}
                </p>
              </CardContent>
            </Card>)}
        </div>

        {/* Steps */}
        <div className="bg-gray-50 rounded-3xl p-8 md:p-12 mb-12">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-12">
            How to Get Started
          </h3>
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((item, index) => <div key={index} className="text-center">
                <div className="w-16 h-16 bg-[#00F5D4] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {item.step}
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.title}
                </h4>
                <p className="text-gray-600 text-sm">
                  {item.description}
                </p>
              </div>)}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button className="bg-[#00F5D4] hover:bg-[#00D4AA] px-8 py-4 text-lg text-slate-950">
            Start Your Journey Today
          </Button>
          <p className="text-gray-600 mt-4">Questions? WhatsApp us at +91-XXXXX XXXXX</p>
        </div>
      </div>
    </section>;
};
export default ProviderSection;