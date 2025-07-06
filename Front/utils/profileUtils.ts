import { uploadJSONToIPFS, fetchJSONFromIPFS } from './ipfsUtils';
import { ethers } from 'ethers';

// Define the profile data structure
export interface ProfileData {
  name?: string;
  bio?: string;
  avatar?: string;
  skills?: string[];
  socials?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    telegram?: string;
    discord?: string;
    [key: string]: string | undefined;
  };
  createdAt: number;
  updatedAt: number;
}

// Define the ABI for the Profiles contract (minimal version)
const PROFILES_ABI = [
  "function setMetadata(string memory metadataURI) external",
  "function getMetadata(address user) external view returns (string memory)",
  "function isVerified(address user) external view returns (bool)",
];

/**
 * Create a new profile or update an existing one
 * @param profileData Profile data to save
 * @param signer Ethers signer with the user's wallet
 * @param contractAddress Address of the Profiles contract
 * @returns Transaction hash
 */
export async function saveProfile(
  profileData: ProfileData,
  signer: ethers.Signer,
  contractAddress: string
): Promise<string> {
  try {
    // Add timestamps
    profileData.updatedAt = Date.now();
    if (!profileData.createdAt) {
      profileData.createdAt = profileData.updatedAt;
    }
    
    // Upload profile data to IPFS
    const cid = await uploadJSONToIPFS(profileData);
    
    // Create contract instance
    const profilesContract = new ethers.Contract(
      contractAddress,
      PROFILES_ABI,
      signer
    );
    
    // Set the metadata URI in the contract
    const tx = await profilesContract.setMetadata(`ipfs://${cid}`);
    await tx.wait();
    
    return tx.hash;
  } catch (error) {
    console.error('Error saving profile:', error);
    throw new Error('Failed to save profile');
  }
}

/**
 * Get a user's profile data
 * @param address User's wallet address
 * @param contractAddress Address of the Profiles contract
 * @param provider Ethers provider
 * @returns Profile data or null if not found
 */
export async function getProfile(
  address: string,
  contractAddress: string,
  provider: ethers.Provider
): Promise<ProfileData | null> {
  try {
    // Create contract instance
    const profilesContract = new ethers.Contract(
      contractAddress,
      PROFILES_ABI,
      provider
    );
    
    // Get the metadata URI from the contract
    const metadataURI = await profilesContract.getMetadata(address);
    
    // If no metadata is set, return null
    if (!metadataURI || metadataURI === '') {
      return null;
    }
    
    // Extract the CID from the metadata URI
    const cid = metadataURI.replace('ipfs://', '');
    
    // Fetch the profile data from IPFS
    const profileData = await fetchJSONFromIPFS(cid);
    
    return profileData as ProfileData;
  } catch (error) {
    console.error('Error getting profile:', error);
    return null;
  }
}

/**
 * Check if a user is verified
 * @param address User's wallet address
 * @param contractAddress Address of the Profiles contract
 * @param provider Ethers provider
 * @returns True if verified, false otherwise
 */
export async function isUserVerified(
  address: string,
  contractAddress: string,
  provider: ethers.Provider
): Promise<boolean> {
  try {
    // Create contract instance
    const profilesContract = new ethers.Contract(
      contractAddress,
      PROFILES_ABI,
      provider
    );
    
    // Check if the user is verified
    const isVerified = await profilesContract.isVerified(address);
    
    return isVerified;
  } catch (error) {
    console.error('Error checking verification status:', error);
    
    // For development, return a mock result
    if (process.env.NODE_ENV === 'development') {
      return address.toLowerCase().startsWith('0x0') || 
             address.toLowerCase().startsWith('0x1');
    }
    
    return false;
  }
}
