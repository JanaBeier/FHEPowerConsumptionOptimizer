# PowerConsumptionOptimizer - Architecture Guide

## Overview

PowerConsumptionOptimizer is an advanced decentralized energy management system that leverages **Fully Homomorphic Encryption (FHE)** for privacy-preserving optimization and uses the **Gateway callback pattern** for secure asynchronous decryption operations.

## Core Architecture

### 1. Gateway Callback Pattern

The system implements the gateway callback pattern for encrypted data handling:

```
User Input → FHE Encryption → Smart Contract Storage → Gateway Request
    ↓
    FHE Oracle Decryption → Callback Execution → Final Results
```

**Key Components:**

- **Encrypted Request**: Users submit encrypted optimization requests
- **Contract Storage**: Encrypted data stored on-chain with request ID tracking
- **Gateway Decryption**: ZAMA oracle network decrypts data off-chain
- **Callback Resolution**: `optimizationDecryptionCallback()` completes transaction

### 2. Data Structures

#### DeviceConsumption
```solidity
struct DeviceConsumption {
    euint32 encryptedPowerUsage;      // Watts (encrypted)
    euint16 encryptedEfficiencyScore; // 0-1000 scale (encrypted)
    bool isActive;
    uint256 lastUpdateTime;
    string deviceType;
    uint256 pendingRefund;            // Timeout refund tracking
    uint256 refundTimestamp;          // Refund eligibility
}
```

#### OptimizationRecommendation
```solidity
struct OptimizationRecommendation {
    euint32 targetConsumption;        // Encrypted optimization target
    euint16 potentialSavings;         // Encrypted savings percentage
    bool analysisCompleted;
    bool decryptionFailed;            // Refund mechanism trigger
    uint256 analysisTime;
    uint256 decryptionRequestTime;    // Timeout protection
    address[] analyzedDevices;
    uint256 decryptionRequestId;      // Gateway callback mapping
}
```

## Security Features

### 1. Input Validation

```solidity
modifier validPowerUsage(uint32 _powerUsage) {
    require(_powerUsage >= MIN_POWER_USAGE && _powerUsage <= MAX_POWER_USAGE);
    _;
}
```

- **MIN_POWER_USAGE**: 1 Watt
- **MAX_POWER_USAGE**: 1,000,000 Watts (1MW)
- **Efficiency Score Range**: 0-1000

### 2. Access Control

- **onlyOwner**: Administrative operations (fee withdrawal, grid load updates)
- **onlyRegisteredDevice**: Consumption data updates
- **onlyDuringOptimizationWindow**: Analysis initiation (every 4 hours)

### 3. Overflow Protection

- **safeOperation**: Requires minimum gas (100,000) before state changes
- **Batch size limits**: Maximum 50 devices per batch update
- **HCU cycle limits**: < 1,000,000 cycles per operation

### 4. Refund Mechanism

**Decryption Failure Protection:**

```solidity
// Timeout period: 1 hour
uint256 public constant DECRYPTION_TIMEOUT = 1 hours;

// Trigger refund if timeout exceeded
function requestDecryptionRefund(uint256 optimizationId) external {
    require(block.timestamp >= decryptionRequestTime + DECRYPTION_TIMEOUT);
    recommendation.decryptionFailed = true;
    platformFeePool += 0.01 ether;
}

// Claim individual refund
function claimDecryptionFailureRefund(uint256 optimizationId) external {
    uint256 refundAmount = 0.01 ether / deviceCount;
    payable(msg.sender).call{value: refundAmount}("");
}
```

### 5. Timeout Protection

- **Decryption Timeout**: 1 hour for gateway response
- **Max Request Age**: 24 hours for stale request cleanup
- **Refund Delay**: 30 minutes after timeout declaration

## Privacy Features

### 1. Privacy-Preserving Division

Protects against inference attacks on division operations:

```solidity
function _calculateSavingsPercentage(euint32 savings, euint32 totalConsumption)
    internal returns (euint16) {

    // Generate random multiplier for obfuscation
    uint256 randomMultiplier = _generateRandomMultiplier();

    // Obfuscate division operation
    uint256 obfuscatedValue = keccak256(abi.encode(savings, randomMultiplier)) % 1000;

    // Cache for later verification
    divisionCache[currentOptimizationId] = DivisionObfuscation({
        randomMultiplier: randomMultiplier,
        obfuscatedValue: obfuscatedValue,
        timestamp: block.timestamp
    });
}
```

**Protection Against:**
- Direct observation of division results
- Inference of actual consumption values
- Pattern analysis on calculation logic

### 2. Price Obfuscation

Adds temporal noise to prevent pattern inference:

```solidity
function obfuscatePriceData(uint256 optimizationId) external view returns (uint256) {
    DivisionObfuscation storage obfuscation = divisionCache[optimizationId];

    // Add block-hash-based temporal noise
    uint256 temporalNoise = uint256(blockhash(block.number - 1)) % 100;
    return obfuscation.obfuscatedValue ^ temporalNoise;
}
```

**Noise Sources:**
- Random multipliers (1-10,000)
- Block hash entropy
- Timestamp variation
- User address entropy

### 3. Encrypted Aggregation

```solidity
// All operations on encrypted values
euint32 totalConsumption = FHE.asEuint32(0);
for (uint256 i = 0; i < devices.length; i++) {
    totalConsumption = FHE.add(totalConsumption, device.encryptedPowerUsage);
}
// Individual values never revealed during aggregation
```

