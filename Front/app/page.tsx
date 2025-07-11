'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, initializeDefaultUser } from '@/utils/storage';

export default function HomePage() {
  const router = useRouter();
  const [clickCount, setClickCount] = useState(0);
  const [isShaking, setIsShaking] = useState(false);

  const handleLogoClick = () => {
    const newClickCount = clickCount + 1;
    setClickCount(newClickCount);

    // Trigger shake animation
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 240);

    // Trigger vibration on mobile devices
    if (navigator.vibrate) {
      // Different vibration patterns for each click
      const vibrationPatterns = [
        [50], // First click: short vibration
        [50, 50, 50], // Second click: triple short vibration
        [100, 50, 100, 50, 200] // Third click: complex pattern
      ];
      navigator.vibrate(vibrationPatterns[newClickCount - 1] || [50]);
    }

    if (newClickCount === 3) {
      // Delay before redirect to show wave animation
      setTimeout(() => {
        // Redirect to login page
        router.push('/login');
      }, 1000);
    }
  };

  const getLogoScale = () => {
    // Grow by 5% with each click: 1.0 -> 1.05 -> 1.10 -> 1.15
    return 1.0 + (clickCount * 0.05);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex items-center justify-center">
      <div className="absolute inset-0 flex items-center justify-center">
        <button
          onClick={handleLogoClick}
          className={`group transition-all duration-500 hover:scale-105 focus:outline-none focus:ring-0 ${
            isShaking ? 'animate-shake' : ''
          }`}
          style={{
            transform: `scale(${getLogoScale()})`,
            outline: 'none',
            WebkitTapHighlightColor: 'transparent',
            WebkitTouchCallout: 'none',
            WebkitUserSelect: 'none',
            userSelect: 'none'
          }}
        >
          <img
            src="/endoors_transparent2.png"
            alt="Endoors"
            className="h-32 w-auto opacity-90 group-hover:opacity-100 transition-opacity duration-300"
          />
        </button>
      </div>
      
      {clickCount > 0 && (
        <div className="absolute bottom-1/3 flex justify-center space-x-3">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                clickCount >= step 
                  ? 'bg-purple-400 scale-110' 
                  : 'bg-gray-600'
              } ${
                clickCount === 3 ? 'animate-wave' : ''
              }`}
              style={{
                animationDelay: clickCount === 3 ? `${(step - 1) * 0.2}s` : '0s'
              }}
            />
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes wave {
          0%, 100% {
            transform: translateY(0) scale(1.1);
          }
          50% {
            transform: translateY(-8px) scale(1.1);
          }
        }
        
        .animate-wave {
          animation: wave 0.8s ease-in-out infinite;
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0) scale(${getLogoScale()}); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-0.777px) scale(${getLogoScale()}); }
          20%, 40%, 60%, 80% { transform: translateX(0.777px) scale(${getLogoScale()}); }
        }
        
        .animate-shake {
          animation: shake 0.24s ease-in-out;
        }
      `}</style>
    </div>
  );
}