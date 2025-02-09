import { z } from "zod";
import {
  ActionProvider,
  CreateAction,
  WalletProvider,
} from "@coinbase/agentkit";
import { ethers } from "ethers";

// ERC1155 ミント用の入力スキーマ（必要に応じて調整）
const ERC1155MintSchema = z.object({
  contractAddress: z.string().url(), // ミント対象のコントラクトアドレス
  to: z.string(), // トークンの受取先アドレス
  tokenId: z.string(), // ミントするトークンID（単一の場合）
  amount: z.string(), // ミントする数量
});

// ERC1155 トークンをミントするためのアクションプロバイダーの実装例
class ERC1155ActionProvider extends ActionProvider<WalletProvider> {
  constructor() {
    super("erc1155-mint-action-provider", []);
  }

  supportsNetwork = () => true;

  @CreateAction({
    name: "erc1155-mint",
    description:
      "Mints an ERC1155 token by calling the mint function of the specified contract. " +
      "Parameters: contractAddress, to (recipient address), tokenId, and amount.",
    schema: ERC1155MintSchema,
  })
  async mintToken(
    walletProvider: WalletProvider,
    args: z.infer<typeof ERC1155MintSchema>,
  ): Promise<string> {
    const { contractAddress, to, tokenId, amount } = args;
    try {
      // ethers v6 では ethers.Interface を直接使用する
      const iface = new ethers.Interface([
        "function mint(address to, uint256 tokenId, uint256 amount, bytes data) public",
      ]);
      const data = iface.encodeFunctionData("mint", [
        to,
        tokenId,
        amount,
        "0x",
      ]);

      // 現在の WalletProvider 型には sendTransaction や waitForTransactionReceipt が存在しないため、
      // 一旦 any としてキャストして利用します。実際の環境に合わせて、適切な型に変更してください。
      const providerAny = walletProvider as any;

      const txHash = await providerAny.sendTransaction({
        to: contractAddress as `0x${string}`,
        data,
      });
      await providerAny.waitForTransactionReceipt(txHash);

      console.log(
        "ERC1155MintActionProvider: Mint transaction sent. Hash:",
        txHash,
      );
      return `Mint transaction sent with hash: ${txHash}`;
    } catch (error) {
      console.error("ERC1155MintActionProvider: Error minting token", error);
      throw new Error(`Error minting ERC1155 token: ${error}`);
    }
  }
}

export const erc1155ActionProvider = () => new ERC1155ActionProvider();
