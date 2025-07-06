'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';

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
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                Connect Wallet
              </button>
            )}
            
            {isLoggedIn && walletAddress && (
              <div className="text-center">
                <p className="mb-2">Connected with:</p>
                <p className="font-mono bg-gray-700 p-2 rounded-lg mb-4 overflow-hidden text-ellipsis">
                  {walletAddress}
                </p>
                
                {isVerified ? (
                  <div className="text-green-400 mb-4">
                    ✓ Your account is verified
                  </div>
                ) : (
                  <div className="text-yellow-400 mb-4">
                    Your account needs verification
                  </div>
                )}
                
                <button
                  onClick={() => router.push(isVerified ? '/profile' : '/verify')}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
                >
                  {isVerified ? 'Go to Profile' : 'Verify Account'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
