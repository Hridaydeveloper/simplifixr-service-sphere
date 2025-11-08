
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, FileText, ArrowLeft, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { useProviderStatus } from "@/hooks/useProviderStatus";

const ProviderRegistration = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isProvider, isApproved, isPending } = useProviderStatus();
  const [isLoading, setIsLoading] = useState(false);
  const [existingRegistration, setExistingRegistration] = useState<{ exists: boolean; status: string } | null>(null);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    businessName: '',
    businessAddress: '',
    serviceCategories: '',
    experience: '',
    description: '',
    idProofType: '',
    idProofNumber: '',
    idProofFile: null as File | null,
    validDocument: null as File | null
  });

  // Check for existing registration on component mount
  useEffect(() => {
    if (user && formData.email) {
      checkExistingRegistration();
    }
  }, [user, formData.email]);

  // Auto-fill user data if logged in
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || '',
        fullName: user.user_metadata?.full_name || ''
      }));
    }
  }, [user]);

  const checkExistingRegistration = async () => {
    if (!formData.email && !user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('provider_registrations' as any)
        .select('status, verified')
        .or(`email.eq.${formData.email}${user?.id ? `,user_id.eq.${user.id}` : ''}`)
        .maybeSingle();
      
      if (data && !error) {
        setExistingRegistration({ exists: true, status: (data as any).status || 'pending' });
      } else {
        setExistingRegistration({ exists: false, status: '' });
      }
    } catch (error) {
      console.error('Error checking registration:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field: string, file: File | null) => {
    setFormData(prev => ({ ...prev, [field]: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user already has a registration
    if (existingRegistration?.exists) {
      toast({
        title: "Registration Already Exists",
        description: `You've already submitted a registration. Current status: ${existingRegistration.status}. Please wait for approval.`,
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to submit your registration.",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }

    setIsLoading(true);
    
    try {
      let idProofDocumentUrl = '';
      let businessLicenseUrl = '';

      // Upload ID proof document
      if (formData.idProofFile) {
        const fileExt = formData.idProofFile.name.split('.').pop();
        const fileName = `${user.id}/id-proof-${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, formData.idProofFile);

        if (uploadError) {
          throw new Error(`Failed to upload ID proof: ${uploadError.message}`);
        }

        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName);
        
        idProofDocumentUrl = publicUrl;
      }

      // Upload business license/valid document
      if (formData.validDocument) {
        const fileExt = formData.validDocument.name.split('.').pop();
        const fileName = `${user.id}/business-license-${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, formData.validDocument);

        if (uploadError) {
          throw new Error(`Failed to upload business license: ${uploadError.message}`);
        }

        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName);
        
        businessLicenseUrl = publicUrl;
      }

      const registrationData = {
        user_id: user.id,
        email: formData.email,
        full_name: formData.fullName,
        phone: formData.phone,
        business_name: formData.businessName,
        business_address: formData.businessAddress,
        service_categories: [formData.serviceCategories],
        experience: formData.experience,
        description: formData.description,
        id_proof_type: formData.idProofType,
        id_proof_number: formData.idProofNumber,
        id_proof_document_url: idProofDocumentUrl || null,
        business_license_url: businessLicenseUrl || null
      };

      const { data, error } = await supabase
        .from('provider_registrations' as any)
        .insert([registrationData])
        .select()
        .single();

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast({
            title: "Registration Already Exists",
            description: "You've already submitted a registration. Please wait for approval.",
            variant: "destructive"
          });
        } else {
          throw error;
        }
        setIsLoading(false);
        return;
      }

      // Show custom success animation
      setShowSuccessAnimation(true);
      
      // Hide animation after 2 seconds
      setTimeout(() => {
        setShowSuccessAnimation(false);
      }, 2000);
      
      // Update the existing registration state to show pending status
      setExistingRegistration({ exists: true, status: 'pending' });
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: "An error occurred while submitting your registration. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Success Animation Overlay */}
      {showSuccessAnimation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-2xl p-8 shadow-2xl max-w-sm mx-4 text-center animate-scale-in border border-border">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <CheckCircle className="w-8 h-8 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Registration Successful!</h3>
            <p className="text-muted-foreground">Your registration is now pending review. You'll be notified once approved.</p>
          </div>
        </div>
      )}
      
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
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Provider Registration
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Join our platform and start earning by offering your services
            </p>
          </div>

          {/* Show message for approved providers */}
          {isApproved ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">You're Already a Provider!</h3>
                  <p className="text-muted-foreground">
                    Your provider account has been approved. Access your dashboard to manage your services and bookings.
                  </p>
                  <Button onClick={() => navigate('/provider-dashboard')} className="mt-4">
                    Go to Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Registration Form</CardTitle>
            </CardHeader>
            <CardContent>
              {isPending && (
                <div className="mb-6 p-4 border border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950 rounded-lg">
                  <h4 className="font-semibold text-orange-800 dark:text-orange-400 mb-2">Registration Pending</h4>
                  <p className="text-orange-700 dark:text-orange-300">
                    You've already submitted a registration. It's currently pending review. 
                    Please wait for approval before submitting another registration.
                  </p>
                </div>
              )}
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
                      onChange={(e) => {
                        handleInputChange('email', e.target.value);
                        // Trigger check when email changes
                        setTimeout(() => checkExistingRegistration(), 500);
                      }}
                      required
                      className="mt-1"
                      disabled={!!user?.email}
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

                {/* Business Information */}
                <div className="space-y-4">
                  <h3 className="text-base sm:text-lg font-semibold">Business Information</h3>
                  <div>
                    <Label htmlFor="businessName" className="text-sm sm:text-base">Business Name *</Label>
                    <Input
                      id="businessName"
                      value={formData.businessName}
                      onChange={(e) => handleInputChange('businessName', e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="businessAddress" className="text-sm sm:text-base">Business Address *</Label>
                    <Textarea
                      id="businessAddress"
                      value={formData.businessAddress}
                      onChange={(e) => handleInputChange('businessAddress', e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Service Information */}
                <div className="space-y-4">
                  <h3 className="text-base sm:text-lg font-semibold">Service Information</h3>
                  <div>
                    <Label htmlFor="serviceCategories" className="text-sm sm:text-base">Service Categories *</Label>
                    <Textarea
                      id="serviceCategories"
                      placeholder="List the services you can provide (e.g., Plumbing, Electrical work, etc.)"
                      value={formData.serviceCategories}
                      onChange={(e) => handleInputChange('serviceCategories', e.target.value)}
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
                          className="flex items-center justify-center w-full p-4 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors"
                        >
                          <div className="text-center">
                            <Upload className="w-6 sm:w-8 h-6 sm:h-8 mx-auto text-muted-foreground mb-2" />
                            <p className="text-xs sm:text-sm text-muted-foreground">
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
                          className="flex items-center justify-center w-full p-4 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors"
                        >
                          <div className="text-center">
                            <FileText className="w-6 sm:w-8 h-6 sm:h-8 mx-auto text-muted-foreground mb-2" />
                            <p className="text-xs sm:text-sm text-muted-foreground">
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
                    disabled={isLoading || isPending}
                    className="w-full sm:w-auto disabled:opacity-50"
                  >
                    {isLoading ? 'Submitting...' : 'Submit Registration'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ProviderRegistration;
