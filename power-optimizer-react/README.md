# Power Optimizer React

A modern React application for privacy-preserving power consumption optimization using FHEVM (Fully Homomorphic Encryption Virtual Machine).

## Features

- **Privacy-Preserving**: All consumption data encrypted using FHE before storage
- **Real-time Analytics**: Monitor energy consumption with complete privacy
- **Smart Optimization**: Get recommendations without revealing sensitive data
- **MetaMask Integration**: Seamless wallet connection
- **Type-Safe**: Full TypeScript support
- **Modern UI**: Built with React 18 and Vite

## Technology Stack

- **React 18**: Modern React with hooks
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and dev server
- **Ethers.js**: Ethereum interaction
- **FHEVM SDK**: Fully homomorphic encryption operations
- **Sepolia Testnet**: Live deployment on Ethereum testnet

## Contract Information

- **Address**: `0x71FA4921E376f40CAD0e122E287F20da8e6AE9B5`
- **Network**: Sepolia Testnet
- **Explorer**: [View on Etherscan](https://sepolia.etherscan.io/address/0x71FA4921E376f40CAD0e122E287F20da8e6AE9B5)

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- MetaMask browser extension
- Sepolia testnet ETH ([Get from faucet](https://sepoliafaucet.com/))

### Installation

```bash
# Navigate to the project
cd power-optimizer-react

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## Application Structure

```
power-optimizer-react/
├── src/
│   ├── components/          # React components
│   │   ├── WalletConnect.tsx       # Wallet connection UI
│   │   ├── DeviceRegistration.tsx  # Device registration form
│   │   ├── ConsumptionUpdate.tsx   # Update consumption data
│   │   ├── SystemStats.tsx         # System statistics display
│   │   ├── DeviceList.tsx          # User devices list
│   │   └── AlertList.tsx           # Alert notifications
│   │
│   ├── hooks/               # Custom React hooks
│   │   ├── useWallet.ts            # Wallet connection logic
│   │   ├── usePowerContract.ts     # Contract interaction
│   │   └── useAlerts.ts            # Alert management
│   │
│   ├── lib/                 # Utilities and configuration
│   │   ├── contract.ts             # Contract ABI and address
│   │   └── types.ts                # TypeScript type definitions
│   │
│   ├── styles/              # CSS styles
│   │   └── App.css                 # Main stylesheet
│   │
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Application entry point
│   └── vite-env.d.ts        # Vite type declarations
│
├── index.html               # HTML entry point
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
└── README.md                # This file
```

## Features Overview

### 1. Wallet Connection

- Connect/disconnect MetaMask wallet
- View account balance and network
- Auto-detect network changes
- Sepolia testnet validation

### 2. Device Registration

- Register energy devices (thermostats, solar panels, etc.)
- Multiple device type support
- Privacy-preserving registration

### 3. Consumption Tracking

- Update power usage (1-10000W)
- Set efficiency scores (0-1000)
- FHE encryption before blockchain storage
- Real-time transaction tracking

### 4. System Analytics

- Total registered devices
- Current hour tracking
- Optimization window status
- Peak hour detection (6 PM - 10 PM)

### 5. Optimization Analysis

- Start privacy-preserving optimization
- Window-based execution (every 4 hours)
- Encrypted recommendations
- Multi-device analysis

## Usage Guide

### Step 1: Connect Wallet

1. Click "Connect Wallet"
2. Approve MetaMask connection
3. Ensure you're on Sepolia network

### Step 2: Register Device

1. Select device type from dropdown
2. Click "Register Device"
3. Confirm transaction in MetaMask
4. Wait for confirmation

### Step 3: Update Consumption

1. Enter power usage (Watts)
2. Enter efficiency score (0-1000)
3. Click "Update Consumption"
4. Data is encrypted before storage

### Step 4: View Statistics

- System stats auto-refresh every 30 seconds
- Click "Refresh Stats" for manual update
- Monitor optimization windows
- Check peak hour status

### Step 5: Run Optimization

1. Wait for optimization window
2. Click "Start Optimization"
3. Receive encrypted recommendations
4. All calculations done on encrypted data

## Development

### Available Scripts

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run lint
```

### Key Technologies

- **React Hooks**: Modern state management
- **Custom Hooks**: Reusable logic (wallet, contract, alerts)
- **TypeScript**: Full type safety
- **Ethers.js v5**: Ethereum interaction
- **Vite**: Lightning-fast builds

## Privacy Features

### Fully Homomorphic Encryption

All sensitive data is encrypted using FHE:

- **Power Usage**: `euint32` (32-bit encrypted integer)
- **Efficiency Score**: `euint16` (16-bit encrypted integer)
- **Computations**: Performed on encrypted data
- **Access Control**: Permission-based decryption

### What's Private

- Individual device consumption
- Efficiency ratings
- Personal usage patterns
- Optimization recommendations

### What's Public

- Device registration (address + type)
- Number of registered devices
- Optimization timestamps
- System-level statistics

## Troubleshooting

### MetaMask Not Detected

- Install MetaMask extension
- Refresh the page
- Check browser console for errors

### Wrong Network

- Open MetaMask
- Switch to Sepolia testnet
- Refresh the application

### Transaction Fails

- Ensure sufficient Sepolia ETH
- Check gas limits
- Verify contract permissions
- Wait for previous transaction

### Optimization Window Not Active

- Analysis runs every 4 hours
- Check "System Statistics" for status
- Wait for next window
- Monitor "Optimization Status" indicator

## Security Considerations

- Never share private keys
- Use testnet ETH only (no real value)
- Verify contract address before transactions
- Review all MetaMask prompts carefully

## Contributing

This is a demonstration application. Feel free to:

- Report issues
- Suggest improvements
- Submit pull requests
- Fork for your own use

## License

MIT License - See LICENSE file for details

## Resources

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Zama.ai](https://www.zama.ai/)
- [Ethers.js Docs](https://docs.ethers.io/)
- [React Documentation](https://react.dev/)
- [Vite Guide](https://vitejs.dev/)

## Support

For questions or issues:

- Check the main repository README
- Review FHEVM documentation
- Open an issue on GitHub
- Join Zama community Discord

---

Built with ❤️ using FHEVM and React
