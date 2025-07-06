'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { AuthProvider } from '@/lib/authContext';
import { PRIVY_APP_ID } from '@/lib/config';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        loginMethods: ['wallet', 'email'],
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
        appearance: {
          theme: 'dark',
          accentColor: '#8B5CF6', // Purple color to match your UI
          logo: '/endoors_transparent2.png',
        },
      }}
    >
      <AuthProvider>{children}</AuthProvider>
    </PrivyProvider>
  );
}
