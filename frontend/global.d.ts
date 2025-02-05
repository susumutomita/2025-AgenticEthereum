// global.d.ts

// 1. chart.js types
declare module "chart.js/auto" {
  export * from "chart.js";
}

// 2. Env variable types
declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_API_URL: string;
    NODE_ENV: "development" | "production" | "test";
    // 他にも追加したい環境変数があれば追記
  }
}

// 3. MetaMask specific types
type MetaMaskRequestMethod =
  | "eth_requestAccounts"
  | "eth_accounts"
  | "eth_chainId";

// リクエストのパラメータ
interface MetaMaskRequestParams {
  method: MetaMaskRequestMethod;
  params?: unknown[];
}

// MetaMask Provider
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

// Windowにethereumを生やす
interface Window {
  ethereum?: MetaMaskProvider;
}

// 4. image module declarations
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

// 5. 独自のMetaMaskInpageProvider拡張
import "@metamask/providers";
declare module "@metamask/providers" {
  interface MetaMaskInpageProvider {
    request<T>(args: {
      method: "wallet_switchEthereumChain";
      params?: { chainId: string }[];
    }): Promise<T>;
  }
}
