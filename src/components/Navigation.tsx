
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Settings, User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NavigationProps {
  onShowAuth?: (authFlow: {
    show: boolean;
    role?: 'customer' | 'provider';
  }) => void;
}

const Navigation = ({
  onShowAuth
}: NavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    user,
    signOut,
    userProfile
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isGuest = localStorage.getItem('guestMode') === 'true';

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const displayName = userProfile?.full_name || user?.email?.split('@')[0] || 'User';
  const userInitials = getInitials(displayName);

  const handleSignIn = () => {
    navigate('/auth');
  };

  const handleBecomeProvider = () => {
    navigate('/become-provider');
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  const navItems = [{
    name: "Services",
    href: "/services"
  }, {
    name: "About Us",
    href: "/about-us"
  }, {
    name: "Shop",
    href: "/shop"
  }, {
    name: "Help",
    href: "/help-community"
  }];

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate('/', {
        state: {
          scrollTo: sectionId
        }
      });
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };

  return <nav className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50 dark:bg-gray-900/95 dark:border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <button onClick={handleHomeClick} className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-to-br from-[#00B896] to-[#00C9A7] rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-[#00B896] to-[#00C9A7] bg-clip-text text-transparent">
              Simplifixr
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={handleHomeClick} className={`text-gray-600 hover:text-[#00B896] transition-colors duration-200 font-medium dark:text-gray-300 dark:hover:text-[#00B896] ${location.pathname === '/' ? 'text-[#00B896] font-semibold' : ''}`}>
              Home
            </button>
            {navItems.map(item => <Link key={item.name} to={item.href} className={`text-gray-600 hover:text-[#00B896] transition-colors duration-200 font-medium dark:text-gray-300 dark:hover:text-[#00B896] ${location.pathname === item.href ? 'text-[#00B896] font-semibold' : ''}`}>
                {item.name}
              </Link>)}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {displayName}
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="h-8 w-8 cursor-pointer">
                      <AvatarImage src={userProfile?.profile_picture_url} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                   <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                     <DropdownMenuItem onClick={handleProfileClick}>
                       <User className="w-4 h-4 mr-2" />
                       Profile
                     </DropdownMenuItem>
                     {userProfile?.role === 'provider' && (
                       <DropdownMenuItem onClick={() => navigate('/provider-dashboard')}>
                         <Settings className="w-4 h-4 mr-2" />
                         Dashboard
                       </DropdownMenuItem>
                     )}
                     <DropdownMenuItem onClick={handleSettingsClick}>
                       <Settings className="w-4 h-4 mr-2" />
                       Settings
                     </DropdownMenuItem>
                     <DropdownMenuItem onClick={handleSignOut}>
                       <LogOut className="w-4 h-4 mr-2" />
                       Sign Out
                     </DropdownMenuItem>
                   </DropdownMenuContent>
                </DropdownMenu>
              </div> : isGuest ? <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600 dark:text-gray-300">Guest Mode</span>
                <Button onClick={handleSignIn} variant="outline" size="sm">
                  Sign In
                </Button>
                <Button onClick={handleBecomeProvider} className="bg-[#00B896] hover:bg-[#00A085] text-white" size="sm">
                  Become Provider
                </Button>
              </div> : <div className="flex items-center space-x-4">
                <Button onClick={handleSignIn} variant="outline" size="sm">
                  Sign In
                </Button>
                <Button onClick={handleBecomeProvider} className="bg-[#00B896] hover:bg-[#00A085] text-white" size="sm">
                  Become Provider
                </Button>
              </div>}
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="lg" className="p-3">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-white dark:bg-gray-900">
              <nav className="flex flex-col space-y-4 mt-4">
                <button onClick={() => {
                handleHomeClick();
                setIsOpen(false);
              }} className="text-gray-600 hover:text-[#00B896] transition-colors duration-200 font-medium py-2 dark:text-gray-300 text-left">
                  Home
                </button>
                {navItems.map(item => <Link key={item.name} to={item.href} className="text-gray-600 hover:text-[#00B896] transition-colors duration-200 font-medium py-2 dark:text-gray-300" onClick={() => setIsOpen(false)}>
                    {item.name}
                  </Link>)}
                <div className="border-t pt-4 space-y-2 dark:border-gray-700">
                   {user ? <>
                      <div className="flex items-center space-x-3 py-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={userProfile?.profile_picture_url} />
                          <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                            {userInitials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          {displayName}
                        </div>
                      </div>
                      <Button onClick={handleProfileClick} variant="outline" className="w-full justify-start">
                        <User className="w-4 h-4 mr-2" />
                        Profile
                      </Button>
                      {userProfile?.role === 'provider' && (
                        <Button onClick={() => navigate('/provider-dashboard')} variant="outline" className="w-full justify-start">
                          <Settings className="w-4 h-4 mr-2" />
                          Dashboard
                        </Button>
                      )}
                      <Button onClick={handleSettingsClick} variant="outline" className="w-full justify-start">
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </Button>
                      <Button onClick={handleSignOut} variant="outline" className="w-full justify-start">
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </Button>
                    </> : <>
                      <Button onClick={handleSignIn} variant="outline" className="w-full">
                        Sign In
                      </Button>
                      <Button onClick={handleBecomeProvider} className="w-full bg-[#00B896] hover:bg-[#00A085] text-white">
                        Become Provider
                      </Button>
                    </>}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>;
};

export default Navigation;
