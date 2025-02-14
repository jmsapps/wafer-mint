import { ethers } from "hardhat";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

async function main(networkType: string) {
  const platformAddress = process.env.PUBLIC_KEY;
  const baseURI = process.env.BASE_URI;

  if (!networkType) {
    throw new Error("network type required");
  }

  if (!platformAddress) {
    throw new Error("platform address undefined");
  }

  if (!baseURI) {
    throw new Error("baseURI undefined");
  }

  console.log("Deploying contract...");

  const NFTContract = await ethers.getContractFactory("NFTV1");
  const contract = await NFTContract.deploy(baseURI, platformAddress);

  await contract.waitForDeployment();
  const contractAddress = await contract.getAddress()

  console.log(`✅ Contract deployed at: ${contractAddress}`);

  const envEntry = `\nCONTRACT_ADDRESS_${networkType.toUpperCase()}=${contractAddress}\n`;
  fs.appendFileSync(".env", envEntry);
}

main("amoy").catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exit(1);
});
