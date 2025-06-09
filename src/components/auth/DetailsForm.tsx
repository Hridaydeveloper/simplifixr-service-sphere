
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";

interface DetailsFormProps {
  formData: {
    fullName: string;
    location: string;
  };
  loading: boolean;
  onInputChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const DetailsForm = ({ formData, loading, onInputChange, onSubmit }: DetailsFormProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-[#00B896]/10 to-[#00C9A7]/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-[#00B896]" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Profile</h2>
        <p className="text-gray-600">Just a few more details to get started</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">Full Name</Label>
          <Input
            id="fullName"
            type="text"
            value={formData.fullName}
            onChange={(e) => onInputChange('fullName', e.target.value)}
            className="mt-1 border-gray-300 focus:border-[#00B896] focus:ring-[#00B896]"
            required
          />
        </div>
        <div>
          <Label htmlFor="location" className="text-sm font-medium text-gray-700">Location</Label>
          <Input
            id="location"
            type="text"
            value={formData.location}
            onChange={(e) => onInputChange('location', e.target.value)}
            placeholder="City, State"
            className="mt-1 border-gray-300 focus:border-[#00B896] focus:ring-[#00B896]"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-[#00B896] to-[#00C9A7] hover:from-[#00A085] hover:to-[#00B896] text-white font-semibold py-3 transition-all duration-300"
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Creating Account...</span>
            </div>
          ) : (
            'Complete Signup'
          )}
        </Button>
      </form>
    </div>
  );
};

export default DetailsForm;
