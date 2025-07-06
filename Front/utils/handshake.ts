import { keccak256 } from "ethers";

/**
 * ConnectionPolaroid schema
 */
export interface ConnectionPolaroid {
  id: string;
  from: string;
  to: string;
  photoCID: string;
  note: string;
  timestamp: string;
  eventOrganizer: string;
  event: string;
  tags: string[];
}

// IPFS gateway URL for uploads
const IPFS_API_URL = process.env.NEXT_PUBLIC_IPFS_API_URL || 'https://ipfs.infura.io:5001/api/v0';

/**
 * Encode a ConnectionPolaroid object into a base64 string for URL embedding
 */
export function encodePolaroid(data: ConnectionPolaroid): string {
  const json = JSON.stringify(data);
  return btoa(json);
}

/**
 * Decode a base64 string back into a ConnectionPolaroid object
 */
export function decodePolaroid(base64Str: string): ConnectionPolaroid {
  const json = atob(base64Str);
  return JSON.parse(json) as ConnectionPolaroid;
}

/**
 * Safely parse a base64 string into ConnectionPolaroid or return null on error
 */
export function safeParsePolaroid(data: string): ConnectionPolaroid | null {
  try {
    return decodePolaroid(data);
  } catch (error) {
    console.error("Failed to parse polaroid data", error);
    return null;
  }
}

/**
 * Upload a File to IPFS and return an ipfs:// URI
 */
export async function uploadToIPFS(file: File): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${IPFS_API_URL}/add`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`IPFS upload failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    return `ipfs://${data.Hash}/${file.name}`;
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw error;
  }
}

/**
 * Convert an ipfs:// CID to a public HTTP gateway URL
 */
export function ipfsToHttp(ipfsUrl: string): string {
  return ipfsUrl.replace(/^ipfs:\/\//, "https://ipfs.io/ipfs/");
}

/**
 * Generate a unique ID for a connection using keccak256 hash
 */
export function generatePolaroidId(
  from: string,
  to: string,
  timestamp: string
): string {
  return keccak256(new TextEncoder().encode(`${from}-${to}-${timestamp}`));
}
