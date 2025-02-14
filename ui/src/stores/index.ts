import { writable } from "svelte/store";
import { ethers } from "ethers";

import global from 'global'

import type { Eip1193Provider, Interface, InterfaceAbi } from "ethers";

// Store for wallet address & provider
export const wallet = writable<IWallet>({
  address: undefined,
  provider: undefined,
  balance: undefined,
  network: undefined,
});

export async function connectWallet(chainId: string) {
  if (!window.ethereum) {
    alert(
      "MetaMask not found! Install it first. If it is installed, make sure it is enabled " +
      "and then reload this page."
    );

    return;
  }

  if (!chainId || typeof chainId !== "string" || !/^0x[0-9a-fA-F]+$/.test(chainId)) {
    alert(`Invalid chainId: ${chainId}. Please provide a valid chain ID.`);
    console.error("🚨 Invalid chainId passed:", chainId);

    return;
  }

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: chainId }]
    })

  } catch (error: any) {
    alert(
      "This chain does not belong to your network, you will now be prompted by Metamask to add it"
    );

    try {
      await addChain(chainId)
    } catch (error: any) {
      alert(`Error switching chain: ${error.message || error}`);

      return
    }
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    const balance = await provider.getBalance(address);
    const network = await provider.getNetwork();

    wallet.set({
      address,
      provider,
      balance,
      network: network,
    });
  } catch (error: any) {

    alert(`Wallet connection failed: ${error.message || error}`);
  }
}

export async function addChain(chainId: string) {
  if (!window.ethereum) {
    alert("MetaMask not found! Install it first and reload this page.");

    return;
  }

  await window.ethereum.request({
    method: "wallet_addEthereumChain",
    params: [global.chainParams[chainId]]
  });
}

export const getPendingRequests = async (_ethereum: Eip1193Provider) => {
  // Check if there are any pending requests
  const pendingRequests = await _ethereum.request({
    method: "wallet_getPermissions",
  });

  if (pendingRequests && pendingRequests.length > 0) {
    alert("You have pending MetaMask requests. Please approve or reject them before trying again.");

    return;
  }
}

export async function mintNFT(
  contractAddress: string,
  amount: number,
  metadataURI: string
) {
  if (!window.ethereum) {
    alert("MetaMask not found! Install it first and reload this page.");

    return;
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contractAbi = global.contractABI as unknown as Interface | InterfaceAbi;
  const contract = new ethers.Contract(contractAddress, contractAbi, signer);

  try {
    const tx = await contract.mintNFT(amount, metadataURI);
    await tx.wait();
    console.log("NFT Minted!");
  } catch (error) {
    console.error("Minting failed:", error);
  }
}
