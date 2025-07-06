import { Profile, Skill, SuperEndorsedUser, BlockchainResponse, FetcherOptions } from '@/types/profile';
import { 
  getStoredProfile, 
  setStoredProfile, 
  getStoredSkills, 
  setStoredSkills, 
  getStoredSuperEndorsed, 
  setStoredSuperEndorsed,
  StoredProfile,
  StoredSkill,
  StoredSuperEndorsedUser
} from '@/utils/storage';
import mockData from '@/data/mock-profile.json';

// Generic response wrapper
const createResponse = <T>(
  data: T | null, 
  success: boolean = true, 
  error?: string
): BlockchainResponse<T> => ({
  success,
  data,
  error,
  timestamp: new Date().toISOString(),
});

// Convert stored data to API format
const convertStoredProfile = (stored: StoredProfile): Profile => ({
  ...stored,
});

const convertStoredSkill = (stored: StoredSkill): Skill => ({
  ...stored,
});

const convertStoredSuperEndorsed = (stored: StoredSuperEndorsedUser): SuperEndorsedUser => ({
  ...stored,
});

// Convert API data to stored format
const convertToStoredProfile = (profile: Profile): StoredProfile => ({
  ...profile,
});

const convertToStoredSkill = (skill: Skill): StoredSkill => ({
  ...skill,
});

const convertToStoredSuperEndorsed = (user: SuperEndorsedUser): StoredSuperEndorsedUser => ({
  ...user,
});

/**
 * Fetch user profile data including name, bio, and wallet address
 */
export const getProfile = async (
  profileId?: string,
  options: FetcherOptions = {}
): Promise<BlockchainResponse<Profile>> => {
  try {
    console.log('Fetching profile...', { profileId });
    
    if (!profileId) {
      throw new Error('Profile ID is required');
    }

    // Check browser storage first
    const storedProfile = getStoredProfile(profileId);
    if (storedProfile) {
      console.log('Profile loaded from storage', { handle: storedProfile.handle });
      return createResponse(convertStoredProfile(storedProfile));
    }

    // Fallback to mock data (simulate API call)
    const profile: Profile = {
      ...mockData.profile,
      id: profileId,
      handle: profileId,
      socialLinks: mockData.profile.socialLinks.map(link => ({
        platform: link.platform,
        url: link.url,
        verified: link.verified
      }))
    };

    // Store in browser for future use
    setStoredProfile(profileId, convertToStoredProfile(profile));

    console.log('Profile fetched from mock data and stored', { handle: profile.handle });
    return createResponse(profile);

  } catch (error) {
    console.error('Failed to fetch profile:', error);
    return createResponse<Profile>(
      null, 
      false, 
      error instanceof Error ? error.message : 'Unknown error occurred'
    );
  }
};

/**
 * Update user profile data
 */
export const updateProfile = async (
  profileId: string,
  updates: Partial<Profile>,
  options: FetcherOptions = {}
): Promise<BlockchainResponse<Profile>> => {
  try {
    console.log('Updating profile...', { profileId, updates });
    
    // Get current profile
    const currentProfile = getStoredProfile(profileId);
    if (!currentProfile) {
      throw new Error('Profile not found');
    }

    // Merge updates
    const updatedProfile: StoredProfile = {
      ...currentProfile,
      ...updates,
      lastActive: new Date().toISOString(),
    };

    // Store updated profile
    setStoredProfile(profileId, updatedProfile);

    console.log('Profile updated successfully', { handle: updatedProfile.handle });
    return createResponse(convertStoredProfile(updatedProfile));

  } catch (error) {
    console.error('Failed to update profile:', error);
    return createResponse<Profile>(
      null, 
      false, 
      error instanceof Error ? error.message : 'Failed to update profile'
    );
  }
};

/**
 * Retrieve validated skills and endorsements
 */
export const getSkills = async (
  profileId?: string,
  options: FetcherOptions = {}
): Promise<BlockchainResponse<Skill[]>> => {
  try {
    console.log('Fetching skills...', { profileId });
    
    if (!profileId) {
      throw new Error('Profile ID is required');
    }

    // Check browser storage first
    const storedSkills = getStoredSkills(profileId);
    if (storedSkills.length > 0) {
      console.log('Skills loaded from storage', { count: storedSkills.length });
      return createResponse(storedSkills.map(convertStoredSkill));
    }

    // Fallback to mock data
    const skills: Skill[] = mockData.skills.map(skill => ({
      id: skill.id,
      name: skill.name,
      category: skill.category,
      userEndorsements: skill.userEndorsements,
      expertEndorsements: skill.expertEndorsements,
      totalEndorsements: skill.totalEndorsements,
      isVerified: skill.isVerified,
      lastEndorsed: skill.lastEndorsed
    }));

    // Store in browser for future use
    setStoredSkills(profileId, skills.map(convertToStoredSkill));

    console.log('Skills fetched from mock data and stored', { count: skills.length });
    return createResponse(skills);

  } catch (error) {
    console.error('Failed to fetch skills:', error);
    return createResponse<Skill[]>(
      null, 
      false, 
      error instanceof Error ? error.message : 'Failed to retrieve skills data'
    );
  }
};

