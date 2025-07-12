# PowerConsumptionOptimizer - Quick Start Guide

Get started with PowerConsumptionOptimizer in 5 minutes using Hardhat.

## ⚡ Quick Setup

### 1. Install Dependencies (1 minute)

```bash
cd power-consumption-optimizer
npm install
```

### 2. Configure Environment (2 minutes)

```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your details
nano .env
```

Required values:
```bash
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
PRIVATE_KEY=your_private_key_without_0x
ETHERSCAN_API_KEY=your_etherscan_api_key
```

**Get Resources:**
- 🔗 RPC URL: [Alchemy](https://www.alchemy.com/) or [Infura](https://infura.io/)
- 💰 Sepolia ETH: [Sepolia Faucet](https://sepoliafaucet.com/)
- 🔍 API Key: [Etherscan](https://etherscan.io/myapikey)

### 3. Compile Contracts (30 seconds)

```bash
npm run compile
```

Expected output: `Compiled 1 Solidity file successfully`

### 4. Deploy Contract (1 minute)

```bash
npm run deploy
```

Expected output:
```
✅ PowerConsumptionOptimizer deployed successfully!
📍 Contract Address: 0x71FA4921E376f40CAD0e122E287F20da8e6AE9B5
```

### 5. Verify Contract (1 minute)

```bash
# Wait 1-2 minutes after deployment, then:
npm run verify
```

Expected output:
```
✅ Contract verified successfully!
🔗 https://sepolia.etherscan.io/address/0x71FA...#code
```

## 🎮 Usage

### Interact with Contract

```bash
npm run interact
```

This will:
- Register a smart device
- Update consumption data
- Check optimization windows
- Fetch recommendations

### Run Simulation

```bash
npm run simulate
```

This will:
- Register 5 devices
- Simulate 3 consumption cycles
- Track gas usage
- Generate results report

## 📋 Available Commands

```bash
npm run compile      # Compile contracts
npm run deploy       # Deploy to Sepolia
npm run verify       # Verify on Etherscan
npm run interact     # Interact with contract
npm run simulate     # Run full simulation
npm run node         # Start local node
npm run clean        # Clean build files
```

## 🔗 Deployed Contract

**Network:** Sepolia Testnet

**Contract Address:**
```
0x71FA4921E376f40CAD0e122E287F20da8e6AE9B5
```

**Etherscan:**
- Contract: https://sepolia.etherscan.io/address/0x71FA4921E376f40CAD0e122E287F20da8e6AE9B5
- Verified Code: https://sepolia.etherscan.io/address/0x71FA4921E376f40CAD0e122E287F20da8e6AE9B5#code

## 📁 Key Files

```
power-consumption-optimizer/
├── contracts/
│   └── PowerConsumptionOptimizer.sol    # Smart contract
├── scripts/
│   ├── deploy.js       # Deployment script
│   ├── verify.js       # Verification script
│   ├── interact.js     # Interaction script
│   └── simulate.js     # Simulation script
├── hardhat.config.js   # Hardhat configuration
├── .env               # Your environment variables
└── package.json       # NPM scripts
```

## 🆘 Troubleshooting

### Issue: "Insufficient funds"
**Solution:** Get Sepolia ETH from https://sepoliafaucet.com/

### Issue: "Cannot compile"
**Solution:**
```bash
npm run clean
rm -rf node_modules
npm install
npm run compile
```

### Issue: "Verification failed"
**Solution:** Wait 2-3 minutes after deployment and try again

### Issue: "Network error"
**Solution:** Check your RPC URL in `.env` file

## 📚 Documentation

- **Full Deployment Guide:** [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Hardhat Setup:** [HARDHAT_SETUP.md](./HARDHAT_SETUP.md)
- **Main README:** [README.md](./README.md)

## 🎯 Next Steps

1. ✅ Deploy contract
2. ✅ Verify on Etherscan
3. ✅ Run interaction script
4. ✅ Execute simulation
5. ⬜ Build frontend integration
6. ⬜ Add comprehensive tests
7. ⬜ Optimize gas usage

## 💡 Tips

- **Test First:** Always test on Sepolia before mainnet
- **Verify Contracts:** Increases trust and transparency
- **Track Gas:** Use `REPORT_GAS=true` to monitor costs
- **Keep Keys Safe:** Never commit `.env` file

## 🔐 Security Notes

⚠️ **Important:**
- Never share your private key
- Use separate wallet for testing
- Keep `.env` file secure
- Audit before mainnet deployment

## 📞 Getting Help

- Check logs in `deployments/` directory
- Review [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed guide
- Visit [Hardhat Docs](https://hardhat.org/docs)

## ✨ Features

- ✅ Privacy-preserving FHE computations
- ✅ Device registration and monitoring
- ✅ Encrypted consumption data updates
- ✅ Optimization analysis algorithms
- ✅ Peak hour detection
- ✅ Grid load management
- ✅ Comprehensive event logging

---

**Ready to Start?** Run `npm install && npm run compile && npm run deploy`

**Need Help?** Check [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions
