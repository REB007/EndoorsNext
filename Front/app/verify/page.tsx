'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { getProfilesVerificationLink } from '@/utils/selfApp';
import { AppContainer } from '@/components/ui/app-container';

export default function VerifyPage() {
  const router = useRouter();
  const { isLoggedIn, walletAddress } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [verificationLink, setVerificationLink] = useState<string | null>(null);
  const [debugMode, setDebugMode] = useState(false);

  // Generate verification link when wallet address is available
  useEffect(() => {
    if (walletAddress) {
      // Generate verification link
      const link = getProfilesVerificationLink(walletAddress, {
        // Optional custom data to pass to the contract
        timestamp: Date.now(),
      });
      setVerificationLink(link);
    } else if (!isLoggedIn) {
      // Not logged in, redirect to login
      router.push('/login');
    }
  }, [walletAddress, isLoggedIn, router]);

  const handleVerify = () => {
    if (verificationLink) {
      // Open the verification link in a new tab
      window.open(verificationLink, '_blank');
    }
  };

  const handleContinue = () => {
    // After verification, redirect to subdomain registration
    router.push('/register-subdomain');
  };

  return (
    <AppContainer>
      <h1 className="text-2xl font-bold text-center mb-6">
        Verify Your Account
      </h1>
      
      {isLoading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : (
        <>
          {walletAddress && (
            <div className="text-center">
              <p className="mb-4">
                To continue, you need to verify your account with Self Protocol.
              </p>
              
              <p className="font-mono bg-gray-700/60 backdrop-blur-sm p-2 rounded-lg mb-6 overflow-hidden text-ellipsis text-sm">
                {walletAddress}
              </p>
              
              <div className="space-y-4">
                <button
                  onClick={handleVerify}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center shadow-lg"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Verify with Self
                </button>
                
                <div className="text-sm text-gray-400 bg-gray-800/70 p-3 rounded-lg">
                  After completing verification in the Self app, return here and continue.
                </div>
                
                <button
                  onClick={handleContinue}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 shadow-lg"
                >
                  I've Completed Verification
                </button>

                {/* Debug button for development/testing */}
                <div className="mt-6 pt-4 border-t border-gray-700/50">
                  <button
                    onClick={() => {
                      console.log('Debug: Bypassing Self verification');
                      handleContinue();
                    }}
                    className="w-full bg-red-600/80 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 text-sm shadow-md"
                  >
                    Debug: Skip Verification (Dev Only)
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {!walletAddress && (
            <div className="text-center">
              <div className="flex items-center justify-center mb-4 text-red-400 bg-red-400/10 p-3 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>No wallet address found. Please connect your wallet first.</span>
              </div>
              
              <button
                onClick={() => router.push('/login')}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 shadow-lg"
              >
                Back to Login
              </button>
            </div>
          )}
        </>
      )}
    </AppContainer>
  );
}
