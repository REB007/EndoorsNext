import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES, NETWORK_CONFIG } from '@/lib/contracts';
import { registerSubdomain, isSubdomainAvailable } from '@/utils/ensUtils';

// ABI snippet for the L2Registrar contract
const L2RegistrarABI = [
  "function register(string calldata label, address owner) external returns (uint256)",
  "function available(string calldata label) external view returns (bool)"
];

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        { message: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }
    
    const { name, address } = body;
    
    // Validate inputs
    if (!name || !address) {
      return NextResponse.json(
        { message: 'Name and address are required' },
        { status: 400 }
      );
    }
    
    // Validate name format (alphanumeric and underscores only)
    if (!/^[a-z0-9_]+$/.test(name)) {
      return NextResponse.json(
        { message: 'Name can only contain lowercase letters, numbers, and underscores' },
        { status: 400 }
      );
    }
    
    // Check if the subdomain is available
    const available = await isSubdomainAvailable(name);
    if (!available) {
      return NextResponse.json(
        { message: 'This subdomain is already taken' },
        { status: 400 }
      );
    }
    
    // Get contract address
    const l2RegistrarContract = CONTRACT_ADDRESSES.L2_REGISTRAR_CONTRACT;
    
    // Create provider and signer
    const network = process.env.NEXT_PUBLIC_NETWORK || 'testnet';
    const rpcUrl = NETWORK_CONFIG.RPC_URLS[network as keyof typeof NETWORK_CONFIG.RPC_URLS];
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    
    // Use the private key from environment variables
    if (!process.env.PRIVATE_KEY) {
      return NextResponse.json(
        { message: 'Server configuration error: Missing private key' },
        { status: 500 }
      );
    }
    
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY as string, provider);
    
    // Create contract instance
    const registrar = new ethers.Contract(l2RegistrarContract, L2RegistrarABI, signer);
    
    // Register the subdomain
    const tx = await registrar.register(name, address);
    const receipt = await tx.wait();
    
    // Return success response with transaction details
    return NextResponse.json({
      message: 'Subdomain registered successfully',
      name,
      address,
      transactionHash: receipt.hash,
    });
  } catch (error: any) {
    console.error('Error registering subdomain:', error);
    
    return NextResponse.json(
      { message: `Failed to register subdomain: ${error.message}` },
      { status: 500 }
    );
  }
}
