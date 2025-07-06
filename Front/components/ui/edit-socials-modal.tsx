import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Github, Send, Twitter, Zap } from 'lucide-react';

interface SocialLink {
  platform: string;
  url: string;
  verified: boolean;
}

interface EditSocialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSocials: SocialLink[];
  onSave: (newSocials: SocialLink[]) => void;
}

export function EditSocialsModal({ isOpen, onClose, currentSocials, onSave }: EditSocialsModalProps) {
  const [socials, setSocials] = useState<SocialLink[]>(currentSocials);

  const socialIcons = {
    Github: Github,
    Telegram: Send,
    X: Twitter,
    Farcaster: Zap,
  };

  const handleSave = () => {
    onSave(socials);
    onClose();
  };

  const handleCancel = () => {
    setSocials(currentSocials); // Reset to original
    onClose();
  };

  const updateSocialUrl = (platform: string, url: string) => {
    setSocials(prev => 
      prev.map(social => 
        social.platform === platform 
          ? { ...social, url }
          : social
      )
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-light text-gray-100">Edit Social Links</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {socials.map((social) => {
            const IconComponent = socialIcons[social.platform as keyof typeof socialIcons];
            
            return (
              <div key={social.platform}>
                <Label htmlFor={social.platform} className="text-sm text-gray-400 flex items-center gap-2">
                  {IconComponent && <IconComponent className="w-4 h-4" />}
                  {social.platform}
                </Label>
                <Input
                  id={social.platform}
                  value={social.url}
                  onChange={(e) => updateSocialUrl(social.platform, e.target.value)}
                  placeholder={`Your ${social.platform} URL`}
                  className="mt-2 bg-gray-800/50 border-gray-700 text-white placeholder-gray-500"
                />
              </div>
            );
          })}
          
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