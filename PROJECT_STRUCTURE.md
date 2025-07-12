# PowerConsumptionOptimizer - Project Structure

Complete overview of the Hardhat-based project structure.

## 📂 Directory Structure

```
power-consumption-optimizer/
│
├── contracts/                              # Smart Contracts
│   └── PowerConsumptionOptimizer.sol      # Main FHE-enabled contract
│
├── scripts/                                # Hardhat Task Scripts
│   ├── deploy.js                          # Contract deployment script
│   ├── verify.js                          # Etherscan verification script
│   ├── interact.js                        # Contract interaction script
│   └── simulate.js                        # Comprehensive simulation script
│
├── test/                                   # Test Files (to be added)
│   └── PowerConsumptionOptimizer.test.js  # Contract tests
│
├── deployments/                            # Deployment Records
│   └── sepolia-deployment.json            # Sepolia deployment info
│
├── simulations/                            # Simulation Results
│   └── simulation-[timestamp].json        # Simulation data
│
├── artifacts/                              # Compiled Contracts (generated)
│   ├── contracts/
│   └── build-info/
│
├── cache/                                  # Hardhat Cache (generated)
│
├── typechain-types/                        # TypeScript Types (generated)
│
├── public/                                 # Frontend Files
│   ├── index.html                         # Web interface
│   ├── script.js                          # Frontend logic
│   └── style.css                          # Styling
│
├── node_modules/                           # Dependencies (generated)
│
├── hardhat.config.js                      # Hardhat Configuration
├── package.json                           # NPM Configuration
├── .env                                   # Environment Variables (local)
├── .env.example                           # Environment Template
├── .gitignore                             # Git Ignore Rules
│
├── README.md                              # Main Documentation
├── DEPLOYMENT.md                          # Deployment Guide
├── HARDHAT_SETUP.md                       # Hardhat Setup Guide
├── QUICKSTART.md                          # Quick Start Guide
├── PROJECT_STRUCTURE.md                   # This file
│
└── LICENSE                                # MIT License
```

## 📝 File Descriptions

### Core Contract Files

#### `contracts/PowerConsumptionOptimizer.sol`
**Purpose:** Main smart contract implementing FHE-based power optimization

**Features:**
- Device registration and management
- Encrypted consumption data handling
- Optimization analysis algorithms
- Peak hour detection
- Grid load tracking

**Key Functions:**
- `registerDevice()` - Register smart devices
- `updateConsumptionData()` - Update power readings
- `startOptimizationAnalysis()` - Run optimization
- `getOptimizationRecommendation()` - Fetch results

---

### Hardhat Scripts

#### `scripts/deploy.js`
**Purpose:** Deploy contract to specified network

**Features:**
- Network detection and validation
- Balance checking
- Contract deployment
- Transaction tracking
- Record keeping

**Output:** `deployments/[network]-deployment.json`

**Usage:**
```bash
npm run deploy
```

---

#### `scripts/verify.js`
**Purpose:** Verify contract on Etherscan

**Features:**
- API key validation
- Source code submission
- Constructor arguments handling
- Verification status tracking

**Usage:**
```bash
npm run verify
```

---

#### `scripts/interact.js`
**Purpose:** Interact with deployed contract

**Operations:**
1. Fetch system statistics
2. Register new device
3. Update consumption data
4. Retrieve device information
5. Check optimization window
6. Start analysis (if in window)
7. Get recommendations

**Usage:**
```bash
npm run interact
```

---

#### `scripts/simulate.js`
**Purpose:** Run comprehensive multi-device simulation

**Phases:**
1. **Device Registration** - Register 5 devices
2. **Consumption Simulation** - 3 update cycles
3. **System Statistics** - Performance tracking
4. **Optimization Analysis** - Run algorithms

**Configuration:**
```javascript
{
  numberOfDevices: 5,
  simulationCycles: 3,
  deviceTypes: [
    "Smart Refrigerator",
    "Air Conditioner",
    "Electric Water Heater",
    "Washing Machine",
    "Smart TV"
  ]
}
```

**Output:** `simulations/simulation-[timestamp].json`

**Usage:**
```bash
npm run simulate
```

---

