// utils/durin.ts
import { DurinClient } from '@durin-sdk/client';
import { createWalletClient, custom } from 'viem';
import { mainnet, sepolia } from 'viem/chains';

/**
 * Create a configured Durin client instance
 */
export function getDurinClient({
  projectId,
  signer,
  domain,
  chain = mainnet,
}: {
  projectId: string;
  signer: any; // viem-compatible signer
  domain: string; // e.g., 'yourapp.eth'
  chain?: typeof mainnet | typeof sepolia;
}): DurinClient {
  return new DurinClient({
    projectId,
    domain,
    chain,
    signer,
  });
}

/**
 * Register a new ENS subname (e.g., 'alice.yourapp.eth')
 */
export async function registerUsername(
  username: string,
  durin: DurinClient
): Promise<string> {
  const subname = await durin.register(username);
  return subname; // returns full ENS like 'alice.yourapp.eth'
}

/**
 * Resolve ENS subname to address (off-chain)
 */
export async function resolveSubname(subname: string, provider: any): Promise<string | null> {
  return provider.resolveName(subname); // ethers or viem
}
