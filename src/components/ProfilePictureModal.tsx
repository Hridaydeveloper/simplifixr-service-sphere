
import { useState } from "react";
import { Camera, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

interface ProfilePictureModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPhoto: string | null;
  userName: string;
}

const ProfilePictureModal = ({ isOpen, onClose, currentPhoto, userName }: ProfilePictureModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select a JPG or PNG image file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image under 2MB.",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    
    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleSave = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      // TODO: Implement actual file upload logic here
      // This would typically upload to your storage service
      console.log("Uploading file:", selectedFile);
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Profile picture updated",
        description: "Your profile picture has been successfully updated.",
      });
      
      handleClose();
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your profile picture. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePhoto = () => {
    // TODO: Implement actual photo removal logic
    console.log("Removing current photo");
    toast({
      title: "Profile picture removed",
      description: "Your profile picture has been removed.",
    });
    handleClose();
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsUploading(false);
    onClose();
  };

  const displayImage = previewUrl || currentPhoto;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Edit Profile Picture
          </DialogTitle>
          <DialogDescription>
            Your current photo helps personalize your account.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-4 py-4">
          {/* Current/Preview Photo */}
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src={displayImage || ""} alt={userName} />
              <AvatarFallback className="bg-gradient-to-r from-[#00B896] to-[#00C9A7] text-white text-lg">
                {getInitials(userName)}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Upload Section */}
          <div className="w-full space-y-3">
            <div className="flex flex-col items-center">
              <input
                type="file"
                id="profile-upload"
                accept="image/jpeg,image/png,image/jpg"
                onChange={handleFileSelect}
                className="hidden"
              />
              <label htmlFor="profile-upload">
                <Button variant="outline" className="cursor-pointer" asChild>
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload New Photo
                  </span>
                </Button>
              </label>
              <p className="text-xs text-muted-foreground mt-1">
                JPG/PNG under 2MB
              </p>
            </div>

            {/* Remove Photo Button - only show if there's a current photo */}
            {currentPhoto && (
              <div className="flex justify-center">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleRemovePhoto}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove Photo
                </Button>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isUploading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!selectedFile || isUploading}
          >
            {isUploading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfilePictureModal;
