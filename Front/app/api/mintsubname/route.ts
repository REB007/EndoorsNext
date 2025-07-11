import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES, NETWORK_CONFIG } from '@/lib/contracts';
import { registerSubdomain, isSubdomainAvailable } from '@/utils/ensUtils';

// ABI snippet for the L2Registrar contract
const L2RegistrarABI = [
  "function register(string calldata label, address owner) external",
  "function available(string calldata label) external view returns (bool)"
];

export async function POST(request: NextRequest) {
  try {
    console.log('Starting subdomain registration process');
    
    // Parse request body
    let body;
    try {
      body = await request.json();
      console.log('Request body parsed:', { name: body.name, address: body.address });
    } catch (error) {
      console.error('Failed to parse request body:', error);
      return NextResponse.json(
        { message: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }
    
    const { name, address } = body;
    
    // Validate inputs
    if (!name || !address) {
      console.error('Missing required fields:', { name, address });
      return NextResponse.json(
        { message: 'Name and address are required' },
        { status: 400 }
      );
    }
    
    // Validate name format (alphanumeric and underscores only)
    if (!/^[a-z0-9_]+$/.test(name)) {
      console.error('Invalid name format:', name);
      return NextResponse.json(
        { message: 'Name can only contain lowercase letters, numbers, and underscores' },
        { status: 400 }
      );
    }
    
    // Check if the subdomain is available
    let available = false;
    try {
      console.log('Checking subdomain availability for:', name);
      available = await isSubdomainAvailable(name);
      console.log('Subdomain availability result:', available);
    } catch (error) {
      console.error('Error checking subdomain availability:', error);
      // In development mode, assume it's available
      if (process.env.NODE_ENV === 'development') {
        console.log('Development mode: Assuming subdomain is available despite error');
        available = true;
      } else {
        return NextResponse.json(
          { message: `Error checking subdomain availability: ${error instanceof Error ? error.message : 'Unknown error'}` },
          { status: 500 }
        );
      }
    }
    
    if (!available) {
      console.log('Subdomain is already taken:', name);
      return NextResponse.json(
        { message: 'This subdomain is already taken' },
        { status: 400 }
      );
    }
    
    // No mock registration - we want to identify the real issue
    console.log('Proceeding with actual blockchain registration');
    
    // For debugging only - log environment variables (without exposing private key)
    console.log('Environment check:', { 
      NODE_ENV: process.env.NODE_ENV,
      NEXT_PUBLIC_NETWORK: process.env.NEXT_PUBLIC_NETWORK,
      HAS_PRIVATE_KEY: !!process.env.PRIVATE_KEY
    });
    
    // Get contract address
    const l2RegistrarContract = CONTRACT_ADDRESSES.L2_REGISTRAR_CONTRACT;
    console.log('Using L2 Registrar contract:', l2RegistrarContract);
    
    // Create provider and signer
    const network = process.env.NEXT_PUBLIC_NETWORK || 'testnet';
    const rpcUrl = NETWORK_CONFIG.RPC_URLS[network as keyof typeof NETWORK_CONFIG.RPC_URLS];
    console.log('Connecting to network:', network, 'with RPC URL:', rpcUrl);
    
    try {
      const provider = new ethers.JsonRpcProvider(rpcUrl);
      
      // Check provider connection
      const blockNumber = await provider.getBlockNumber();
      console.log('Successfully connected to provider. Current block number:', blockNumber);
      
      // Use the private key from environment variables
      if (!process.env.PRIVATE_KEY) {
        console.error('Missing PRIVATE_KEY environment variable');
        return NextResponse.json(
          { message: 'Server configuration error: Missing private key' },
          { status: 500 }
        );
      }
      
      const signer = new ethers.Wallet(process.env.PRIVATE_KEY as string, provider);
      const signerAddress = await signer.getAddress();
      console.log('Signer address:', signerAddress);
      
      // Create contract instance
      const registrar = new ethers.Contract(l2RegistrarContract, L2RegistrarABI, signer);
      console.log('Contract instance created');
      
      // Register the subdomain
      console.log('Sending transaction to register subdomain:', name, 'for address:', address);
      const tx = await registrar.register(name, address);
      console.log('Transaction sent:', tx.hash);
      
      const receipt = await tx.wait();
      console.log('Transaction confirmed in block:', receipt.blockNumber);
      
      // Return success response with transaction details
      return NextResponse.json({
        message: 'Subdomain registered successfully',
        name,
        address,
        transactionHash: receipt.hash,
      });
    } catch (error: any) {
      console.error('Error during blockchain interaction:', error);
      
      // Extract detailed error information
      const errorDetails = {
        message: error.message || 'Unknown error',
        code: error.code,
        reason: error.reason,
        method: error.method,
        transaction: error.transaction ? {
          from: error.transaction.from,
          to: error.transaction.to,
          data: error.transaction.data?.substring(0, 100) + '...',
          value: error.transaction.value?.toString(),
          gasLimit: error.transaction.gasLimit?.toString()
        } : undefined,
        stack: error.stack
      };
      
      // Determine which function failed based on the error or stack trace
      let failedFunction = 'register';
      if (error.method) {
        failedFunction = error.method;
      } else if (error.stack && error.stack.includes('provider.getBlockNumber')) {
        failedFunction = 'provider.getBlockNumber';
      } else if (error.stack && error.stack.includes('signer.getAddress')) {
        failedFunction = 'signer.getAddress';
      }
      
      return NextResponse.json(
        { 
          message: `${failedFunction}() failed: ${errorDetails.message}`,
          details: errorDetails
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Error registering subdomain:', error);
    
    // Determine which function failed based on the error or stack trace
    let failedFunction = 'registerSubdomain';
    if (error.method) {
      failedFunction = error.method;
    } else if (error.stack) {
      // Extract function name from stack trace if possible
      const stackLines = error.stack.split('\n');
      if (stackLines.length > 1) {
        const firstCallSite = stackLines[1].trim();
        const functionMatch = firstCallSite.match(/at ([\w\.]+)/);
        if (functionMatch && functionMatch[1]) {
          failedFunction = functionMatch[1];
        }
      }
    }
    
    // Ensure we have a valid error message
    let errorMessage = `${failedFunction}() failed`;
    if (error) {
      if (typeof error.message === 'string') {
        errorMessage += `: ${error.message}`;
      } else if (typeof error.toString === 'function') {
        errorMessage += `: ${error.toString()}`;
      }
    }
    
    // Extract detailed error information
    const errorDetails = {
      message: error.message || 'Unknown error',
      code: error.code,
      reason: error.reason,
      method: error.method,
      transaction: error.transaction ? {
        from: error.transaction.from,
        to: error.transaction.to,
        data: error.transaction.data?.substring(0, 100) + '...',
        value: error.transaction.value?.toString(),
        gasLimit: error.transaction.gasLimit?.toString()
      } : undefined,
      stack: error.stack,
      // Include environment information (without sensitive data)
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        NEXT_PUBLIC_NETWORK: process.env.NEXT_PUBLIC_NETWORK,
        HAS_PRIVATE_KEY: !!process.env.PRIVATE_KEY
      }
    };
    
    return NextResponse.json(
      { 
        message: errorMessage,
        details: errorDetails 
      },
      { status: 500 }
    );
  }
}
