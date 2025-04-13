require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337
    },
    sepolia: {
      url: process.env.SEPOLIA_URL,
      accounts: [process.env.SEPOLIA_PRIVATE_KEY],
      gasPrice: 10000000000, // Optional: 10 gwei
      gas: 5000000          // Optional: Gas limit
    }
  },
  // CORRECT PLACEMENT FOR THESE:
  sourcify: {
    enabled: true
  },
  etherscan: {
    apiKey: process.env.ETHER_SCAN_API_KEY
  },
  // Your existing Hardhat config (networks, solidity, etc.)
  mocha: {
    timeout: 40000,     // Global timeout (40 seconds, useful for slow RPC)
    color: true,        // Colorize output
    reporter: "spec",   // Clean test reporting ("spec" is default)
    bail: true,         // Stop after first test failure (optional)
  },
};