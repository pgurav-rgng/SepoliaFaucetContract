////Pradeep Gurav 11th April 2025
const hre = require("hardhat");

async function estimateGas() {
  const [owner] = await hre.ethers.getSigners();
  const Faucet = await hre.ethers.getContractFactory("Faucet");
  const faucet = await Faucet.deploy();
  await faucet.waitForDeployment();

  await owner.sendTransaction({
    to: await faucet.getAddress(),
    value: hre.ethers.parseEther("1")
  });

  const gasPriceHex = await hre.ethers.provider.send("eth_gasPrice", []);
  const gasPrice = BigInt(gasPriceHex);

  const gasEstimate = await faucet.withdraw.estimateGas(
    hre.ethers.parseEther("0.1")
  );

  const txCost = gasEstimate * gasPrice;

  console.log(`Gas Price: ${gasPrice} wei`);
  console.log(`Gas Estimate: ${gasEstimate} units`);
  console.log(`Transaction Cost: ${txCost} wei`);
  console.log(`Transaction Cost: ${hre.ethers.formatEther(txCost)} ETH`);
}

estimateGas().catch(console.error);
