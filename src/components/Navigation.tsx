
import { useState } from "react";
import { Menu, X, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-[#00D4AA] to-[#00F5D4] p-2 rounded-xl shadow-lg mr-3">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-[#00D4AA] to-[#00F5D4] bg-clip-text text-transparent drop-shadow-sm">
              Simplifixr
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-gray-700 hover:text-[#00D4AA] transition-colors font-medium">Home</a>
            <a href="#services" className="text-gray-700 hover:text-[#00D4AA] transition-colors font-medium">Explore services</a>
            <a href="#about" className="text-gray-700 hover:text-[#00D4AA] transition-colors font-medium">Why simplifixr?</a>
            <a href="#provider" className="text-gray-700 hover:text-[#00D4AA] transition-colors font-medium">Earn with us</a>
            <a href="#contact" className="text-gray-700 hover:text-[#00D4AA] transition-colors font-medium">Help & Support</a>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" className="border-[#00D4AA] text-[#00D4AA] hover:bg-[#00D4AA] hover:text-white font-semibold">
              <Users className="w-4 h-4 mr-2" />
              Help Community
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="text-gray-700 hover:text-[#00D4AA] transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#home" className="block px-3 py-2 text-gray-700 hover:text-[#00D4AA] font-medium">Home</a>
              <a href="#services" className="block px-3 py-2 text-gray-700 hover:text-[#00D4AA] font-medium">Services</a>
              <a href="#about" className="block px-3 py-2 text-gray-700 hover:text-[#00D4AA] font-medium">About</a>
              <a href="#provider" className="block px-3 py-2 text-gray-700 hover:text-[#00D4AA] font-medium">Become Provider</a>
              <a href="#contact" className="block px-3 py-2 text-gray-700 hover:text-[#00D4AA] font-medium">Contact</a>
              <div className="px-3 py-2">
                <Button variant="outline" className="w-full border-[#00D4AA] text-[#00D4AA] hover:bg-[#00D4AA] hover:text-white">
                  <Users className="w-4 h-4 mr-2" />
                  Help Community
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
