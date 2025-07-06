import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';

interface Skill {
  id: string;
  name: string;
  category: string;
  userEndorsements: number;
  expertEndorsements: number;
  totalEndorsements: number;
  isVerified: boolean;
  lastEndorsed: string;
}

interface EditSkillsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSkills: Skill[];
  onSave: (newSkills: Skill[]) => void;
}

export function EditSkillsModal({ isOpen, onClose, currentSkills, onSave }: EditSkillsModalProps) {
  const [skills, setSkills] = useState<Skill[]>(currentSkills);
  const [newSkillName, setNewSkillName] = useState('');

  const handleSave = () => {
    onSave(skills);
    onClose();
  };

  const handleCancel = () => {
    setSkills(currentSkills); // Reset to original
    setNewSkillName('');
    onClose();
  };

  const addSkill = () => {
    if (newSkillName.trim() && skills.length < 4) {
      const newSkill: Skill = {
        id: `skill_${Date.now()}`,
        name: newSkillName.trim(),
        category: 'Custom',
        userEndorsements: 0,
        expertEndorsements: 0,
        totalEndorsements: 0,
        isVerified: false,
        lastEndorsed: new Date().toISOString(),
      };
      
      setSkills(prev => [...prev, newSkill]);
      setNewSkillName('');
    }
  };

  const removeSkill = (skillId: string) => {
    setSkills(prev => prev.filter(skill => skill.id !== skillId));
  };

  const updateSkillName = (skillId: string, newName: string) => {
    setSkills(prev => 
      prev.map(skill => 
        skill.id === skillId 
          ? { ...skill, name: newName }
          : skill
      )
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-light text-gray-100">Edit Skills</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label className="text-sm text-gray-400">Current Skills (Max 4)</Label>
            <div className="space-y-2 mt-2">
              {skills.map((skill) => (
                <div key={skill.id} className="flex items-center gap-2">
                  <Input
                    value={skill.name}
                    onChange={(e) => updateSkillName(skill.id, e.target.value)}
                    className="flex-1 bg-gray-800/50 border-gray-700 text-white"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSkill(skill.id)}
                    className="w-8 h-8 p-0 text-gray-400 hover:text-red-400"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {skills.length < 4 && (
            <div>
              <Label className="text-sm text-gray-400">Add New Skill</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  placeholder="Enter skill name"
                  className="flex-1 bg-gray-800/50 border-gray-700 text-white placeholder-gray-500"
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                />
                <Button
                  onClick={addSkill}
                  disabled={!newSkillName.trim()}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          <div className="text-xs text-gray-500">
            Skills retain their endorsement counts when edited.
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