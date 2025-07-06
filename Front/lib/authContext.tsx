import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { isUserVerified } from '../utils/selfVerification';

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
  const [isVerified, setIsVerified] = useState(false);
  
  // Use Privy hooks directly
  const { ready, authenticated, user, login, logout } = usePrivy();
  const { wallets } = useWallets();
  
  // Get the first connected wallet address
  const walletAddress = wallets && wallets.length > 0 ? wallets[0].address : null;
  
  // Check verification status whenever the wallet address changes
  useEffect(() => {
    const checkVerification = async () => {
      if (!walletAddress) {
        setIsVerified(false);
        return;
      }
      
      try {
        const verified = await isUserVerified(walletAddress);
        setIsVerified(verified);
      } catch (error) {
        console.error('Verification check failed:', error);
        setIsVerified(false);
      }
    };
    
    if (authenticated && walletAddress) {
      checkVerification();
    }
  }, [authenticated, walletAddress]);
  
  // Check verification status function that can be called manually
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
    isLoggedIn: authenticated,
    isVerified,
    walletAddress,
    login,
    logout,
    checkVerification,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
