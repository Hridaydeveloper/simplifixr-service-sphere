
import { useState } from "react";
import { Menu, X, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (hash: string) => {
    if (location.pathname === '/') {
      // If we're on home page, just scroll to section
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If we're on another page, navigate to home with hash
      navigate(`/${hash}`);
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/')}
              className="text-2xl font-bold bg-gradient-to-r from-[#00D4AA] to-[#00F5D4] bg-clip-text text-transparent drop-shadow-sm cursor-pointer"
            >
              Simplifixr
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => handleNavClick('#home')} 
              className="text-gray-700 hover:text-[#00D4AA] transition-colors font-medium"
            >
              Home
            </button>
            <button 
              onClick={() => handleNavClick('#services')} 
              className="text-gray-700 hover:text-[#00D4AA] transition-colors font-medium"
            >
              Explore services
            </button>
            <button 
              onClick={() => handleNavClick('#about')} 
              className="text-gray-700 hover:text-[#00D4AA] transition-colors font-medium"
            >
              Why simplifixr?
            </button>
            <button 
              onClick={() => handleNavClick('#provider')} 
              className="text-gray-700 hover:text-[#00D4AA] transition-colors font-medium"
            >
              Earn with us
            </button>
            <button 
              onClick={() => handleNavClick('#contact')} 
              className="text-gray-700 hover:text-[#00D4AA] transition-colors font-medium"
            >
              Help & Support
            </button>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" className="border-[#00D4AA] text-[#00D4AA] hover:bg-[#00D4AA] hover:text-white font-semibold">
              <Users className="w-4 h-4 mr-2" />
              Help Community
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700 hover:text-[#00D4AA] transition-colors">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button 
                onClick={() => handleNavClick('#home')} 
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-[#00D4AA] font-medium"
              >
                Home
              </button>
              <button 
                onClick={() => handleNavClick('#services')} 
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-[#00D4AA] font-medium"
              >
                Explore services
              </button>
              <button 
                onClick={() => handleNavClick('#about')} 
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-[#00D4AA] font-medium"
              >
                Why simplifixr?
              </button>
              <button 
                onClick={() => handleNavClick('#provider')} 
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-[#00D4AA] font-medium"
              >
                Earn with us
              </button>
              <button 
                onClick={() => handleNavClick('#contact')} 
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-[#00D4AA] font-medium"
              >
                Help & Support
              </button>
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
