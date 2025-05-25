
import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-[#00F5D4] to-[#00D4AA] bg-clip-text text-transparent">
              Simplifixr
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-gray-700 hover:text-[#00F5D4] transition-colors">Home</a>
            <a href="#services" className="text-gray-700 hover:text-[#00F5D4] transition-colors">Services</a>
            <a href="#about" className="text-gray-700 hover:text-[#00F5D4] transition-colors">About</a>
            <a href="#provider" className="text-gray-700 hover:text-[#00F5D4] transition-colors">Become Provider</a>
            <a href="#contact" className="text-gray-700 hover:text-[#00F5D4] transition-colors">Contact</a>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" className="border-[#00F5D4] text-[#00F5D4] hover:bg-[#00F5D4] hover:text-white">
              <Phone className="w-4 h-4 mr-2" />
              Contact Us
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-[#00F5D4]"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#home" className="block px-3 py-2 text-gray-700 hover:text-[#00F5D4]">Home</a>
              <a href="#services" className="block px-3 py-2 text-gray-700 hover:text-[#00F5D4]">Services</a>
              <a href="#about" className="block px-3 py-2 text-gray-700 hover:text-[#00F5D4]">About</a>
              <a href="#provider" className="block px-3 py-2 text-gray-700 hover:text-[#00F5D4]">Become Provider</a>
              <a href="#contact" className="block px-3 py-2 text-gray-700 hover:text-[#00F5D4]">Contact</a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
