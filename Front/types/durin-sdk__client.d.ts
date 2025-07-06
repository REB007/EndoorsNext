declare module '@durin-sdk/client' {
  export class DurinClient {
    constructor(options: any);
    // Add any methods that might be used in the codebase
    connect(): Promise<any>;
    disconnect(): Promise<void>;
    register(username: string): Promise<string>;
    // Add other methods as needed
  }
}
