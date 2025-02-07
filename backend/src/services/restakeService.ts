// backend/src/services/restakeService.ts
import { JsonRpcProvider, Contract, formatEther } from "ethers";
import dotenv from "dotenv";

dotenv.config();

const ETH_RPC_URL: string = process.env.ETH_RPC_URL!;
const RESTAKE_CONTRACT_ADDRESS: string = process.env.RESTAKE_CONTRACT_ADDRESS!;

// JSON RPC プロバイダーの初期化
const provider = new JsonRpcProvider(ETH_RPC_URL);

// リステーキング情報取得用の ABI（必要な関数のみ記述）
const restakeABI: string[] = [
  "function getRestakeBalance(address user) external view returns (uint256)",
];

// スマートコントラクトインスタンスの作成
const restakeContract = new Contract(
  RESTAKE_CONTRACT_ADDRESS,
  restakeABI,
  provider,
);

/**
 * 指定したユーザーアドレスのリステーキング残高を取得する関数
 * @param userAddress ユーザーのウォレットアドレス
 * @returns 残高（Ether 単位の文字列）
 */
export async function fetchRestakeBalance(
  userAddress: string,
): Promise<string> {
  try {
    const balance: bigint =
      await restakeContract.getRestakeBalance(userAddress);
    return formatEther(balance);
  } catch (error) {
    console.error("Error fetching restake balance:", error);
    throw error;
  }
}
