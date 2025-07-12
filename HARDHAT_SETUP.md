# Hardhat Development Framework Setup

Complete guide for setting up and using Hardhat with PowerConsumptionOptimizer project.

## 📋 Overview

This project uses **Hardhat** as the primary development framework, providing:

- ✅ Solidity compilation with optimization
- ✅ Local blockchain for testing
- ✅ Deployment scripts for multiple networks
- ✅ Contract verification on Etherscan
- ✅ Gas reporting and optimization
- ✅ Testing framework integration
- ✅ TypeScript support
- ✅ Plugin ecosystem

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Compile contracts
npm run compile

# Deploy to Sepolia
npm run deploy

# Verify contract
npm run verify

# Interact with contract
npm run interact

# Run simulation
npm run simulate
```

## 📦 Project Structure

```
power-consumption-optimizer/
├── contracts/                      # Solidity contracts
│   └── PowerConsumptionOptimizer.sol
├── scripts/                        # Hardhat scripts
│   ├── deploy.js                  # Deployment script
│   ├── verify.js                  # Etherscan verification
│   ├── interact.js                # Contract interaction
│   └── simulate.js                # Full simulation
├── test/                          # Test files (to be added)
├── deployments/                   # Deployment records
│   └── sepolia-deployment.json
├── simulations/                   # Simulation results
├── hardhat.config.js             # Hardhat configuration
├── .env                          # Environment variables
└── .env.example                  # Environment template
```

## ⚙️ Hardhat Configuration

### hardhat.config.js

The configuration file includes:

**Solidity Settings:**
```javascript
solidity: {
  version: "0.8.24",
  settings: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
}
```

**Network Configuration:**
```javascript
networks: {
  hardhat: {
    chainId: 31337,
    allowUnlimitedContractSize: true
  },
  sepolia: {
    url: SEPOLIA_RPC_URL,
    accounts: [PRIVATE_KEY],
    chainId: 11155111
  }
}
```

**Plugins:**
- `@nomicfoundation/hardhat-toolbox` - Essential tools
- `@nomicfoundation/hardhat-verify` - Etherscan verification
- `hardhat-gas-reporter` - Gas usage reporting
- `solidity-coverage` - Code coverage

## 🛠️ Available Scripts

### Compilation

```bash
# Compile contracts
npm run compile

# Clean and recompile
npm run clean && npm run compile
```

**Output:**
- `artifacts/` - Contract ABIs and bytecode
- `cache/` - Hardhat cache
- `typechain-types/` - TypeScript definitions

### Deployment

```bash
# Deploy to Sepolia testnet
npm run deploy

# Deploy to local network
npm run node          # Terminal 1
npm run deploy:local  # Terminal 2
```

**Features:**
- Pre-deployment validation
- Balance checking
- Transaction tracking
- Automatic record keeping
- Etherscan link generation

### Verification

```bash
# Verify on Etherscan
npm run verify
```

**Requirements:**
- Valid Etherscan API key
- Contract deployed on Sepolia
- Wait 1-2 minutes after deployment

**Benefits:**
- Public source code visibility
- Contract interaction via Etherscan
- Increased trust and transparency
- Easier debugging

### Interaction

```bash
# Interact with deployed contract
npm run interact
```

**Operations:**
1. Fetch system statistics
2. Register device
3. Update consumption data
4. Retrieve device info
5. Check optimization window
6. Start optimization analysis
7. Get recommendations

### Simulation

```bash
# Run comprehensive simulation
npm run simulate
```

**Simulation Phases:**
1. **Device Registration** - Register 5 smart devices
2. **Consumption Updates** - Simulate realistic usage
3. **System Statistics** - Track performance
4. **Optimization** - Run analysis algorithms

### Testing

```bash
# Run tests (when added)
npm test

# Run with coverage
npm run coverage

# Run with gas reporting
REPORT_GAS=true npm test
```

### Utilities

```bash
# Start local Hardhat node
npm run node

# Clean build artifacts
npm run clean

# Format code
npm run format

# Lint Solidity
npm run lint:sol
```

## 🔧 Hardhat Tasks

Hardhat provides built-in tasks:

```bash
# List all available tasks
npx hardhat help

# Get account list
npx hardhat accounts

# Check network status
npx hardhat --network sepolia

# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy (custom script)
npx hardhat run scripts/deploy.js --network sepolia
```

## 📝 Script Details

### 1. deploy.js

**Purpose:** Deploy contract to specified network

**Features:**
- Network detection
- Balance validation
- Deployment execution
- Information storage
- Etherscan link generation

**Usage:**
```bash
npm run deploy
```

**Output File:** `deployments/sepolia-deployment.json`

**JSON Structure:**
```json
{
  "network": "sepolia",
  "contractName": "PowerConsumptionOptimizer",
  "contractAddress": "0x...",
  "deployer": "0x...",
  "deploymentTime": "2024-01-15T10:30:00.000Z",
  "blockNumber": 5234567,
  "transactionHash": "0x...",
  "chainId": 11155111
}
```

### 2. verify.js

**Purpose:** Verify contract on Etherscan

**Features:**
- API key validation
- Deployment info loading
- Source code submission
- Status update

**Usage:**
```bash
npm run verify
```

**Requirements:**
- ETHERSCAN_API_KEY in .env
- Deployed contract on Sepolia
- Deployment JSON file exists

### 3. interact.js

**Purpose:** Interact with deployed contract

**Features:**
- Contract connection
- Function calls
- Transaction tracking
- Result display

**Usage:**
```bash
npm run interact
```

**Interactions:**
- System statistics retrieval
- Device registration
- Consumption updates
- Optimization analysis

### 4. simulate.js

**Purpose:** Run comprehensive simulation

**Features:**
- Multi-device registration
- Realistic usage patterns
- Multiple update cycles
- Gas tracking
- Result storage

**Usage:**
```bash
npm run simulate
```

**Configuration:**
```javascript
{
  numberOfDevices: 5,
  simulationCycles: 3,
  deviceTypes: [
    "Smart Refrigerator",
    "Air Conditioner",
    "Electric Water Heater"
  ]
}
```

**Output File:** `simulations/simulation-[timestamp].json`

## 🌐 Network Configuration

### Sepolia Testnet

**Network Details:**
```javascript
{
  name: "sepolia",
  chainId: 11155111,
  rpcUrl: "https://rpc.sepolia.org",
  blockExplorer: "https://sepolia.etherscan.io"
}
```

**Required Resources:**
- Sepolia ETH from faucet
- RPC endpoint (Alchemy/Infura)
- Etherscan API key

**Getting Sepolia ETH:**
1. Visit https://sepoliafaucet.com/
2. Enter your wallet address
3. Complete verification
4. Receive 0.5 ETH

### Local Network

**Network Details:**
```javascript
{
  name: "localhost",
  chainId: 31337,
  rpcUrl: "http://127.0.0.1:8545"
}
```

**Starting Local Node:**
```bash
npx hardhat node
```

**Features:**
- 20 pre-funded accounts
- Instant mining
- Console logging
- Transaction history

## 🔍 Gas Optimization

### Enable Gas Reporter

Add to `.env`:
```bash
REPORT_GAS=true
COINMARKETCAP_API_KEY=your_api_key
```

### Run with Gas Reporting

```bash
REPORT_GAS=true npm run deploy
```

### Optimization Tips

1. **Enable Optimizer:**
   ```javascript
   optimizer: {
     enabled: true,
     runs: 200  // Optimize for deployment
   }
   ```

2. **Batch Operations:**
   - Combine multiple calls
   - Use arrays for bulk operations

3. **Storage Optimization:**
   - Pack variables efficiently
   - Use events for historical data

4. **Function Optimization:**
   - Mark functions as `external` when possible
   - Use `calldata` instead of `memory`

## 🧪 Testing Strategy

### Test Structure (to be implemented)

```javascript
describe("PowerConsumptionOptimizer", function() {
  it("Should deploy successfully", async function() {
    // Test deployment
  });

  it("Should register device", async function() {
    // Test device registration
  });

  it("Should update consumption data", async function() {
    // Test data updates
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run specific test
npx hardhat test test/PowerConsumptionOptimizer.test.js

# Run with coverage
npm run coverage
```

## 🔐 Security Best Practices

### Environment Variables

✅ **DO:**
- Use `.env` for sensitive data
- Keep `.env` out of version control
- Use `.env.example` as template
- Rotate keys regularly

❌ **DON'T:**
- Commit `.env` to git
- Share private keys
- Use production keys in testing
- Hardcode sensitive data

### Private Key Security

```bash
# Generate new wallet for testing
npx hardhat console
> const wallet = ethers.Wallet.createRandom()
> console.log(wallet.privateKey)
```

### Contract Security

- Audit before mainnet deployment
- Use OpenZeppelin contracts
- Test thoroughly on testnet
- Implement access controls
- Add emergency pause functionality

## 📊 Monitoring and Debugging

### Console Logging

```javascript
console.log("Deploying contract...");
console.log("Contract address:", contract.address);
```

### Hardhat Console

```bash
npx hardhat console --network sepolia
```

```javascript
> const contract = await ethers.getContractAt("PowerConsumptionOptimizer", "0x...")
> await contract.getSystemStats()
```

### Transaction Debugging

```javascript
const tx = await contract.registerDevice("Smart TV");
console.log("Transaction hash:", tx.hash);
const receipt = await tx.wait();
console.log("Gas used:", receipt.gasUsed.toString());
```

## 🚨 Troubleshooting

### Common Issues

**1. Compilation Errors**
```bash
# Clear cache and recompile
npm run clean
rm -rf node_modules
npm install
npm run compile
```

**2. Network Connection Issues**
```bash
# Test RPC connection
curl -X POST $SEPOLIA_RPC_URL \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
```

**3. Insufficient Gas**
```bash
# Increase gas limit in config
gas: "auto",
gasPrice: "auto"
```

**4. Deployment Verification Failed**
```bash
# Wait 2 minutes and retry
sleep 120
npm run verify
```

## 📚 Additional Resources

### Hardhat Documentation
- Website: https://hardhat.org/
- Tutorial: https://hardhat.org/tutorial
- Plugins: https://hardhat.org/plugins

### Ethereum Development
- Ethereum Docs: https://ethereum.org/developers
- Solidity: https://docs.soliditylang.org/
- OpenZeppelin: https://docs.openzeppelin.com/

### Testing Tools
- Waffle: https://getwaffle.io/
- Chai: https://www.chaijs.com/
- Ethers.js: https://docs.ethers.io/

### Network Resources
- Sepolia Faucet: https://sepoliafaucet.com/
- Etherscan: https://sepolia.etherscan.io/
- Alchemy: https://www.alchemy.com/
- Infura: https://infura.io/

## 🎯 Next Steps

1. ✅ Complete environment setup
2. ✅ Deploy to Sepolia testnet
3. ✅ Verify contract on Etherscan
4. ✅ Run interaction script
5. ✅ Execute simulation
6. ⬜ Implement comprehensive tests
7. ⬜ Add coverage reporting
8. ⬜ Optimize gas usage
9. ⬜ Prepare for mainnet

## 📄 License

MIT License

---

**Framework:** Hardhat 2.19.0+
**Last Updated:** 2024
**Network:** Sepolia Testnet
