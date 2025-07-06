export interface Profile {
  id: string;
  handle: string;
  name: string;
  bio: string;
  walletAddress: string;
  avatar: string;
  socialLinks: SocialLink[];
  createdAt: string;
  lastActive: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  verified: boolean;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  userEndorsements: number;
  expertEndorsements: number;
  totalEndorsements: number;
  isVerified: boolean;
  lastEndorsed: string;
}

export interface SuperEndorsedUser {
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

export interface BlockchainResponse<T> {
  success: boolean;
  data: T | null;
  error?: string;
  timestamp: string;
  blockHeight?: number;
  gasUsed?: string;
}

export interface FetcherOptions {
  timeout?: number;
  retries?: number;
  cacheTime?: number;
}