const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const Faucet = await hre.ethers.getContractFactory("Faucet");
  const faucet = await Faucet.deploy();

  await faucet.waitForDeployment();

  console.log("Faucet address:", await faucet.getAddress());

  // Fund the faucet (optional)
  await deployer.sendTransaction({
    to: await faucet.getAddress(),
    value: hre.ethers.parseEther("0.5")
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
