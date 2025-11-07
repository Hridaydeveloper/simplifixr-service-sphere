import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { serviceService } from "@/services/serviceService";
import { Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface EditServiceModalProps {
  open: boolean;
  onClose: () => void;
  onServiceUpdated: () => void;
  service: any;
}

const EditServiceModal = ({ open, onClose, onServiceUpdated, service }: EditServiceModalProps) => {
  const [priceRange, setPriceRange] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  useEffect(() => {
    if (service && open) {
      setPriceRange(service.price_range?.replace('₹', '') || '');
      setEstimatedTime(service.estimated_time || '');
      setDescription(service.description || '');
      setImages(service.images || []);
    }
  }, [service, open]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploadingImages(true);
    const newImageUrls: string[] = [];

    try {
      for (const file of Array.from(files)) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        
        const { data, error } = await supabase.storage
          .from('service-images')
          .upload(fileName, file);

        if (error) {
          console.error('Upload error:', error);
          toast({
            title: "Upload Error",
            description: `Failed to upload ${file.name}`,
            variant: "destructive"
          });
          continue;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('service-images')
          .getPublicUrl(fileName);

        newImageUrls.push(publicUrl);
      }

      if (newImageUrls.length > 0) {
        setImages(prev => [...prev, ...newImageUrls].slice(0, 5));
        toast({
          title: "Success",
          description: `${newImageUrls.length} image(s) uploaded successfully`,
        });
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      toast({
        title: "Error",
        description: "Failed to upload images",
        variant: "destructive"
      });
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = async (index: number) => {
    const imageUrl = images[index];
    
    try {
      const url = new URL(imageUrl);
      const fileName = url.pathname.split('/').pop();
      
      if (fileName) {
        await supabase.storage
          .from('service-images')
          .remove([fileName]);
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    }
    
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!priceRange || !estimatedTime) {
        throw new Error('Price range and estimated time are required');
      }

      const updates = {
        price_range: priceRange,
        estimated_time: estimatedTime,
        description: description || undefined,
        images: images.length > 0 ? images : undefined
      };

      await serviceService.updateProviderService(service.id, updates);

      toast({
        title: "Success",
        description: "Service updated successfully!"
      });

      onServiceUpdated();
      handleClose();
    } catch (error: any) {
      console.error('Error updating service:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update service",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Service</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Service Name</Label>
            <Input
              value={service?.master_service?.name || service?.custom_service_name || ''}
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">Service name cannot be changed</p>
          </div>

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
                  disabled={uploadingImages}
                />
                <Label 
                  htmlFor="imageUpload"
                  className={`flex items-center space-x-2 cursor-pointer px-4 py-2 rounded border transition-colors ${
                    uploadingImages 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  <span>{uploadingImages ? 'Uploading...' : 'Upload Images'}</span>
                </Label>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1 bg-primary hover:bg-primary/90">
              {loading ? 'Updating...' : 'Update Service'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditServiceModal;
