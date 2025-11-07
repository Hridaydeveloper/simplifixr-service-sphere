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
      <DialogOverlay className="bg-black/90 backdrop-blur-md fixed inset-0 z-50" />
      <DialogContent className="max-w-md mx-auto p-0 border-0 bg-transparent shadow-none z-[60] fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="bg-background rounded-2xl shadow-2xl border border-border/50">
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