/**
 * Update user skills
 */
export const updateSkills = async (
  profileId: string,
  skills: Skill[],
  options: FetcherOptions = {}
): Promise<BlockchainResponse<Skill[]>> => {
  try {
    console.log('Updating skills...', { profileId, count: skills.length });
    
    // Store updated skills
    setStoredSkills(profileId, skills.map(convertToStoredSkill));

    console.log('Skills updated successfully', { count: skills.length });
    return createResponse(skills);

  } catch (error) {
    console.error('Failed to update skills:', error);
    return createResponse<Skill[]>(
      null, 
      false, 
      error instanceof Error ? error.message : 'Failed to update skills'
    );
  }
};

/**
 * Get highly endorsed users (>10 endorsements)
 */
export const getSuperEndorsed = async (
  profileId?: string,
  minEndorsements: number = 10,
  options: FetcherOptions = {}
): Promise<BlockchainResponse<SuperEndorsedUser[]>> => {
  try {
    console.log('Fetching super-endorsed users...', { profileId, minEndorsements });
    
    if (!profileId) {
      // For viewing others' profiles, use mock data
      const superEndorsedUsers: SuperEndorsedUser[] = mockData.superEndorsedUsers
        .filter(user => user.endorsementCount >= minEndorsements)
        .map(user => ({
          id: user.id,
          handle: user.handle,
          name: user.name,
          avatar: user.avatar,
          walletAddress: user.walletAddress,
          endorsementCount: user.endorsementCount,
          skills: user.skills,
          reputation: user.reputation,
          isExpert: user.isExpert
        }))
        .sort((a, b) => b.endorsementCount - a.endorsementCount);

      return createResponse(superEndorsedUsers);
    }

    // Check browser storage first for user's own profile
    const storedSuperEndorsed = getStoredSuperEndorsed(profileId);
    if (storedSuperEndorsed.length > 0) {
      console.log('Super-endorsed users loaded from storage', { count: storedSuperEndorsed.length });
      return createResponse(storedSuperEndorsed.map(convertStoredSuperEndorsed));
    }

    // Fallback to mock data
    const superEndorsedUsers: SuperEndorsedUser[] = mockData.superEndorsedUsers
      .filter(user => user.endorsementCount >= minEndorsements)
      .map(user => ({
        id: user.id,
        handle: user.handle,
        name: user.name,
        avatar: user.avatar,
        walletAddress: user.walletAddress,
        endorsementCount: user.endorsementCount,
        skills: user.skills,
        reputation: user.reputation,
        isExpert: user.isExpert
      }))
      .sort((a, b) => b.endorsementCount - a.endorsementCount);

    // Store in browser for future use
    setStoredSuperEndorsed(profileId, superEndorsedUsers.map(convertToStoredSuperEndorsed));

    console.log('Super-endorsed users fetched from mock data and stored', { 
      count: superEndorsedUsers.length,
      minEndorsements 
    });
    
    return createResponse(superEndorsedUsers);

  } catch (error) {
    console.error('Failed to fetch super-endorsed users:', error);
    return createResponse<SuperEndorsedUser[]>(
      null, 
      false, 
      error instanceof Error ? error.message : 'Failed to retrieve super-endorsed users'
    );
  }
};

/**
 * Update super-endorsed users
 */
export const updateSuperEndorsed = async (
  profileId: string,
  users: SuperEndorsedUser[],
  options: FetcherOptions = {}
): Promise<BlockchainResponse<SuperEndorsedUser[]>> => {
  try {
    console.log('Updating super-endorsed users...', { profileId, count: users.length });
    
    // Store updated super-endorsed users
    setStoredSuperEndorsed(profileId, users.map(convertToStoredSuperEndorsed));

    console.log('Super-endorsed users updated successfully', { count: users.length });
    return createResponse(users);

  } catch (error) {
    console.error('Failed to update super-endorsed users:', error);
    return createResponse<SuperEndorsedUser[]>(
      null, 
      false, 
      error instanceof Error ? error.message : 'Failed to update super-endorsed users'
    );
  }
};

/**
 * Utility function to get all profile data in a single call
 * Combines profile, skills, and super-endorsed data
 */
export const getFullProfile = async (
  profileId?: string,
  options: FetcherOptions = {}
): Promise<{
  profile: BlockchainResponse<Profile>;
  skills: BlockchainResponse<Skill[]>;
  superEndorsed: BlockchainResponse<SuperEndorsedUser[]>;
}> => {
  console.log('Fetching complete profile data...');
  
  try {
    // Fetch all data concurrently
    const [profileResponse, skillsResponse, superEndorsedResponse] = await Promise.all([
      getProfile(profileId, options),
      getSkills(profileId, options),
      getSuperEndorsed(profileId, 10, options)
    ]);

    console.log('Complete profile data fetched');
    
    return {
      profile: profileResponse,
      skills: skillsResponse,
      superEndorsed: superEndorsedResponse
    };
  } catch (error) {
    console.error('Failed to fetch complete profile:', error);
    throw error;
  }
};