import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface EditBioModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBio: string;
  onSave: (newBio: string) => void;
}

export function EditBioModal({ isOpen, onClose, currentBio, onSave }: EditBioModalProps) {
  const [bio, setBio] = useState(currentBio);

  const handleSave = () => {
    onSave(bio);
    onClose();
  };

  const handleCancel = () => {
    setBio(currentBio); // Reset to original
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-light text-gray-100">Edit Bio</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="bio" className="text-sm text-gray-400">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              className="mt-2 bg-gray-800/50 border-gray-700 text-white placeholder-gray-500 resize-none"
              rows={4}
              maxLength={300}
            />
            <div className="text-xs text-gray-500 mt-1">
              {bio.length}/300 characters
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleCancel}
              variant="outline"
              className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
            >
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}