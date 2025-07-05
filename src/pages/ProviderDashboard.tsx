
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { PlusCircle, Settings, Eye, Edit, Trash2, Calendar, DollarSign, Star } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import { serviceService, ProviderService } from "@/services/serviceService";
import { bookingService, Booking } from "@/services/bookingService";
import { profileService } from "@/services/profileService";
import AddServiceModal from "@/components/provider/AddServiceModal";

const ProviderDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { role, loading: roleLoading } = useUserRole();
  const [services, setServices] = useState<ProviderService[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isAvailable, setIsAvailable] = useState(true);
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalServices: 0,
    activeBookings: 0,
    totalEarnings: 0,
    rating: 4.8
  });

  useEffect(() => {
    if (!roleLoading && user) {
      // If user doesn't have provider role, try to update it or redirect
      if (role !== 'provider') {
        // Check if this is a new provider account
        const urlParams = new URLSearchParams(window.location.search);
        const isNewProvider = urlParams.get('new') === 'true';
        
        if (isNewProvider || role === null) {
          // Try to update role to provider
          updateUserToProvider();
        } else {
          toast({
            title: "Access Denied",
            description: "You need to be a provider to access this page",
            variant: "destructive"
          });
          navigate('/become-provider');
          return;
        }
      }
      fetchDashboardData();
    }
  }, [user, role, roleLoading, navigate]);

  const updateUserToProvider = async () => {
    if (!user) return;
    
    try {
      await profileService.updateProfile(user.id, { role: 'provider' });
      // Force a page refresh to update the role
      window.location.reload();
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: "Setup Required",
        description: "Please complete your provider registration",
        variant: "destructive"
      });
      navigate('/become-provider');
    }
  };

  const fetchDashboardData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Fetch data with error handling
      const [servicesData, bookingsData, profileData] = await Promise.allSettled([
        serviceService.getMyProviderServices(user.id),
        bookingService.getMyBookings(),
        profileService.getProfile(user.id)
      ]);

      // Handle services data
      if (servicesData.status === 'fulfilled') {
        setServices(servicesData.value || []);
      } else {
        console.error('Error fetching services:', servicesData.reason);
        setServices([]);
      }

      // Handle bookings data  
      if (bookingsData.status === 'fulfilled') {
        setBookings(bookingsData.value || []);
      } else {
        console.error('Error fetching bookings:', bookingsData.reason);
        setBookings([]);
      }
      
      // Handle profile data
      if (profileData.status === 'fulfilled' && profileData.value) {
        const profile = profileData.value as any;
        setIsAvailable(profile.is_available ?? true);
      }

      // Calculate stats from successfully fetched data
      const validBookings = bookingsData.status === 'fulfilled' ? (bookingsData.value || []) : [];
      const validServices = servicesData.status === 'fulfilled' ? (servicesData.value || []) : [];
      
      const providerBookings = validBookings.filter(booking => booking.provider_id === user.id);
      const activeBookings = providerBookings.filter(b => 
        ['pending', 'confirmed', 'in_progress'].includes(b.status)
      ).length;
      
      const totalEarnings = providerBookings
        .filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + (b.total_amount || 0), 0);

      setStats({
        totalServices: validServices.length,
        activeBookings,
        totalEarnings,
        rating: 4.8 // This would come from reviews in a real app
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Welcome to Your Dashboard!",
        description: "Start by adding your first service to attract customers",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAvailabilityToggle = async (available: boolean) => {
    if (!user) return;

    try {
      await profileService.updateProfile(user.id, { is_available: available });
      setIsAvailable(available);
      toast({
        title: "Status Updated",
        description: `You are now ${available ? 'available' : 'unavailable'} for bookings`
      });
    } catch (error) {
      console.error('Error updating availability:', error);
      toast({
        title: "Error",
        description: "Failed to update availability",
        variant: "destructive"
      });
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    try {
      await serviceService.deleteProviderService(serviceId);
      setServices(prev => prev.filter(s => s.id !== serviceId));
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

  // Show loading screen while checking authentication and role
  if (roleLoading || (loading && role !== 'provider')) {
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
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Provider Dashboard</h1>
            <p className="text-gray-600">Manage your services and bookings</p>
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
                  <Settings className="w-6 h-6 text-blue-600" />
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

        {/* Services Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">My Services</h2>
            <Button 
              onClick={() => setShowAddServiceModal(true)}
              className="bg-[#00B896] hover:bg-[#00A085]"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Service
            </Button>
          </div>

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
              {services.map((service) => (
                <Card key={service.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Badge variant={service.is_available ? "default" : "secondary"}>
                        {service.is_available ? "Available" : "Unavailable"}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">
                      {service.master_service?.name || service.custom_service_name}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    <div className="text-lg font-semibold text-[#00B896]">
                      {service.price_range}
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      Duration: {service.estimated_time}
                    </div>
                    
                    {service.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {service.description}
                      </p>
                    )}
                    
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDeleteService(service.id)}
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
              {bookings.slice(0, 5).map((booking) => (
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
                        <Badge variant="outline">{booking.status}</Badge>
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
