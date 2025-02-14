# NFT Minting DApp

## Overview
This project consists of two repositories:
1. **blockchain** (Backend) - Handles smart contract deployment and interaction.
2. **ui** (Frontend) - A Svelte-based web interface for users to mint NFTs.

## Features
- **Connect MetaMask**: Users can connect their MetaMask wallet to interact with the blockchain.
- **Select Network**: Users can switch between Ethereum (Sepolia) and Polygon (Amoy) testnets.
- **Mint NFTs**: Users enter a metadata URI, specify the number of NFTs, and mint them using the connected wallet.

## Technologies Used
- **Svelte**: Frontend framework for the UI.
- **Ethers.js**: Blockchain interaction.
- **MetaMask**: Wallet authentication.
- **Hardhat**: Smart contract deployment.
- **Solidity**: Smart contract development.

## Setup Instructions

### 1️⃣ Install Dependencies
Ensure you have **Node.js** and **npm** installed, then run:
```sh
npm install
```

### 2️⃣ Configure Environment Variables
#### Blockchain Repo (`blockchain/.env`)
```sh
PRIVATE_KEY=""
PUBLIC_KEY="your-wallet-address"
BASE_URI="https://your-metadata-uri.com/"
INFURA_PROJECT_ID="your-infura-id"
```

### 3️⃣ Run the Blockchain Backend
```sh
cd blockchain
npx hardhat compile
npx hardhat run scripts/deploy.ts --network sepolia
```
For **Polygon Amoy**:
```sh
npx hardhat run scripts/deploy.ts --network amoy
```

### 4️⃣ Run the Frontend
```sh
cd ui
npm run dev
```
The app should now be available at:
```
http://localhost:8080
```

### 5️⃣ Connect MetaMask
1. Open MetaMask.
2. Switch to **Sepolia** or **Amoy** testnet.
3. Click **"Connect MetaMask"** in the DApp.

### 6️⃣ Mint an NFT
1. Enter a **Metadata URI** (e.g., `https://your-metadata-uri.com/1.json`).
2. Specify the **Amount** of NFTs to mint.
3. Click **"Mint NFT"**.
4. Confirm the transaction in MetaMask.

## Smart Contract Interaction

### **Minting Function**
The `mintNFT` function interacts with the smart contract:
```ts
const handleMintNFT = async () => {
  await mintNFT(
    _wallet?.address!,
    amount,
    metadataURI,
  )
};
```

### **Smart Contract (Solidity)**
The mint function inside the contract:
```solidity
function mintNFT(uint256 amount, string memory metadataURI) public {
  require(amount > 0, "Must mint at least 1 copy");
  uint256 tokenId = nextTokenId;
  nextTokenId++;
  _mint(msg.sender, tokenId, amount, "");
  _setURI(tokenId, metadataURI);
  emit NFTMinted(msg.sender, tokenId, amount, metadataURI);
}
```

## Future Improvements
- **Add NFT metadata preview** before minting.
- **Support more blockchain networks** beyond Ethereum and Polygon.
- **Enable resale functionality** directly on OpenSea.

## Notes

To properly test, you're going to need test coins from a faucet. You can get test coins from:

**Sepolia ETH Faucet:** https://sepoliafaucet.com/

**Polygon Amoy Faucet:** https://www.alchemy.com/faucets/polygon-amoy

Make sure your MetaMask wallet is connected to the correct testnet before requesting funds.

### Minting an NFT

To mint an NFT, you'll need a metadata URL that points to the metadata JSON file containing information about your NFT. You can store your metadata on a decentralized storage provider such as:

**ArDrive (Arweave-based storage):** https://ardrive.io/

**IPFS (via Pinata or NFT.Storage):** https://www.pinata.cloud/ or https://nft.storage/

Once you have uploaded your metadata, copy the URL and paste it into the form when minting.

## License
MIT License
