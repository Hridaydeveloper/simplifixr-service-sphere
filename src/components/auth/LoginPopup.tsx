import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import ComprehensiveAuth from "./ComprehensiveAuth";

interface LoginPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSkip: () => void;
  onAuthComplete: (role: 'customer' | 'provider' | 'guest') => void;
}

const LoginPopup = ({ isOpen, onClose, onSkip, onAuthComplete }: LoginPopupProps) => {
  const [showAuth, setShowAuth] = useState(false);

  const handleAuthComplete = (role: 'customer' | 'provider' | 'guest') => {
    onAuthComplete(role);
    onClose();
  };

  const handleSkip = () => {
    onSkip();
    onClose();
  };

  if (showAuth) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogOverlay className="bg-black/80 backdrop-blur-sm" />
        <DialogContent className="max-w-md p-0 border-0 bg-transparent shadow-none">
          <div className="relative">
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="absolute -top-12 right-0 text-white hover:bg-white/20 z-50"
            >
              <X className="w-5 h-5" />
            </Button>
            <div className="bg-white rounded-3xl overflow-hidden">
              <ComprehensiveAuth
                onComplete={handleAuthComplete}
                onBack={() => setShowAuth(false)}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="bg-black/80 backdrop-blur-sm" />
      <DialogContent className="max-w-lg p-8 border-0 bg-white rounded-3xl shadow-2xl">
        <div className="text-center space-y-6">
          {/* Header */}
          <div className="space-y-3">
            <div className="w-20 h-20 bg-gradient-to-br from-[#00B896] to-[#00C9A7] rounded-full flex items-center justify-center mx-auto">
              <div className="text-white text-2xl font-bold">S</div>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-[#00B896] to-[#00C9A7] bg-clip-text text-transparent">
              Welcome to Simplifixr!
            </h2>
            <p className="text-gray-600 text-lg">
              Your trusted service marketplace
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4 text-left">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-[#00B896] rounded-full"></div>
              <span className="text-gray-700">Find trusted service providers</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-[#00B896] rounded-full"></div>
              <span className="text-gray-700">Book services instantly</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-[#00B896] rounded-full"></div>
              <span className="text-gray-700">Secure payments & reviews</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-4">
            <Button
              onClick={() => setShowAuth(true)}
              className="w-full bg-gradient-to-r from-[#00B896] to-[#00C9A7] hover:from-[#00A085] hover:to-[#00B896] text-white font-semibold py-4 text-lg rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              Get Started
            </Button>
            
            <Button
              onClick={handleSkip}
              variant="outline"
              className="w-full border-2 border-[#00B896] text-[#00B896] hover:bg-[#00B896] hover:text-white font-semibold py-4 text-lg rounded-xl transition-all duration-300"
            >
              Skip for now
            </Button>
          </div>

          {/* Skip highlight */}
          <div className="relative">
            <div className="absolute -top-2 -right-2 bg-yellow-400 text-xs font-bold px-2 py-1 rounded-full text-black animate-pulse">
              Quick Access!
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginPopup;
