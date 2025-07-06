import { SelfAppBuilder } from "@selfxyz/qrcode";
import { getUniversalLink } from "@selfxyz/core";
import { getContractAddresses, SELF_APP_CONFIG } from "../lib/config";

// Base64 encoded logo (replace with your actual logo)
const logo = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiMwMDAwMDAiLz4KICA8cGF0aCBkPSJNMjAgMjBIODBWODBIMjBWMjBaIiBmaWxsPSIjZmZmZmZmIi8+Cjwvc3ZnPgo=";

/**
 * Create a Self app instance for Profiles verification
 * @param address User's wallet address
 * @param data Optional custom data to pass to the contract
 * @returns Self app instance
 */
export const createProfilesSelfApp = (address: string, data: any = {}) => {
  const { profilesContract } = getContractAddresses();
  
  return new SelfAppBuilder({
    appName: SELF_APP_CONFIG.appName,
    scope: SELF_APP_CONFIG.scope,
    endpoint: profilesContract,
    endpointType: SELF_APP_CONFIG.endpointType as any,
    logoBase64: logo,
    userId: address,
    userIdType: "hex",
    version: 2,
    disclosures: {},
    devMode: SELF_APP_CONFIG.devMode,
    userDefinedData: data,
  }).build();
};

/**
 * Create a Self app instance for Privacy Endorser verification
 * @param address User's wallet address
 * @param data Optional custom data to pass to the contract
 * @returns Self app instance
 */
export const createPrivacyEndorserSelfApp = (address: string, data: any = {}) => {
  const { privacyEndorserContract } = getContractAddresses();
  
  return new SelfAppBuilder({
    appName: SELF_APP_CONFIG.appName,
    scope: SELF_APP_CONFIG.scope,
    endpoint: privacyEndorserContract,
    endpointType: SELF_APP_CONFIG.endpointType as any,
    logoBase64: logo,
    userId: address,
    userIdType: "hex",
    version: 2,
    disclosures: {},
    devMode: SELF_APP_CONFIG.devMode,
    userDefinedData: data,
  }).build();
};

/**
 * Get the universal link for Self verification
 * @param address User's wallet address
 * @param data Optional custom data to pass to the contract
 * @returns Universal link URL
 */
export const getProfilesVerificationLink = (address: string, data: any = {}) => {
  const selfApp = createProfilesSelfApp(address, data);
  return (selfApp as any).getUniversalLink();
};

/**
 * Get the universal link for Privacy Endorser verification
 * @param address User's wallet address
 * @param data Optional custom data to pass to the contract
 * @returns Universal link URL
 */
export const getPrivacyEndorserVerificationLink = (address: string, data: any = {}) => {
  const selfApp = createPrivacyEndorserSelfApp(address, data);
  return (selfApp as any).getUniversalLink();
};

/**
 * Check if a user is verified on the Profiles contract
 * @param address User's wallet address
 * @returns Promise<boolean> True if verified, false otherwise
 */
export const isUserVerified = async (address: string): Promise<boolean> => {
  try {
    // Implementation will depend on your contract ABI and interaction method
    // This is a placeholder - you'll need to implement the actual contract call
    const { profilesContract } = getContractAddresses();
    
    // Example using ethers.js or viem would go here
    // const provider = new ethers.providers.JsonRpcProvider();
    // const contract = new ethers.Contract(profilesContract, ABI, provider);
    // return await contract.isVerified(address);
    
    // For now, return a mock implementation
    return false;
  } catch (error) {
    console.error("Error checking verification status:", error);
    return false;
  }
};
