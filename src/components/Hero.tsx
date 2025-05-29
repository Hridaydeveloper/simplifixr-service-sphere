
import { Search, MapPin, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  const handleBookService = () => {
    navigate('/services');
  };

  return (
    <section id="home" className="pt-16 pb-20 bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[85vh] mx-0 px-0">
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-6">
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#00D4AA]/20 to-[#00F5D4]/20 rounded-full border border-[#00D4AA]/30 backdrop-blur-sm">
                <span className="w-3 h-3 bg-gradient-to-r from-[#00D4AA] to-[#00F5D4] rounded-full mr-3 animate-pulse"></span>
                <span className="text-[#00D4AA] text-sm font-semibold tracking-wide">Services at Your Fingertips</span>
              </div>
              
              <h1 className="text-6xl text-gray-900 leading-[1.1] tracking-tight font-extrabold lg:text-4xl">
                Simplify Your Life,{" "}
                <span className="bg-gradient-to-r from-[#00D4AA] to-[#00F5D4] bg-clip-text text-transparent">
                  One Service
                </span>{" "}
                at a Time
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed max-w-lg font-medium">
                Connect with verified local service providers for all your needs. From cleaning to repairs, education to events - we've got you covered with trust and excellence.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={handleBookService}
                className="bg-gradient-to-r from-[#00D4AA] to-[#00F5D4] hover:from-[#00C49A] hover:to-[#00E5C4] px-10 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-slate-950 mx-[23px]"
              >
                Book a Service
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button variant="outline" className="border-2 border-[#00D4AA] hover:bg-[#00D4AA] px-10 py-4 text-lg font-semibold rounded-xl transition-all duration-300 my-0 text-zinc-950 mx-0">
                Become a Provider
              </Button>
            </div>

            {/* Enhanced Search Bar */}
            <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-gray-200/50 max-w-2xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-4 top-4 w-5 h-5 text-[#00D4AA]" />
                  <Input placeholder="What service do you need?" className="pl-12 py-3 border-gray-200 focus:border-[#00D4AA] focus:ring-[#00D4AA]/20 rounded-lg" />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-4 top-4 w-5 h-5 text-[#00D4AA]" />
                  <Input placeholder="Your location" className="pl-12 py-3 border-gray-200 rounded-xl focus:border-[#00D4AA] focus:ring-[#00D4AA]/20" />
                </div>
                <Button 
                  onClick={handleBookService}
                  className="bg-gradient-to-r from-[#00D4AA] to-[#00F5D4] hover:from-[#00C49A] hover:to-[#00E5C4] py-3 rounded-xl font-semibold text-slate-950"
                >
                  Search
                </Button>
              </div>
            </div>

            {/* Enhanced Trust Indicators */}
            <div className="flex items-center space-x-10 text-sm">
              <div className="flex items-center bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full">
                <div className="w-10 h-10 bg-gradient-to-r from-[#00D4AA] to-[#00F5D4] rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">4.8</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Average Rating</div>
                  <div className="text-gray-600 text-xs">Trusted by thousands</div>
                </div>
              </div>
              <div className="flex items-center bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full">
                <div className="w-10 h-10 bg-gradient-to-r from-[#00D4AA] to-[#00F5D4] rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">1K+</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Verified Providers</div>
                  <div className="text-gray-600 text-xs">Background checked</div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Hero Visual */}
          <div className="relative">
            <div className="relative w-full h-96 lg:h-[600px] bg-gradient-to-br from-[#00D4AA]/30 via-[#00F5D4]/20 to-transparent rounded-3xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00D4AA]/10 to-transparent"></div>
              
              {/* Floating Cards */}
              <div className="absolute top-12 left-8 bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-gray-100">
                <div className="text-sm text-gray-600 mb-1">Choose a service</div>
                <div className="font-bold text-lg text-gray-900">Cleaning • Repairs • More</div>
                <div className="w-12 h-1 bg-gradient-to-r from-[#00D4AA] to-[#00F5D4] rounded-full mt-2"></div>
              </div>
              
              <div className="absolute bottom-12 right-8 bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-gray-100">
                <div className="text-sm text-gray-600 mb-1">Book instantly</div>
                <div className="font-bold text-lg text-[#00D4AA]">Available now</div>
                <div className="flex items-center mt-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  <span className="text-xs text-gray-500">Live tracking</span>
                </div>
              </div>
              
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-gray-200">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#00D4AA] to-[#00F5D4] rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white font-bold text-xl">S</span>
                  </div>
                  <div className="font-bold text-xl text-gray-900">Simplifixr</div>
                  <div className="text-sm text-gray-600">Your trusted partner</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
