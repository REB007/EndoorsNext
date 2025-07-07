'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/authContext';
import { resolveSubdomain } from '@/utils/ensUtils';
import { ENS_CONFIG } from '@/lib/contracts';
import { AppContainer } from '@/components/ui/app-container';

export default function ProfilePage() {
  const router = useRouter();
  const { isLoggedIn, isVerified, walletAddress } = useAuth();
  
  const [subdomain, setSubdomain] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  
  useEffect(() => {
    // Redirect to login if not logged in
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    
    // Redirect to verification if not verified
    if (isLoggedIn && !isVerified) {
      router.push('/verify');
      return;
    }
    
    // Try to find the user's subdomain
    const fetchSubdomain = async () => {
      try {
        setLoading(true);
        if (!walletAddress) return;
        
        // In a real implementation, we would query the L2Registry contract
        // to find the subdomain associated with this wallet address
        // For now, we'll use a mock implementation
        const mockSubdomain = await resolveSubdomain(walletAddress);
        
        if (mockSubdomain) {
          setSubdomain(mockSubdomain);
        } else {
          // No subdomain found, redirect to registration
          router.push('/register-subdomain');
        }
      } catch (err) {
        console.error('Error fetching subdomain:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSubdomain();
  }, [isLoggedIn, isVerified, walletAddress, router]);

  return (
    <AppContainer maxWidth="lg">
      <h1 className="text-2xl font-bold text-center mb-6">Profile</h1>
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-400/10 border border-red-400/20 text-red-400 px-4 py-3 rounded-lg">
          <p>{error}</p>
          <button 
            onClick={() => router.push('/register-subdomain')} 
            className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-colors duration-200"
          >
            Register a Subdomain
          </button>
        </div>
      ) : (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">
                {subdomain ? `${subdomain}.${ENS_CONFIG.domain}` : 'No Subdomain Registered'}
              </h2>
              <p className="text-gray-300 mt-1 text-sm">{walletAddress}</p>
            </div>
            
            <div className="mt-4 md:mt-0 flex space-x-2">
              <Link href="/register-subdomain">
                <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-colors duration-200">
                  Change Subdomain
                </button>
              </Link>
            </div>
          </div>
          
          <div className="border-t border-gray-700/50 pt-6">
            <h3 className="text-xl font-semibold mb-4 text-white">Verification Status</h3>
            <div className="flex items-center">
              <div className="bg-green-400/20 text-green-400 px-4 py-2 rounded-lg text-sm font-semibold flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Verified with Self Protocol
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700/50 pt-6 mt-6">
            <h3 className="text-xl font-semibold mb-4 text-white">Wallet</h3>
            <p className="font-mono bg-gray-700/40 backdrop-blur-sm p-3 rounded-lg text-gray-200 text-sm overflow-hidden text-ellipsis">{walletAddress}</p>
          </div>
          
          <div className="border-t border-gray-700/50 pt-6 mt-6">
            <h3 className="text-xl font-semibold mb-4 text-white">Actions</h3>
            <div className="flex flex-wrap gap-3">
              <Link href="/verify">
                <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-colors duration-200">
                  Re-verify Identity
                </button>
              </Link>
              <Link href="/register-subdomain">
                <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-colors duration-200">
                  Manage Subdomain
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </AppContainer>
  );
}
