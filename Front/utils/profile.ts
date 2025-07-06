import { createPublicClient, createWalletClient, http, parseAbi, getContract, type PublicClient, type WalletClient } from 'viem';
import { celoAlfajores } from 'viem/chains';
import { usePrivy } from '@privy-io/react-auth';
import { Skill, PublicUserProfile, SuperEndorsement, SuperEndorsementMatrix } from '@/lib/types';

// Contract ABI for the Profiles contract
// This is a subset of the full ABI with just the functions we need
const PROFILES_ABI = parseAbi([
  // View functions
  'function getProfileUri(address user) external view returns (string memory)',
  'function getSkills(address user) external view returns (tuple(string name, uint256 totalEndorsements, uint256 expertEndorsements, bool isExpert)[4])',
  'function getSuperEndorsedMatrix(address user) external view returns (tuple(address endorser, uint8 x, uint8 y, string message)[16])',
  
  // Write functions
  'function setProfileUri(string memory uri) external',
  'function setSkill(address user, uint256 index, string memory name) external',
  'function setSuperEndorsement(address target, uint8 x, uint8 y, string memory message) external',
  'function expertEndorseSkill(address target, bytes32 skillId) external',
]);

// Get the contract address from environment variable
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_PROFILES_CONTRACT_TESTNET as `0x${string}` || '0x0000000000000000000000000000000000000000';

/**
 * Create a public client for read operations on Alfajores testnet
 */
export function createClient() {
  return createPublicClient({
    chain: celoAlfajores,
    transport: http(),
  });
}

/**
 * Get the Profiles contract instance
 */
export function getProfilesContract(walletClient: WalletClient | undefined = undefined) {
  const publicClient = createClient();
  
  if (!CONTRACT_ADDRESS) {
    console.error('Contract address not set in environment variables');
    throw new Error('Contract address not configured');
  }
  
  // Create contract instance with the correct client type
  return getContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: PROFILES_ABI,
    client: { public: publicClient, wallet: walletClient },
  });
}

/**
 * Hook to get a wallet client using Privy
 */
export function useWalletClient() {
  const { user, authenticated, ready } = usePrivy();
  
  if (!ready || !authenticated || !user?.wallet?.address) {
    return null;
  }
  
  // This is a simplified approach - in a real implementation,
  // you would use Privy's wallet to sign transactions
  return createWalletClient({
    chain: celoAlfajores,
    transport: http(),
  });
}

/**
 * Get a user's profile URI
 */
export async function getProfileUri(address: string): Promise<string> {
  try {
    const publicClient = createClient();
    const result = await publicClient.readContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: PROFILES_ABI,
      functionName: 'getProfileUri',
      args: [address]
    });
    return result as string;
  } catch (error) {
    console.error('[getProfileUri] Error:', error);
    return '';
  }
}

/**
 * Get a user's skills
 */
export async function getSkills(address: string): Promise<Skill[]> {
  try {
    const publicClient = createClient();
    const skills = await publicClient.readContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: PROFILES_ABI,
      functionName: 'getSkills',
      args: [address]
    });
    return skills as Skill[];
  } catch (error) {
    console.error('[getSkills] Error:', error);
    return [];
  }
}

/**
 * Get a user's super endorsement matrix
 */
export async function getSuperEndorsedMatrix(address: string): Promise<SuperEndorsementMatrix> {
  try {
    const publicClient = createClient();
    const matrix = await publicClient.readContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: PROFILES_ABI,
      functionName: 'getSuperEndorsedMatrix',
      args: [address]
    });
    return matrix as SuperEndorsementMatrix;
  } catch (error) {
    console.error('[getSuperEndorsedMatrix] Error:', error);
    return [];
  }
}

/**
 * Set a user's profile URI
 */
export async function setProfileUri(
  uri: string, 
  walletClient: WalletClient
): Promise<boolean> {
  try {
    // Get the account address from the wallet client
    const [account] = await walletClient.getAddresses();
    
    const hash = await walletClient.writeContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: PROFILES_ABI,
      functionName: 'setProfileUri',
      args: [uri],
      chain: celoAlfajores,
      account
    });
    return !!hash;
  } catch (error) {
    console.error('[setProfileUri] Error:', error);
    return false;
  }
}

/**
 * Set a skill for a user
 */
