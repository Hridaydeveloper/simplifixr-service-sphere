
import { useState } from "react";
import { ArrowLeft, MapPin, Eye, EyeOff, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/services/authService";

interface ProviderSignupProps {
  contact: string;
  onBack: () => void;
  onComplete: () => void;
}

const ProviderSignup = ({ contact, onBack, onComplete }: ProviderSignupProps) => {
  const [formData, setFormData] = useState({
    fullName: '',
    location: '',
    password: '',
    idProof: null as File | null
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, idProof: file }));
    }
  };

  const handleAutoDetectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({ ...prev, location: 'Auto-detected location' }));
          toast({
            title: "Location detected",
            description: "Location has been auto-detected",
          });
        },
        (error) => {
          console.log('Location detection failed:', error);
          toast({
            title: "Location detection failed",
            description: "Please enter your location manually",
            variant: "destructive"
          });
        }
      );
    }
  };

  const handleSubmit = async () => {
    if (!formData.fullName || !formData.location || !formData.password) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      await authService.signUp({
        email: contact,
        password: formData.password,
        fullName: formData.fullName,
        location: formData.location
      });

      toast({
        title: "Success",
        description: "Provider account created successfully!",
      });
      onComplete();
    } catch (error: any) {
      console.error('Provider registration error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create account. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
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
          <CardTitle className="text-2xl text-center">Tell us a bit more to list your services</CardTitle>
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
                type="button"
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload ID Proof (Aadhaar or Govt ID) - Optional
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#00B896] transition-colors">
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileUpload}
                className="hidden"
                id="id-upload"
              />
              <label htmlFor="id-upload" className="cursor-pointer">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                {formData.idProof ? (
                  <p className="text-sm text-[#00B896] font-medium">{formData.idProof.name}</p>
                ) : (
                  <p className="text-sm text-gray-600">Upload ID Proof (Optional)</p>
                )}
              </label>
            </div>
          </div>

          <Button 
            onClick={handleSubmit} 
            className="w-full bg-gradient-to-r from-[#00B896] to-[#00C9A7]"
            disabled={!formData.fullName || !formData.location || !formData.password || loading}
          >
            {loading ? "Creating Account..." : "Finish Setup"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProviderSignup;
