'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Search, Users, Crown } from 'lucide-react';
import { getCurrentUser } from '@/utils/storage';

interface Contact {
  id: string;
  handle: string;
  name: string;
  avatar: string;
  isExpert: boolean;
  reputation: number;
  skills: string[];
  lastActive: string;
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Mock contacts data
  const mockContacts: Contact[] = [
    {
      id: "user_001",
      handle: "alexdev",
      name: "Alex Rivera",
      avatar: "https://xsgames.co/randomusers/avatar.php?g=male&seed=1",
      isExpert: true,
      reputation: 892,
      skills: ["React", "TypeScript", "Node.js"],
      lastActive: "2024-12-20T14:22:00Z"
    },
    {
      id: "user_002",
      handle: "sarah_ui",
      name: "Sarah Chen",
      avatar: "https://xsgames.co/randomusers/avatar.php?g=female&seed=2",
      isExpert: true,
      reputation: 756,
      skills: ["UI/UX", "Figma", "Design Systems"],
      lastActive: "2024-12-20T12:15:00Z"
    },
    {
      id: "user_003",
      handle: "mikecode",
      name: "Mike Johnson",
      avatar: "https://xsgames.co/randomusers/avatar.php?g=male&seed=3",
      isExpert: true,
      reputation: 1024,
      skills: ["Python", "Machine Learning", "Data Science"],
      lastActive: "2024-12-20T10:30:00Z"
    },
    {
      id: "user_004",
      handle: "jenny_tech",
      name: "Jennifer Wu",
      avatar: "https://xsgames.co/randomusers/avatar.php?g=female&seed=4",
      isExpert: false,
      reputation: 634,
      skills: ["Blockchain", "Solidity", "Web3"],
      lastActive: "2024-12-19T18:45:00Z"
    },
    {
      id: "user_005",
      handle: "davidops",
      name: "David Kim",
      avatar: "https://xsgames.co/randomusers/avatar.php?g=male&seed=5",
      isExpert: true,
      reputation: 1156,
      skills: ["DevOps", "Kubernetes", "AWS"],
      lastActive: "2024-12-20T09:20:00Z"
    },
    {
      id: "user_006",
      handle: "lisa_design",
      name: "Lisa Martinez",
      avatar: "https://xsgames.co/randomusers/avatar.php?g=female&seed=6",
      isExpert: true,
      reputation: 823,
      skills: ["Graphic Design", "Branding", "Illustration"],
      lastActive: "2024-12-19T16:30:00Z"
    },
    {
      id: "user_007",
      handle: "tomrust",
      name: "Tom Anderson",
      avatar: "https://xsgames.co/randomusers/avatar.php?g=male&seed=7",
      isExpert: true,
      reputation: 1289,
      skills: ["Rust", "Systems Programming", "Performance"],
      lastActive: "2024-12-20T11:45:00Z"
    },
    {
      id: "user_008",
      handle: "anna_cloud",
      name: "Anna Petrov",
      avatar: "https://xsgames.co/randomusers/avatar.php?g=female&seed=8",
      isExpert: false,
      reputation: 712,
      skills: ["Cloud Architecture", "Azure", "Terraform"],
      lastActive: "2024-12-19T14:20:00Z"
    }
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setContacts(mockContacts);
      setLoading(false);
    }, 500);
  }, []);

  const filteredContacts = contacts.filter(contact =>
    contact.handle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleContactClick = (handle: string) => {
    window.location.href = `/profile?id=${handle}`;
  };

  const handleBackClick = () => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      window.location.href = `/profile?id=${currentUser}`;
    } else {
      window.location.href = '/';
    }
  };

  const formatLastActive = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Active now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <div className="h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-hidden">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between p-6">
          <Button
            onClick={handleBackClick}
            variant="ghost"
            className="text-gray-400 hover:text-white transition-colors duration-300"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          
          <div className="flex items-center space-x-2">
            <Users className="w-6 h-6 text-purple-400" />
            <h1 className="text-xl font-light tracking-wide text-gray-100">Contacts</h1>
          </div>
          
          <div className="w-20"></div> {/* Spacer for symmetry */}
        </div>

        {/* Search */}
        <div className="flex-shrink-0 px-6 pb-4">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800/30 border border-gray-700/50 rounded-2xl pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 transition-colors duration-300"
            />
          </div>
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-400">Loading contacts...</div>
            </div>
          ) : (
            <div className="space-y-3 max-w-md mx-auto">
              {filteredContacts.map((contact) => (
                <Card
                  key={contact.id}
                  className="bg-gray-900/30 backdrop-blur-xl border-gray-800/50 rounded-2xl shadow-xl hover:bg-gray-800/40 transition-all duration-300 cursor-pointer"
                  onClick={() => handleContactClick(contact.handle)}
                >
                  <div className="p-4 flex items-center space-x-4">
                    <div className="relative">
                      <img
                        src={contact.avatar}
                        alt={contact.name}
                        className="w-12 h-12 rounded-xl object-cover border border-gray-700/30"
                      />
                      {contact.isExpert && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center">
                          <Crown className="w-2.5 h-2.5 text-white fill-white" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-white truncate">@{contact.handle}</h3>
                        <span className="text-xs text-gray-400">{formatLastActive(contact.lastActive)}</span>
                      </div>
                      <p className="text-sm text-gray-400 truncate">{contact.name}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-purple-400">{contact.reputation} rep</span>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-gray-500 truncate">
                          {contact.skills.slice(0, 2).join(', ')}
                          {contact.skills.length > 2 && '...'}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
              
              {filteredContacts.length === 0 && !loading && (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No contacts found</p>
                  {searchTerm && (
                    <p className="text-gray-500 text-sm mt-2">
                      Try adjusting your search terms
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}