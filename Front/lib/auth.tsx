import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRIVY_APP_ID } from './config';
import { isUserVerified } from '../utils/selfVerification';

// Define the auth context type
interface AuthContextType {
  isAuthenticated: boolean;
  isVerified: boolean;
  address: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  checkVerification: () => Promise<void>;
}

// Create the auth context
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isVerified: false,
  address: null,
  login: async () => {},
  logout: async () => {},
  checkVerification: async () => {},
});

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [privy, setPrivy] = useState<any>(null);

  // Initialize Privy on client side only
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('@privy-io/react-auth').then(({ PrivyClient }) => {
        const privyClient = new PrivyClient({
          appId: PRIVY_APP_ID,
          loginMethods: ['wallet', 'email'],
          embeddedWallets: {
            createOnLogin: 'users-without-wallets',
          },
        });
        
        setPrivy(privyClient);
        
        // Check if user is already logged in
        const checkAuth = async () => {
          const user = await privyClient.getUser();
          if (user) {
            setIsAuthenticated(true);
            
            // Get the user's wallet address
            const wallets = await privyClient.getWallets();
            if (wallets.length > 0) {
              const userAddress = wallets[0].address;
              setAddress(userAddress);
              
              // Check if user is verified
              const verified = await isUserVerified(userAddress);
              setIsVerified(verified);
            }
          }
        };
        
        checkAuth();
      });
    }
  }, []);

  // Login function
  const login = async () => {
    if (!privy) return;
    
    try {
      await privy.login();
      setIsAuthenticated(true);
      
      // Get the user's wallet address
      const wallets = await privy.getWallets();
      if (wallets.length > 0) {
        const userAddress = wallets[0].address;
        setAddress(userAddress);
        
        // Check if user is verified
        const verified = await isUserVerified(userAddress);
        setIsVerified(verified);
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  // Logout function
  const logout = async () => {
    if (!privy) return;
    
    try {
      await privy.logout();
      setIsAuthenticated(false);
      setIsVerified(false);
      setAddress(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Check verification status
  const checkVerification = async () => {
    if (!address) return;
    
    try {
      const verified = await isUserVerified(address);
      setIsVerified(verified);
    } catch (error) {
      console.error('Verification check failed:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isVerified,
        address,
        login,
        logout,
        checkVerification,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);
