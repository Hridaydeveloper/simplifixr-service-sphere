
import { useState, useEffect } from "react";
import { Menu, X, Users, User, MapPin, Camera, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ProfilePictureModal from "./ProfilePictureModal";
import { useAuth } from "@/contexts/AuthContext";
import { profileService } from "@/services/profileService";

interface NavigationProps {
  onShowAuth?: (authFlow: { show: boolean; role?: 'customer' | 'provider' }) => void;
}

const Navigation = ({ onShowAuth }: NavigationProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  // Check if user is a guest
  const isGuest = !user && localStorage.getItem('guestMode') === 'true';

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user?.id) {
        try {
          const profile = await profileService.getProfile(user.id);
          setUserProfile(profile);
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      }
    };

    fetchUserProfile();
  }, [user]);

  // Default user data - use profile data if available, otherwise fallback
  const userData = {
    name: userProfile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || "User",
    location: userProfile?.location || user?.user_metadata?.location || "Location not set",
    profilePicture: userProfile?.profile_picture_url || null,
    email: user?.email || "user@example.com"
  };

  const handleNavClick = (hash: string) => {
    if (location.pathname === '/') {
      const element = document.querySelector(hash) as HTMLElement;
      if (element) {
        const offsetTop = element.offsetTop - 70;
        window.scrollTo({ 
          top: offsetTop, 
          behavior: 'smooth' 
        });
      }
    } else {
      navigate(`/${hash}`);
      setTimeout(() => {
        const element = document.querySelector(hash) as HTMLElement;
        if (element) {
          const offsetTop = element.offsetTop - 70;
          window.scrollTo({ 
            top: offsetTop, 
            behavior: 'smooth' 
          });
        }
      }, 100);
    }
    setIsMenuOpen(false);
  };

  const handlePageNavigation = (path: string) => {
    navigate(path);
    setTimeout(() => {
      window.scrollTo({ 
        top: 0, 
        behavior: 'smooth' 
      });
    }, 100);
  };

  const handleLoginClick = () => {
    if (onShowAuth) {
      onShowAuth({ show: true });
    } else {
      // Clear any existing guest mode
      localStorage.removeItem('guestMode');
      // Trigger auth flow by reloading the page
      window.location.reload();
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      // Clear guest mode on logout
      localStorage.removeItem('guestMode');
      navigate('/');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button 
                onClick={() => handlePageNavigation('/')}
                className="text-2xl font-bold bg-gradient-to-r from-[#00B896] to-[#00C9A7] bg-clip-text text-transparent drop-shadow-sm cursor-pointer"
              >
                Simplifixr
              </button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => handleNavClick('#home')} 
                className="text-gray-700 hover:text-[#00B896] transition-colors font-medium"
              >
                Home
              </button>
              <button 
                onClick={() => handleNavClick('#services')} 
                className="text-gray-700 hover:text-[#00B896] transition-colors font-medium"
              >
                Explore services
              </button>
              <button 
                onClick={() => handleNavClick('#about')} 
                className="text-gray-700 hover:text-[#00B896] transition-colors font-medium"
              >
                Why simplifixr?
              </button>
              <button 
                onClick={() => handleNavClick('#provider')} 
                className="text-gray-700 hover:text-[#00B896] transition-colors font-medium"
              >
                Earn with us
              </button>
              <button 
                onClick={() => handleNavClick('#contact')} 
                className="text-gray-700 hover:text-[#00B896] transition-colors font-medium"
              >
                Help & Support
              </button>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <Button variant="outline" className="border-[#00B896] text-[#00B896] hover:bg-[#00B896] hover:text-white font-semibold">
                <Users className="w-4 h-4 mr-2" />
                Help Community
              </Button>
              
              {/* Profile Dropdown or Login Button */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={userData.profilePicture || ""} alt={userData.name} />
                        <AvatarFallback className="bg-gradient-to-r from-[#00B896] to-[#00C9A7] text-white">
                          {getInitials(userData.name)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64" align="end" forceMount>
                    <div className="flex items-center space-x-2 p-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={userData.profilePicture || ""} alt={userData.name} />
                        <AvatarFallback className="bg-gradient-to-r from-[#00B896] to-[#00C9A7] text-white text-xs">
                          {getInitials(userData.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{userData.name}</p>
                        <p className="text-xs text-muted-foreground">{userData.email}</p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <MapPin className="w-3 h-3 mr-1" />
                          {userData.location}
                        </div>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setIsProfileModalOpen(true)}>
                      <Camera className="w-4 h-4 mr-2" />
                      Edit / Add Profile Picture
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="w-4 h-4 mr-2" />
                      Account Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button 
                  onClick={handleLoginClick}
                  variant="outline" 
                  className="border-[#00B896] text-[#00B896] hover:bg-[#00B896] hover:text-white"
                >
                  <User className="w-4 h-4 mr-2" />
                  Login
                </Button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700 hover:text-[#00B896] transition-colors">
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
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:text-[#00B896] font-medium"
                >
                  Home
                </button>
                <button 
                  onClick={() => handleNavClick('#services')} 
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:text-[#00B896] font-medium"
                >
                  Explore services
                </button>
                <button 
                  onClick={() => handleNavClick('#about')} 
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:text-[#00B896] font-medium"
                >
                  Why simplifixr?
                </button>
                <button 
                  onClick={() => handleNavClick('#provider')} 
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:text-[#00B896] font-medium"
                >
                  Earn with us
                </button>
                <button 
                  onClick={() => handleNavClick('#contact')} 
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:text-[#00B896] font-medium"
                >
                  Help & Support
                </button>
                <div className="px-3 py-2">
                  <Button variant="outline" className="w-full border-[#00B896] text-[#00B896] hover:bg-[#00B896] hover:text-white">
                    <Users className="w-4 h-4 mr-2" />
                    Help Community
                  </Button>
                </div>
                {/* Mobile Profile Section or Login */}
                {user ? (
                  <div className="px-3 py-2 border-t border-gray-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={userData.profilePicture || ""} alt={userData.name} />
                        <AvatarFallback className="bg-gradient-to-r from-[#00B896] to-[#00C9A7] text-white text-xs">
                          {getInitials(userData.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{userData.name}</p>
                        <p className="text-xs text-muted-foreground">{userData.email}</p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <MapPin className="w-3 h-3 mr-1" />
                          {userData.location}
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mb-2"
                      onClick={() => setIsProfileModalOpen(true)}
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Edit Profile Picture
                    </Button>
                    <Button variant="outline" size="sm" className="w-full mb-2">
                      <Settings className="w-4 h-4 mr-2" />
                      Account Settings
                    </Button>
                    <Button variant="outline" size="sm" className="w-full" onClick={handleLogout}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="px-3 py-2 border-t border-gray-200">
                    <Button 
                      onClick={handleLoginClick}
                      variant="outline" 
                      className="w-full border-[#00B896] text-[#00B896] hover:bg-[#00B896] hover:text-white"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Login
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {user && (
        <ProfilePictureModal 
          isOpen={isProfileModalOpen} 
          onClose={() => setIsProfileModalOpen(false)}
        />
      )}
    </>
  );
};

export default Navigation;