### Configuration Files

#### `hardhat.config.js`
**Purpose:** Hardhat framework configuration

**Includes:**
- Solidity compiler settings (v0.8.24)
- Network configurations (Sepolia, localhost)
- Plugin configurations
- Gas reporter settings
- Path configurations

**Key Sections:**
```javascript
{
  solidity: { version, optimizer },
  networks: { sepolia, localhost, hardhat },
  etherscan: { apiKey },
  gasReporter: { enabled, currency },
  paths: { sources, tests, cache, artifacts }
}
```

---

#### `package.json`
**Purpose:** NPM project configuration

**Scripts:**
```json
{
  "compile": "hardhat compile",
  "deploy": "hardhat run scripts/deploy.js --network sepolia",
  "verify": "hardhat run scripts/verify.js --network sepolia",
  "interact": "hardhat run scripts/interact.js --network sepolia",
  "simulate": "hardhat run scripts/simulate.js --network sepolia",
  "test": "hardhat test",
  "node": "hardhat node",
  "clean": "hardhat clean"
}
```

---

#### `.env` (local only)
**Purpose:** Environment variables for deployment

**Required Variables:**
```bash
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
PRIVATE_KEY=your_private_key_without_0x
ETHERSCAN_API_KEY=your_etherscan_api_key
```

**Security:** Never commit to version control

---

#### `.env.example`
**Purpose:** Template for environment variables

**Usage:** Copy to `.env` and fill in values
```bash
cp .env.example .env
```

---

#### `.gitignore`
**Purpose:** Specify files to exclude from git

**Key Exclusions:**
- `.env` (sensitive data)
- `node_modules/` (dependencies)
- `cache/` (build cache)
- `artifacts/` (compiled contracts)
- `typechain-types/` (generated types)

---

### Documentation Files

#### `README.md`
**Purpose:** Main project documentation

**Sections:**
- Project overview
- Core concepts (FHE)
- Key features
- Privacy architecture
- Contract details
- Use cases
- Links and resources

---

#### `DEPLOYMENT.md`
**Purpose:** Comprehensive deployment guide

**Sections:**
- Prerequisites
- Installation steps
- Configuration guide
- Compilation process
- Deployment instructions
- Verification process
- Interaction examples
- Troubleshooting

---

#### `HARDHAT_SETUP.md`
**Purpose:** Hardhat framework setup guide

**Sections:**
- Framework overview
- Configuration details
- Available scripts
- Task descriptions
- Network setup
- Gas optimization
- Testing strategy
- Security practices

---

#### `QUICKSTART.md`
**Purpose:** 5-minute quick start guide

**Steps:**
1. Install dependencies
2. Configure environment
3. Compile contracts
4. Deploy contract
5. Verify on Etherscan

---

#### `PROJECT_STRUCTURE.md` (this file)
**Purpose:** Complete project structure overview

---

### Generated Directories

#### `artifacts/`
**Generated by:** `npm run compile`

**Contains:**
- Compiled contract bytecode
- Contract ABIs (Application Binary Interface)
- Build metadata

**Usage:** Required for deployment and interaction

---

#### `cache/`
**Generated by:** Hardhat compilation

**Contains:**
- Compilation cache
- Dependency resolution data

**Purpose:** Speed up subsequent compilations

---

#### `typechain-types/`
**Generated by:** TypeChain plugin

**Contains:**
- TypeScript type definitions
- Contract type-safe wrappers

**Purpose:** TypeScript development support

---

#### `deployments/`
**Generated by:** `npm run deploy`

**Contains:**
- Deployment records per network
- Contract addresses
- Transaction hashes
- Timestamps

**Example:** `sepolia-deployment.json`

---

#### `simulations/`
**Generated by:** `npm run simulate`

**Contains:**
- Simulation results
- Gas usage data
- Transaction records

**Example:** `simulation-2024-01-15T10-30-00-000Z.json`

---

## 🔄 Workflow

### Development Workflow

```
1. Write/Edit Contract
   ↓
2. Compile (npm run compile)
   ↓
3. Test Locally (npm run node + deploy:local)
   ↓
4. Deploy to Testnet (npm run deploy)
   ↓
5. Verify Contract (npm run verify)
   ↓
6. Interact & Test (npm run interact)
   ↓
7. Run Simulation (npm run simulate)
   ↓
8. Mainnet Deployment
```

