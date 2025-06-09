
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Settings, User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface NavigationProps {
  onShowAuth?: (authFlow: { show: boolean; role?: 'customer' | 'provider' }) => void;
}

const Navigation = ({ onShowAuth }: NavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const isGuest = localStorage.getItem('guestMode') === 'true';

  const handleSignIn = () => {
    if (onShowAuth) {
      onShowAuth({ show: true });
    }
  };

  const handleBecomeProvider = () => {
    if (onShowAuth) {
      onShowAuth({ show: true, role: 'provider' });
    } else {
      navigate('/become-provider');
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const navItems = [
    { name: "Services", href: "/services" },
    { name: "About Us", href: "/about-us" },
    { name: "Shop", href: "/shop" },
    { name: "Help", href: "/help-community" },
  ];

  return (
    <nav className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#00B896] to-[#00C9A7] rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-[#00B896] to-[#00C9A7] bg-clip-text text-transparent">
              Simplifixr
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-gray-600 hover:text-[#00B896] transition-colors duration-200 font-medium"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Welcome, {user.email?.split('@')[0]}!
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>Account</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleProfileClick}>
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : isGuest ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Guest Mode</span>
                <Button onClick={handleSignIn} variant="outline" size="sm">
                  Sign In
                </Button>
                <Button onClick={handleBecomeProvider} className="bg-[#00B896] hover:bg-[#00A085] text-white" size="sm">
                  Become Provider
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Button onClick={handleSignIn} variant="outline" size="sm">
                  Sign In
                </Button>
                <Button onClick={handleBecomeProvider} className="bg-[#00B896] hover:bg-[#00A085] text-white" size="sm">
                  Become Provider
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col space-y-4 mt-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="text-gray-600 hover:text-[#00B896] transition-colors duration-200 font-medium py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="border-t pt-4 space-y-2">
                  {user ? (
                    <>
                      <div className="text-sm text-gray-600 py-2">
                        Welcome, {user.email?.split('@')[0]}!
                      </div>
                      <Button onClick={handleProfileClick} variant="outline" className="w-full justify-start">
                        <User className="w-4 h-4 mr-2" />
                        Profile
                      </Button>
                      <Button onClick={handleSignOut} variant="outline" className="w-full justify-start">
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button onClick={handleSignIn} variant="outline" className="w-full">
                        Sign In
                      </Button>
                      <Button onClick={handleBecomeProvider} className="w-full bg-[#00B896] hover:bg-[#00A085] text-white">
                        Become Provider
                      </Button>
                    </>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
