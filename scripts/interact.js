const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("\n🔧 Starting interaction with PowerConsumptionOptimizer contract...\n");

  const network = hre.network.name;
  const [signer] = await hre.ethers.getSigners();

  console.log("📋 Interaction Configuration:");
  console.log("━".repeat(50));
  console.log(`Network:        ${network}`);
  console.log(`Signer:         ${signer.address}`);
  console.log(`Balance:        ${hre.ethers.utils.formatEther(await signer.getBalance())} ETH`);
  console.log("━".repeat(50));
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

  try {
    // 1. Get System Stats
    console.log("📊 Step 1: Fetching System Statistics...");
    console.log("━".repeat(50));

    const stats = await contract.getSystemStats();
    console.log(`Total Devices:         ${stats.totalRegisteredDevices}`);
    console.log(`Last Optimization:     ${new Date(stats.lastOptimizationTimestamp.toNumber() * 1000).toLocaleString()}`);
    console.log(`Current Analysis ID:   ${stats.currentAnalysisId}`);
    console.log(`Optimization Active:   ${stats.isOptimizationActive}`);

    const currentHour = await contract.getCurrentHour();
    console.log(`Current Hour:          ${currentHour}`);
    console.log();

    // 2. Register a Device
    console.log("📝 Step 2: Registering a new device...");
    console.log("━".repeat(50));

    const deviceType = "Smart Refrigerator";
    const registerTx = await contract.registerDevice(deviceType);
    console.log(`Transaction Hash: ${registerTx.hash}`);

    const registerReceipt = await registerTx.wait();
    console.log(`✅ Device registered successfully!`);
    console.log(`   Gas Used: ${registerReceipt.gasUsed.toString()}`);
    console.log(`   Block: ${registerReceipt.blockNumber}`);
    console.log();

    // 3. Update Consumption Data
    console.log("📈 Step 3: Updating consumption data...");
    console.log("━".repeat(50));

    const powerUsage = 1500; // 1500 watts
    const efficiencyScore = 750; // 75% efficiency

    const updateTx = await contract.updateConsumptionData(powerUsage, efficiencyScore);
    console.log(`Transaction Hash: ${updateTx.hash}`);

    const updateReceipt = await updateTx.wait();
    console.log(`✅ Consumption data updated!`);
    console.log(`   Power Usage: ${powerUsage}W`);
    console.log(`   Efficiency Score: ${efficiencyScore}/1000`);
    console.log(`   Gas Used: ${updateReceipt.gasUsed.toString()}`);
    console.log();

    // 4. Get Device Information
    console.log("🔍 Step 4: Retrieving device information...");
    console.log("━".repeat(50));

    const deviceInfo = await contract.getDeviceInfo(signer.address);
    console.log(`Device Active:     ${deviceInfo.isActive}`);
    console.log(`Device Type:       ${deviceInfo.deviceType}`);
    console.log(`Last Update:       ${new Date(deviceInfo.lastUpdateTime.toNumber() * 1000).toLocaleString()}`);
    console.log();

    // 5. Check if in Optimization Window
    console.log("⏰ Step 5: Checking optimization window...");
    console.log("━".repeat(50));

    const isOptWindow = await contract.isOptimizationWindow();
    const isPeak = await contract.isPeakHour();

    console.log(`Optimization Window: ${isOptWindow ? "✅ Yes" : "❌ No"}`);
    console.log(`Peak Hour:           ${isPeak ? "✅ Yes" : "❌ No"}`);
    console.log();

    // 6. Start Optimization Analysis (if in window)
    if (isOptWindow) {
      console.log("🚀 Step 6: Starting optimization analysis...");
      console.log("━".repeat(50));

      const optimizeTx = await contract.startOptimizationAnalysis();
      console.log(`Transaction Hash: ${optimizeTx.hash}`);

      const optimizeReceipt = await optimizeTx.wait();
      console.log(`✅ Optimization analysis started!`);
      console.log(`   Gas Used: ${optimizeReceipt.gasUsed.toString()}`);
      console.log();

      // 7. Get Optimization Recommendation
      console.log("💡 Step 7: Fetching optimization recommendation...");
      console.log("━".repeat(50));

      const analysisId = stats.currentAnalysisId;
      const recommendation = await contract.getOptimizationRecommendation(analysisId);

      console.log(`Analysis Completed:  ${recommendation.analysisCompleted}`);
      console.log(`Analysis Time:       ${new Date(recommendation.analysisTime.toNumber() * 1000).toLocaleString()}`);
      console.log(`Devices Analyzed:    ${recommendation.deviceCount}`);
      console.log();
    } else {
      console.log("⏳ Step 6: Optimization analysis skipped (not in optimization window)");
      console.log("━".repeat(50));
      console.log("   Optimization windows are at: 00:00, 04:00, 08:00, 12:00, 16:00, 20:00");
      console.log();
    }

    // 8. Get Registered Devices Count
    console.log("📊 Step 8: Fetching registered devices count...");
    console.log("━".repeat(50));

    const devicesCount = await contract.getRegisteredDevicesCount();
    console.log(`Total Registered Devices: ${devicesCount}`);
    console.log();

    // Summary
    console.log("✨ Interaction Summary:");
    console.log("━".repeat(50));
    console.log("✅ Device registered successfully");
    console.log("✅ Consumption data updated");
    console.log("✅ Device information retrieved");
    console.log("✅ System statistics fetched");
    if (isOptWindow) {
      console.log("✅ Optimization analysis completed");
    }
    console.log("━".repeat(50));
    console.log();

    // Display links
    if (network === "sepolia") {
      console.log("🔗 Transaction Links:");
      console.log("━".repeat(50));
      console.log(`Register: https://sepolia.etherscan.io/tx/${registerTx.hash}`);
      console.log(`Update:   https://sepolia.etherscan.io/tx/${updateTx.hash}`);
      if (isOptWindow) {
        console.log(`Optimize: https://sepolia.etherscan.io/tx/${optimizeTx.hash}`);
      }
      console.log("━".repeat(50));
      console.log();
    }

    console.log("✨ Interaction completed successfully!");
    console.log();

  } catch (error) {
    console.error("\n❌ Interaction failed:");
    console.error(error.message);

    if (error.message.includes("Device already registered")) {
      console.log("\n💡 Note: This device is already registered.");
      console.log("   Try using a different account or interacting with existing data.");
    }

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
