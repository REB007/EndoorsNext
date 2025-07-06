import React, { createContext, useContext, useState, useEffect } from 'react';
import { isUserVerified } from '../utils/selfApp';
import { PRIVY_CONFIG } from './contracts';

// Define the shape of our authentication context
interface AuthContextType {
  isLoggedIn: boolean;
  isVerified: boolean;
  walletAddress: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  checkVerification: () => Promise<boolean>;
}

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  isVerified: false,
  walletAddress: null,
  login: async () => {},
  logout: async () => {},
  checkVerification: async () => false,
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component that wraps the app and makes auth available
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [privyReady, setPrivyReady] = useState(false);
  const [privyClient, setPrivyClient] = useState<any>(null);

  // Initialize Privy client
  useEffect(() => {
    // Dynamic import to avoid SSR issues
    const loadPrivy = async () => {
      try {
        // Import Privy SDK dynamically to avoid SSR issues
        const { PrivyClient } = await import('@privy-io/react-auth');
        
        // Initialize Privy client with app ID from environment
        const privyClient = new PrivyClient({
          appId: PRIVY_CONFIG.APP_ID,
          loginMethods: ['wallet', 'email'],
          embeddedWallets: {
            createOnLogin: 'users-without-wallets',
          },
        });
        
        setPrivyClient(privyClient);
        setPrivyReady(true);
        
        // Check if user is already authenticated
        const user = await privyClient.getUser();
        if (user) {
          setIsLoggedIn(true);
          
          // Get wallet address
          const wallets = await privyClient.getWallets();
          if (wallets.length > 0) {
            const address = wallets[0].address;
            setWalletAddress(address);
            
            // Check verification status
            if (address) {
              const verified = await isUserVerified(address);
              setIsVerified(verified);
            }
          }
        }
      } catch (error) {
        console.error('Failed to load Privy:', error);
      }
    };

    // Only run in browser environment
    if (typeof window !== 'undefined') {
      loadPrivy();
    }
  }, []);



  // Login function
  const login = async () => {
    if (!privyReady || !privyClient) return;
    
    try {
      // Use Privy login method
      await privyClient.login();
      setIsLoggedIn(true);
      
      // Get wallet address after login
      const wallets = await privyClient.getWallets();
      if (wallets.length > 0) {
        const address = wallets[0].address;
        setWalletAddress(address);
        
        // Check verification status
        if (address) {
          const verified = await isUserVerified(address);
          setIsVerified(verified);
        }
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  // Logout function
  const logout = async () => {
    if (!privyReady || !privyClient) return;
    
    try {
      // Use Privy logout method
      await privyClient.logout();
      
      // Reset state
      setIsLoggedIn(false);
      setIsVerified(false);
      setWalletAddress(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Check verification status
  const checkVerification = async () => {
    if (!walletAddress) return false;
    
    try {
      const verified = await isUserVerified(walletAddress);
      setIsVerified(verified);
      return verified;
    } catch (error) {
      console.error('Verification check failed:', error);
      return false;
    }
  };

  // Create the value object that will be provided by the context
  const value = {
    isLoggedIn,
    isVerified,
    walletAddress,
    login,
    logout,
    checkVerification,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
