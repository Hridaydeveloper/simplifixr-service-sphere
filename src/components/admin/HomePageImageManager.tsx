import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Trash2, Plus, Upload, Edit3, Link, ImageIcon } from 'lucide-react';
import { homePageImageService, HomePageImage } from '@/services/homePageImageService';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const HomePageImageManager = () => {
  const [images, setImages] = useState<HomePageImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<HomePageImage | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadTab, setUploadTab] = useState<'url' | 'file'>('url');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);
  const [newImage, setNewImage] = useState({
    image_url: '',
    alt_text: '',
    display_order: 0,
    title: '',
    subtitle: ''
  });
  const { toast } = useToast();

  const fetchImages = async () => {
    try {
      setLoading(true);
      const data = await homePageImageService.getAllImages();
      setImages(data);
    } catch (error) {
      console.error('Error fetching images:', error);
      toast({
        title: "Error",
        description: "Failed to fetch home page images",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const uploadFile = async (file: File): Promise<string | null> => {
    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from('banners')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('banners')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const publicUrl = await uploadFile(file);
    if (publicUrl) {
      setNewImage({ ...newImage, image_url: publicUrl });
    }
  };

  const handleEditFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingImage) return;

    const publicUrl = await uploadFile(file);
    if (publicUrl) {
      setEditingImage({ ...editingImage, image_url: publicUrl });
    }
  };

  const handleAddImage = async () => {
    if (!newImage.image_url || !newImage.alt_text) {
      toast({
        title: "Error",
        description: "Please fill in image URL and alt text",
        variant: "destructive",
      });
      return;
    }

    try {
      await homePageImageService.addImage({
        image_url: newImage.image_url,
        alt_text: newImage.alt_text,
        display_order: newImage.display_order,
        is_active: true,
        title: newImage.title || undefined,
        subtitle: newImage.subtitle || undefined
      });
      
      toast({
        title: "Success",
        description: "Home page banner added successfully",
      });
      
      setIsAddDialogOpen(false);
      setNewImage({ image_url: '', alt_text: '', display_order: 0, title: '', subtitle: '' });
      fetchImages();
    } catch (error) {
      console.error('Error adding banner:', error);
      toast({
        title: "Error",
        description: "Failed to add home page banner",
        variant: "destructive",
      });
    }
  };

  const handleEditImage = async () => {
    if (!editingImage) return;

    try {
      await homePageImageService.updateImage(editingImage.id, {
        image_url: editingImage.image_url,
        alt_text: editingImage.alt_text,
        display_order: editingImage.display_order,
        title: editingImage.title || undefined,
        subtitle: editingImage.subtitle || undefined
      });
      
      toast({
        title: "Success",
        description: "Banner updated successfully",
      });
      
      setIsEditDialogOpen(false);
      setEditingImage(null);
      fetchImages();
    } catch (error) {
      console.error('Error updating banner:', error);
      toast({
        title: "Error",
        description: "Failed to update banner",
        variant: "destructive",
      });
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await homePageImageService.toggleImageStatus(id, !currentStatus);
      toast({
        title: "Success",
        description: `Banner ${!currentStatus ? 'activated' : 'deactivated'} successfully`,
      });
      fetchImages();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update banner status",
        variant: "destructive",
      });
    }
  };

  const handleDeleteImage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;

    try {
      await homePageImageService.deleteImage(id);
      toast({
        title: "Success",
        description: "Banner deleted successfully",
      });
      fetchImages();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete banner",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (image: HomePageImage) => {
    setEditingImage({ ...image });
    setIsEditDialogOpen(true);
  };

  if (loading) {
    return <div className="p-4">Loading home page banners...</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Home Page Banners</h1>
          <p className="text-muted-foreground">Manage banner images with title and subtitle for the home page slider</p>
          <p className="text-sm text-muted-foreground mt-1">
            <strong>Alt Text</strong> = Description for accessibility (screen readers) & SEO. Example: "Professional repair services banner"
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Banner
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Banner</DialogTitle>
              <DialogDescription>
                Add a new banner with title and subtitle for the home page slider
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Tabs value={uploadTab} onValueChange={(v) => setUploadTab(v as 'url' | 'file')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="url" className="flex items-center gap-2">
                    <Link className="w-4 h-4" />
                    URL
                  </TabsTrigger>
                  <TabsTrigger value="file" className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    Upload File
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="url" className="mt-4">
                  <div>
                    <Label htmlFor="image_url">Image URL *</Label>
                    <Input
                      id="image_url"
                      placeholder="https://example.com/image.jpg"
                      value={newImage.image_url}
                      onChange={(e) => setNewImage({ ...newImage, image_url: e.target.value })}
                    />
                  </div>
                </TabsContent>
                <TabsContent value="file" className="mt-4">
                  <div>
                    <Label>Upload Image *</Label>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full mt-2"
                      disabled={uploading}
                    >
                      {uploading ? 'Uploading...' : 'Choose Image File'}
                    </Button>
                    {newImage.image_url && (
                      <p className="text-sm text-muted-foreground mt-2 truncate">
                        Selected: {newImage.image_url}
                      </p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              {/* Image Preview */}
              {newImage.image_url && (
                <div className="w-full h-32 bg-muted rounded-lg overflow-hidden">
                  <img
                    src={newImage.image_url}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=400&h=300&fit=crop';
                    }}
                  />
                </div>
              )}

              <div>
                <Label htmlFor="title">Banner Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Professional Home Services"
                  value={newImage.title}
                  onChange={(e) => setNewImage({ ...newImage, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="subtitle">Banner Subtitle</Label>
                <Textarea
                  id="subtitle"
                  placeholder="e.g., Trusted experts for all your home service needs"
                  value={newImage.subtitle}
                  onChange={(e) => setNewImage({ ...newImage, subtitle: e.target.value })}
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="alt_text">Alt Text * (for accessibility & SEO)</Label>
                <Input
                  id="alt_text"
                  placeholder="e.g., Professional repair technician working"
                  value={newImage.alt_text}
                  onChange={(e) => setNewImage({ ...newImage, alt_text: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="display_order">Display Order</Label>
                <Input
                  id="display_order"
                  type="number"
                  placeholder="0"
                  value={newImage.display_order}
                  onChange={(e) => setNewImage({ ...newImage, display_order: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddImage} disabled={uploading}>
                Add Banner
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Banner</DialogTitle>
            <DialogDescription>
              Update banner details
            </DialogDescription>
          </DialogHeader>
          {editingImage && (
            <div className="space-y-4">
              {/* Current Image Preview */}
              <div className="w-full h-32 bg-muted rounded-lg overflow-hidden">
                <img
                  src={editingImage.image_url}
                  alt={editingImage.alt_text}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=400&h=300&fit=crop';
                  }}
                />
              </div>

              <Tabs defaultValue="url">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="url" className="flex items-center gap-2">
                    <Link className="w-4 h-4" />
                    URL
                  </TabsTrigger>
                  <TabsTrigger value="file" className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    Upload New
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="url" className="mt-4">
                  <div>
                    <Label htmlFor="edit_image_url">Image URL *</Label>
                    <Input
                      id="edit_image_url"
                      value={editingImage.image_url}
                      onChange={(e) => setEditingImage({ ...editingImage, image_url: e.target.value })}
                    />
                  </div>
                </TabsContent>
                <TabsContent value="file" className="mt-4">
                  <div>
                    <Label>Upload New Image</Label>
                    <input
                      type="file"
                      ref={editFileInputRef}
                      accept="image/*"
                      onChange={handleEditFileSelect}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => editFileInputRef.current?.click()}
                      className="w-full mt-2"
                      disabled={uploading}
                    >
                      {uploading ? 'Uploading...' : 'Choose New Image'}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>

              <div>
                <Label htmlFor="edit_title">Banner Title</Label>
                <Input
                  id="edit_title"
                  placeholder="e.g., Professional Home Services"
                  value={editingImage.title || ''}
                  onChange={(e) => setEditingImage({ ...editingImage, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit_subtitle">Banner Subtitle</Label>
                <Textarea
                  id="edit_subtitle"
                  placeholder="e.g., Trusted experts for all your home service needs"
                  value={editingImage.subtitle || ''}
                  onChange={(e) => setEditingImage({ ...editingImage, subtitle: e.target.value })}
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="edit_alt_text">Alt Text * (for accessibility & SEO)</Label>
                <Input
                  id="edit_alt_text"
                  value={editingImage.alt_text}
                  onChange={(e) => setEditingImage({ ...editingImage, alt_text: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit_display_order">Display Order</Label>
                <Input
                  id="edit_display_order"
                  type="number"
                  value={editingImage.display_order}
                  onChange={(e) => setEditingImage({ ...editingImage, display_order: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditImage} disabled={uploading}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid gap-6">
        {images.map((image) => (
          <Card key={image.id}>
            <CardContent className="p-6">
              <div className="flex gap-6">
                <div className="w-48 h-32 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={image.image_url}
                    alt={image.alt_text}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=400&h=300&fit=crop';
                    }}
                  />
                </div>
                
                <div className="flex-1 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{image.title || 'No title set'}</h3>
                      <p className="text-sm text-muted-foreground">{image.subtitle || 'No subtitle set'}</p>
                      <p className="text-xs text-muted-foreground mt-1">Order: {image.display_order}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={image.is_active ? "default" : "secondary"}>
                        {image.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground break-all">
                    <span className="font-medium">Image: </span>{image.image_url}
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <label htmlFor={`toggle-${image.id}`} className="text-sm font-medium">
                          Active
                        </label>
                        <Switch
                          id={`toggle-${image.id}`}
                          checked={image.is_active}
                          onCheckedChange={() => handleToggleStatus(image.id, image.is_active)}
                        />
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(image)}
                      >
                        <Edit3 className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteImage(image.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {images.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No banners found</h3>
              <p className="text-muted-foreground mb-4">
                Add your first home page banner to get started
              </p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Banner
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default HomePageImageManager;