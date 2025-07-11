# PowerConsumptionOptimizer Deployment Guide

Complete deployment guide for the PowerConsumptionOptimizer smart contract using Hardhat development framework.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Compilation](#compilation)
- [Deployment](#deployment)
- [Verification](#verification)
- [Interaction](#interaction)
- [Simulation](#simulation)
- [Testing](#testing)
- [Network Information](#network-information)
- [Troubleshooting](#troubleshooting)

## 🔧 Prerequisites

Before deploying, ensure you have:

- **Node.js** version 18.0.0 or higher
- **npm** or **yarn** package manager
- **Sepolia testnet ETH** for deployment (get from [Sepolia Faucet](https://sepoliafaucet.com/))
- **Ethereum wallet** with a private key
- **Alchemy/Infura account** for RPC endpoint (optional but recommended)
- **Etherscan API key** for contract verification

## 📦 Installation

### 1. Clone and Install Dependencies

```bash
# Navigate to project directory
cd power-consumption-optimizer

# Install dependencies
npm install
```

### 2. Verify Installation

```bash
# Check Hardhat installation
npx hardhat --version

# Should output: Hardhat version 2.19.0 or higher
```

## ⚙️ Configuration

### 1. Create Environment File

```bash
# Copy the example environment file
cp .env.example .env
```

### 2. Configure Environment Variables

Edit `.env` file with your actual values:

```bash
# Sepolia RPC URL
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY

# Your wallet private key (without 0x prefix)
PRIVATE_KEY=your_private_key_here

# Etherscan API key
ETHERSCAN_API_KEY=your_etherscan_api_key_here

# Optional: Gas reporting
REPORT_GAS=false
```

### 3. Security Notes

⚠️ **IMPORTANT:**
- Never commit `.env` file to version control
- Keep your private key secure
- Use a dedicated wallet for testing
- Ensure `.env` is in `.gitignore`

## 🔨 Compilation

Compile the smart contracts:

```bash
# Compile contracts
npm run compile

# Clean and recompile
npm run clean && npm run compile
```

**Expected Output:**
```
Compiled 1 Solidity file successfully
```

**Generated Files:**
- `artifacts/` - Compiled contract artifacts
- `cache/` - Hardhat cache files
- `typechain-types/` - TypeScript type definitions

## 🚀 Deployment

### Deploy to Sepolia Testnet

```bash
npm run deploy
```

**Deployment Process:**

1. **Pre-deployment Checks**
   - Validates network configuration
   - Checks deployer account balance
   - Verifies contract compilation

2. **Contract Deployment**
   - Deploys PowerConsumptionOptimizer contract
   - Waits for transaction confirmation
   - Records deployment information

3. **Post-deployment**
   - Saves deployment info to `deployments/sepolia-deployment.json`
   - Displays contract address and transaction hash
   - Provides Etherscan links

**Expected Output:**
```
🚀 Starting deployment process...

📋 Deployment Configuration:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Network:        sepolia
Deployer:       0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
Balance:        0.5 ETH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📦 Deploying PowerConsumptionOptimizer contract...
✅ PowerConsumptionOptimizer deployed successfully!

📝 Deployment Information:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Contract Address: 0x71FA4921E376f40CAD0e122E287F20da8e6AE9B5
Deployer:         0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
Network:          sepolia
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✨ Deployment completed successfully!
```

### Deploy to Local Network

For local development and testing:

```bash
# Terminal 1: Start local Hardhat node
npm run node

# Terminal 2: Deploy to local network
npm run deploy:local
```

## ✅ Verification

Verify the deployed contract on Etherscan:

```bash
npm run verify
```

**Verification Process:**

1. Reads deployment information from `deployments/sepolia-deployment.json`
2. Submits contract source code to Etherscan
3. Verifies compiler settings match deployment
4. Updates deployment file with verification status

**Expected Output:**
```
🔍 Starting contract verification process...

📋 Verification Configuration:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Network:          sepolia
Contract Address: 0x71FA4921E376f40CAD0e122E287F20da8e6AE9B5
Contract Name:    PowerConsumptionOptimizer
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Contract verified successfully!

🔗 Verified Contract Link:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
https://sepolia.etherscan.io/address/0x71FA4921E376f40CAD0e122E287F20da8e6AE9B5#code
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Note:** Wait 1-2 minutes after deployment before running verification.

## 🔧 Interaction

Interact with the deployed contract:

```bash
npm run interact
```

**Interaction Script Performs:**

1. ✅ Fetches system statistics
2. ✅ Registers a new device
3. ✅ Updates consumption data
4. ✅ Retrieves device information
5. ✅ Checks optimization window
6. ✅ Starts optimization analysis (if in window)
7. ✅ Fetches optimization recommendations

**Expected Output:**
```
🔧 Starting interaction with PowerConsumptionOptimizer contract...

📊 Step 1: Fetching System Statistics...
Total Devices:         1
Current Analysis ID:   2
Optimization Active:   false

📝 Step 2: Registering a new device...
✅ Device registered successfully!

📈 Step 3: Updating consumption data...
✅ Consumption data updated!
   Power Usage: 1500W
   Efficiency Score: 750/1000

✨ Interaction completed successfully!
```

## 🎮 Simulation

Run comprehensive simulation with multiple devices:

```bash
npm run simulate
```

**Simulation Features:**

- **Device Registration**: Registers multiple smart home devices
- **Consumption Updates**: Simulates realistic power usage patterns
- **Multiple Cycles**: Runs several update cycles
- **System Statistics**: Tracks overall system performance
- **Optimization Analysis**: Tests optimization algorithms
- **Gas Tracking**: Records gas usage for all operations

**Simulation Configuration:**

```javascript
{
  devices: 5,
  cycles: 3,
  deviceTypes: [
    "Smart Refrigerator",
    "Air Conditioner",
    "Electric Water Heater",
    "Washing Machine",
    "Smart TV"
  ]
}
```

**Expected Output:**
```
🎮 Starting PowerConsumptionOptimizer Simulation...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 PHASE 1: DEVICE REGISTRATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[1/5] Registering Smart Refrigerator...
   ✅ Registered | Gas: 125000

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📈 PHASE 2: CONSUMPTION DATA SIMULATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔄 Simulation Cycle 1/3
[1/5] Smart Refrigerator
   Power: 150W | Efficiency: 750/1000
   ✅ Updated | Gas: 85000

✨ Simulation completed successfully!
```

## 🧪 Testing

Run the test suite (when tests are added):

```bash
# Run all tests
npm test

# Run with coverage
npm run coverage

# Run with gas reporting
REPORT_GAS=true npm test
```

## 🌐 Network Information

### Sepolia Testnet

**Network Details:**
- **Chain ID**: 11155111
- **RPC URL**: https://rpc.sepolia.org
- **Block Explorer**: https://sepolia.etherscan.io
- **Faucets**:
  - https://sepoliafaucet.com/
  - https://faucet.quicknode.com/ethereum/sepolia

**Contract Address:**
```
0x71FA4921E376f40CAD0e122E287F20da8e6AE9B5
```

**Etherscan Links:**
- Contract: https://sepolia.etherscan.io/address/0x71FA4921E376f40CAD0e122E287F20da8e6AE9B5
- Verified Contract: https://sepolia.etherscan.io/address/0x71FA4921E376f40CAD0e122E287F20da8e6AE9B5#code

## 📊 Deployment Files

### Directory Structure

```
power-consumption-optimizer/
├── contracts/
│   └── PowerConsumptionOptimizer.sol
├── scripts/
│   ├── deploy.js           # Deployment script
│   ├── verify.js           # Verification script
│   ├── interact.js         # Interaction script
│   └── simulate.js         # Simulation script
├── deployments/
│   └── sepolia-deployment.json  # Deployment info
├── simulations/
│   └── simulation-*.json   # Simulation results
├── hardhat.config.js       # Hardhat configuration
├── .env                    # Environment variables (not in git)
├── .env.example            # Environment template
└── package.json           # Project dependencies
```

### Deployment Information File

`deployments/sepolia-deployment.json`:

```json
{
  "network": "sepolia",
  "contractName": "PowerConsumptionOptimizer",
  "contractAddress": "0x71FA4921E376f40CAD0e122E287F20da8e6AE9B5",
  "deployer": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "deploymentTime": "2024-01-15T10:30:00.000Z",
  "blockNumber": 5234567,
  "transactionHash": "0xabc...",
  "chainId": 11155111,
  "verified": true,
  "verificationTime": "2024-01-15T10:35:00.000Z"
}
```

## 🔍 Troubleshooting

### Common Issues

#### 1. Insufficient Balance

**Error:** `insufficient funds for gas * price + value`

**Solution:**
```bash
# Get testnet ETH from Sepolia faucet
# Visit: https://sepoliafaucet.com/
```

#### 2. Private Key Error

**Error:** `invalid private key`

**Solution:**
- Ensure private key is in `.env` file
- Remove `0x` prefix from private key
- Verify no extra spaces or newlines

#### 3. Network Connection Error

**Error:** `could not detect network`

**Solution:**
- Check RPC URL in `.env` file
- Verify internet connection
- Try alternative RPC provider

#### 4. Compilation Error

**Error:** `Cannot find module '@fhevm/solidity'`

**Solution:**
```bash
# Reinstall dependencies
npm install

# Clear cache and reinstall
npm run clean
rm -rf node_modules package-lock.json
npm install
```

#### 5. Verification Failed

**Error:** `Already Verified` or `verification failed`

**Solution:**
- Wait 2-3 minutes after deployment
- Check Etherscan API key is correct
- Verify on correct network

#### 6. Gas Estimation Failed

**Error:** `cannot estimate gas`

**Solution:**
- Check contract function parameters
- Ensure sufficient ETH balance
- Verify contract is deployed correctly

### Getting Help

If you encounter issues:

1. Check deployment logs in `deployments/` directory
2. Review simulation results in `simulations/` directory
3. Verify environment variables in `.env` file
4. Check network status on Etherscan
5. Review Hardhat documentation: https://hardhat.org/docs

## 📝 Additional Commands

```bash
# Format code
npm run format

# Lint Solidity files
npm run lint:sol

# Clean build artifacts
npm run clean

# View Hardhat tasks
npx hardhat help

# Get account information
npx hardhat accounts

# Check network configuration
npx hardhat --network sepolia
```

## 🔐 Security Best Practices

1. **Never commit private keys** to version control
2. **Use separate wallets** for development and production
3. **Audit contracts** before mainnet deployment
4. **Test thoroughly** on testnet first
5. **Verify contracts** on Etherscan for transparency
6. **Monitor transactions** after deployment
7. **Keep dependencies** updated

## 📚 Resources

- **Hardhat Documentation**: https://hardhat.org/
- **Ethereum Documentation**: https://ethereum.org/developers
- **Sepolia Faucet**: https://sepoliafaucet.com/
- **Etherscan**: https://sepolia.etherscan.io/
- **OpenZeppelin**: https://docs.openzeppelin.com/

## 📄 License

MIT License - see LICENSE file for details

---

**Deployment Guide Version:** 1.0.0
**Last Updated:** 2024
**Framework:** Hardhat 2.19.0+
**Network:** Sepolia Testnet
