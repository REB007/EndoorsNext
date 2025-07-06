// Configuration file for contract addresses and environment variables

// Network configuration
export const NETWORK = process.env.NEXT_PUBLIC_NETWORK || 'testnet';

// Contract addresses based on network
export const getContractAddresses = () => {
  switch (NETWORK) {
    case 'mainnet':
      return {
        profilesContract: process.env.NEXT_PUBLIC_PROFILES_CONTRACT_MAINNET || '',
        privacyEndorserContract: process.env.NEXT_PUBLIC_PRIVACY_ENDORSER_CONTRACT_MAINNET || '',
        l2RegistryContract: process.env.NEXT_PUBLIC_L2_REGISTRY_CONTRACT_MAINNET || '',
        l2RegistrarContract: process.env.NEXT_PUBLIC_L2_REGISTRAR_CONTRACT_MAINNET || '',
      };
    case 'testnet':
      return {
        profilesContract: process.env.NEXT_PUBLIC_PROFILES_CONTRACT_TESTNET || '0xfaC20Cd322884d61daf144C940E6Cc77678bD6BE',
        privacyEndorserContract: process.env.NEXT_PUBLIC_PRIVACY_ENDORSER_CONTRACT_TESTNET || '0x8562dec4d4aad950B69312Df8B125f2184CCefEB',
        l2RegistryContract: process.env.NEXT_PUBLIC_L2_REGISTRY_CONTRACT_TESTNET || '0x2565b1f8bfd174d3acb67fd1a377b8014350dc26',
        l2RegistrarContract: process.env.NEXT_PUBLIC_L2_REGISTRAR_CONTRACT_TESTNET || '0x59221A5Ebb314C358bCFCEDAEc406D2BF322F7A5',
      };
    case 'localhost':
      return {
        profilesContract: process.env.NEXT_PUBLIC_PROFILES_CONTRACT_LOCALHOST || '',
        privacyEndorserContract: process.env.NEXT_PUBLIC_PRIVACY_ENDORSER_CONTRACT_LOCALHOST || '',
        l2RegistryContract: process.env.NEXT_PUBLIC_L2_REGISTRY_CONTRACT_LOCALHOST || '',
        l2RegistrarContract: process.env.NEXT_PUBLIC_L2_REGISTRAR_CONTRACT_LOCALHOST || '',
      };
    default:
      return {
        profilesContract: '',
        privacyEndorserContract: '',
        l2RegistryContract: '',
        l2RegistrarContract: '',
      };
  }
};

// Self app configuration
export const SELF_APP_CONFIG = {
  appName: "Endoors",
  scope: "https://endoors.vercel.app/",
  endpointType: NETWORK === 'mainnet' ? "celo" : "staging_celo",
  devMode: NETWORK !== 'mainnet',
};

// ENS configuration
export const ENS_CONFIG = {
  domain: 'endoors.eth',
};

// API endpoints
export const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

// Authentication configuration
export const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID || '';
