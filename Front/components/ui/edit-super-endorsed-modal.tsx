import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Crown, User } from 'lucide-react';

interface SuperEndorsedUser {
  id: string;
  handle: string;
  name: string;
  avatar: string;
  walletAddress: string;
  endorsementCount: number;
  skills: string[];
  reputation: number;
  isExpert: boolean;
}

interface EditSuperEndorsedModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUsers: SuperEndorsedUser[];
  onSave: (newUsers: SuperEndorsedUser[]) => void;
}

export function EditSuperEndorsedModal({ isOpen, onClose, currentUsers, onSave }: EditSuperEndorsedModalProps) {
  const [users, setUsers] = useState<SuperEndorsedUser[]>(currentUsers.slice(0, 16));

  const handleSave = () => {
    onSave(users);
    onClose();
  };

  const handleCancel = () => {
    setUsers(currentUsers.slice(0, 16)); // Reset to original
    onClose();
  };

  const updateUserHandle = (index: number, newHandle: string) => {
    setUsers(prev => 
      prev.map((user, i) => 
        i === index 
          ? { 
              ...user, 
              handle: newHandle,
              avatar: `https://xsgames.co/randomusers/avatar.php?g=${Math.random() > 0.5 ? 'male' : 'female'}&seed=${newHandle}`
            }
          : user
      )
    );
  };

  const toggleExpertStatus = (index: number) => {
    setUsers(prev => 
      prev.map((user, i) => 
        i === index 
          ? { ...user, isExpert: !user.isExpert }
          : user
      )
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-light text-gray-100">Edit Super-Endorsed Users</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {users.map((user, index) => (
              <div key={user.id} className="bg-gray-800/30 rounded-lg p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <img
                    src={user.avatar}
                    alt={user.handle}
                    className="w-8 h-8 rounded-lg object-cover"
                  />
                  <div className="text-xs text-gray-400">Position {index + 1}</div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleExpertStatus(index)}
                    className={`ml-auto w-6 h-6 p-0 ${user.isExpert ? 'text-amber-400' : 'text-gray-500'}`}
                  >
                    {user.isExpert ? <Crown className="w-4 h-4 fill-current" /> : <User className="w-4 h-4" />}
                  </Button>
                </div>
                
                <div>
                  <Label className="text-xs text-gray-500">Handle</Label>
                  <Input
                    value={user.handle}
                    onChange={(e) => updateUserHandle(index, e.target.value)}
                    className="mt-1 bg-gray-700/50 border-gray-600 text-white text-sm h-8"
                    placeholder="username"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="text-xs text-gray-500 bg-gray-800/20 p-3 rounded-lg">
            <div className="font-medium mb-1">Tips:</div>
            <ul className="space-y-1">
              <li>• Click the crown icon to toggle expert status</li>
              <li>• Avatar images update automatically based on handle</li>
              <li>• Only the first 16 users are displayed in the grid</li>
            </ul>
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