export async function setSkill(
  user: string,
  index: number,
  name: string,
  walletClient: WalletClient
): Promise<boolean> {
  try {
    if (index < 0 || index > 3) {
      throw new Error('Skill index must be between 0 and 3');
    }
    
    // Get the account address from the wallet client
    const [account] = await walletClient.getAddresses();
    
    const hash = await walletClient.writeContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: PROFILES_ABI,
      functionName: 'setSkill',
      args: [user, BigInt(index), name],
      chain: celoAlfajores,
      account
    });
    return !!hash;
  } catch (error) {
    console.error('[setSkill] Error:', error);
    return false;
  }
}

/**
 * Set a super endorsement
 */
export async function setSuperEndorsement(
  target: string,
  x: number,
  y: number,
  message: string,
  walletClient: WalletClient
): Promise<boolean> {
  try {
    if (x < 0 || x > 3 || y < 0 || y > 3) {
      throw new Error('Position must be between 0 and 3');
    }
    
    // Get the account address from the wallet client
    const [account] = await walletClient.getAddresses();
    
    const hash = await walletClient.writeContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: PROFILES_ABI,
      functionName: 'setSuperEndorsement',
      args: [target, x, y, message],
      chain: celoAlfajores,
      account
    });
    return !!hash;
  } catch (error) {
    console.error('[setSuperEndorsement] Error:', error);
    return false;
  }
}

/**
 * Expert endorse a skill
 */
export async function expertEndorseSkill(
  target: string,
  skillName: string,
  walletClient: WalletClient
): Promise<boolean> {
  try {
    // Convert skill name to bytes32 skillId using keccak256
    const encoder = new TextEncoder();
    const data = encoder.encode(skillName);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    
    // Convert ArrayBuffer to hexadecimal string with 0x prefix
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const skillId = '0x' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    // Get the account address from the wallet client
    const [account] = await walletClient.getAddresses();
    
    const hash = await walletClient.writeContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: PROFILES_ABI,
      functionName: 'expertEndorseSkill',
      args: [target, skillId as `0x${string}`],
      chain: celoAlfajores,
      account
    });
    return !!hash;
  } catch (error) {
    console.error('[expertEndorseSkill] Error:', error);
    return false;
  }
}

/**
 * Upload a profile to IPFS and update the contract
 */
export async function uploadAndSetProfile(
  profile: PublicUserProfile,
  walletClient: any
): Promise<boolean> {
  try {
    // Convert profile to JSON
    const profileJson = JSON.stringify(profile);
    
    // Create a file object
    const file = new File([profileJson], 'profile.json', { type: 'application/json' });
    
    // Import the uploadToIPFS function from handshake.ts
    const { uploadToIPFS } = await import('./handshake');
    
    // Upload to IPFS
    const ipfsUri = await uploadToIPFS(file);
    
    // Set the profile URI in the contract
    return await setProfileUri(ipfsUri, walletClient);
  } catch (error) {
    console.error('[uploadAndSetProfile] Error:', error);
    return false;
  }
}

/**
 * Fetch a profile from IPFS
 */
export async function fetchProfileFromIPFS(uri: string): Promise<PublicUserProfile | null> {
  try {
    // Import the ipfsToHttp function from handshake.ts
    const { ipfsToHttp } = await import('./handshake');
    
    // Convert IPFS URI to HTTP URL
    const httpUrl = ipfsToHttp(uri);
    
    // Fetch the profile
    const response = await fetch(httpUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch profile: ${response.statusText}`);
    }
    
    // Parse the JSON
    const profile = await response.json();
    return profile as PublicUserProfile;
  } catch (error) {
    console.error('[fetchProfileFromIPFS] Error:', error);
    return null;
  }
}

/**
 * Get a user's complete profile including skills and profile data
 */
export async function getCompleteProfile(address: string): Promise<{
  profile: PublicUserProfile | null;
  skills: Skill[];
  superMatrix: SuperEndorsementMatrix;
}> {
  try {
    // Get profile URI
    const profileUri = await getProfileUri(address);
    
    // Get profile data from IPFS if URI exists
    let profile = null;
    if (profileUri) {
      profile = await fetchProfileFromIPFS(profileUri);
    }
    
    // Get skills
    const skills = await getSkills(address);
    
    // Get super endorsement matrix
    const superMatrix = await getSuperEndorsedMatrix(address);
    
    return {
      profile,
      skills,
      superMatrix,
    };
  } catch (error) {
    console.error('[getCompleteProfile] Error:', error);
    return {
      profile: null,
      skills: [],
      superMatrix: [],
    };
  }
}
