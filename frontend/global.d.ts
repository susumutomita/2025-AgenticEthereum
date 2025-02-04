// Add chart.js types
declare module "chart.js/auto" {
  export * from "chart.js";
}

// Add env variable types
declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_API_URL: string;
    NODE_ENV: "development" | "production" | "test";
  }
}

// MetaMask specific types
type MetaMaskRequestMethod =
  | "eth_requestAccounts"
  | "eth_accounts"
  | "eth_chainId";

interface MetaMaskRequestParams {
  method: MetaMaskRequestMethod;
  params?: unknown[];
}

interface MetaMaskProvider {
  isMetaMask?: boolean;
  request: <T>(request: MetaMaskRequestParams) => Promise<T>;
  on: (eventName: string, callback: (payload: unknown) => void) => void;
  removeListener: (
    eventName: string,
    callback: (payload: unknown) => void,
  ) => void;
  selectedAddress: string | null;
  isConnected: () => boolean;
}

// Add MetaMask ethereum provider type
interface Window {
  ethereum?: MetaMaskProvider;
}

type AccountsResponse = string[];

declare function requestAccounts(): Promise<AccountsResponse>;

// Add image module declarations
declare module "*.svg" {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default content;
}

declare module "*.png" {
  const content: string;
  export default content;
}

declare module "*.jpg" {
  const content: string;
  export default content;
}
