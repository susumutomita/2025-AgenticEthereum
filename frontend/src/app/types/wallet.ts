export interface Transaction {
  id: string;
  type: "send" | "receive";
  amount: string;
  date: string;
}

export interface WalletData {
  address: string;
  balance: string;
  transactions: Transaction[];
}
