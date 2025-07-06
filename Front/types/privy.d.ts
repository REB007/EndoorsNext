declare module '@privy-io/react-auth' {
  export interface PrivyClientOptions {
    appId: string;
    loginMethods?: string[];
    embeddedWallets?: {
      createOnLogin?: string;
    };
  }

  export interface Wallet {
    address: string;
    chainId?: number;
    walletClientId?: string;
  }

  export interface User {
    id: string;
    linkedAccounts?: any[];
    email?: string;
    phone?: string;
    google?: any;
    twitter?: any;
    discord?: any;
    github?: any;
  }

  export class PrivyClient {
    constructor(options: PrivyClientOptions);
    
    login(): Promise<boolean>;
    logout(): Promise<boolean>;
    getUser(): Promise<User | null>;
    getWallets(): Promise<Wallet[]>;
    
    // Add other methods as needed
  }
}
