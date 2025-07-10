const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

// Simulation configuration
const SIMULATION_CONFIG = {
  deviceTypes: [
    "Smart Refrigerator",
    "Air Conditioner",
    "Electric Water Heater",
    "Washing Machine",
    "Smart TV",
    "LED Lighting System",
    "Electric Oven",
    "Dishwasher"
  ],
  powerRanges: {
    "Smart Refrigerator": { min: 100, max: 200 },
    "Air Conditioner": { min: 1500, max: 3500 },
    "Electric Water Heater": { min: 3000, max: 5000 },
    "Washing Machine": { min: 500, max: 2000 },
    "Smart TV": { min: 50, max: 200 },
    "LED Lighting System": { min: 20, max: 100 },
    "Electric Oven": { min: 2000, max: 4000 },
    "Dishwasher": { min: 1200, max: 2400 }
  },
  efficiencyScores: { min: 400, max: 950 },
  numberOfDevices: 5,
  simulationCycles: 3
};

// Helper function to generate random value in range
function randomInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper function to wait for specified time
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log("\n🎮 Starting PowerConsumptionOptimizer Simulation...\n");

  const network = hre.network.name;
  const [deployer, ...accounts] = await hre.ethers.getSigners();

  console.log("📋 Simulation Configuration:");
  console.log("━".repeat(60));
  console.log(`Network:              ${network}`);
  console.log(`Deployer:             ${deployer.address}`);
  console.log(`Available Accounts:   ${accounts.length}`);
  console.log(`Devices to Simulate:  ${SIMULATION_CONFIG.numberOfDevices}`);
  console.log(`Simulation Cycles:    ${SIMULATION_CONFIG.simulationCycles}`);
  console.log("━".repeat(60));
  console.log();

  // Load deployment information
  const deploymentFile = path.join(__dirname, `../deployments/${network}-deployment.json`);

  if (!fs.existsSync(deploymentFile)) {
    console.error(`❌ Deployment file not found: ${deploymentFile}`);
    console.log("\nPlease deploy the contract first:");
    console.log("npm run deploy");
    process.exit(1);
  }

  const deploymentInfo = JSON.parse(fs.readFileSync(deploymentFile, "utf8"));
  const contractAddress = deploymentInfo.contractAddress;

  console.log(`📍 Contract Address: ${contractAddress}`);
  console.log();

  // Connect to deployed contract
  const PowerConsumptionOptimizer = await hre.ethers.getContractFactory("PowerConsumptionOptimizer");
  const contract = PowerConsumptionOptimizer.attach(contractAddress);

  console.log("🔗 Connected to contract successfully!\n");

  const simulationResults = {
    network: network,
    contractAddress: contractAddress,
    startTime: new Date().toISOString(),
    devices: [],
    cycles: [],
    totalGasUsed: hre.ethers.BigNumber.from(0)
  };

  try {
    // Phase 1: Register Multiple Devices
    console.log("━".repeat(60));
    console.log("📝 PHASE 1: DEVICE REGISTRATION");
    console.log("━".repeat(60));
    console.log();

    const numDevices = Math.min(SIMULATION_CONFIG.numberOfDevices, accounts.length);

    for (let i = 0; i < numDevices; i++) {
      const account = accounts[i];
      const deviceType = SIMULATION_CONFIG.deviceTypes[i % SIMULATION_CONFIG.deviceTypes.length];

      console.log(`[${i + 1}/${numDevices}] Registering ${deviceType}...`);
      console.log(`   Account: ${account.address}`);

      const contractWithSigner = contract.connect(account);
      const tx = await contractWithSigner.registerDevice(deviceType);
      const receipt = await tx.wait();

      simulationResults.devices.push({
        address: account.address,
        deviceType: deviceType,
        registrationTx: tx.hash,
        gasUsed: receipt.gasUsed.toString()
      });

      simulationResults.totalGasUsed = simulationResults.totalGasUsed.add(receipt.gasUsed);

      console.log(`   ✅ Registered | Gas: ${receipt.gasUsed.toString()}`);
      console.log(`   Tx: ${tx.hash}`);
      console.log();

      await wait(1000); // Wait 1 second between registrations
    }

    // Phase 2: Simulate Multiple Consumption Update Cycles
    console.log("━".repeat(60));
    console.log("📈 PHASE 2: CONSUMPTION DATA SIMULATION");
    console.log("━".repeat(60));
    console.log();

    for (let cycle = 0; cycle < SIMULATION_CONFIG.simulationCycles; cycle++) {
      console.log(`🔄 Simulation Cycle ${cycle + 1}/${SIMULATION_CONFIG.simulationCycles}`);
      console.log("─".repeat(60));

      const cycleData = {
        cycleNumber: cycle + 1,
        timestamp: new Date().toISOString(),
        updates: []
      };

      for (let i = 0; i < numDevices; i++) {
        const account = accounts[i];
        const deviceType = simulationResults.devices[i].deviceType;
        const powerRange = SIMULATION_CONFIG.powerRanges[deviceType];

        const powerUsage = randomInRange(powerRange.min, powerRange.max);
        const efficiencyScore = randomInRange(
          SIMULATION_CONFIG.efficiencyScores.min,
          SIMULATION_CONFIG.efficiencyScores.max
        );

        console.log(`[${i + 1}/${numDevices}] ${deviceType}`);
        console.log(`   Power: ${powerUsage}W | Efficiency: ${efficiencyScore}/1000`);

        const contractWithSigner = contract.connect(account);
        const tx = await contractWithSigner.updateConsumptionData(powerUsage, efficiencyScore);
        const receipt = await tx.wait();

        cycleData.updates.push({
          deviceAddress: account.address,
          powerUsage: powerUsage,
          efficiencyScore: efficiencyScore,
          transactionHash: tx.hash,
          gasUsed: receipt.gasUsed.toString()
        });

        simulationResults.totalGasUsed = simulationResults.totalGasUsed.add(receipt.gasUsed);

        console.log(`   ✅ Updated | Gas: ${receipt.gasUsed.toString()}`);
        console.log();

        await wait(500); // Wait 0.5 seconds between updates
      }

      simulationResults.cycles.push(cycleData);

      console.log(`✅ Cycle ${cycle + 1} completed\n`);
      await wait(2000); // Wait 2 seconds between cycles
    }

    // Phase 3: Check System Statistics
    console.log("━".repeat(60));
    console.log("📊 PHASE 3: SYSTEM STATISTICS");
    console.log("━".repeat(60));
    console.log();

    const stats = await contract.getSystemStats();
    const currentHour = await contract.getCurrentHour();
    const isOptWindow = await contract.isOptimizationWindow();
    const isPeak = await contract.isPeakHour();

    console.log("System Status:");
    console.log(`   Total Devices:        ${stats.totalRegisteredDevices}`);
    console.log(`   Last Optimization:    ${new Date(stats.lastOptimizationTimestamp.toNumber() * 1000).toLocaleString()}`);
    console.log(`   Current Analysis ID:  ${stats.currentAnalysisId}`);
    console.log(`   Current Hour:         ${currentHour}`);
    console.log(`   Optimization Window:  ${isOptWindow ? "✅ Active" : "❌ Inactive"}`);
    console.log(`   Peak Hour:            ${isPeak ? "✅ Yes" : "❌ No"}`);
    console.log();

    simulationResults.systemStats = {
      totalDevices: stats.totalRegisteredDevices.toString(),
      lastOptimization: stats.lastOptimizationTimestamp.toString(),
      currentAnalysisId: stats.currentAnalysisId.toString(),
      currentHour: currentHour.toString(),
      isOptimizationWindow: isOptWindow,
      isPeakHour: isPeak
    };

    // Phase 4: Optimization Analysis (if in window)
    if (isOptWindow) {
      console.log("━".repeat(60));
      console.log("🚀 PHASE 4: OPTIMIZATION ANALYSIS");
      console.log("━".repeat(60));
      console.log();

      console.log("Starting optimization analysis...");
      const optimizeTx = await contract.startOptimizationAnalysis();
      const optimizeReceipt = await optimizeTx.wait();

      simulationResults.totalGasUsed = simulationResults.totalGasUsed.add(optimizeReceipt.gasUsed);

      console.log(`✅ Analysis completed | Gas: ${optimizeReceipt.gasUsed.toString()}`);
      console.log(`   Tx: ${optimizeTx.hash}`);
      console.log();

      const analysisId = stats.currentAnalysisId;
      const recommendation = await contract.getOptimizationRecommendation(analysisId);

      console.log("Optimization Results:");
      console.log(`   Analysis Completed:   ${recommendation.analysisCompleted}`);
      console.log(`   Analysis Time:        ${new Date(recommendation.analysisTime.toNumber() * 1000).toLocaleString()}`);
      console.log(`   Devices Analyzed:     ${recommendation.deviceCount}`);
      console.log();

      simulationResults.optimization = {
        transactionHash: optimizeTx.hash,
        gasUsed: optimizeReceipt.gasUsed.toString(),
        analysisCompleted: recommendation.analysisCompleted,
        deviceCount: recommendation.deviceCount.toString()
      };
    } else {
      console.log("━".repeat(60));
      console.log("⏳ PHASE 4: OPTIMIZATION ANALYSIS SKIPPED");
      console.log("━".repeat(60));
      console.log();
      console.log("Not currently in optimization window.");
      console.log("Optimization windows: 00:00, 04:00, 08:00, 12:00, 16:00, 20:00");
      console.log();
    }

    // Save simulation results
    simulationResults.endTime = new Date().toISOString();
    simulationResults.totalGasUsedString = simulationResults.totalGasUsed.toString();

    const simulationsDir = path.join(__dirname, "../simulations");
    if (!fs.existsSync(simulationsDir)) {
      fs.mkdirSync(simulationsDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const simulationFile = path.join(simulationsDir, `simulation-${timestamp}.json`);
    fs.writeFileSync(simulationFile, JSON.stringify(simulationResults, null, 2));

    // Final Summary
    console.log("━".repeat(60));
    console.log("✨ SIMULATION SUMMARY");
    console.log("━".repeat(60));
    console.log();
    console.log(`Devices Registered:     ${simulationResults.devices.length}`);
    console.log(`Simulation Cycles:      ${simulationResults.cycles.length}`);
    console.log(`Total Updates:          ${simulationResults.cycles.length * numDevices}`);
    console.log(`Total Gas Used:         ${simulationResults.totalGasUsed.toString()}`);
    console.log(`Results Saved:          ${simulationFile}`);
    console.log();

    if (network === "sepolia") {
      console.log("🔗 View Transactions:");
      console.log("━".repeat(60));
      console.log(`Contract: https://sepolia.etherscan.io/address/${contractAddress}`);
      console.log("━".repeat(60));
      console.log();
    }

    console.log("✨ Simulation completed successfully!");
    console.log();

  } catch (error) {
    console.error("\n❌ Simulation failed:");
    console.error(error.message);
    console.error(error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Script execution failed:");
    console.error(error);
    process.exit(1);
  });

module.exports = main;
