import { Web3Storage } from "web3.storage";
import { keccak256, toUtf8Bytes } from "ethers/lib/utils";

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

// Initialize Web3.Storage client (ensure process.env.WEB3STORAGE_TOKEN is set)
const web3Client = new Web3Storage({ token: process.env.WEB3STORAGE_TOKEN! });

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
 * Upload a File to IPFS via Web3.Storage and return an ipfs:// URI
 */
export async function uploadToIPFS(file: File): Promise<string> {
  const cid = await web3Client.put([file]);
  // Return path including original filename
  return `ipfs://${cid}/${file.name}`;
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
  return keccak256(toUtf8Bytes(`${from}-${to}-${timestamp}`));
}
