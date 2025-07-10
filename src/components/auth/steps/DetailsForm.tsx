import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";

type AuthMethod = 'email' | 'phone';

interface DetailsFormProps {
  authMethod: AuthMethod;
  loading: boolean;
  formData: {
    fullName: string;
    location: string;
  };
  onInputChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const DetailsForm = ({
  authMethod,
  loading,
  formData,
  onInputChange,
  onSubmit
}: DetailsFormProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Complete your profile</h3>
        <p className="text-gray-600 text-sm">
          {authMethod === 'email' ? 'Email verified!' : 'Phone verified!'} Tell us a bit about yourself.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            type="text"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={(e) => onInputChange('fullName', e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            type="text"
            placeholder="City, State"
            value={formData.location}
            onChange={(e) => onInputChange('location', e.target.value)}
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Creating Account...' : 'Complete Registration'}
        </Button>
      </form>
    </div>
  );
};