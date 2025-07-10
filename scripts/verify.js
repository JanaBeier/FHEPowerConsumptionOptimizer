const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("\n🔍 Starting contract verification process...\n");

  const network = hre.network.name;

  // Check if on supported network
  if (network !== "sepolia") {
    console.log(`⚠️  Contract verification is only available on Sepolia network`);
    console.log(`   Current network: ${network}`);
    return;
  }

  // Check for API key
  if (!process.env.ETHERSCAN_API_KEY) {
    console.error("❌ ETHERSCAN_API_KEY not found in environment variables");
    console.log("\nPlease add your Etherscan API key to .env file:");
    console.log("ETHERSCAN_API_KEY=your_api_key_here");
    console.log("\nGet your API key from: https://etherscan.io/myapikey");
    process.exit(1);
  }

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

  console.log("📋 Verification Configuration:");
  console.log("━".repeat(50));
  console.log(`Network:          ${network}`);
  console.log(`Contract Address: ${contractAddress}`);
  console.log(`Contract Name:    ${deploymentInfo.contractName}`);
  console.log("━".repeat(50));
  console.log();

  try {
    console.log("🔄 Verifying contract on Etherscan...");
    console.log("   This may take a few minutes...\n");

    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: [],
      contract: "contracts/PowerConsumptionOptimizer.sol:PowerConsumptionOptimizer"
    });

    console.log("\n✅ Contract verified successfully!");
    console.log();
    console.log("🔗 Verified Contract Link:");
    console.log("━".repeat(50));
    console.log(`https://sepolia.etherscan.io/address/${contractAddress}#code`);
    console.log("━".repeat(50));
    console.log();

    // Update deployment info with verification status
    deploymentInfo.verified = true;
    deploymentInfo.verificationTime = new Date().toISOString();
    fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));

    console.log("💾 Deployment info updated with verification status");
    console.log();

  } catch (error) {
    if (error.message.includes("Already Verified")) {
      console.log("✅ Contract is already verified on Etherscan");
      console.log();
      console.log("🔗 Verified Contract Link:");
      console.log("━".repeat(50));
      console.log(`https://sepolia.etherscan.io/address/${contractAddress}#code`);
      console.log("━".repeat(50));
      console.log();
    } else {
      console.error("\n❌ Verification failed:");
      console.error(error.message);
      console.log();
      console.log("Common issues:");
      console.log("1. Contract was deployed very recently - wait a few minutes and try again");
      console.log("2. Invalid Etherscan API key - check your .env file");
      console.log("3. Network mismatch - ensure you're verifying on the correct network");
      console.log();
      process.exit(1);
    }
  }

  console.log("✨ Verification process completed!");
  console.log();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Verification process failed:");
    console.error(error);
    process.exit(1);
  });

module.exports = main;
