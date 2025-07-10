const { expect } = require("chai");
const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

describe("PowerConsumptionOptimizer - Sepolia Integration Tests", function () {
  let powerOptimizer;
  let contractAddress;
  let alice;
  let step;
  let steps;

  function progress(message) {
    console.log(`  [${++step}/${steps}] ${message}`);
  }

  before(async function () {
    // Check if we're on Sepolia network
    const network = await ethers.provider.getNetwork();

    if (network.chainId !== 11155111) {
      console.warn("⚠️  These tests can only run on Sepolia Testnet");
      console.warn(`   Current network: ${network.name} (chainId: ${network.chainId})`);
      console.warn("   Run with: npx hardhat test --network sepolia");
      this.skip();
    }

    // Load deployment information
    const deploymentFile = path.join(__dirname, "../deployments/sepolia-deployment.json");

    if (!fs.existsSync(deploymentFile)) {
      const error = new Error("Deployment file not found");
      error.message += "\n\nPlease deploy the contract first: npm run deploy";
      throw error;
    }

    const deploymentInfo = JSON.parse(fs.readFileSync(deploymentFile, "utf8"));
    contractAddress = deploymentInfo.contractAddress;

    console.log(`\n📍 Using deployed contract at: ${contractAddress}`);

    // Connect to deployed contract
    powerOptimizer = await ethers.getContractAt("PowerConsumptionOptimizer", contractAddress);

    // Get signers
    const signers = await ethers.getSigners();
    alice = signers[0];

    console.log(`👤 Test account: ${alice.address}\n`);
  });

  beforeEach(function () {
    step = 0;
    steps = 0;
  });

  // ========================================
  // SEPOLIA INTEGRATION TESTS
  // ========================================

  describe("Contract Connection", function () {
    it("should connect to deployed contract", async function () {
      steps = 2;
      this.timeout(40000);

      progress("Checking contract address...");
      expect(contractAddress).to.be.properAddress;

      progress("Verifying contract code...");
      const code = await ethers.provider.getCode(contractAddress);
      expect(code).to.not.equal("0x");
    });

    it("should have correct owner", async function () {
      steps = 1;
      this.timeout(40000);

      progress("Fetching owner address...");
      const owner = await powerOptimizer.owner();
      expect(owner).to.be.properAddress;
    });
  });

  describe("Read Functions", function () {
    it("should fetch system statistics", async function () {
      steps = 4;
      this.timeout(60000);

      progress("Calling getSystemStats()...");
      const stats = await powerOptimizer.getSystemStats();

      progress("Verifying totalRegisteredDevices...");
      expect(stats.totalRegisteredDevices).to.be.gte(0);

      progress("Verifying currentAnalysisId...");
      expect(stats.currentAnalysisId).to.be.gte(1);

      progress("Verifying lastOptimizationTimestamp...");
      expect(stats.lastOptimizationTimestamp).to.be.gt(0);

      console.log(`\n  📊 System Stats:`);
      console.log(`     Total Devices: ${stats.totalRegisteredDevices}`);
      console.log(`     Analysis ID: ${stats.currentAnalysisId}`);
      console.log(`     Optimization Active: ${stats.isOptimizationActive}\n`);
    });

    it("should check time-based functions", async function () {
      steps = 3;
      this.timeout(60000);

      progress("Getting current hour...");
      const currentHour = await powerOptimizer.getCurrentHour();
      expect(currentHour).to.be.gte(0);
      expect(currentHour).to.be.lt(24);

      progress("Checking optimization window...");
      const isOptWindow = await powerOptimizer.isOptimizationWindow();
      expect(typeof isOptWindow).to.equal("boolean");

      progress("Checking peak hour status...");
      const isPeak = await powerOptimizer.isPeakHour();
      expect(typeof isPeak).to.equal("boolean");

      console.log(`\n  ⏰ Time Status:`);
      console.log(`     Current Hour: ${currentHour}`);
      console.log(`     Optimization Window: ${isOptWindow ? "✅ Yes" : "❌ No"}`);
      console.log(`     Peak Hour: ${isPeak ? "✅ Yes" : "❌ No"}\n`);
    });

    it("should get registered devices count", async function () {
      steps = 1;
      this.timeout(40000);

      progress("Fetching registered devices count...");
      const count = await powerOptimizer.getRegisteredDevicesCount();
      expect(count).to.be.gte(0);

      console.log(`\n  📝 Registered Devices: ${count}\n`);
    });
  });

  describe("Write Functions", function () {
    it("should register a device on Sepolia", async function () {
      steps = 5;
      this.timeout(160000); // 160 seconds for Sepolia transactions

      progress("Checking if device is already registered...");
      const deviceInfo = await powerOptimizer.getDeviceInfo(alice.address);

      if (deviceInfo.isActive) {
        console.log(`\n  ⚠️  Device already registered as: ${deviceInfo.deviceType}`);
        console.log(`     Skipping registration test\n`);
        this.skip();
      }

      progress("Preparing device registration...");
      const deviceType = "Sepolia Test Device";

      progress("Sending registration transaction...");
      const tx = await powerOptimizer.connect(alice).registerDevice(deviceType);

      console.log(`\n  📤 Transaction Hash: ${tx.hash}`);

      progress("Waiting for confirmation...");
      const receipt = await tx.wait();

      progress("Verifying registration...");
      const updatedInfo = await powerOptimizer.getDeviceInfo(alice.address);
      expect(updatedInfo.isActive).to.be.true;
      expect(updatedInfo.deviceType).to.equal(deviceType);

      console.log(`\n  ✅ Device Registered Successfully!`);
      console.log(`     Type: ${deviceType}`);
      console.log(`     Gas Used: ${receipt.gasUsed.toString()}`);
      console.log(`     Block: ${receipt.blockNumber}\n`);
    });

    it("should update consumption data on Sepolia", async function () {
      steps = 6;
      this.timeout(200000); // 200 seconds for Sepolia transactions

      progress("Checking device registration status...");
      const deviceInfo = await powerOptimizer.getDeviceInfo(alice.address);

      if (!deviceInfo.isActive) {
        console.log(`\n  ⚠️  Device not registered`);
        console.log(`     Please run device registration test first\n`);
        this.skip();
      }

      progress("Preparing consumption data...");
      const powerUsage = 2500; // 2500 watts
      const efficiencyScore = 800; // 80% efficiency

      progress("Sending update transaction...");
      const tx = await powerOptimizer.connect(alice).updateConsumptionData(powerUsage, efficiencyScore);

      console.log(`\n  📤 Transaction Hash: ${tx.hash}`);

      progress("Waiting for confirmation...");
      const receipt = await tx.wait();

      progress("Verifying update...");
      const updatedInfo = await powerOptimizer.getDeviceInfo(alice.address);
      expect(updatedInfo.lastUpdateTime).to.be.gt(deviceInfo.lastUpdateTime);

      progress("Checking event emission...");
      const event = receipt.events.find(e => e.event === "ConsumptionDataUpdated");
      expect(event).to.not.be.undefined;

      console.log(`\n  ✅ Consumption Data Updated!`);
      console.log(`     Power Usage: ${powerUsage}W`);
      console.log(`     Efficiency: ${efficiencyScore}/1000`);
      console.log(`     Gas Used: ${receipt.gasUsed.toString()}`);
      console.log(`     Block: ${receipt.blockNumber}\n`);
    });
  });

  describe("Gas Estimation", function () {
    it("should estimate gas for read operations", async function () {
      steps = 3;
      this.timeout(60000);

      progress("Estimating gas for getSystemStats()...");
      const gas1 = await powerOptimizer.estimateGas.getSystemStats();
      expect(gas1).to.be.lt(100000);

      progress("Estimating gas for getCurrentHour()...");
      const gas2 = await powerOptimizer.estimateGas.getCurrentHour();
      expect(gas2).to.be.lt(50000);

      progress("Estimating gas for isOptimizationWindow()...");
      const gas3 = await powerOptimizer.estimateGas.isOptimizationWindow();
      expect(gas3).to.be.lt(50000);

      console.log(`\n  ⛽ Gas Estimates:`);
      console.log(`     getSystemStats: ${gas1.toString()}`);
      console.log(`     getCurrentHour: ${gas2.toString()}`);
      console.log(`     isOptimizationWindow: ${gas3.toString()}\n`);
    });
  });

  describe("Network Information", function () {
    it("should verify network details", async function () {
      steps = 4;
      this.timeout(60000);

      progress("Getting network information...");
      const network = await ethers.provider.getNetwork();
      expect(network.chainId).to.equal(11155111);

      progress("Getting latest block number...");
      const blockNumber = await ethers.provider.getBlockNumber();
      expect(blockNumber).to.be.gt(0);

      progress("Getting gas price...");
      const gasPrice = await ethers.provider.getGasPrice();
      expect(gasPrice).to.be.gt(0);

      progress("Getting account balance...");
      const balance = await alice.getBalance();
      expect(balance).to.be.gt(0);

      console.log(`\n  🌐 Network Details:`);
      console.log(`     Network: Sepolia`);
      console.log(`     Chain ID: ${network.chainId}`);
      console.log(`     Latest Block: ${blockNumber}`);
      console.log(`     Gas Price: ${ethers.utils.formatUnits(gasPrice, "gwei")} gwei`);
      console.log(`     Account Balance: ${ethers.utils.formatEther(balance)} ETH\n`);
    });
  });

  describe("Contract State Verification", function () {
    it("should verify contract deployment info", async function () {
      steps = 3;
      this.timeout(60000);

      progress("Reading deployment file...");
      const deploymentFile = path.join(__dirname, "../deployments/sepolia-deployment.json");
      const deploymentInfo = JSON.parse(fs.readFileSync(deploymentFile, "utf8"));

      progress("Verifying contract address...");
      expect(deploymentInfo.contractAddress).to.equal(contractAddress);
      expect(deploymentInfo.network).to.equal("sepolia");

      progress("Checking verification status...");
      const verified = deploymentInfo.verified || false;

      console.log(`\n  📋 Deployment Info:`);
      console.log(`     Contract: ${deploymentInfo.contractAddress}`);
      console.log(`     Network: ${deploymentInfo.network}`);
      console.log(`     Verified: ${verified ? "✅ Yes" : "❌ No"}`);
      console.log(`     Deployed: ${new Date(deploymentInfo.deploymentTime).toLocaleString()}\n`);

      if (verified) {
        console.log(`  🔗 Etherscan Link:`);
        console.log(`     https://sepolia.etherscan.io/address/${contractAddress}#code\n`);
      }
    });
  });
});
