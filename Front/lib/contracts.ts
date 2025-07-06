// Contract addresses for the application
export const CONTRACT_ADDRESSES = {
  // Profiles contract deployed on Celo Alfajores
  PROFILES_CONTRACT: '0xfaC20Cd322884d61daf144C940E6Cc77678bD6BE',
  
  // PrivacyEndorser contract deployed on Celo Alfajores
  PRIVACY_ENDORSER_CONTRACT: '0x8562dec4d4aad950B69312Df8B125f2184CCefEB',
  
  // L2Registry contract deployed on Celo Alfajores
  L2_REGISTRY_CONTRACT: '0x2565b1f8bfd174d3acb67fd1a377b8014350dc26',
  
  // L2Registrar contract deployed on Celo Alfajores
  L2_REGISTRAR_CONTRACT: '0x59221A5Ebb314C358bCFCEDAEc406D2BF322F7A5',
};

// Network configuration
export const NETWORK_CONFIG = {
  // Network type: 'mainnet', 'testnet', or 'localhost'
  NETWORK: 'testnet',
  
  // RPC URLs
  RPC_URLS: {
    mainnet: 'https://forno.celo.org',
    testnet: 'https://alfajores-forno.celo-testnet.org',
    localhost: 'http://localhost:8545',
  },
  
  // Chain IDs
  CHAIN_IDS: {
    mainnet: 42220,
    testnet: 44787,
    localhost: 31337,
  },
};

// Self app configuration
export const SELF_APP_CONFIG = {
  appName: "Endoors",
  scope: "https://endoors.vercel.app/",
  endpointType: "staging_celo", // "staging_celo" for testnet, "celo" for mainnet
  devMode: true, // Set to true for development/testing, false for production
};

// ENS configuration
export const ENS_CONFIG = {
  domain: 'endoors.eth',
};

// Privy configuration
export const PRIVY_CONFIG = {
  APP_ID: process.env.NEXT_PUBLIC_PRIVY_APP_ID || '',
  LOGIN_METHODS: ['wallet', 'email'],
  EMBEDDED_WALLETS: {
    createOnLogin: 'users-without-wallets',
  },
};

// IPFS configuration using Infura
export const IPFS_CONFIG = {
  PROJECT_ID: process.env.NEXT_PUBLIC_INFURA_PROJECT_ID || '',
  PROJECT_SECRET: process.env.NEXT_PUBLIC_INFURA_PROJECT_SECRET || '',
  GATEWAY: process.env.NEXT_PUBLIC_INFURA_IPFS_GATEWAY || 'https://ipfs.infura.io',
};
