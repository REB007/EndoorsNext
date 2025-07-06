import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES, SELF_APP_CONFIG, NETWORK_CONFIG } from '../lib/contracts';

// ABI snippet for the Profiles contract verification check
const PROFILES_ABI = [
  "function isVerified(address user) external view returns (bool)"
];

// Base64 encoded logo (replace with your actual logo)
const logo = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiMwMDAwMDAiLz4KICA8cGF0aCBkPSJNMjAgMjBIODBWODBIMjBWMjBaIiBmaWxsPSIjZmZmZmZmIi8+Cjwvc3ZnPgo=";

/**
 * Create a Self app configuration for Profiles verification
 * @param address User's wallet address
 * @param data Optional custom data to pass to the contract
 * @returns Self app configuration object
 */
export function createProfilesSelfAppConfig(address: string, data: any = {}) {
  return {
    appName: SELF_APP_CONFIG.appName,
    scope: SELF_APP_CONFIG.scope,
    endpoint: CONTRACT_ADDRESSES.PROFILES_CONTRACT,
    endpointType: SELF_APP_CONFIG.endpointType,
    logoBase64: logo,
    userId: address,
    userIdType: "hex",
    version: 2,
    disclosures: {},
    devMode: SELF_APP_CONFIG.devMode,
    userDefinedData: data,
  };
}

/**
 * Create a Self app configuration for Privacy Endorser verification
 * @param address User's wallet address
 * @param data Optional custom data to pass to the contract
 * @returns Self app configuration object
 */
export function createPrivacyEndorserSelfAppConfig(address: string, data: any = {}) {
  return {
    appName: SELF_APP_CONFIG.appName,
    scope: SELF_APP_CONFIG.scope,
    endpoint: CONTRACT_ADDRESSES.PRIVACY_ENDORSER_CONTRACT,
    endpointType: SELF_APP_CONFIG.endpointType,
    logoBase64: logo,
    userId: address,
    userIdType: "hex",
    version: 2,
    disclosures: {},
    devMode: SELF_APP_CONFIG.devMode,
    userDefinedData: data,
  };
}

/**
 * Generate a Self verification link for the Profiles contract
 * @param address User's wallet address
 * @param data Optional custom data to pass to the contract
 * @returns Self verification URL
 */
export function getProfilesVerificationLink(address: string, data: any = {}) {
  // This is a placeholder - in a real implementation, you would use the Self SDK
  // to generate the universal link
  const config = createProfilesSelfAppConfig(address, data);
  const baseUrl = "https://self.xyz/verify";
  const params = new URLSearchParams({
    appName: config.appName,
    scope: config.scope,
    endpoint: config.endpoint,
    endpointType: config.endpointType,
    userId: config.userId,
    userIdType: config.userIdType,
    version: '2',
    devMode: config.devMode ? 'true' : 'false',
  });
  
  return `${baseUrl}?${params.toString()}`;
}

/**
 * Generate a Self verification link for the Privacy Endorser contract
 * @param address User's wallet address
 * @param data Optional custom data to pass to the contract
 * @returns Self verification URL
 */
export function getPrivacyEndorserVerificationLink(address: string, data: any = {}) {
  // This is a placeholder - in a real implementation, you would use the Self SDK
  // to generate the universal link
  const config = createPrivacyEndorserSelfAppConfig(address, data);
  const baseUrl = "https://self.xyz/verify";
  const params = new URLSearchParams({
    appName: config.appName,
    scope: config.scope,
    endpoint: config.endpoint,
    endpointType: config.endpointType,
    userId: config.userId,
    userIdType: config.userIdType,
    version: '2',
    devMode: config.devMode ? 'true' : 'false',
  });
  
  return `${baseUrl}?${params.toString()}`;
}

/**
 * Check if a user is verified on the Profiles contract
 * @param address User's wallet address
 * @returns Promise<boolean> True if verified, false otherwise
 */
export async function isUserVerified(address: string): Promise<boolean> {
  try {
    if (!address) return false;
    
    console.log(`Checking verification for address: ${address}`);
    
    // For development purposes, we'll use a mock implementation
    // In production, you would call the actual contract
    
    // Mock verification check - consider addresses starting with 0x0 or 0x1 as verified
    const isVerified = address.toLowerCase().startsWith('0x0') || 
                       address.toLowerCase().startsWith('0x1');
    
    console.log(`Verification status for ${address}: ${isVerified}`);
    return isVerified;
    
    /* Real implementation would be:
    // Get the network configuration
    const network = process.env.NEXT_PUBLIC_NETWORK || 'testnet';
    const rpcUrl = NETWORK_CONFIG.RPC_URLS[network as keyof typeof NETWORK_CONFIG.RPC_URLS];
    
    // Create a provider
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    
    // Create a contract instance
    const profilesContract = new ethers.Contract(
      CONTRACT_ADDRESSES.PROFILES_CONTRACT,
      PROFILES_ABI,
      provider
    );
    
    // Call the contract to check if the user is verified
    const isVerified = await profilesContract.isVerified(address);
    return isVerified;
    */
  } catch (error) {
    console.error("Error checking verification status:", error);
    return false;
  }
}
