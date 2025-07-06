'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isSubdomainAvailable, formatSubdomain } from '@/utils/ensUtils';
import { ENS_CONFIG } from '@/lib/contracts';
import { useAuth } from '@/lib/authContext';

export default function RegisterSubdomainPage() {
  const router = useRouter();
  const { isLoggedIn, walletAddress } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [subdomain, setSubdomain] = useState('');
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [isLoggedIn, router]);

  const handleSubdomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow alphanumeric characters and underscores
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '');
    setSubdomain(value);
    setIsAvailable(null);
    setError(null);
  };

  const checkAvailability = async () => {
    if (!subdomain) {
      setError('Please enter a subdomain name');
      return;
    }
    
    try {
      setIsChecking(true);
      const available = await isSubdomainAvailable(subdomain);
      setIsAvailable(available);
      
      if (!available) {
        setError(`${formatSubdomain(subdomain)} is already taken`);
      }
    } catch (error) {
      console.error('Error checking subdomain availability:', error);
      setError('Error checking availability. Please try again.');
    } finally {
      setIsChecking(false);
    }
  };

  const handleRegister = async () => {
    if (!subdomain || !isAvailable) {
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Call the API route to register the subdomain
      const response = await fetch('/api/mintsubname', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: subdomain,
          address: walletAddress,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to register subdomain');
      }
      
      // Redirect to the profile page
      router.push(`/profile?id=${subdomain}`);
    } catch (error: any) {
      console.error('Error registering subdomain:', error);
      setError(error.message || 'Failed to register subdomain');
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
          Choose Your Subdomain
        </h1>
        
        {isLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <>
            {walletAddress && (
              <div>
                <p className="mb-4 text-center">
                  Choose a unique name for your {ENS_CONFIG.domain} subdomain.
                </p>
                
                <div className="flex items-center mb-6">
                  <input
                    type="text"
                    value={subdomain}
                    onChange={handleSubdomainChange}
                    placeholder="yourname"
                    className="flex-grow bg-gray-700 text-white px-4 py-3 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <div className="bg-gray-600 px-4 py-3 rounded-r-lg">
                    .{ENS_CONFIG.domain}
                  </div>
                </div>
                
                {error && (
                  <p className="text-red-400 text-sm mb-4">{error}</p>
                )}
                
                {isAvailable === true && (
                  <p className="text-green-400 text-sm mb-4">
                    ✓ {formatSubdomain(subdomain)} is available!
                  </p>
                )}
                
                <div className="space-y-4">
                  <button
                    onClick={checkAvailability}
                    disabled={isChecking || !subdomain}
                    className={`w-full ${
                      isChecking || !subdomain
                        ? 'bg-gray-600 cursor-not-allowed'
                        : 'bg-purple-600 hover:bg-purple-700'
                    } text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200`}
                  >
                    {isChecking ? (
                      <span className="flex items-center justify-center">
                        <span className="animate-spin h-4 w-4 border-t-2 border-b-2 border-white rounded-full mr-2"></span>
                        Checking...
                      </span>
                    ) : (
                      'Check Availability'
                    )}
                  </button>
                  
                  <button
                    onClick={handleRegister}
                    disabled={!isAvailable || isLoading}
                    className={`w-full ${
                      !isAvailable || isLoading
                        ? 'bg-gray-600 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700'
                    } text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200`}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <span className="animate-spin h-4 w-4 border-t-2 border-b-2 border-white rounded-full mr-2"></span>
                        Registering...
                      </span>
                    ) : (
                      'Register Subdomain'
                    )}
                  </button>
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
