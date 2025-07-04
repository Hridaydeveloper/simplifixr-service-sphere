
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  const services = ["Home Cleaning", "Plumbing", "Electrical", "AC Repair", "Painting", "Carpentry", "Home Tutoring", "Salon at Home"];

  const handleSocialClick = (platform: string) => {
    const urls = {
      linkedin: "https://www.linkedin.com/company/simplifixr-official/",
      instagram: "https://www.instagram.com/fixwithsimplifixr/?utm_source=qr&igsh=M2c4cnAzOXNudWtz#",
      facebook: "#",
      twitter: "#"
    };
    
    const url = urls[platform as keyof typeof urls];
    if (url && url !== "#") {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleCompanyNavigation = (page: string) => {
    navigate(`/${page}`);
    // Scroll to top of page content
    setTimeout(() => {
      window.scrollTo({ 
        top: 0, 
        behavior: 'smooth' 
      });
    }, 100);
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="text-2xl font-bold bg-gradient-to-r from-[#00B896] to-[#00C9A7] bg-clip-text text-transparent">
              Simplifixr
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Connecting communities through trusted local services. Dignity in every job, simplicity in every booking.
            </p>
            <div className="flex space-x-4">
              <button 
                onClick={() => handleSocialClick('facebook')}
                className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#00B896] transition-colors cursor-pointer"
              >
                <Facebook className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleSocialClick('twitter')}
                className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#00B896] transition-colors cursor-pointer"
              >
                <Twitter className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleSocialClick('instagram')}
                className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#00B896] transition-colors cursor-pointer"
              >
                <Instagram className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleSocialClick('linkedin')}
                className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#00B896] transition-colors cursor-pointer"
              >
                <Linkedin className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4">Popular Services</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              {services.map((service, index) => (
                <li key={index} className="hover:text-[#00B896] cursor-pointer transition-colors">
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li 
                onClick={() => handleCompanyNavigation('about-us')}
                className="hover:text-[#00B896] cursor-pointer transition-colors"
              >
                About Us
              </li>
              <li 
                onClick={() => handleCompanyNavigation('careers')}
                className="hover:text-[#00B896] cursor-pointer transition-colors"
              >
                Careers
              </li>
              <li 
                onClick={() => handleCompanyNavigation('press')}
                className="hover:text-[#00B896] cursor-pointer transition-colors"
              >
                Press
              </li>
              <li 
                onClick={() => handleCompanyNavigation('blog')}
                className="hover:text-[#00B896] cursor-pointer transition-colors"
              >
                Blog
              </li>
              <li 
                onClick={() => handleCompanyNavigation('terms-of-service')}
                className="hover:text-[#00B896] cursor-pointer transition-colors"
              >
                Terms of Service
              </li>
              <li 
                onClick={() => handleCompanyNavigation('privacy-policy')}
                className="hover:text-[#00B896] cursor-pointer transition-colors"
              >
                Privacy Policy
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <div className="space-y-2 text-sm text-gray-400">
              <p>🕿 +91-9876543210</p>
              <p>📧 support@simplifixr.com</p>
              <p>📍 Agartala, Tripura</p>
            </div>
            <div className="mt-4">
              <h4 className="font-medium mb-2 text-white">Download App</h4>
              <div className="space-y-2">
                <div className="bg-gray-800 px-3 py-2 rounded text-xs cursor-pointer hover:bg-gray-700 transition-colors">
                  📱 Download for Android
                </div>
                <div className="bg-gray-800 px-3 py-2 rounded text-xs cursor-pointer hover:bg-gray-700 transition-colors">
                  🍎 Download for iOS
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>© 2025 Simplifixr. All rights reserved.</p>
            <p>Made with ❤️ in India</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
