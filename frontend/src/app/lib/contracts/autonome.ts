import { ethers } from "ethers";

export const AUTONOME_ABI = [
  "function stake(uint256 amount) external",
  "function unstake(uint256 amount) external",
  "function registerAgent(uint256 serviceId) external",
  "function deregisterAgent() external",
  "function isAgentRegistered(address agent) external view returns (bool)",
  "function getAgentServiceId(address agent) external view returns (uint256)",
  "function getServiceCount() external view returns (uint256)",
  "function getService(uint256 serviceId) external view returns (string memory name, string memory description, bool active)",
  "function getStake(address agent) external view returns (uint256)",
] as const;

export const OLAS_ABI = [
  "function approve(address spender, uint256 amount) public returns (bool)",
  "function balanceOf(address account) external view returns (uint256)",
  "function allowance(address owner, address spender) external view returns (uint256)",
] as const;

export class AutonomeContract {
  private contract: ethers.Contract;
  private olasContract: ethers.Contract;

  constructor(
    autonomeAddress: string,
    olasAddress: string,
    provider: ethers.Provider | ethers.Signer,
  ) {
    this.contract = new ethers.Contract(
      autonomeAddress,
      AUTONOME_ABI,
      provider,
    );
    this.olasContract = new ethers.Contract(olasAddress, OLAS_ABI, provider);
  }

  async stake(amount: string) {
    const parsedAmount = ethers.parseEther(amount);
    try {
      const allowance = await this.olasContract.allowance(
        await (
          this.olasContract.signer as unknown as ethers.Signer
        ).getAddress(),
        this.contract.target,
      );
      if (allowance < parsedAmount) {
        await this.olasContract.approve(this.contract.target, parsedAmount);
      }
      const tx = await this.contract.stake(parsedAmount);
      return await tx.wait();
    } catch (error) {
      if ((error as Error & { code?: string }).code === "INSUFFICIENT_FUNDS") {
        throw new Error("Insufficient OLAS balance for staking");
      }
      throw error;
    }
  }

  async unstake(amount: string) {
    return this.contract.unstake(ethers.parseEther(amount));
  }

  async registerAgent(serviceId: number) {
    return this.contract.registerAgent(serviceId);
  }

  async deregisterAgent() {
    return this.contract.deregisterAgent();
  }

  async isAgentRegistered(address: string) {
    return this.contract.isAgentRegistered(address);
  }

  async getAgentServiceId(address: string) {
    return this.contract.getAgentServiceId(address);
  }

  async getServiceCount() {
    return this.contract.getServiceCount();
  }

  async getService(serviceId: number) {
    return this.contract.getService(serviceId);
  }

  async getStake(address: string) {
    return this.contract.getStake(address);
  }

  async getOlasBalance(address: string) {
    try {
      const balance = await this.olasContract.balanceOf(address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error("Failed to fetch OLAS balance:", error);
      throw new Error("Failed to fetch OLAS balance. Please try again.");
    }
  }
}
