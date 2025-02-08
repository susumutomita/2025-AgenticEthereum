// global.d.ts
export {}; // このファイルをモジュールとして扱うため

declare global {
  interface Window {
    ethereum?: import("ethers").Eip1193Provider & {
      on?: (eventName: string, listener: (...args: unknown[]) => void) => void;
      removeListener?: (
        eventName: string,
        listener: (...args: unknown[]) => void,
      ) => void;
      isMetaMask?: boolean;
      selectedAddress?: string | null;
      isConnected?: () => boolean;
    };
  }
}
