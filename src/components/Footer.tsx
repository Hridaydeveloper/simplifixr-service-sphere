
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  const services = ["Home Cleaning", "Plumbing", "Electrical", "AC Repair", "Painting", "Carpentry", "Home Tutoring", "Salon at Home"];

  const handleSocialClick = (platform: string) => {
    const urls = {
      linkedin: "https://www.linkedin.com/company/simplifixr-official/",
      instagram: "https://www.instagram.com/fix_with_simplifixr?igsh=M2c4cnAzOXNudWtz",
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
    <footer className="bg-secondary/30 text-foreground border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <button 
              onClick={() => {
                navigate('/');
                setTimeout(() => {
                  window.scrollTo({ 
                    top: 0, 
                    behavior: 'smooth' 
                  });
                }, 100);
              }}
              className="text-2xl font-bold text-primary hover:opacity-80 transition-opacity cursor-pointer"
            >
              Simplifixr
            </button>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Connecting communities through trusted local services. Dignity in every job, simplicity in every booking.
            </p>
            <div className="flex space-x-4">
              <button 
                onClick={() => handleSocialClick('facebook')}
                className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center hover:bg-primary transition-colors cursor-pointer"
              >
                <Facebook className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleSocialClick('twitter')}
                className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center hover:bg-primary transition-colors cursor-pointer"
              >
                <Twitter className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleSocialClick('instagram')}
                className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center hover:bg-primary transition-colors cursor-pointer"
              >
                <Instagram className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleSocialClick('linkedin')}
                className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center hover:bg-primary transition-colors cursor-pointer"
              >
                <Linkedin className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4">Popular Services</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {services.map((service, index) => (
                <li key={index} className="hover:text-primary cursor-pointer transition-colors">
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li 
                onClick={() => handleCompanyNavigation('about-us')}
                className="hover:text-primary cursor-pointer transition-colors"
              >
                About Us
              </li>
              <li 
                onClick={() => handleCompanyNavigation('careers')}
                className="hover:text-primary cursor-pointer transition-colors"
              >
                Careers
              </li>
              <li 
                onClick={() => handleCompanyNavigation('press')}
                className="hover:text-primary cursor-pointer transition-colors"
              >
                Press
              </li>
              <li 
                onClick={() => handleCompanyNavigation('blog')}
                className="hover:text-primary cursor-pointer transition-colors"
              >
                Blog
              </li>
              <li 
                onClick={() => handleCompanyNavigation('terms-of-service')}
                className="hover:text-primary cursor-pointer transition-colors"
              >
                Terms of Service
              </li>
              <li 
                onClick={() => handleCompanyNavigation('privacy-policy')}
                className="hover:text-primary cursor-pointer transition-colors"
              >
                Privacy Policy
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>🕿 +91-9876543210/9615262753</p>
              <p>📧 simplifixr2025@gmail.com</p>
              <p>📍 Agartala, Tripura</p>
            </div>
            <div className="mt-4">
              <h4 className="font-medium mb-2 text-foreground">Download App</h4>
              <div className="space-y-2">
                <div className="bg-secondary px-3 py-2 rounded text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                  Download for Android
                </div>
                <div className="bg-secondary px-3 py-2 rounded text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                  Download for iOS
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>© 2025 Simplifixr. All rights reserved.</p>
            <p>Developer: Hriday Das</p>
            <p>🕿 +91-9615262753</p>
            <p>📧 dashriday856@gmail.com</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
