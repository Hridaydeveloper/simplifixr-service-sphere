import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import SimpleAuth from "@/components/auth/SimpleAuth";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (role: 'customer' | 'provider') => void;
}

const AuthModal = ({ isOpen, onClose, onSuccess }: AuthModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="bg-black/80 backdrop-blur-sm" />
      <DialogContent className="max-w-md mx-auto p-0 border-0 bg-transparent shadow-none">
        <div className="bg-white rounded-lg shadow-2xl">
          <SimpleAuth
            onBack={onClose}
            onSuccess={(role) => {
              onSuccess(role);
              onClose();
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;