## Performance Optimization

### 1. Gas Optimization

**Batch Operations:**
```solidity
function batchUpdateConsumptionData(
    address[] calldata devices,
    uint32[] calldata powerUsages,
    uint16[] calldata efficiencyScores
) external onlyOwner {
    require(devices.length <= 50, "Batch size limit for gas efficiency");
    // Single transaction for multiple updates
}
```

**State Read Reduction:**
```solidity
function getOptimizationStatus(uint256 analysisId) external view
    returns (bool, bool, uint256, uint256, uint256) {
    // Single storage read, multiple return values
}
```

### 2. HCU (Homomorphic Computing Unit) Management

- **Cycle Tracking**: Monitor FHE operation complexity
- **Budget Limits**: 1,000,000 cycles maximum per operation
- **Cost Optimization**: Batch operations reduce per-device overhead

**HCU Operations Cost:**
- Addition: ~100 cycles
- Multiplication: ~500 cycles
- Select (conditional): ~200 cycles
- Decryption request: ~1,000 cycles

### 3. Optimization Windows

```solidity
// Analysis only during designated windows (every 4 hours)
uint256 currentHour = (block.timestamp / 3600) % 24;
return currentHour % 4 == 0; // 00:00, 04:00, 08:00, 12:00, 16:00, 20:00
```

## Audit & Monitoring

### 1. Device Initialization Audit

```solidity
function auditDeviceInitialization(address deviceAddr)
    external view returns (bool, uint256, string, bool)
```

Verifies:
- Device has been initialized
- Last update timestamp
- Device type classification
- Current active status

### 2. Refund Lifecycle Audit

```solidity
function auditRefundStatus(uint256 optimizationId)
    external view returns (bool, uint256, bool)
```

Tracks:
- Refund issuance status
- Refund amount calculation
- Refund processing completion

### 3. Access Control Audit

```solidity
function auditAccessControl(address deviceAddr)
    external view returns (bool, bool, bool)
```

Verifies:
- Owner authorization
- Device registration status
- Current activity status

## Workflow Examples

### Example 1: Normal Optimization Flow

```
1. startOptimizationAnalysis() called
   ↓
2. Collect encrypted consumption data from all devices
   ↓
3. FHE.requestDecryption() triggered → Gateway receives request
   ↓
4. ZAMA oracle decrypts results off-chain
   ↓
5. optimizationDecryptionCallback() executed by oracle
   ↓
6. Results stored, users can claim findings
```

### Example 2: Timeout & Refund Flow

```
1. startOptimizationAnalysis() called (Time: T)
   ↓
2. Decryption request sent (Time: T)
   ↓
3. Oracle fails to respond (> 1 hour)
   ↓
4. requestDecryptionRefund() called (Time: T + 1h)
   ↓
5. decryptionFailed = true, platform holds 0.01 ETH
   ↓
6. claimDecryptionFailureRefund() distributes refund to participants
```

### Example 3: Encrypted Data Update

```
1. Device generates encrypted power usage
   ↓
2. Client encrypts with FHE: externalEuint32
   ↓
3. updateConsumptionDataEncrypted(encryptedUsage, proof)
   ↓
4. Contract verifies proof via FHE.fromExternal()
   ↓
5. Encrypted value stored, never decrypted on-chain
```

## Event Logging

### Critical Events

```solidity
event DecryptionRequested(uint256 indexed analysisId, uint256 requestId);
event OptimizationCompleted(uint256 indexed analysisId, address[] devices);
event RefundIssued(uint256 indexed analysisId, uint256 amount, string reason);
event TimeoutProtectionTriggered(uint256 indexed analysisId);
event PriceObfuscated(uint256 indexed analysisId, uint256 obfuscatedValue);
```

## Constants & Configuration

```solidity
// Timeout Configuration
DECRYPTION_TIMEOUT = 1 hour          // Oracle response deadline
MAX_REQUEST_AGE = 24 hours           // Cleanup period
REFUND_DELAY = 30 minutes            // Refund claim window

// Input Constraints
MIN_POWER_USAGE = 1 Watt
MAX_POWER_USAGE = 1,000,000 Watts
MAX_EFFICIENCY_SCORE = 1000

// Batch Limits
MAX_BATCH_SIZE = 50 devices
MIN_GAS_REQUIRED = 100,000
MAX_HCU_CYCLES = 1,000,000
```

## Security Considerations

### 1. FHE Integrity

- All encrypted operations verified by ZAMA libraries
- Cryptographic proofs checked on callback execution
- No unencrypted computation on sensitive data

### 2. Reentrancy Protection

- State updated before external calls
- Pull-over-push pattern for refunds
- Checks-effects-interactions pattern

### 3. Oracle Trust Model

- Only ZAMA oracle network can trigger callbacks
- Signature verification on decrypted values
- Request ID mapping prevents replay attacks

### 4. Privacy Leakage Prevention

- No value logging in events (only IDs)
- Random obfuscation for division operations
- Temporal noise on price data

## Future Enhancements

1. **VRF Integration**: Use Chainlink VRF for better randomness
2. **Off-Chain Computation**: Move complex analyses to ZK proofs
3. **Scalability**: Implement layer-2 solutions for high-frequency updates
4. **Governance**: DAO-based parameter adjustment
5. **Advanced Analytics**: Pattern detection on encrypted data using MPC
