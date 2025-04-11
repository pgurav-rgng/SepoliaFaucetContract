////Pradeep Gurav 11th April 2025
const { expect } = require("chai");
const hre = require("hardhat");

describe("Faucet", function () {
  let faucet, owner, user;

  beforeEach(async function () {
    const ethers = hre.ethers;
    [owner, user] = await ethers.getSigners();

    const Faucet = await ethers.getContractFactory("Faucet");
    faucet = await Faucet.deploy();
    await faucet.waitForDeployment();

    await owner.sendTransaction({
      to: await faucet.getAddress(),
      value: ethers.parseEther("0.1")
    });
  });

  describe("Core functionality", () => {
    it("Should set the right owner", async () => {
      expect(await faucet.owner()).to.equal(owner.address);
    });

    it("Should allow withdrawals", async () => {
      await expect(faucet.connect(user).withdraw(hre.ethers.parseEther("0.1")))
        .to.changeEtherBalance(user, hre.ethers.parseEther("0.1"));
    });
  });

  describe("Admin functions", () => {
    it("Should disable faucet", async () => {
      await faucet.disableFaucet();
      expect(await faucet.isActive()).to.be.false;
    });

    it("Should withdraw all funds", async () => {
      await expect(faucet.withdrawAll())
        .to.changeEtherBalance(owner, hre.ethers.parseEther("0.1"));
    });
  });
});
