import React from 'react';

interface AppContainerProps {
  children: React.ReactNode;
  maxWidth?: string;
}

export function AppContainer({ children, maxWidth = "md" }: AppContainerProps) {
  const maxWidthClass = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
  }[maxWidth] || "max-w-md";

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex flex-col items-center justify-center p-4">
      <div className={`w-full ${maxWidthClass} bg-gray-800/80 backdrop-blur-md rounded-xl shadow-lg p-6 overflow-hidden`}>
        <div className="flex justify-center mb-6">
          <img
            src="/endoors_transparent2.png"
            alt="Endoors"
            className="h-16 w-auto"
          />
        </div>
        
        <div className="max-h-[70vh] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 pr-1">
          {children}
        </div>
      </div>
    </div>
  );
}
