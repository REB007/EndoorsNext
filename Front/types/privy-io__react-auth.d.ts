declare module '@privy-io/react-auth' {
  import { ReactNode } from 'react';

  export interface PrivyProviderProps {
    appId: string;
    children: ReactNode;
    config?: {
      loginMethods?: string[];
      embeddedWallets?: {
        createOnLogin?: string;
      };
      appearance?: {
        theme?: string;
        accentColor?: string;
        logo?: string;
      };
    };
  }

  export interface PrivyInterface {
    ready: boolean;
    authenticated: boolean;
    user: any;
    login: () => Promise<void>;
    logout: () => Promise<void>;
  }

  export interface WalletsInterface {
    wallets: Array<{
      address: string;
    }>;
  }

  export const PrivyProvider: React.FC<PrivyProviderProps>;
  export const usePrivy: () => PrivyInterface;
  export const useWallets: () => WalletsInterface;
}
