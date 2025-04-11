const hre = require("hardhat");

async function main() {
  const Faucet = await hre.ethers.getContractFactory("Faucet");
  
  // 1. Get deployment data
  const deploymentTx = await Faucet.getDeployTransaction();
  
  // 2. Estimate through provider
  const estimatedGas = await hre.ethers.provider.estimateGas(
    deploymentTx
  );
  
  console.log(`Estimated gas: ${estimatedGas.toString()}`);
}

main().catch(console.error);