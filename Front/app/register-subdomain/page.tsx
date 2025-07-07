'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isSubdomainAvailable, formatSubdomain } from '@/utils/ensUtils';
import { ENS_CONFIG } from '@/lib/contracts';
import { useAuth } from '@/lib/authContext';
import { AppContainer } from '@/components/ui/app-container';

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
      } else {
        setError(null); // Clear any previous errors
      }
    } catch (error: any) {
      console.error('Error checking subdomain availability:', error);
      // In development mode, we'll assume the subdomain is available despite errors
      if (process.env.NODE_ENV === 'development') {
        console.log('Development mode: Assuming subdomain is available despite error');
        setIsAvailable(true);
        setError(null);
      } else {
        setError(`Error checking availability: ${error.message || 'Please try again'}`);
        setIsAvailable(false);
      }
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
        let errorMessage = 'Failed to register subdomain';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (jsonError) {
          console.error('Error parsing error response:', jsonError);
          // Try to get text content if JSON parsing fails
          const textContent = await response.text();
          if (textContent) {
            errorMessage = `Server error: ${textContent.substring(0, 100)}`;
          }
        }
        throw new Error(errorMessage);
      }
      
      // Get the successful response
      let responseData;
      try {
        responseData = await response.json();
        console.log('Registration successful:', responseData);
      } catch (jsonError) {
        console.warn('Could not parse success response as JSON, but continuing anyway');
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
    <AppContainer>
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
              
              <div className="flex items-center mb-6 bg-gray-700/40 backdrop-blur-sm rounded-lg overflow-hidden shadow-inner">
                <input
                  type="text"
                  value={subdomain}
                  onChange={handleSubdomainChange}
                  placeholder="yourname"
                  className="flex-grow min-w-0 bg-transparent text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 border-none"
                />
                <div className="bg-gray-600/80 backdrop-blur-sm px-4 py-3 text-sm md:text-base whitespace-nowrap">
                  .{ENS_CONFIG.domain}
                </div>
              </div>
              
              {error && (
                <div className="flex items-center text-red-400 text-sm mb-4 bg-red-400/10 p-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}
              
              {isAvailable === true && (
                <div className="flex items-center text-green-400 text-sm mb-4 bg-green-400/10 p-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {formatSubdomain(subdomain)} is available!
                </div>
              )}
              
              <div className="space-y-4">
                <button
                  onClick={checkAvailability}
                  disabled={isChecking || !subdomain}
                  className={`w-full ${
                    isChecking || !subdomain
                      ? 'bg-gray-600/80 cursor-not-allowed'
                      : 'bg-purple-600 hover:bg-purple-700'
                  } text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 shadow-lg`}
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
                      ? 'bg-gray-600/80 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700'
                  } text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 shadow-lg`}
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
