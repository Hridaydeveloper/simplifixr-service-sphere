
import { Search, MapPin, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Hero = () => {
  return (
    <section id="home" className="pt-16 pb-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <div className="inline-flex items-center px-4 py-2 bg-[#00F5D4]/10 rounded-full text-[#00F5D4] text-sm font-medium">
                <span className="w-2 h-2 bg-[#00F5D4] rounded-full mr-2"></span>
                Services at Your Fingertips
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Simplify Your Life,{" "}
                <span className="bg-gradient-to-r from-[#00F5D4] to-[#00D4AA] bg-clip-text text-transparent">
                  One Service
                </span>{" "}
                at a Time
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                Connect with verified local service providers for all your needs. From cleaning to repairs, education to events - we've got you covered.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-[#00F5D4] hover:bg-[#00D4AA] text-white px-8 py-3 text-lg">
                Book a Service
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button variant="outline" className="border-gray-300 px-8 py-3 text-lg">
                Become a Provider
              </Button>
            </div>

            {/* Search Bar */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 max-w-2xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input placeholder="What service do you need?" className="pl-10" />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input placeholder="Your location" className="pl-10" />
                </div>
                <Button className="bg-[#00F5D4] hover:bg-[#00D4AA] text-white">
                  Search
                </Button>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center space-x-8 text-sm text-gray-600">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-[#00F5D4]/10 rounded-full flex items-center justify-center mr-2">
                  <span className="text-[#00F5D4] font-bold">5.0</span>
                </div>
                <span>Average Rating</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-[#00F5D4]/10 rounded-full flex items-center justify-center mr-2">
                  <span className="text-[#00F5D4] font-bold">2K+</span>
                </div>
                <span>Verified Providers</span>
              </div>
            </div>
          </div>

          {/* Hero Image/Animation */}
          <div className="relative">
            <div className="relative w-full h-96 lg:h-[500px] bg-gradient-to-br from-[#00F5D4]/20 to-[#00D4AA]/20 rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00F5D4]/10 to-transparent"></div>
              <div className="absolute top-8 left-8 bg-white p-4 rounded-xl shadow-lg">
                <div className="text-sm text-gray-600">Choose a service</div>
                <div className="font-semibold">Cleaning • Repairs • More</div>
              </div>
              <div className="absolute bottom-8 right-8 bg-white p-4 rounded-xl shadow-lg">
                <div className="text-sm text-gray-600">Book instantly</div>
                <div className="font-semibold text-[#00F5D4]">Available now</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
