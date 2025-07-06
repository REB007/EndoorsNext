// Browser storage utilities for profile data
export interface StoredProfile {
  id: string;
  handle: string;
  name: string;
  bio: string;
  walletAddress: string;
  avatar: string;
  socialLinks: Array<{
    platform: string;
    url: string;
    verified: boolean;
  }>;
  createdAt: string;
  lastActive: string;
}

export interface StoredSkill {
  id: string;
  name: string;
  category: string;
  userEndorsements: number;
  expertEndorsements: number;
  totalEndorsements: number;
  isVerified: boolean;
  lastEndorsed: string;
}

export interface StoredSuperEndorsedUser {
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

const STORAGE_KEYS = {
  CURRENT_USER: 'social_skills_current_user',
  PROFILES: 'social_skills_profiles',
  SKILLS: 'social_skills_skills',
  SUPER_ENDORSED: 'social_skills_super_endorsed',
} as const;

// Current user management
export const getCurrentUser = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
};

export const setCurrentUser = (userId: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, userId);
};

export const isMyProfile = (profileId: string): boolean => {
  const currentUser = getCurrentUser();
  return currentUser === profileId;
};

// Profile data management
export const getStoredProfile = (profileId: string): StoredProfile | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const profiles = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROFILES) || '{}');
    return profiles[profileId] || null;
  } catch {
    return null;
  }
};

export const setStoredProfile = (profileId: string, profile: StoredProfile): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const profiles = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROFILES) || '{}');
    profiles[profileId] = profile;
    localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
  } catch (error) {
    console.error('Failed to store profile:', error);
  }
};

// Skills data management
export const getStoredSkills = (profileId: string): StoredSkill[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const allSkills = JSON.parse(localStorage.getItem(STORAGE_KEYS.SKILLS) || '{}');
    return allSkills[profileId] || [];
  } catch {
    return [];
  }
};

export const setStoredSkills = (profileId: string, skills: StoredSkill[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const allSkills = JSON.parse(localStorage.getItem(STORAGE_KEYS.SKILLS) || '{}');
    allSkills[profileId] = skills;
    localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(allSkills));
  } catch (error) {
    console.error('Failed to store skills:', error);
  }
};

// Super-endorsed users management
export const getStoredSuperEndorsed = (profileId: string): StoredSuperEndorsedUser[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const allSuperEndorsed = JSON.parse(localStorage.getItem(STORAGE_KEYS.SUPER_ENDORSED) || '{}');
    return allSuperEndorsed[profileId] || [];
  } catch {
    return [];
  }
};

export const setStoredSuperEndorsed = (profileId: string, users: StoredSuperEndorsedUser[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const allSuperEndorsed = JSON.parse(localStorage.getItem(STORAGE_KEYS.SUPER_ENDORSED) || '{}');
    allSuperEndorsed[profileId] = users;
    localStorage.setItem(STORAGE_KEYS.SUPER_ENDORSED, JSON.stringify(allSuperEndorsed));
  } catch (error) {
    console.error('Failed to store super-endorsed users:', error);
  }
};

// Initialize default user if none exists
export const initializeDefaultUser = (): void => {
  if (typeof window === 'undefined') return;
  
  const currentUser = getCurrentUser();
  if (!currentUser) {
    setCurrentUser('techpro_dev');
  }
};

// Clear all stored data (for testing/reset)
export const clearAllStoredData = (): void => {
  if (typeof window === 'undefined') return;
  
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};