//Pradeep Gurav 11th April 2025
const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("Gas Estimation", function () {
  it("should estimate gas for withdrawal", async function () {
    const [owner, user] = await ethers.getSigners();

    // Deploy the contract
    const Faucet = await ethers.getContractFactory("Faucet");
    const faucet = await Faucet.deploy();
    await faucet.waitForDeployment();

    // Fund the faucet
    await owner.sendTransaction({
      to: await faucet.getAddress(),
      value: ethers.parseEther("0.1")
    });

    // Get gas fee data (replaces getGasPrice)
    const feeData = await ethers.provider.getFeeData();
    const gasPrice = feeData.gasPrice;

    // Estimate gas for withdrawal
    const gasEstimate = await faucet.connect(user).withdraw.estimateGas(
      ethers.parseEther("0.1")
    );

    // Compute cost
    const txCost = gasEstimate * gasPrice;

    console.log(`Gas Price: ${gasPrice.toString()} wei`);
    console.log(`Gas Estimate: ${gasEstimate.toString()} units`);
    console.log(`Transaction Cost: ${txCost.toString()} wei`);
    console.log(`Transaction Cost: ${ethers.formatEther(txCost.toString())} ETH`);

    expect(gasEstimate).to.be.gt(0n);
  });
});