### Deployment Workflow

```
1. Configure .env
   ↓
2. Compile Contract
   ↓
3. Deploy Script (scripts/deploy.js)
   ↓
4. Generate Deployment Record
   ↓
5. Verify on Etherscan (scripts/verify.js)
   ↓
6. Update Documentation
```

### Interaction Workflow

```
1. Load Deployment Info
   ↓
2. Connect to Contract
   ↓
3. Execute Functions
   ↓
4. Track Transactions
   ↓
5. Display Results
```

## 📊 Data Flow

### Deployment Data Flow

```
hardhat.config.js
       ↓
   .env (credentials)
       ↓
scripts/deploy.js
       ↓
   Network (Sepolia)
       ↓
Contract Deployed
       ↓
deployments/sepolia-deployment.json
```

### Interaction Data Flow

```
deployments/sepolia-deployment.json
       ↓
scripts/interact.js
       ↓
Contract Instance
       ↓
Function Calls
       ↓
Transaction Results
       ↓
Console Output + Etherscan
```

### Simulation Data Flow

```
scripts/simulate.js (config)
       ↓
Multiple Accounts
       ↓
Device Registration
       ↓
Consumption Updates (3 cycles)
       ↓
Optimization Analysis
       ↓
simulations/simulation-[timestamp].json
```

## 🎯 Key Patterns

### Script Pattern

All scripts follow this pattern:

```javascript
// 1. Import dependencies
const hre = require("hardhat");

// 2. Main function
async function main() {
  // Get signers
  const [deployer] = await hre.ethers.getSigners();

  // Execute logic
  // ...

  // Return results
  return results;
}

// 3. Execute with error handling
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

### Configuration Pattern

```javascript
// Load from environment
const VALUE = process.env.VALUE || "default";

// Use in configuration
module.exports = {
  setting: VALUE
};
```

### Contract Interaction Pattern

```javascript
// 1. Load deployment info
const deploymentInfo = JSON.parse(
  fs.readFileSync("deployments/sepolia-deployment.json")
);

// 2. Connect to contract
const Contract = await hre.ethers.getContractFactory("ContractName");
const contract = Contract.attach(deploymentInfo.contractAddress);

// 3. Execute function
const tx = await contract.functionName(args);
await tx.wait();
```

## 📦 Dependencies

### Core Dependencies

```json
{
  "@fhevm/solidity": "latest"
}
```

### Dev Dependencies

```json
{
  "hardhat": "^2.19.0",
  "@nomicfoundation/hardhat-toolbox": "^4.0.0",
  "@nomicfoundation/hardhat-verify": "^2.0.0",
  "hardhat-gas-reporter": "^1.0.9",
  "solidity-coverage": "^0.8.5",
  "dotenv": "^16.3.1",
  "ethers": "^5.7.2"
}
```

## 🔗 Integration Points

### Frontend Integration

```javascript
// Connect to deployed contract
const contractAddress = "0x71FA4921E376f40CAD0e122E287F20da8e6AE9B5";
const contractABI = require("./artifacts/contracts/PowerConsumptionOptimizer.sol/PowerConsumptionOptimizer.json").abi;

const provider = new ethers.providers.Web3Provider(window.ethereum);
const contract = new ethers.Contract(contractAddress, contractABI, provider);
```

### Backend Integration

```javascript
const { ethers } = require("ethers");
const deploymentInfo = require("./deployments/sepolia-deployment.json");

const provider = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(
  deploymentInfo.contractAddress,
  contractABI,
  wallet
);
```

## ✅ Best Practices

1. **Always compile before deploying**
2. **Verify contracts on Etherscan**
3. **Test on testnet first**
4. **Keep .env secure**
5. **Document all deployments**
6. **Track gas usage**
7. **Maintain clean git history**

---

**Project Type:** Hardhat Smart Contract Development
**Framework Version:** Hardhat 2.19.0+
**Network:** Sepolia Testnet
**Last Updated:** 2024
