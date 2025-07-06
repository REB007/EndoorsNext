'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/authContext';
import { resolveSubdomain } from '@/utils/ensUtils';
import { ENS_CONFIG } from '@/lib/contracts';

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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
          <button 
            onClick={() => router.push('/register-subdomain')} 
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Register a Subdomain
          </button>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold">
                {subdomain ? `${subdomain}.${ENS_CONFIG.domain}` : 'No Subdomain Registered'}
              </h2>
              <p className="text-gray-600 mt-1">{walletAddress}</p>
            </div>
            
            <div className="mt-4 md:mt-0 flex space-x-2">
              <Link href="/register-subdomain">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Change Subdomain
                </button>
              </Link>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-xl font-semibold mb-4">Verification Status</h3>
            <div className="flex items-center">
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                Verified with Self Protocol
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6 mt-6">
            <h3 className="text-xl font-semibold mb-4">Wallet</h3>
            <p className="font-mono bg-gray-100 p-3 rounded">{walletAddress}</p>
          </div>
          
          <div className="border-t border-gray-200 pt-6 mt-6">
            <h3 className="text-xl font-semibold mb-4">Actions</h3>
            <div className="flex flex-wrap gap-2">
              <Link href="/verify">
                <button className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
                  Re-verify Identity
                </button>
              </Link>
              <Link href="/register-subdomain">
                <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                  Manage Subdomain
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
