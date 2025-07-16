
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { serviceService, MasterService } from "@/services/serviceService";
import { SmartSearchSelect } from "@/components/ui/smart-search-select";
import { Upload, X } from "lucide-react";

interface AddServiceModalProps {
  open: boolean;
  onClose: () => void;
  onServiceAdded: () => void;
}

const AddServiceModal = ({ open, onClose, onServiceAdded }: AddServiceModalProps) => {
  const [masterServices, setMasterServices] = useState<MasterService[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [customServiceName, setCustomServiceName] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCustomService, setIsCustomService] = useState(false);

  useEffect(() => {
    if (open) {
      fetchMasterServices();
    }
  }, [open]);

  const fetchMasterServices = async () => {
    try {
      const services = await serviceService.getMasterServices();
      setMasterServices(services);
    } catch (error) {
      console.error('Error fetching master services:', error);
      toast({
        title: "Error",
        description: "Failed to load services",
        variant: "destructive"
      });
    }
  };

  const serviceOptions = masterServices.map(service => ({
    value: service.id,
    label: service.name,
    category: service.category
  }));

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // For demo purposes, we'll create placeholder URLs
    // In production, you'd upload to Supabase storage
    const newImages = Array.from(files).map((file, index) => 
      URL.createObjectURL(file)
    );
    setImages(prev => [...prev, ...newImages].slice(0, 5)); // Limit to 5 images
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!priceRange || !estimatedTime) {
        throw new Error('Price range and estimated time are required');
      }

      if (!isCustomService && !selectedServiceId) {
        throw new Error('Please select a service or choose "Other"');
      }

      if (isCustomService && !customServiceName) {
        throw new Error('Please enter a custom service name');
      }

      const serviceData = {
        master_service_id: isCustomService ? undefined : selectedServiceId,
        custom_service_name: isCustomService ? customServiceName : undefined,
        price_range: priceRange,
        estimated_time: estimatedTime,
        description: description || undefined,
        images: images.length > 0 ? images : undefined
      };

      await serviceService.addProviderService(serviceData);

      // If it's a custom service, also add it to master services for future use
      if (isCustomService && customServiceName) {
        try {
          await serviceService.addCustomMasterService({
            name: customServiceName,
            category: 'other',
            description,
            base_price_range: priceRange,
            estimated_time: estimatedTime
          });
        } catch (error) {
          // Non-critical error, service was still added to provider
          console.log('Custom service not added to master list (may require admin approval)');
        }
      }

      toast({
        title: "Success",
        description: "Service added successfully!"
      });

      onServiceAdded();
      handleClose();
    } catch (error: any) {
      console.error('Error adding service:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add service",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedServiceId('');
    setCustomServiceName('');
    setPriceRange('');
    setEstimatedTime('');
    setDescription('');
    setImages([]);
    setIsCustomService(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Service</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Service Type</Label>
            <SmartSearchSelect
              options={serviceOptions}
              value={isCustomService ? '' : selectedServiceId}
              onValueChange={(value) => {
                setIsCustomService(false);
                setSelectedServiceId(value);
              }}
              placeholder="Select a service..."
              searchPlaceholder="Search for services..."
              allowCustom={true}
              customLabel="Other (Custom Service)"
              onCustomValueChange={(customValue) => {
                setIsCustomService(true);
                setCustomServiceName(customValue);
                setSelectedServiceId('');
              }}
              className="w-full"
            />
          </div>

          {isCustomService && (
            <div className="space-y-2 p-4 bg-muted/50 rounded-lg border border-primary/20">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-primary"></div>
                <Label htmlFor="customServiceName" className="text-sm font-medium text-primary">
                  Custom Service Selected: "{customServiceName}"
                </Label>
              </div>
              <p className="text-xs text-muted-foreground">
                You can edit the service name below if needed:
              </p>
              <Input
                id="customServiceName"
                value={customServiceName}
                onChange={(e) => setCustomServiceName(e.target.value)}
                placeholder="Enter your custom service name"
                className="bg-background border-primary/30 focus:border-primary"
                required
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priceRange">Price Range (INR) *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">₹</span>
                <Input
                  id="priceRange"
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  placeholder="499-899"
                  className="pl-8"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="estimatedTime">Estimated Time *</Label>
              <Input
                id="estimatedTime"
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(e.target.value)}
                placeholder="2-3 hrs"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your service..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Service Images (Max 5)</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img 
                    src={image} 
                    alt={`Service ${index + 1}`}
                    className="w-20 h-20 object-cover rounded border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 w-6 h-6 p-0"
                    onClick={() => removeImage(index)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
            {images.length < 5 && (
              <div className="flex items-center space-x-2">
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  id="imageUpload"
                />
                <Label 
                  htmlFor="imageUpload"
                  className="flex items-center space-x-2 cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded border"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Images</span>
                </Label>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1 bg-[#00B896] hover:bg-[#00A085]">
              {loading ? 'Adding...' : 'Add Service'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddServiceModal;
