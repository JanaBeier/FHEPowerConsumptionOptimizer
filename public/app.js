// Contract Configuration
// IMPORTANT: Replace this with your actual deployed contract address on Sepolia testnet
const CONTRACT_ADDRESS = "0x71FA4921E376f40CAD0e122E287F20da8e6AE9B5"; // ⚠️ REPLACE WITH YOUR DEPLOYED CONTRACT ADDRESS
const CONTRACT_ABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "deviceAddress",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "name": "ConsumptionDataUpdated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "deviceAddress",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "deviceType",
                "type": "string"
            }
        ],
        "name": "DeviceRegistered",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "deviceAddress",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "savingsPercentage",
                "type": "uint256"
            }
        ],
        "name": "EnergyEfficiencyImproved",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "analysisId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address[]",
                "name": "devices",
                "type": "address[]"
            }
        ],
        "name": "OptimizationCompleted",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "analysisId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "name": "OptimizationAnalysisStarted",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "gridLoadHistory",
        "outputs": [
            {
                "internalType": "euint32",
                "name": "totalLoad",
                "type": "uint256"
            },
            {
                "internalType": "euint16",
                "name": "loadFactor",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "isPeakHour",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_deviceType",
                "type": "string"
            }
        ],
        "name": "registerDevice",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint32",
                "name": "_powerUsage",
                "type": "uint32"
            },
            {
                "internalType": "uint16",
                "name": "_efficiencyScore",
                "type": "uint16"
            }
        ],
        "name": "updateConsumptionData",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "startOptimizationAnalysis",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint32",
                "name": "_totalLoad",
                "type": "uint32"
            }
        ],
        "name": "updateGridLoad",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "deviceAddr",
                "type": "address"
            }
        ],
        "name": "getDeviceInfo",
        "outputs": [
            {
                "internalType": "bool",
                "name": "isActive",
                "type": "bool"
            },
            {
                "internalType": "uint256",
                "name": "lastUpdateTime",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "deviceType",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "analysisId",
                "type": "uint256"
            }
        ],
        "name": "getOptimizationRecommendation",
        "outputs": [
            {
                "internalType": "bool",
                "name": "analysisCompleted",
                "type": "bool"
            },
            {
                "internalType": "uint256",
                "name": "analysisTime",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "deviceCount",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getSystemStats",
        "outputs": [
            {
                "internalType": "uint32",
                "name": "totalRegisteredDevices",
                "type": "uint32"
            },
            {
                "internalType": "uint256",
                "name": "lastOptimizationTimestamp",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "currentAnalysisId",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "isOptimizationActive",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getCurrentHour",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "isOptimizationWindow",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "isPeakHour",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getRegisteredDevicesCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

// Global variables
let provider;
let signer;
let contract;
let userAddress;
let registeredDevices = [];

// Initialize the application
async function init() {
    console.log('Initializing application...');

    // Check if MetaMask is installed
    if (typeof window.ethereum !== 'undefined') {
        console.log('MetaMask is installed!');

        try {
            provider = new ethers.providers.Web3Provider(window.ethereum);
            console.log('Provider created successfully');

            setupEventListeners();
            await checkConnection();

            // Only update optimization status if connected
            if (contract) {
                await updateOptimizationStatus();
            }
        } catch (error) {
            console.error('Error initializing provider:', error);
            showAlert('Error initializing wallet connection: ' + error.message, 'error');
        }
    } else {
        showAlert('Please install MetaMask to use this application. Visit https://metamask.io to download.', 'error');
    }
}

// Setup event listeners
function setupEventListeners() {
    document.getElementById('connect-wallet').addEventListener('click', connectWallet);
    document.getElementById('test-connection').addEventListener('click', testConnection);
    document.getElementById('register-device').addEventListener('click', registerDevice);
    document.getElementById('update-consumption').addEventListener('click', updateConsumption);
    document.getElementById('start-optimization').addEventListener('click', startOptimization);
    document.getElementById('check-analysis').addEventListener('click', checkAnalysis);
    document.getElementById('update-grid-load').addEventListener('click', updateGridLoad);
    document.getElementById('refresh-stats').addEventListener('click', refreshStats);
    document.getElementById('refresh-devices').addEventListener('click', refreshDevices);

    // Listen for account changes
    if (window.ethereum) {
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', handleChainChanged);
    }
}

// Check if already connected
async function checkConnection() {
    try {
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
            await connectWallet();
        }
    } catch (error) {
        console.error('Error checking connection:', error);
    }
}

// Test connection function for debugging
async function testConnection() {
    console.log('Testing connection...');

    // Test 1: Check if ethers is loaded
    if (typeof ethers === 'undefined') {
        showAlert('❌ Ethers.js library not loaded', 'error');
        return;
    }
    showAlert('✅ Ethers.js library loaded', 'success');

    // Test 2: Check if MetaMask is installed
    if (typeof window.ethereum === 'undefined') {
        showAlert('❌ MetaMask not detected', 'error');
        return;
    }
    showAlert('✅ MetaMask detected', 'success');

    // Test 3: Check if provider can be created
    try {
        const testProvider = new ethers.providers.Web3Provider(window.ethereum);
        showAlert('✅ Provider created successfully', 'success');

        // Test 4: Try to get network info
        const network = await testProvider.getNetwork();
        showAlert(`✅ Network: ${network.name} (Chain ID: ${network.chainId})`, 'info');

        // Test 5: Check accounts (without requesting permission)
        const accounts = await testProvider.listAccounts();
        if (accounts.length > 0) {
            showAlert(`✅ Found ${accounts.length} connected account(s)`, 'success');
        } else {
            showAlert('ℹ️ No accounts connected yet - click "Connect Wallet" to connect', 'info');
        }

    } catch (error) {
        showAlert('❌ Provider test failed: ' + error.message, 'error');
    }
}

// Connect wallet
async function connectWallet() {
    try {
        showLoading(true);
        console.log('Attempting to connect wallet...');

        // Check if MetaMask is available
        if (!window.ethereum) {
            throw new Error('MetaMask is not installed');
        }

        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log('Accounts:', accounts);

        if (accounts.length === 0) {
            throw new Error('No accounts found. Please create an account in MetaMask.');
        }

        // Get the signer
        signer = provider.getSigner();
        userAddress = await signer.getAddress();
        console.log('Connected address:', userAddress);

        // Check network (should be Sepolia)
        const network = await provider.getNetwork();
        console.log('Connected to network:', network);

        // Update network info in UI
        document.getElementById('network-info').textContent = `${network.name} (${network.chainId})`;

        if (network.chainId !== 11155111) {
            showAlert('Please switch to Sepolia testnet in MetaMask. Current network: ' + network.name, 'error');
            return;
        }

        // Create contract instance
        contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        console.log('Contract instance created');

        // Update UI
        updateWalletStatus(true);
        await updateBalance();
        await refreshStats();
        await refreshDevices();

        showAlert('Wallet connected successfully!', 'success');

    } catch (error) {
        console.error('Error connecting wallet:', error);

        if (error.code === 4001) {
            showAlert('Connection rejected by user', 'error');
        } else if (error.code === -32002) {
            showAlert('Connection request already pending. Please check MetaMask.', 'error');
        } else {
            showAlert('Failed to connect wallet: ' + error.message, 'error');
        }
    } finally {
        showLoading(false);
    }
}

// Update wallet status in UI
function updateWalletStatus(connected) {
    const statusElement = document.getElementById('wallet-status');
    const walletInfo = document.getElementById('wallet-info');
    const connectBtn = document.getElementById('connect-wallet');

    if (connected) {
        statusElement.innerHTML = '<span class="status-indicator status-connected"></span><span>Connected</span>';
        walletInfo.style.display = 'block';
        document.getElementById('wallet-address').textContent = userAddress;
        connectBtn.textContent = 'Disconnect';
        connectBtn.onclick = disconnectWallet;
    } else {
        statusElement.innerHTML = '<span class="status-indicator status-disconnected"></span><span>Not Connected</span>';
        walletInfo.style.display = 'none';
        connectBtn.textContent = 'Connect Wallet';
        connectBtn.onclick = connectWallet;
    }
}

// Update wallet balance
async function updateBalance() {
    try {
        if (provider && userAddress) {
            const balance = await provider.getBalance(userAddress);
            const balanceInEth = ethers.utils.formatEther(balance);
            document.getElementById('wallet-balance').textContent = parseFloat(balanceInEth).toFixed(4);
        }
    } catch (error) {
        console.error('Error updating balance:', error);
    }
}

// Disconnect wallet
function disconnectWallet() {
    provider = null;
    signer = null;
    contract = null;
    userAddress = null;
    updateWalletStatus(false);
    showAlert('Wallet disconnected', 'info');
}

// Register a new device
async function registerDevice() {
    if (!contract) {
        showAlert('Please connect your wallet first', 'error');
        return;
    }

    const deviceType = document.getElementById('device-type').value;

    try {
        showLoading(true);

        // Check if device is already registered
        const deviceInfo = await contract.getDeviceInfo(userAddress);
        if (deviceInfo.isActive) {
            showAlert('This address already has a registered device', 'error');
            return;
        }

        const tx = await contract.registerDevice(deviceType);
        showAlert('Transaction submitted. Waiting for confirmation...', 'info');

        await tx.wait();
        showAlert('Device registered successfully!', 'success');

        await refreshStats();
        await refreshDevices();

    } catch (error) {
        console.error('Error registering device:', error);
        showAlert('Failed to register device: ' + error.message, 'error');
    } finally {
        showLoading(false);
    }
}

// Update consumption data
async function updateConsumption() {
    if (!contract) {
        showAlert('Please connect your wallet first', 'error');
        return;
    }

    const powerUsage = document.getElementById('power-usage').value;
    const efficiencyScore = document.getElementById('efficiency-score').value;

    if (!powerUsage || !efficiencyScore) {
        showAlert('Please fill in all fields', 'error');
        return;
    }

    if (powerUsage < 1 || powerUsage > 10000) {
        showAlert('Power usage must be between 1 and 10000 watts', 'error');
        return;
    }

    if (efficiencyScore < 0 || efficiencyScore > 1000) {
        showAlert('Efficiency score must be between 0 and 1000', 'error');
        return;
    }

    try {
        showLoading(true);

        const tx = await contract.updateConsumptionData(
            parseInt(powerUsage),
            parseInt(efficiencyScore)
        );
        showAlert('Transaction submitted. Waiting for confirmation...', 'info');

        await tx.wait();
        showAlert('Consumption data updated successfully!', 'success');

        // Clear form
        document.getElementById('power-usage').value = '';
        document.getElementById('efficiency-score').value = '';

    } catch (error) {
        console.error('Error updating consumption:', error);
        showAlert('Failed to update consumption: ' + error.message, 'error');
    } finally {
        showLoading(false);
    }
}

// Start optimization analysis
async function startOptimization() {
    if (!contract) {
        showAlert('Please connect your wallet first', 'error');
        return;
    }

    try {
        showLoading(true);

        // Check if it's optimization window
        const isOptWindow = await contract.isOptimizationWindow();
        if (!isOptWindow) {
            showAlert('Optimization analysis can only be started during optimization windows (every 4 hours)', 'error');
            return;
        }

        const tx = await contract.startOptimizationAnalysis();
        showAlert('Transaction submitted. Waiting for confirmation...', 'info');

        await tx.wait();
        showAlert('Optimization analysis started successfully!', 'success');

        await refreshStats();

    } catch (error) {
        console.error('Error starting optimization:', error);
        showAlert('Failed to start optimization: ' + error.message, 'error');
    } finally {
        showLoading(false);
    }
}

// Check analysis result
async function checkAnalysis() {
    if (!contract) {
        showAlert('Please connect your wallet first', 'error');
        return;
    }

    const analysisId = document.getElementById('analysis-id-input').value;

    if (!analysisId) {
        showAlert('Please enter an analysis ID', 'error');
        return;
    }

    try {
        showLoading(true);

        const result = await contract.getOptimizationRecommendation(parseInt(analysisId));

        if (result.analysisCompleted) {
            const analysisTime = new Date(result.analysisTime.toNumber() * 1000);
            showAlert(`Analysis #${analysisId} completed on ${analysisTime.toLocaleString()}. Analyzed ${result.deviceCount} devices.`, 'success');
        } else {
            showAlert(`Analysis #${analysisId} is not completed yet or does not exist.`, 'info');
        }

    } catch (error) {
        console.error('Error checking analysis:', error);
        showAlert('Failed to check analysis: ' + error.message, 'error');
    } finally {
        showLoading(false);
    }
}

// Update grid load (owner only)
async function updateGridLoad() {
    if (!contract) {
        showAlert('Please connect your wallet first', 'error');
        return;
    }

    const totalLoad = document.getElementById('total-load').value;

    if (!totalLoad) {
        showAlert('Please enter total load value', 'error');
        return;
    }

    if (totalLoad < 1000 || totalLoad > 50000) {
        showAlert('Total load must be between 1000 and 50000 MW', 'error');
        return;
    }

    try {
        showLoading(true);

        const tx = await contract.updateGridLoad(parseInt(totalLoad));
        showAlert('Transaction submitted. Waiting for confirmation...', 'info');

        await tx.wait();
        showAlert('Grid load updated successfully!', 'success');

        // Clear form
        document.getElementById('total-load').value = '';

    } catch (error) {
        console.error('Error updating grid load:', error);
        showAlert('Failed to update grid load: ' + error.message, 'error');
    } finally {
        showLoading(false);
    }
}

// Refresh system statistics
async function refreshStats() {
    if (!contract) return;

    try {
        const stats = await contract.getSystemStats();
        const currentHour = await contract.getCurrentHour();

        document.getElementById('total-devices').textContent = stats.totalRegisteredDevices.toString();
        document.getElementById('current-hour').textContent = currentHour.toString();
        document.getElementById('analysis-id').textContent = stats.currentAnalysisId.toString();

        await updateOptimizationStatus();

    } catch (error) {
        console.error('Error refreshing stats:', error);
    }
}

// Update optimization status
async function updateOptimizationStatus() {
    if (!contract) return;

    try {
        const isOptWindow = await contract.isOptimizationWindow();
        const isPeak = await contract.isPeakHour();
        const statusDiv = document.getElementById('optimization-status');

        let statusHTML = '';

        if (isOptWindow) {
            statusHTML += '<div class="optimization-window">✅ Optimization Window Active - You can start analysis</div>';
        } else {
            statusHTML += '<div class="alert alert-info">⏳ Outside optimization window - Wait for next window (every 4 hours)</div>';
        }

        if (isPeak) {
            statusHTML += '<div class="peak-hour">⚠️ Peak Hours (6 PM - 10 PM) - High energy consumption period</div>';
        }

        statusDiv.innerHTML = statusHTML;

    } catch (error) {
        console.error('Error updating optimization status:', error);
    }
}

// Refresh device list
async function refreshDevices() {
    if (!contract || !userAddress) return;

    try {
        const deviceInfo = await contract.getDeviceInfo(userAddress);
        const deviceList = document.getElementById('device-list');

        if (deviceInfo.isActive) {
            const lastUpdate = new Date(deviceInfo.lastUpdateTime.toNumber() * 1000);
            deviceList.innerHTML = `
                <div class="device-item">
                    <div class="device-info">
                        <h4>${deviceInfo.deviceType}</h4>
                        <p>Address: ${userAddress}</p>
                        <p>Last Update: ${lastUpdate.toLocaleString()}</p>
                        <p>Status: <span style="color: green;">Active</span></p>
                    </div>
                </div>
            `;
        } else {
            deviceList.innerHTML = '<p>No devices registered for this address.</p>';
        }

    } catch (error) {
        console.error('Error refreshing devices:', error);
        document.getElementById('device-list').innerHTML = '<p>Error loading device information.</p>';
    }
}

// Handle account changes
function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
        disconnectWallet();
    } else if (accounts[0] !== userAddress) {
        connectWallet();
    }
}

// Handle chain changes
function handleChainChanged(chainId) {
    window.location.reload();
}

// Show alert message
function showAlert(message, type = 'info') {
    const alertsContainer = document.getElementById('alerts');
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;

    alertsContainer.appendChild(alertDiv);

    // Remove alert after 5 seconds
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// Show/hide loading indicator
function showLoading(show) {
    const loadingDiv = document.getElementById('loading');
    loadingDiv.style.display = show ? 'block' : 'none';
}

// Initialize the application when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing app...');
    init();
});

// Wait for ethers to load
window.addEventListener('load', () => {
    console.log('Window loaded');
    if (typeof ethers === 'undefined') {
        console.error('Ethers.js failed to load');
        showAlert('Failed to load required libraries. Please refresh the page.', 'error');
    } else {
        console.log('Ethers.js loaded successfully, version:', ethers.version);
    }
});

// Refresh optimization status every 30 seconds
setInterval(() => {
    if (contract) {
        updateOptimizationStatus();
    }
}, 30000);