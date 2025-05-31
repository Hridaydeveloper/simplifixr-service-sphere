
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { profileService } from "@/services/profileService";
import { toast } from "sonner";

interface ProfilePictureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfilePictureModal = ({ isOpen, onClose }: ProfilePictureModalProps) => {
  const { user, refreshUser } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !user) return;

    setUploading(true);
    try {
      const publicUrl = await profileService.uploadProfilePicture(user.id, selectedFile);
      await profileService.updateProfile(user.id, { profile_picture_url: publicUrl });
      await refreshUser();
      toast.success("Profile picture updated successfully!");
      onClose();
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload profile picture");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    if (!user) return;

    setUploading(true);
    try {
      await profileService.deleteProfilePicture(user.id);
      await profileService.updateProfile(user.id, { profile_picture_url: null });
      await refreshUser();
      toast.success("Profile picture removed successfully!");
      onClose();
    } catch (error) {
      console.error("Remove error:", error);
      toast.error("Failed to remove profile picture");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Profile Picture</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex flex-col items-center space-y-4">
            {preview ? (
              <img 
                src={preview} 
                alt="Preview" 
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                <Upload className="w-8 h-8 text-gray-400" />
              </div>
            )}
            
            <div className="flex flex-col space-y-2 w-full">
              <label className="cursor-pointer">
                <Button variant="outline" className="w-full" asChild>
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Image
                  </span>
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
              
              {selectedFile && (
                <Button 
                  onClick={handleUpload} 
                  disabled={uploading}
                  className="w-full bg-[#00B896] hover:bg-[#009985]"
                >
                  {uploading ? "Uploading..." : "Upload"}
                </Button>
              )}
              
              <Button 
                variant="destructive" 
                onClick={handleRemove}
                disabled={uploading}
                className="w-full"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Remove Current Picture
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfilePictureModal;
