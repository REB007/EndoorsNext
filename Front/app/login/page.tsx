'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { AppContainer } from '@/components/ui/app-container';

export default function LoginPage() {
  const router = useRouter();
  const { isLoggedIn, isVerified, walletAddress, login, checkVerification } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  // Check verification status when wallet address changes
  useEffect(() => {
    const verifyUser = async () => {
      if (isLoggedIn && walletAddress) {
        await checkVerification();
      }
    };
    
    verifyUser();
  }, [isLoggedIn, walletAddress, checkVerification]);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      await login();
      
      // Wait a moment for verification status to update
      setTimeout(async () => {
        // Check verification status again after login
        const verified = await checkVerification();
        
        // Redirect based on verification status
        if (verified) {
          router.push('/profile');
        } else {
          router.push('/verify');
        }
        
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Login failed:', error);
      setIsLoading(false);
    }
  };

  return (
    <AppContainer>
      <h1 className="text-2xl font-bold text-center mb-6">
        Welcome to Endoors
      </h1>
      
      {isLoading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : (
        <>
          {!isLoggedIn && (
            <button
              onClick={handleLogin}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center shadow-lg"
            >
              Connect Wallet
            </button>
          )}
          
          {isLoggedIn && walletAddress && (
            <div className="text-center">
              <p className="mb-2">Connected with:</p>
              <p className="font-mono bg-gray-700/60 backdrop-blur-sm p-2 rounded-lg mb-4 overflow-hidden text-ellipsis text-sm">
                {walletAddress}
              </p>
              
              {isVerified ? (
                <div className="text-green-400 mb-4 flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Your account is verified</span>
                </div>
              ) : (
                <div className="text-yellow-400 mb-4 flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>Your account needs verification</span>
                </div>
              )}
              
              <button
                onClick={() => router.push(isVerified ? '/profile' : '/verify')}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 shadow-lg"
              >
                {isVerified ? 'Go to Profile' : 'Verify Account'}
              </button>
            </div>
          )}
        </>
      )}
    </AppContainer>
  );
}
