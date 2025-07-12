require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");
require("hardhat-gas-reporter");
require("hardhat-contract-sizer");
require("solidity-coverage");
require("dotenv").config();

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || "https://rpc.sepolia.org";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x0000000000000000000000000000000000000000000000000000000000000000";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";

// Optimizer configuration from environment or defaults
const OPTIMIZER_ENABLED = process.env.OPTIMIZER_ENABLED === "true" || true;
const OPTIMIZER_RUNS = parseInt(process.env.OPTIMIZER_RUNS || "200");
const VIA_IR = process.env.VIA_IR === "true" || false;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: OPTIMIZER_ENABLED,
        runs: OPTIMIZER_RUNS,
        details: {
          yul: true,
          yulDetails: {
            stackAllocation: true,
            optimizerSteps: "dhfoDgvulfnTUtnIf"
          }
        }
      },
      viaIR: VIA_IR,
      metadata: {
        bytecodeHash: "ipfs"
      }
    }
  },

  networks: {
    hardhat: {
      chainId: 31337,
      allowUnlimitedContractSize: true
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337
    },
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: PRIVATE_KEY !== "0x0000000000000000000000000000000000000000000000000000000000000000"
        ? [PRIVATE_KEY]
        : [],
      chainId: 11155111,
      gasPrice: "auto",
      gas: "auto"
    }
  },

  etherscan: {
    apiKey: {
      sepolia: ETHERSCAN_API_KEY
    }
  },

  gasReporter: {
    enabled: process.env.REPORT_GAS === "true",
    currency: "USD",
    outputFile: "gas-report.txt",
    noColors: true,
    coinmarketcap: process.env.COINMARKETCAP_API_KEY || ""
  },

  contractSizer: {
    alphaSort: true,
    runOnCompile: false,
    disambiguatePaths: false
  },

  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },

  mocha: {
    timeout: 200000
  }
};
