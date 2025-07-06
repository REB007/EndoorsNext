'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { getProfilesVerificationLink } from '@/utils/selfApp';

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
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-lg p-8">
        <div className="flex justify-center mb-6">
          <img
            src="/endoors_transparent2.png"
            alt="Endoors"
            className="h-16 w-auto"
          />
        </div>
        
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
                
                <p className="font-mono bg-gray-700 p-2 rounded-lg mb-6 overflow-hidden text-ellipsis">
                  {walletAddress}
                </p>
                
                <div className="space-y-4">
                  <button
                    onClick={handleVerify}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                  >
                    Verify with Self
                  </button>
                  
                  <p className="text-sm text-gray-400">
                    After completing verification in the Self app, return here and continue.
                  </p>
                  
                  <button
                    onClick={handleContinue}
                    className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
                  >
                    I've Completed Verification
                  </button>

                  {/* Debug button for development/testing */}
                  <div className="mt-8 pt-4 border-t border-gray-700">
                    <button
                      onClick={() => {
                        console.log('Debug: Bypassing Self verification');
                        handleContinue();
                      }}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
                    >
                      Debug: Skip Verification (Dev Only)
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {!walletAddress && (
              <div className="text-center">
                <p className="text-red-400 mb-4">
                  No wallet address found. Please connect your wallet first.
                </p>
                
                <button
                  onClick={() => router.push('/login')}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
                >
                  Back to Login
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
