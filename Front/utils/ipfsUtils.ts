import { create } from 'ipfs-http-client';
import { IPFS_CONFIG } from '../lib/contracts';

// Configuration from centralized config
const projectId = IPFS_CONFIG.PROJECT_ID;
const projectSecret = IPFS_CONFIG.PROJECT_SECRET;
const ipfsGateway = IPFS_CONFIG.GATEWAY;

// Create authorization header
const auth = 
  typeof projectId === 'string' && 
  typeof projectSecret === 'string' 
    ? 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64')
    : '';

/**
 * Create an IPFS client using Infura
 * @returns IPFS HTTP client instance
 */
export function createIPFSClient() {
  if (!projectId || !projectSecret) {
    throw new Error('Infura IPFS project ID and secret are required');
  }

  return create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
      authorization: auth,
    },
  });
}

/**
 * Upload JSON data to IPFS
 * @param data Any JSON-serializable data
 * @returns CID of the uploaded content
 */
export async function uploadJSONToIPFS(data: any): Promise<string> {
  try {
    const client = createIPFSClient();
    
    // Convert data to JSON string
    const jsonString = JSON.stringify(data);
    
    // Create a Buffer from the JSON string
    const buffer = Buffer.from(jsonString);
    
    // Add the buffer to IPFS
    const added = await client.add(buffer);
    
    // Return the CID
    return added.path;
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw new Error('Failed to upload to IPFS');
  }
}

/**
 * Fetch JSON data from IPFS
 * @param cid Content identifier (CID) of the IPFS content
 * @returns Parsed JSON data
 */
export async function fetchJSONFromIPFS(cid: string): Promise<any> {
  try {
    // Construct the URL to the IPFS gateway
    const url = `${ipfsGateway}/ipfs/${cid}`;
    
    // Fetch the data
    const response = await fetch(url);
    
    // Parse the JSON response
    const data = await response.json();
    
    return data;
  } catch (error) {
    console.error('Error fetching from IPFS:', error);
    throw new Error('Failed to fetch from IPFS');
  }
}

/**
 * Get IPFS gateway URL for a CID
 * @param cid Content identifier (CID) of the IPFS content
 * @returns Full URL to access the content via gateway
 */
export function getIPFSGatewayURL(cid: string): string {
  return `${ipfsGateway}/ipfs/${cid}`;
}
