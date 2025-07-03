
import { useState, useEffect } from "react";
import { ArrowLeft, Plus, Edit2, Trash2, User, Mail, Phone, MapPin, Calendar, Star, ToggleLeft, ToggleRight, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface Service {
  id: string;
  title: string;
  description: string;
  price: string;
  timeNeeded: string;
  category: string;
  customCategory?: string;
  available: boolean;
  images: string[];
  createdAt: string;
}

interface ProviderData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  services: string;
  experience: string;
  description: string;
  available: boolean;
}

const ProviderDashboard = () => {
  const navigate = useNavigate();
  const [providerData, setProviderData] = useState<ProviderData | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [newService, setNewService] = useState({
    title: '',
    description: '',
    price: '',
    timeNeeded: '',
    category: '',
    customCategory: ''
  });

  useEffect(() => {
    // Load provider data from localStorage
    const savedProviderData = localStorage.getItem('providerData');
    if (savedProviderData) {
      const data = JSON.parse(savedProviderData);
      setProviderData({ ...data, available: data.available ?? true });
    }

    // Load services from localStorage
    const savedServices = localStorage.getItem('providerServices');
    if (savedServices) {
      setServices(JSON.parse(savedServices));
    }
  }, []);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedImages(prev => [...prev, ...files].slice(0, 5)); // Max 5 images
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddService = () => {
    if (!newService.title || !newService.price || !newService.timeNeeded) return;

    // Convert selected images to base64 strings for storage
    const imagePromises = selectedImages.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises).then(imageUrls => {
      const service: Service = {
        id: Date.now().toString(),
        ...newService,
        customCategory: newService.category === 'other' ? newService.customCategory : '',
        available: true,
        images: imageUrls,
        createdAt: new Date().toISOString()
      };

      const updatedServices = [...services, service];
      setServices(updatedServices);
      localStorage.setItem('providerServices', JSON.stringify(updatedServices));
      
      setNewService({ title: '', description: '', price: '', timeNeeded: '', category: '', customCategory: '' });
      setSelectedImages([]);
      setIsAddServiceOpen(false);
    });
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setNewService({
      title: service.title,
      description: service.description,
      price: service.price,
      timeNeeded: service.timeNeeded,
      category: service.category,
      customCategory: service.customCategory || ''
    });
    setIsAddServiceOpen(true);
  };

  const handleUpdateService = () => {
    if (!editingService || !newService.title || !newService.price || !newService.timeNeeded) return;

    const imagePromises = selectedImages.length > 0 ? selectedImages.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      });
    }) : Promise.resolve(editingService.images);

    Promise.all([imagePromises].flat()).then(imageUrls => {
      const updatedServices = services.map(service =>
        service.id === editingService.id
          ? { 
              ...service, 
              ...newService,
              customCategory: newService.category === 'other' ? newService.customCategory : '',
              images: selectedImages.length > 0 ? imageUrls as string[] : service.images
            }
          : service
      );

      setServices(updatedServices);
      localStorage.setItem('providerServices', JSON.stringify(updatedServices));
      
      setNewService({ title: '', description: '', price: '', timeNeeded: '', category: '', customCategory: '' });
      setSelectedImages([]);
      setEditingService(null);
      setIsAddServiceOpen(false);
    });
  };

  const handleDeleteService = (serviceId: string) => {
    const updatedServices = services.filter(service => service.id !== serviceId);
    setServices(updatedServices);
    localStorage.setItem('providerServices', JSON.stringify(updatedServices));
  };

  const toggleServiceAvailability = (serviceId: string) => {
    const updatedServices = services.map(service =>
      service.id === serviceId
        ? { ...service, available: !service.available }
        : service
    );
    setServices(updatedServices);
    localStorage.setItem('providerServices', JSON.stringify(updatedServices));
  };

  const toggleProviderAvailability = () => {
    if (providerData) {
      const updatedData = { ...providerData, available: !providerData.available };
      setProviderData(updatedData);
      localStorage.setItem('providerData', JSON.stringify(updatedData));
    }
  };

  const handleCloseDialog = () => {
    setIsAddServiceOpen(false);
    setEditingService(null);
    setSelectedImages([]);
    setNewService({ title: '', description: '', price: '', timeNeeded: '', category: '', customCategory: '' });
  };

  if (!providerData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">No provider data found</h2>
          <Button onClick={() => navigate('/provider-registration')}>
            Go to Registration
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="p-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Provider Dashboard
                </h1>
                <p className="text-sm text-gray-600">Manage your services and profile</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Label htmlFor="provider-availability" className="text-sm font-medium">
                  Available
                </Label>
                <Switch
                  id="provider-availability"
                  checked={providerData.available}
                  onCheckedChange={toggleProviderAvailability}
                />
              </div>
              <Badge variant={providerData.available ? "default" : "secondary"} className="text-sm">
                {providerData.available ? "Available" : "Unavailable"}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-8">
          {/* Profile Section */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Profile Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center mb-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#00B896] to-[#00C9A7] rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl font-bold text-white">
                      {providerData.fullName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{providerData.fullName}</h3>
                  <p className="text-sm text-gray-600">Service Provider</p>
                  <Badge variant={providerData.available ? "default" : "secondary"} className="mt-2">
                    {providerData.available ? "Available" : "Unavailable"}
                  </Badge>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="break-all">{providerData.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{providerData.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{providerData.city}, {providerData.state}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>{providerData.experience} experience</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-semibold text-sm mb-2">Services Offered</h4>
                  <p className="text-sm text-gray-600">{providerData.services}</p>
                </div>

                {providerData.description && (
                  <div className="pt-4 border-t">
                    <h4 className="font-semibold text-sm mb-2">Description</h4>
                    <p className="text-sm text-gray-600">{providerData.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Services Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <CardTitle className="flex items-center space-x-2">
                    <Star className="w-5 h-5" />
                    <span>My Services ({services.length})</span>
                  </CardTitle>
                  <Dialog open={isAddServiceOpen} onOpenChange={setIsAddServiceOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-[#00B896] hover:bg-[#00A085] text-white w-full sm:w-auto">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Service
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>
                          {editingService ? 'Edit Service' : 'Add New Service'}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="serviceTitle">Service Title *</Label>
                          <Input
                            id="serviceTitle"
                            value={newService.title}
                            onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                            placeholder="e.g., AC Repair & Maintenance"
                          />
                        </div>
                        <div>
                          <Label htmlFor="serviceDescription">Description</Label>
                          <Textarea
                            id="serviceDescription"
                            value={newService.description}
                            onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                            placeholder="Describe your service..."
                            rows={3}
                          />
                        </div>
                        <div>
                          <Label htmlFor="servicePrice">Price Range *</Label>
                          <Input
                            id="servicePrice"
                            value={newService.price}
                            onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                            placeholder="e.g., ₹500-1000"
                          />
                        </div>
                        <div>
                          <Label htmlFor="serviceTime">Time Needed *</Label>
                          <Input
                            id="serviceTime"
                            value={newService.timeNeeded}
                            onChange={(e) => setNewService({ ...newService, timeNeeded: e.target.value })}
                            placeholder="e.g., 1-2 hours"
                          />
                        </div>
                        <div>
                          <Label htmlFor="serviceCategory">Category</Label>
                          <Select onValueChange={(value) => setNewService({ ...newService, category: value })}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="home-services">Home Services</SelectItem>
                              <SelectItem value="repairs">Repairs</SelectItem>
                              <SelectItem value="cleaning">Cleaning</SelectItem>
                              <SelectItem value="electrical">Electrical</SelectItem>
                              <SelectItem value="plumbing">Plumbing</SelectItem>
                              <SelectItem value="automotive">Automotive</SelectItem>
                              <SelectItem value="beauty">Beauty & Wellness</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        {newService.category === 'other' && (
                          <div>
                            <Label htmlFor="customCategory">Custom Service Type</Label>
                            <Input
                              id="customCategory"
                              value={newService.customCategory}
                              onChange={(e) => setNewService({ ...newService, customCategory: e.target.value })}
                              placeholder="Enter your service type"
                            />
                          </div>
                        )}
                        <div>
                          <Label htmlFor="serviceImages">Service Images (Max 5)</Label>
                          <div className="space-y-2">
                            <Input
                              id="serviceImages"
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={handleImageSelect}
                              className="cursor-pointer"
                            />
                            {selectedImages.length > 0 && (
                              <div className="grid grid-cols-2 gap-2">
                                {selectedImages.map((image, index) => (
                                  <div key={index} className="relative">
                                    <img
                                      src={URL.createObjectURL(image)}
                                      alt={`Preview ${index + 1}`}
                                      className="w-full h-20 object-cover rounded border"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => removeImage(index)}
                                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2 pt-4">
                          <Button 
                            variant="outline" 
                            onClick={handleCloseDialog}
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                          <Button 
                            onClick={editingService ? handleUpdateService : handleAddService}
                            className="flex-1 bg-[#00B896] hover:bg-[#00A085] text-white"
                          >
                            {editingService ? 'Update' : 'Add'} Service
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {services.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-gray-400 mb-4">
                      <Star className="w-12 h-12 mx-auto" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No services added yet</h3>
                    <p className="text-gray-600 mb-4">Start by adding your first service to attract customers</p>
                    <Button 
                      onClick={() => setIsAddServiceOpen(true)}
                      className="bg-[#00B896] hover:bg-[#00A085] text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Service
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {services.map((service) => (
                      <div
                        key={service.id}
                        className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow"
                      >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-semibold text-gray-900 truncate">{service.title}</h3>
                              {service.category && (
                                <Badge variant="secondary" className="text-xs">
                                  {service.customCategory || service.category}
                                </Badge>
                              )}
                              <Badge variant={service.available ? "default" : "secondary"} className="text-xs">
                                {service.available ? "Available" : "Unavailable"}
                              </Badge>
                            </div>
                            {service.description && (
                              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{service.description}</p>
                            )}
                            {service.images.length > 0 && (
                              <div className="flex space-x-2 mb-2">
                                {service.images.slice(0, 3).map((image, index) => (
                                  <img
                                    key={index}
                                    src={image}
                                    alt={`Service ${index + 1}`}
                                    className="w-12 h-12 object-cover rounded border"
                                  />
                                ))}
                                {service.images.length > 3 && (
                                  <div className="w-12 h-12 bg-gray-100 rounded border flex items-center justify-center text-xs text-gray-500">
                                    +{service.images.length - 3}
                                  </div>
                                )}
                              </div>
                            )}
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                              <span className="font-medium text-[#00B896]">{service.price}</span>
                              <span>⏱️ {service.timeNeeded}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleServiceAvailability(service.id)}
                              className="p-2"
                            >
                              {service.available ? (
                                <ToggleRight className="w-5 h-5 text-green-600" />
                              ) : (
                                <ToggleLeft className="w-5 h-5 text-gray-400" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditService(service)}
                              className="p-2"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteService(service.id)}
                              className="p-2 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;
