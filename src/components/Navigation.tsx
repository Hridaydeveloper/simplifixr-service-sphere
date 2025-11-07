import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Settings, User, LogOut, LayoutDashboard, Calendar, Moon, Sun } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AuthModal from "@/components/AuthModal";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const {
    user,
    signOut,
    userProfile
  } = useAuth();
  const { theme, toggleTheme } = useTheme();
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
    setShowAuthModal(true);
  };

  const handleAuthSuccess = (role: 'customer' | 'provider') => {
    // Auth context will handle the login state
    setShowAuthModal(false);
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

  return <nav className="bg-background/80 backdrop-blur-xl border-b border-border/50 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
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
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center glow-effect">
              <Settings className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-primary">
              Simplifixr
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={handleHomeClick} className={`text-foreground hover:text-primary transition-all duration-200 font-semibold ${location.pathname === '/' ? 'text-primary' : ''}`}>
              Home
            </button>
            {navItems.map(item => <Link key={item.name} to={item.href} className={`text-foreground hover:text-primary transition-all duration-200 font-semibold ${location.pathname === item.href ? 'text-primary' : ''}`}>
                {item.name}
              </Link>)}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="mr-2 hover:bg-primary/10"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-primary" />
              ) : (
                <Moon className="h-5 w-5 text-primary" />
              )}
            </Button>
            {user ? <div className="flex items-center space-x-4">
                <span className="text-sm text-foreground font-medium">
                  {displayName}
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-primary/20 hover:ring-primary/50 transition-all">
                      <AvatarImage src={userProfile?.profile_picture_url} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                   <DropdownMenuContent align="end" className="bg-card border-border z-50 min-w-[200px]">
                     <DropdownMenuItem onClick={handleProfileClick} className="cursor-pointer hover:bg-primary/10">
                       <User className="w-4 h-4 mr-2" />
                       Profile
                     </DropdownMenuItem>
                     <DropdownMenuItem onClick={() => navigate('/my-bookings')} className="cursor-pointer hover:bg-primary/10">
                       <Calendar className="w-4 h-4 mr-2" />
                       Your Bookings
                     </DropdownMenuItem>
                      {userProfile?.role === 'provider' && (
                        <DropdownMenuItem onClick={() => navigate('/provider-dashboard')} className="cursor-pointer hover:bg-primary/10">
                          <LayoutDashboard className="w-4 h-4 mr-2" />
                          Dashboard
                        </DropdownMenuItem>
                      )}
                     <DropdownMenuItem onClick={handleSettingsClick} className="cursor-pointer hover:bg-primary/10">
                       <Settings className="w-4 h-4 mr-2" />
                       Settings
                     </DropdownMenuItem>
                     <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer hover:bg-primary/10">
                       <LogOut className="w-4 h-4 mr-2" />
                       Sign Out
                     </DropdownMenuItem>
                   </DropdownMenuContent>
                </DropdownMenu>
              </div> : isGuest ? <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground font-medium">Guest Mode</span>
                <Button onClick={handleSignIn} variant="outline" size="sm">
                  Sign In
                </Button>
                <Button onClick={handleBecomeProvider} size="sm">
                  Become Provider
                </Button>
              </div> : <div className="flex items-center space-x-4">
                <Button onClick={handleSignIn} variant="outline" size="sm">
                  Sign In
                </Button>
                <Button onClick={handleBecomeProvider} size="sm">
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
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-card border-border">
              <nav className="flex flex-col space-y-4 mt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTheme}
                  className="w-full justify-start mb-2 hover:bg-primary/10"
                >
                  {theme === 'dark' ? (
                    <>
                      <Sun className="h-4 w-4 mr-2 text-primary" />
                      <span className="text-foreground font-medium">Light Mode</span>
                    </>
                  ) : (
                    <>
                      <Moon className="h-4 w-4 mr-2 text-primary" />
                      <span className="text-foreground font-medium">Dark Mode</span>
                    </>
                  )}
                </Button>
                <button onClick={() => {
                handleHomeClick();
                setIsOpen(false);
              }} className="text-foreground hover:text-primary transition-all duration-200 font-semibold py-2 text-left w-full">
                  Home
                </button>
                {navItems.map(item => <Link key={item.name} to={item.href} className="text-foreground hover:text-primary transition-all duration-200 font-semibold py-2 block" onClick={() => setIsOpen(false)}>
                    {item.name}
                  </Link>)}
                <div className="border-t border-border pt-4 space-y-2">
                   {user ? <>
                      <div className="flex items-center space-x-3 py-2">
                        <Avatar className="h-8 w-8 ring-2 ring-primary/20">
                          <AvatarImage src={userProfile?.profile_picture_url} />
                          <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                            {userInitials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-sm text-foreground font-medium">
                          {displayName}
                        </div>
                      </div>
                      <Button onClick={handleProfileClick} variant="outline" className="w-full justify-start">
                        <User className="w-4 h-4 mr-2" />
                        Profile
                      </Button>
                      <Button onClick={() => navigate('/my-bookings')} variant="outline" className="w-full justify-start">
                        <Calendar className="w-4 h-4 mr-2" />
                        Your Bookings
                      </Button>
                       {userProfile?.role === 'provider' && (
                         <Button onClick={() => navigate('/provider-dashboard')} variant="outline" className="w-full justify-start">
                           <LayoutDashboard className="w-4 h-4 mr-2" />
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
                       <Button onClick={handleBecomeProvider} className="w-full">
                         Become Provider
                       </Button>
                     </>}
                 </div>
               </nav>
             </SheetContent>
           </Sheet>
         </div>
       </div>
       
       <AuthModal
         isOpen={showAuthModal}
         onClose={() => setShowAuthModal(false)}
         onSuccess={handleAuthSuccess}
       />
     </nav>;
};

export default Navigation;
