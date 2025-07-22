import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { PlusCircle, Settings, Eye, Edit, Trash2, Calendar, DollarSign, Star, ArrowLeft, AlertCircle, BarChart3 } from "lucide-react";
import { ImageCarousel } from "@/components/ui/image-carousel";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import AddServiceModal from "@/components/provider/AddServiceModal";
import VerificationSteps from "@/components/provider/VerificationSteps";
import { useProviderStatus } from "@/hooks/useProviderStatus";

const ProviderDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const providerStatus = useProviderStatus();
  const [services, setServices] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [isAvailable, setIsAvailable] = useState(true);
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [stats, setStats] = useState({
    totalServices: 0,
    activeBookings: 0,
    totalEarnings: 0,
    rating: 4.8
  });

  useEffect(() => {
    if (user) {
      checkUserAccess();
    } else {
      navigate('/auth');
    }
  }, [user, navigate]);

  const checkUserAccess = async () => {
    if (!user) return;
    
    try {
      console.log('Checking user access for:', user.id);
      
      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Profile fetch error:', profileError);
      }

      // Set profile data with safe property access
      const profileData = profile || {
        id: user.id,
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        location: user.user_metadata?.location || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        profile_picture_url: null,
        role: 'provider',
        is_available: true
      };

      setUserProfile(profileData);
      // Safely access is_available with proper persistence
      setIsAvailable((profileData as any).is_available ?? true);

      // Only update role to provider, don't force availability to true
      try {
        const { error: rpcError } = await (supabase as any)
          .rpc('update_profile', {
            user_id: user.id,
            profile_data: {
              role: 'provider'
            }
          });

        if (rpcError) {
          console.log('RPC profile update error:', rpcError);
        }
      } catch (rpcError) {
        console.log('RPC profile update not available:', rpcError);
      }

      await fetchDashboardData();
    } catch (error) {
      console.error('Error checking user access:', error);
      toast({
        title: "Welcome to Your Provider Dashboard!",
        description: "Start by adding your first service to attract customers",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardData = async () => {
    if (!user) return;
    
    try {
      console.log('Fetching dashboard data for provider:', user.id);

      // Fetch provider services using RPC function
      try {
        const { data: servicesData, error: servicesError } = await (supabase as any)
          .rpc('get_my_provider_services', { provider_id: user.id });

        if (servicesError) {
          console.error('Services fetch error:', servicesError);
          setServices([]);
        } else {
          console.log('Fetched services:', servicesData);
          setServices(servicesData || []);
        }
      } catch (servicesError) {
        console.error('Services RPC error:', servicesError);
        setServices([]);
      }

      // Fetch bookings using RPC function
      try {
        const { data: bookingsData, error: bookingsError } = await (supabase as any)
          .rpc('get_user_bookings', { user_id: user.id });

        if (bookingsError) {
          console.error('Bookings fetch error:', bookingsError);
          setBookings([]);
        } else {
          console.log('Fetched bookings:', bookingsData);
          setBookings(bookingsData || []);
        }
      } catch (bookingsError) {
        console.error('Bookings RPC error:', bookingsError);
        setBookings([]);
      }

      // Update stats after fetching data
      setTimeout(() => {
        updateStats();
      }, 100);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setServices([]);
      setBookings([]);
    }
  };

  const updateStats = () => {
    const validServices = services || [];
    const validBookings = bookings || [];
    
    const activeBookings = validBookings.filter((b: any) => 
      b.status && ['pending', 'confirmed', 'in_progress'].includes(b.status)
    ).length;
    
    const totalEarnings = validBookings
      .filter((b: any) => b.status === 'completed' && b.total_amount)
      .reduce((sum: number, b: any) => sum + (parseFloat(b.total_amount.toString()) || 0), 0);

    setStats({
      totalServices: validServices.length,
      activeBookings,
      totalEarnings,
      rating: 4.8
    });
  };

  const handleAvailabilityToggle = async (available: boolean) => {
    if (!user) return;

    try {
      // Use RPC function to update availability
      const { error } = await (supabase as any)
        .rpc('update_profile', {
          user_id: user.id,
          profile_data: {
            is_available: available
          }
        });

      if (error) {
        console.log('RPC update error:', error);
      }

      setIsAvailable(available);
      toast({
        title: "Status Updated",
        description: `You are now ${available ? 'available' : 'unavailable'} for bookings`
      });
    } catch (error) {
      console.error('Error updating availability:', error);
      setIsAvailable(available);
      toast({
        title: "Status Updated", 
        description: `You are now ${available ? 'available' : 'unavailable'} for bookings`
      });
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    try {
      // Use RPC function to delete service
      const { error } = await (supabase as any)
        .rpc('delete_provider_service', { service_id: serviceId });

      if (error) throw error;

      setServices(prev => prev.filter(s => s.id !== serviceId));
      updateStats();
      toast({
        title: "Success",
        description: "Service deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting service:', error);
      toast({
        title: "Error",
        description: "Failed to delete service",
        variant: "destructive"
      });
    }
  };

  const handleServiceAdded = () => {
    fetchDashboardData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-[#00B896] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p>Setting up your provider dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button 
              onClick={() => navigate(-1)} 
              variant="outline" 
              size="sm"
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Provider Dashboard</h1>
              <p className="text-gray-600">
                Welcome {userProfile?.full_name || 'Provider'}! Manage your services and bookings
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Available</span>
              <Switch
                checked={isAvailable}
                onCheckedChange={handleAvailabilityToggle}
              />
            </div>
            <Button onClick={() => navigate('/settings')} variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Services</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalServices}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Bookings</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeBookings}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                  <p className="text-2xl font-bold text-gray-900">₹{stats.totalEarnings}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Star className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Rating</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.rating}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Verification Status (if not verified) */}
        {!providerStatus.isVerified && (
          <div className="mb-8">
            <VerificationSteps currentStep={providerStatus.hasRegistration ? 2 : 1} />
          </div>
        )}

        {/* Services Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">My Services</h2>
            <Button 
              onClick={() => setShowAddServiceModal(true)}
              className="bg-[#00B896] hover:bg-[#00A085]"
              disabled={!providerStatus.isVerified}
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Service
            </Button>
          </div>
          
          {!providerStatus.isVerified && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <span className="text-yellow-800 font-medium">
                  Complete verification to start adding services and receiving bookings.
                </span>
              </div>
            </div>
          )}

          {services.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-6xl mb-4">🛠️</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No services yet</h3>
                <p className="text-gray-500 mb-6">Start by adding your first service to attract customers</p>
                <Button 
                  onClick={() => setShowAddServiceModal(true)}
                  className="bg-[#00B896] hover:bg-[#00A085]"
                >
                  Add Your First Service
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service: any) => (
                <Card key={service.id} className="hover:shadow-lg transition-shadow">
                  {/* Service Images */}
                  {service.images && service.images.length > 0 && (
                    <div className="h-48 overflow-hidden rounded-t-lg">
                      <ImageCarousel 
                        images={service.images} 
                        alt={service.master_service?.name || service.custom_service_name || 'Service'} 
                        className="w-full h-full"
                      />
                    </div>
                  )}
                  
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Badge variant={service.is_available ? "default" : "secondary"}>
                        {service.is_available ? "Available" : "Unavailable"}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">
                      {service.master_service?.name || service.custom_service_name || 'Service'}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    <div className="text-lg font-semibold text-[#00B896]">
                      {service.price_range || 'Price on request'}
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      Duration: {service.estimated_time || 'To be determined'}
                    </div>
                    
                    {service.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {service.description}
                      </p>
                    )}
                    
                    <div className="flex gap-2 pt-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/provider-service-details/${service.id}`, { 
                            state: { service, provider: userProfile } 
                          });
                        }}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          // TODO: Implement edit modal
                          toast({
                            title: "Coming Soon",
                            description: "Edit functionality will be available soon"
                          });
                        }}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteService(service.id);
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Recent Bookings */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Bookings</h2>
          
          {bookings.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-6xl mb-4">📅</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No bookings yet</h3>
                <p className="text-gray-500">Your bookings will appear here once customers start booking your services</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {bookings.slice(0, 5).map((booking: any) => (
                <Card key={booking.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold">
                          {booking.provider_service?.master_service?.name || 
                           booking.provider_service?.custom_service_name || 'Service'}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Customer: {booking.customer_profile?.full_name || 'Unknown'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {booking.scheduled_date ? 
                            new Date(booking.scheduled_date).toLocaleDateString() : 
                            'No date scheduled'
                          }
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">{booking.status || 'pending'}</Badge>
                        {booking.total_amount && (
                          <p className="text-lg font-semibold text-[#00B896] mt-1">
                            ₹{booking.total_amount}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <AddServiceModal
        open={showAddServiceModal}
        onClose={() => setShowAddServiceModal(false)}
        onServiceAdded={handleServiceAdded}
      />
    </div>
  );
};

export default ProviderDashboard;
