
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, FileText, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";

const ProviderRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    services: '',
    experience: '',
    description: '',
    idProofType: '',
    idProofNumber: '',
    idProofFile: null as File | null,
    validDocument: null as File | null
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field: string, file: File | null) => {
    setFormData(prev => ({ ...prev, [field]: file }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Provider registration submitted:', formData);
    
    // Store provider data in localStorage for demo purposes
    localStorage.setItem('providerData', JSON.stringify(formData));
    
    // Redirect to provider dashboard instead of showing alert
    navigate('/provider-dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="pt-16 sm:pt-20 pb-8 sm:pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 sm:mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/become-provider')}
              className="mb-4 w-full sm:w-auto"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Become Provider
            </Button>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Provider Registration
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Join our platform and start earning by offering your services
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Registration Form</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <Label htmlFor="fullName" className="text-sm sm:text-base">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-sm sm:text-base">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-sm sm:text-base">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="experience" className="text-sm sm:text-base">Years of Experience *</Label>
                    <Select onValueChange={(value) => handleInputChange('experience', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select experience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-1">0-1 years</SelectItem>
                        <SelectItem value="1-3">1-3 years</SelectItem>
                        <SelectItem value="3-5">3-5 years</SelectItem>
                        <SelectItem value="5-10">5-10 years</SelectItem>
                        <SelectItem value="10+">10+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Address Information */}
                <div className="space-y-4">
                  <h3 className="text-base sm:text-lg font-semibold">Address Information</h3>
                  <div>
                    <Label htmlFor="address" className="text-sm sm:text-base">Address *</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city" className="text-sm sm:text-base">City *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state" className="text-sm sm:text-base">State *</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="pincode" className="text-sm sm:text-base">Pincode *</Label>
                      <Input
                        id="pincode"
                        value={formData.pincode}
                        onChange={(e) => handleInputChange('pincode', e.target.value)}
                        required
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Service Information */}
                <div className="space-y-4">
                  <h3 className="text-base sm:text-lg font-semibold">Service Information</h3>
                  <div>
                    <Label htmlFor="services" className="text-sm sm:text-base">Services Offered *</Label>
                    <Textarea
                      id="services"
                      placeholder="List the services you can provide (e.g., Plumbing, Electrical work, etc.)"
                      value={formData.services}
                      onChange={(e) => handleInputChange('services', e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description" className="text-sm sm:text-base">Service Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your expertise and what makes you unique"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* ID Proof Section */}
                <div className="space-y-4">
                  <h3 className="text-base sm:text-lg font-semibold">Identity Verification</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="idProofType" className="text-sm sm:text-base">ID Proof Type *</Label>
                      <Select onValueChange={(value) => handleInputChange('idProofType', value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select ID type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="aadhar">Aadhar Card</SelectItem>
                          <SelectItem value="pan">PAN Card</SelectItem>
                          <SelectItem value="passport">Passport</SelectItem>
                          <SelectItem value="driving-license">Driving License</SelectItem>
                          <SelectItem value="voter-id">Voter ID</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="idProofNumber" className="text-sm sm:text-base">ID Proof Number *</Label>
                      <Input
                        id="idProofNumber"
                        value={formData.idProofNumber}
                        onChange={(e) => handleInputChange('idProofNumber', e.target.value)}
                        required
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm sm:text-base">Upload ID Proof *</Label>
                      <div className="mt-2">
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => handleFileChange('idProofFile', e.target.files?.[0] || null)}
                          className="hidden"
                          id="idProofFile"
                          required
                        />
                        <label
                          htmlFor="idProofFile"
                          className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#00B896] transition-colors"
                        >
                          <div className="text-center">
                            <Upload className="w-6 sm:w-8 h-6 sm:h-8 mx-auto text-gray-400 mb-2" />
                            <p className="text-xs sm:text-sm text-gray-600">
                              {formData.idProofFile ? formData.idProofFile.name : 'Click to upload ID proof'}
                            </p>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm sm:text-base">Upload Valid Document/Certificate</Label>
                      <div className="mt-2">
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => handleFileChange('validDocument', e.target.files?.[0] || null)}
                          className="hidden"
                          id="validDocument"
                        />
                        <label
                          htmlFor="validDocument"
                          className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#00B896] transition-colors"
                        >
                          <div className="text-center">
                            <FileText className="w-6 sm:w-8 h-6 sm:h-8 mx-auto text-gray-400 mb-2" />
                            <p className="text-xs sm:text-sm text-gray-600">
                              {formData.validDocument ? formData.validDocument.name : 'Click to upload certificate (optional)'}
                            </p>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 pt-6">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate('/become-provider')}
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    className="bg-[#00B896] hover:bg-[#00A085] text-white w-full sm:w-auto"
                  >
                    Submit Registration
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProviderRegistration;
