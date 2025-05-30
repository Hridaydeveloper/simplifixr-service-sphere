
import { useState } from "react";
import { ArrowLeft, MapPin, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CustomerSignupProps {
  contact: string;
  onBack: () => void;
  onComplete: () => void;
}

const CustomerSignup = ({ contact, onBack, onComplete }: CustomerSignupProps) => {
  const [formData, setFormData] = useState({
    fullName: '',
    location: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAutoDetectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Here you would reverse geocode the coordinates
          setFormData(prev => ({ ...prev, location: 'Auto-detected location' }));
        },
        (error) => {
          console.log('Location detection failed:', error);
        }
      );
    }
  };

  const handleSubmit = () => {
    if (formData.fullName && formData.location && formData.password) {
      console.log('Customer registration:', { ...formData, contact });
      onComplete();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <Button variant="ghost" size="sm" onClick={onBack} className="w-fit p-0">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <CardTitle className="text-2xl text-center">Just a few more details</CardTitle>
          <p className="text-gray-600 text-center">
            Help us personalize your experience:
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <Input 
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <div className="flex gap-2">
              <Input 
                placeholder="Enter your location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="flex-1"
              />
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleAutoDetectLocation}
                className="px-3"
              >
                <MapPin className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <Input 
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <Button 
            onClick={handleSubmit} 
            className="w-full bg-gradient-to-r from-[#00B896] to-[#00C9A7]"
            disabled={!formData.fullName || !formData.location || !formData.password}
          >
            Complete Sign Up
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerSignup;
