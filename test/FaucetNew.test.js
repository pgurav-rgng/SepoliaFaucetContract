const { expect } = require("chai");
const { ethers } = require("hardhat");

describe.only("Faucet Contract", function () {
  let faucet;
  let owner, user;

  beforeEach(async function () {
    this.timeout(10000); // Safe for CI

    [owner, user] = await ethers.getSigners();
    const Faucet = await ethers.getContractFactory("Faucet");

    try {
      faucet = await Faucet.deploy();
      await faucet.waitForDeployment();

      const address = await faucet.getAddress();
      console.log("Contract deployed to:", address);

      await owner.sendTransaction({
        to: address,
        value: ethers.parseEther("1"),
      });
    } catch (error) {
      console.error("Deployment failed:", error);
      throw error;
    }
  });

  describe.only("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await faucet.owner()).to.equal(owner.address);
    });

    it("Should have initial withdrawal limit of 0.1 ETH", async function () {
      expect(await faucet.withdrawalLimit()).to.equal(ethers.parseEther("0.1"));
    });

    it("Should be active by default", async function () {
      expect(await faucet.isActive()).to.be.true;
    });
  });

  describe.only("Withdrawals", function () {
    it("Should allow withdrawal within limit", async function () {
      const amount = ethers.parseEther("0.05");
      await expect(faucet.connect(user).withdraw(amount)).to.changeEtherBalance(
        user,
        amount
      );
    });

    it("Should reject withdrawal above limit", async function () {
      await expect(
        faucet.connect(user).withdraw(ethers.parseEther("0.2"))
      ).to.be.revertedWith("Exceeds withdrawal limit");
    });

    it("Should emit Withdrawal event", async function () {
      const amount = ethers.parseEther("0.05");
      await expect(faucet.connect(user).withdraw(amount))
        .to.emit(faucet, "Withdrawal")
        .withArgs(user.address, amount);
    });
  });

  describe.only("Ownership", function () {
    it("Should allow owner to change withdrawal limit", async function () {
      const newLimit = ethers.parseEther("0.5");
      await faucet.connect(owner).setWithdrawalLimit(newLimit);
      expect(await faucet.withdrawalLimit()).to.equal(newLimit);
    });

    it("Should prevent non-owners from changing limit", async function () {
      await expect(
        faucet.connect(user).setWithdrawalLimit(ethers.parseEther("0.5"))
      ).to.be.revertedWith("Only owner can call this");
    });
  });

  describe.only("Faucet State", function () {
    it("Should allow owner to disable faucet", async function () {
      await faucet.connect(owner).disableFaucet();
      expect(await faucet.isActive()).to.be.false;
    });

    it("Should emit FaucetDisabled event", async function () {
      await expect(faucet.connect(owner).disableFaucet()).to.emit(
        faucet,
        "FaucetDisabled"
      );
    });

    it("Should prevent withdrawals when disabled", async function () {
      await faucet.connect(owner).disableFaucet();
      await expect(
        faucet.connect(user).withdraw(ethers.parseEther("0.05"))
      ).to.be.revertedWith("Faucet is disabled");
    });
  });

  describe.only("Receive Ether", function () {
    it("Should accept ETH deposits", async function () {
      const tx = await user.sendTransaction({
        to: await faucet.getAddress(),
        value: ethers.parseEther("0.2"),
      });

      await tx.wait();

      const contractBalance = await ethers.provider.getBalance(
        await faucet.getAddress()
      );
      expect(contractBalance).to.be.greaterThan(0);
    });
  });

  describe.only("Owner Withdrawals", function () {
    it("Should allow owner to withdraw all funds", async function () {
      const contractAddress = await faucet.getAddress();
      const initialContractBalance = await ethers.provider.getBalance(
        contractAddress
      );

      // Call the owner withdrawal function
      const tx = await faucet.connect(owner).withdrawAll();
      await tx.wait();

      const finalContractBalance = await ethers.provider.getBalance(
        contractAddress
      );
      expect(finalContractBalance).to.equal(0);
    });
  });
});
