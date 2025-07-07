import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES, NETWORK_CONFIG, ENS_CONFIG, SELF_APP_CONFIG } from '../lib/contracts';

// ABI snippets for the contracts
const L2RegistrarABI = [
  "function register(bytes32 node, address owner) external returns (bool)",
  "function available(bytes32 node) external view returns (bool)",
];

const L2RegistryABI = [
  "function owner(bytes32 node) external view returns (address)",
  "function resolver(bytes32 node) external view returns (address)",
];

/**
 * Calculate the namehash for an ENS name
 * @param name The ENS name to hash
 * @returns The namehash as a hex string
 */
function namehash(name: string): string {
  let node = '0x0000000000000000000000000000000000000000000000000000000000000000';
  if (name) {
    const labels = name.split('.');
    for (let i = labels.length - 1; i >= 0; i--) {
      const labelHash = ethers.keccak256(ethers.toUtf8Bytes(labels[i]));
      node = ethers.keccak256(
        ethers.concat([
          ethers.getBytes(node),
          ethers.getBytes(labelHash)
        ])
      );
    }
  }
  return node;
}

/**
 * Get a provider for the current network
 * @returns An ethers provider
 */
function getProvider() {
  const network = process.env.NEXT_PUBLIC_NETWORK || 'testnet';
  const rpcUrl = NETWORK_CONFIG.RPC_URLS[network as keyof typeof NETWORK_CONFIG.RPC_URLS];
  return new ethers.JsonRpcProvider(rpcUrl);
}

/**
 * Check if a subdomain is available
 * @param subdomain The subdomain to check (without the .endoors.eth part)
 * @returns Promise<boolean> True if available, false if taken
 */
export async function isSubdomainAvailable(subdomain: string): Promise<boolean> {
  try {
    const provider = getProvider();
    const registrar = new ethers.Contract(
      CONTRACT_ADDRESSES.L2_REGISTRAR_CONTRACT,
      L2RegistrarABI,
      provider
    );

    // Format the full name
    const fullName = `${subdomain}.${ENS_CONFIG.domain}`;
    
    // Calculate the namehash
    const node = namehash(fullName);
    
    // Check availability
    const available = await registrar.available(node);
    return available;
  } catch (error) {
    console.error("Error checking subdomain availability:", error);
    // For development/testing purposes, return true to allow registration
    // In production, this should be handled differently
    if (SELF_APP_CONFIG.devMode) {
      console.log("Dev mode enabled, returning true for availability despite error");
      return true;
    }
    throw error; // Re-throw the error so the UI can handle it appropriately
  }
}

/**
 * Register a subdomain for a user
 * @param subdomain The subdomain to register (without the .endoors.eth part)
 * @param ownerAddress The address that will own the subdomain
 * @param signer An ethers signer with permission to register subdomains
 * @returns Promise<ethers.TransactionResponse> The transaction response
 */
export async function registerSubdomain(
  subdomain: string,
  ownerAddress: string,
  signer: ethers.Signer
): Promise<ethers.TransactionResponse> {
  // Format the full name
  const fullName = `${subdomain}.${ENS_CONFIG.domain}`;
  
  // Calculate the namehash
  const node = namehash(fullName);
  
  // Create contract instance
  const registrar = new ethers.Contract(
    CONTRACT_ADDRESSES.L2_REGISTRAR_CONTRACT,
    L2RegistrarABI,
    signer
  );
  
  // Register the subdomain
  return await registrar.register(node, ownerAddress);
}

/**
 * Resolve a subdomain to an address
 * @param subdomain The subdomain to resolve (without the .endoors.eth part)
 * @returns Promise<string> The address that owns the subdomain, or null if not found
 */
export async function resolveSubdomain(subdomain: string): Promise<string | null> {
  try {
    const provider = getProvider();
    const registry = new ethers.Contract(
      CONTRACT_ADDRESSES.L2_REGISTRY_CONTRACT,
      L2RegistryABI,
      provider
    );

    // Format the full name
    const fullName = `${subdomain}.${ENS_CONFIG.domain}`;
    
    // Calculate the namehash
    const node = namehash(fullName);
    
    // Get the owner
    const owner = await registry.owner(node);
    
    // Return null for zero address
    if (owner === '0x0000000000000000000000000000000000000000') {
      return null;
    }
    
    return owner;
  } catch (error) {
    console.error("Error resolving subdomain:", error);
    return null;
  }
}

/**
 * Format a subdomain with the domain
 * @param subdomain The subdomain to format
 * @returns The formatted full name
 */
export function formatSubdomain(subdomain: string): string {
  return `${subdomain}.${ENS_CONFIG.domain}`;
}

/**
 * Extract the subdomain part from a full ENS name
 * @param fullName The full ENS name
 * @returns The subdomain part, or null if invalid
 */
export function extractSubdomain(fullName: string): string | null {
  const parts = fullName.split('.');
  if (parts.length < 3 || `${parts[1]}.${parts[2]}` !== ENS_CONFIG.domain) {
    return null;
  }
  return parts[0];
}

/**
 * Resolve a wallet address to its associated subdomain
 * @param address The wallet address to resolve
 * @returns Promise<string | null> The subdomain if found, null otherwise
 */
export async function resolveAddressToSubdomain(address: string): Promise<string | null> {
  try {
    if (!address) return null;
    
    // For development purposes, we'll use a mock implementation
    // In production, you would query the L2Registry contract to find all subdomains
    // and check which one is owned by this address
    
    // Mock implementation - generate a subdomain based on address
    // This is just for testing and should be replaced with actual contract calls
    const mockSubdomain = `user${address.substring(2, 6).toLowerCase()}`;
    
    // In a real implementation, you would:
    // 1. Query events from the L2Registry to find all registered subdomains
    // 2. For each subdomain, check if the owner is the given address
    // 3. Return the first matching subdomain
    
    return mockSubdomain;
  } catch (error) {
    console.error("Error resolving address to subdomain:", error);
    return null;
  }
}
