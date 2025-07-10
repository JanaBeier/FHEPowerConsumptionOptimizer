const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("\n🚀 Starting deployment process...\n");

  // Get network information
  const network = hre.network.name;
  const [deployer] = await hre.ethers.getSigners();

  console.log("📋 Deployment Configuration:");
  console.log("━".repeat(50));
  console.log(`Network:        ${network}`);
  console.log(`Deployer:       ${deployer.address}`);
  console.log(`Balance:        ${hre.ethers.utils.formatEther(await deployer.getBalance())} ETH`);
  console.log("━".repeat(50));
  console.log();

  // Check balance
  const balance = await deployer.getBalance();
  if (balance.eq(0)) {
    throw new Error("❌ Deployer account has insufficient balance");
  }

  // Deploy PowerConsumptionOptimizer contract
  console.log("📦 Deploying PowerConsumptionOptimizer contract...");

  const PowerConsumptionOptimizer = await hre.ethers.getContractFactory("PowerConsumptionOptimizer");
  const powerOptimizer = await PowerConsumptionOptimizer.deploy();

  await powerOptimizer.deployed();

  console.log("✅ PowerConsumptionOptimizer deployed successfully!");
  console.log();

  // Display deployment information
  console.log("📝 Deployment Information:");
  console.log("━".repeat(50));
  console.log(`Contract Name:  PowerConsumptionOptimizer`);
  console.log(`Contract Address: ${powerOptimizer.address}`);
  console.log(`Deployer:       ${deployer.address}`);
  console.log(`Network:        ${network}`);
  console.log(`Block Number:   ${powerOptimizer.deployTransaction.blockNumber || 'pending'}`);
  console.log(`Gas Used:       ${powerOptimizer.deployTransaction.gasLimit.toString()}`);
  console.log("━".repeat(50));
  console.log();

  // Create deployment info object
  const deploymentInfo = {
    network: network,
    contractName: "PowerConsumptionOptimizer",
    contractAddress: powerOptimizer.address,
    deployer: deployer.address,
    deploymentTime: new Date().toISOString(),
    blockNumber: powerOptimizer.deployTransaction.blockNumber,
    transactionHash: powerOptimizer.deployTransaction.hash,
    chainId: (await hre.ethers.provider.getNetwork()).chainId
  };

  // Save deployment information to file
  const deploymentsDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const deploymentFile = path.join(deploymentsDir, `${network}-deployment.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));

  console.log(`💾 Deployment info saved to: ${deploymentFile}`);
  console.log();

  // Display Etherscan link
  if (network === "sepolia") {
    console.log("🔗 Verification Links:");
    console.log("━".repeat(50));
    console.log(`Contract: https://sepolia.etherscan.io/address/${powerOptimizer.address}`);
    console.log(`Transaction: https://sepolia.etherscan.io/tx/${powerOptimizer.deployTransaction.hash}`);
    console.log("━".repeat(50));
    console.log();
    console.log("⏳ Please wait a few minutes before running verification script");
    console.log("   Run: npm run verify");
  }

  console.log();
  console.log("✨ Deployment completed successfully!");
  console.log();

  // Return deployment info for use in other scripts
  return {
    powerOptimizer: powerOptimizer,
    deploymentInfo: deploymentInfo
  };
}

// Execute deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });

module.exports = main;
