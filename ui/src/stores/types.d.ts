import { ethers } from "ethers";

declare global {
  interface IWallet {
    address: string | undefined;
    provider: ethers.BrowserProvider | undefined;
    balance: bigint | undefined;
    network: ethers.Network | undefined;
  }
}
