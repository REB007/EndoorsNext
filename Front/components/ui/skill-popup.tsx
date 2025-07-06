'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Users, Star, X, Zap } from 'lucide-react';
import { Skill } from '@/types/profile';

interface SkillPopupProps {
  skill: Skill | null;
  isOpen: boolean;
  onClose: () => void;
  onEndorse: (skillId: string, type: 'regular' | 'expert') => void;
}

export function SkillPopup({ skill, isOpen, onClose, onEndorse }: SkillPopupProps) {
  const [isEndorsing, setIsEndorsing] = useState<'regular' | 'expert' | null>(null);

  if (!skill) return null;

  const handleEndorse = async (type: 'regular' | 'expert') => {
    setIsEndorsing(type);
    try {
      await onEndorse(skill.id, type);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
    } finally {
      setIsEndorsing(null);
      onClose();
    }
  };

  const isExpertLevel = skill.userEndorsements >= 100;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-all duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      {/* Popup */}
      <div 
        className={`fixed inset-0 z-50 flex items-center justify-center p-6 transition-all duration-300 ${
          isOpen ? 'scale-100 opacity-100' : 'scale-75 opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      >
        <Card 
          className={`bg-gray-900/95 backdrop-blur-xl border-gray-800/50 rounded-3xl shadow-2xl max-w-sm w-full mx-4 transform transition-all duration-300 ${
            isOpen ? 'scale-100 translate-y-0' : 'scale-90 translate-y-4'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative p-6 pb-4">
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 w-8 h-8 p-0 hover:bg-gray-800/50 rounded-full"
              onClick={onClose}
            >
              <X className="w-4 h-4 text-gray-400" />
            </Button>
            
            <div className="text-center space-y-4">
              {/* Skill Icon/Badge */}
              <div className="relative mx-auto w-16 h-16 flex items-center justify-center">
                <div className="w-full h-full bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-2xl border border-gray-700/30 flex items-center justify-center">
                  <Zap className="w-8 h-8 text-purple-400" />
                </div>
                {isExpertLevel && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                    <Crown className="w-3 h-3 text-black fill-black" />
                  </div>
                )}
              </div>

              {/* Skill Name */}
              <div>
                <h2 className="text-xl font-light text-gray-100 mb-1">{skill.name}</h2>
                <p className="text-sm text-gray-400 font-light">{skill.category}</p>
              </div>

              {/* Expert Status */}
              {isExpertLevel && (
                <Badge className="bg-yellow-900/30 text-yellow-400 border border-yellow-800/30 px-3 py-1 rounded-full">
                  <Crown className="w-3 h-3 mr-1 fill-yellow-400" />
                  Expert Level
                </Badge>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="px-6 pb-6">
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Regular Endorsements */}
              <div className="bg-gray-800/30 rounded-2xl p-4 border border-gray-700/20">
                <div className="flex items-center justify-center mb-2">
                  <Users className="w-4 h-4 text-emerald-400 mr-2" />
                  <span className="text-xs text-gray-400 font-light">Regular</span>
                </div>
                <div className="text-center">
                  <div className="text-lg font-light text-emerald-400">{skill.userEndorsements}</div>
                  <div className="text-xs text-gray-500">endorsements</div>
                </div>
              </div>

              {/* Expert Endorsements */}
              <div className="bg-gray-800/30 rounded-2xl p-4 border border-gray-700/20">
                <div className="flex items-center justify-center mb-2">
                  <Crown className="w-4 h-4 text-amber-400 mr-2 fill-amber-400" />
                  <span className="text-xs text-gray-400 font-light">Expert</span>
                </div>
                <div className="text-center">
                  <div className="text-lg font-light text-amber-400">{skill.expertEndorsements}</div>
                  <div className="text-xs text-gray-500">endorsements</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                className="w-full bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-600/30 rounded-2xl h-12 font-light transition-all duration-300 hover:scale-105"
                onClick={() => handleEndorse('regular')}
                disabled={isEndorsing !== null}
              >
                {isEndorsing === 'regular' ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mr-2" />
                    Endorsing...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    Private Regular Endorsement
                  </div>
                )}
              </Button>

              <Button
                className="w-full bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 border border-amber-600/30 rounded-2xl h-12 font-light transition-all duration-300 hover:scale-105"
                onClick={() => handleEndorse('expert')}
                disabled={isEndorsing !== null}
              >
                {isEndorsing === 'expert' ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mr-2" />
                    Endorsing...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Crown className="w-4 h-4 mr-2 fill-amber-400" />
                    Public Expert Endorsement
                  </div>
                )}
              </Button>
            </div>

            {/* Additional Info */}
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500 font-light">
                Last endorsed {new Date(skill.lastEndorsed).toLocaleDateString()}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}