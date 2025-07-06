import { ethers } from 'ethers';
import { getContractAddresses, ENS_CONFIG } from '../lib/config';

// Simple namehash implementation
function namehash(name: string): string {
  let node = '0x0000000000000000000000000000000000000000000000000000000000000000';
  if (name) {
    const labels = name.split('.');
    for (let i = labels.length - 1; i >= 0; i--) {
      const labelHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(labels[i]));
      node = ethers.utils.keccak256(ethers.utils.concat([node, labelHash].map(h => ethers.utils.arrayify(h))));
    }
  }
  return node;
}

// ABI snippets for the contracts (you'll need to replace these with your actual ABIs)
const L2RegistrarABI = [
  "function register(string calldata label, address owner) external returns (uint256)",
  "function available(string calldata label) external view returns (bool)"
];

const L2RegistryABI = [
  "function resolver(bytes32 node) external view returns (address)",
  "function owner(bytes32 node) external view returns (address)"
];

/**
 * Check if a subdomain is available
 * @param name The subdomain name to check (without .endoors.eth)
 * @returns Promise<boolean> True if available, false otherwise
 */
export const isSubdomainAvailable = async (name: string): Promise<boolean> => {
  try {
    const { l2RegistrarContract } = getContractAddresses();
    
    // Connect to provider
    const provider = new ethers.JsonRpcProvider(
      process.env.NEXT_PUBLIC_NETWORK === 'mainnet' 
        ? 'https://forno.celo.org' 
        : 'https://alfajores-forno.celo-testnet.org'
    );
    
    // Create contract instance
    const registrar = new ethers.Contract(l2RegistrarContract, L2RegistrarABI, provider);
    
    // Check availability
    return await registrar.available(name);
  } catch (error) {
    console.error("Error checking subdomain availability:", error);
    return false;
  }
};

/**
 * Register a new subdomain
 * @param name The subdomain name to register (without .endoors.eth)
 * @param ownerAddress The address that will own the subdomain
 * @param signer Ethers signer with the authority to register
 * @returns Promise<boolean> True if registration successful, false otherwise
 */
export const registerSubdomain = async (
  name: string, 
  ownerAddress: string,
  signer: ethers.Signer
): Promise<boolean> => {
  try {
    const { l2RegistrarContract } = getContractAddresses();
    
    // Create contract instance with signer
    const registrar = new ethers.Contract(l2RegistrarContract, L2RegistrarABI, signer);
    
    // Register the subdomain
    const tx = await registrar.register(name, ownerAddress);
    await tx.wait();
    
    return true;
  } catch (error) {
    console.error("Error registering subdomain:", error);
    return false;
  }
};

/**
 * Resolve a subdomain to an address
 * @param name The full subdomain name (e.g., "john.endoors.eth")
 * @returns Promise<string> The resolved address or empty string if not found
 */
export const resolveSubdomain = async (name: string): Promise<string> => {
  try {
    const { l2RegistryContract } = getContractAddresses();
    
    // Connect to provider
    const provider = new ethers.providers.getDefaultProvider(
      process.env.NEXT_PUBLIC_NETWORK === 'mainnet' 
        ? 'https://forno.celo.org' 
        : 'https://alfajores-forno.celo-testnet.org'
    );
    
    // Create contract instance
    const registry = new ethers.Contract(l2RegistryContract, L2RegistryABI, provider);
    
    // Parse the name
    const nameParts = name.split('.');
    if (nameParts.length < 3 || `${nameParts[1]}.${nameParts[2]}` !== ENS_CONFIG.domain) {
      throw new Error("Invalid subdomain format");
    }
    
    const label = nameParts[0];
    
    // Calculate the namehash
    const labelHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(label));
    const rootNode = namehash(ENS_CONFIG.domain);
    const node = ethers.utils.keccak256(
      ethers.utils.concat([rootNode, labelHash])
    );
    
    // Get the owner
    const owner = await registry.owner(node);
    return owner;
  } catch (error) {
    console.error("Error resolving subdomain:", error);
    return "";
  }
};

/**
 * Format a subdomain name
 * @param name The subdomain name (without .endoors.eth)
 * @returns The full ENS name
 */
export const formatSubdomainName = (name: string): string => {
  return `${name}.${ENS_CONFIG.domain}`;
};

/**
 * Extract subdomain from full ENS name
 * @param fullName The full ENS name (e.g., "john.endoors.eth")
 * @returns The subdomain part only
 */
export const extractSubdomain = (fullName: string): string => {
  const parts = fullName.split('.');
  if (parts.length >= 3) {
    return parts[0];
  }
  return fullName;
};
