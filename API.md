# PowerConsumptionOptimizer - API Documentation

## Overview

This document provides detailed API specifications for the PowerConsumptionOptimizer smart contract, including function signatures, parameters, return values, and usage examples.

## Core Functions

### Device Management

#### registerDevice

Registers a new device for power consumption monitoring.

```solidity
function registerDevice(string memory _deviceType) external
```

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| _deviceType | string | Category of device (e.g., "HVAC", "Lighting", "Industrial") |

**Requirements:**
- Device address must not be already registered
- Caller becomes the device address

**Events Emitted:**
```solidity
event DeviceRegistered(address indexed deviceAddress, string deviceType)
```

**Example:**
```javascript
await contract.registerDevice("Industrial Motor");
```

---

#### updateConsumptionData

Updates power consumption data for a registered device with plain values.

```solidity
function updateConsumptionData(
    uint32 _powerUsage,
    uint16 _efficiencyScore
) external onlyRegisteredDevice validPowerUsage(_powerUsage) safeOperation
```

**Parameters:**
| Name | Type | Range | Description |
|------|------|-------|-------------|
| _powerUsage | uint32 | 1 - 1,000,000 | Power usage in Watts |
| _efficiencyScore | uint16 | 0 - 1000 | Efficiency score (0=0%, 1000=100%) |

**Requirements:**
- Caller must be a registered, active device
- Power usage must be within valid range
- Minimum gas required: 100,000

**Events Emitted:**
```solidity
event ConsumptionDataUpdated(address indexed deviceAddress, uint256 timestamp)
```

---

#### updateConsumptionDataEncrypted

Updates consumption data with client-side encrypted values (Gateway pattern).

```solidity
function updateConsumptionDataEncrypted(
    externalEuint32 encryptedPowerUsage,
    bytes calldata inputProof
) external onlyRegisteredDevice safeOperation
```

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| encryptedPowerUsage | externalEuint32 | FHE-encrypted power usage value |
| inputProof | bytes | Cryptographic proof of encryption validity |

**Requirements:**
- Valid encryption proof
- Caller must be registered device

---

### Optimization Analysis

#### startOptimizationAnalysis

Initiates an optimization analysis during designated windows.

```solidity
function startOptimizationAnalysis() external onlyDuringOptimizationWindow safeOperation
```

**Requirements:**
- Must be within optimization window (00:00, 04:00, 08:00, 12:00, 16:00, 20:00 UTC)
- At least one device registered
- Minimum gas available

**Events Emitted:**
```solidity
event OptimizationAnalysisStarted(uint256 indexed analysisId, uint256 timestamp)
event DecryptionRequested(uint256 indexed analysisId, uint256 requestId)
```

**Workflow:**
1. Creates optimization recommendation record
2. Aggregates encrypted consumption data
3. Calculates optimized consumption targets
4. Requests decryption from Gateway
5. Emits events for tracking

---

#### optimizationDecryptionCallback

Callback executed by ZAMA oracle when decryption completes.

```solidity
function optimizationDecryptionCallback(
    uint256 requestId,
    bytes memory cleartexts,
    bytes memory decryptionProof
) external
```

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| requestId | uint256 | Original decryption request identifier |
| cleartexts | bytes | ABI-encoded decrypted values |
| decryptionProof | bytes | Cryptographic proof of correct decryption |

**Decoded Cleartexts:**
```solidity
(uint32 targetConsumption, uint16 potentialSavings) = abi.decode(cleartexts, (uint32, uint16));
```

**Events Emitted:**
```solidity
event OptimizationCompleted(uint256 indexed analysisId, address[] devices)
```

---

### Refund & Timeout Protection

#### requestDecryptionRefund

Triggers refund mechanism when decryption times out.

```solidity
function requestDecryptionRefund(uint256 optimizationId) external safeOperation
```

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| optimizationId | uint256 | ID of the optimization request |

**Requirements:**
- Decryption request must exist
- Analysis must not be completed
- At least 1 hour since decryption request

**Events Emitted:**
```solidity
event TimeoutProtectionTriggered(uint256 indexed analysisId)
event RefundIssued(uint256 indexed analysisId, uint256 amount, string reason)
```

---

#### claimDecryptionFailureRefund

Claims individual refund after decryption failure.

```solidity
function claimDecryptionFailureRefund(uint256 optimizationId) external
```

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| optimizationId | uint256 | ID of the failed optimization |

**Requirements:**
- Decryption must have failed
- Caller must be a participant

**Refund Calculation:**
```
refundAmount = 0.01 ETH / analyzedDevices.length
```

---

### Grid Load Management

#### updateGridLoad

Updates grid load data (admin only).

```solidity
function updateGridLoad(uint32 _totalLoad) external onlyOwner
```

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| _totalLoad | uint32 | Total grid load in Watts |

**Load Factor Calculation:**
| Load Range | Load Factor |
|------------|-------------|
| > 10,000 W | 900 (High) |
| > 5,000 W | 600 (Medium) |
| <= 5,000 W | 300 (Low) |

---

### Batch Operations (Gas Optimized)

#### batchUpdateConsumptionData

Updates multiple devices in a single transaction.

```solidity
function batchUpdateConsumptionData(
    address[] calldata devices,
    uint32[] calldata powerUsages,
    uint16[] calldata efficiencyScores
) external onlyOwner safeOperation
```

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| devices | address[] | Array of device addresses |
| powerUsages | uint32[] | Array of power usage values |
| efficiencyScores | uint16[] | Array of efficiency scores |

**Requirements:**
- All arrays must have equal length
- Maximum 50 devices per batch
- Only active devices are updated

**Gas Savings:**
- Amortizes transaction overhead
- Reduces storage access costs
- Single authorization check

---

### Privacy Features

#### obfuscatePriceData

Returns obfuscated price/consumption data for privacy.

```solidity
function obfuscatePriceData(uint256 optimizationId) external view returns (uint256)
```

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| optimizationId | uint256 | ID of the optimization |

**Returns:**
| Type | Description |
|------|-------------|
| uint256 | XOR-obfuscated value with temporal noise |

**Privacy Mechanism:**
```solidity
uint256 temporalNoise = uint256(blockhash(block.number - 1)) % 100;
return obfuscatedValue ^ temporalNoise;
```

---

### Query Functions

#### getDeviceInfo

Retrieves device status information.

```solidity
function getDeviceInfo(address deviceAddr) external view returns (
    bool isActive,
    uint256 lastUpdateTime,
    string memory deviceType
)
```

---

#### getOptimizationRecommendation

Retrieves optimization analysis results.

```solidity
function getOptimizationRecommendation(uint256 analysisId) external view returns (
    bool analysisCompleted,
    uint256 analysisTime,
    uint256 deviceCount
)
```

---

#### getOptimizationStatus

Retrieves detailed optimization status (gas-optimized).

```solidity
function getOptimizationStatus(uint256 analysisId) external view returns (
    bool completed,
    bool failed,
    uint256 requestId,
    uint256 deviceCount,
    uint256 requestTime
)
```

---

#### getSystemStats

Retrieves system-wide statistics.

```solidity
function getSystemStats() external view returns (
    uint32 totalRegisteredDevices,
    uint256 lastOptimizationTimestamp,
    uint256 currentAnalysisId,
    bool isOptimizationActive
)
```

---

### Utility Functions

#### isOptimizationWindow

Checks if current time is within an optimization window.

```solidity
function isOptimizationWindow() public view returns (bool)
```

**Returns:**
- `true` at hours 00:00, 04:00, 08:00, 12:00, 16:00, 20:00 UTC

---

#### isPeakHour

Checks if current time is during peak consumption hours.

```solidity
function isPeakHour() public view returns (bool)
```

**Returns:**
- `true` between 18:00-22:00 UTC (6 PM - 10 PM)

---

#### getCurrentHour

Returns current hour for debugging.

```solidity
function getCurrentHour() external view returns (uint256)
```

---

### Audit Functions

#### auditDeviceInitialization

Verifies device initialization status.

```solidity
function auditDeviceInitialization(address deviceAddr) external view returns (
    bool initialized,
    uint256 initTime,
    string memory devType,
    bool isCurrentlyActive
)
```

---

#### auditRefundStatus

Tracks refund lifecycle status.

```solidity
function auditRefundStatus(uint256 optimizationId) external view returns (
    bool refundIssued,
    uint256 refundAmount,
    bool refundProcessed
)
```

---

#### auditAccessControl

Verifies caller's access permissions.

```solidity
function auditAccessControl(address deviceAddr) external view returns (
    bool isOwner,
    bool isDevice,
    bool isActive
)
```

---

### Administrative Functions

#### deactivateDevice

Emergency deactivation of a device.

```solidity
function deactivateDevice(address deviceAddr) external onlyOwner
```

---

#### withdrawPlatformFees

Withdraws accumulated platform fees.

```solidity
function withdrawPlatformFees(address payable recipient) external onlyOwner
```

**Requirements:**
- Platform fee pool must be > 0
- Recipient must be valid address

---

#### emergencyPause

Emergency pause of all devices.

```solidity
function emergencyPause() external onlyOwner
```

**Note:** Deactivates up to 100 devices to prevent gas limit issues.

---

#### trackHCUUsage

Tracks HCU (Homomorphic Computing Unit) usage for cost monitoring.

```solidity
function trackHCUUsage(uint256 optimizationId, uint256 hcuCycles) external onlyOwner
```

**Requirements:**
- HCU cycles < 1,000,000

---

## Events Reference

| Event | Parameters | Description |
|-------|------------|-------------|
| DeviceRegistered | deviceAddress, deviceType | New device registered |
| ConsumptionDataUpdated | deviceAddress, timestamp | Device data updated |
| OptimizationAnalysisStarted | analysisId, timestamp | Analysis initiated |
| DecryptionRequested | analysisId, requestId | Gateway decryption requested |
| OptimizationCompleted | analysisId, devices[] | Analysis completed |
| RefundIssued | analysisId, amount, reason | Refund triggered |
| TimeoutProtectionTriggered | analysisId | Decryption timeout occurred |
| PriceObfuscated | analysisId, obfuscatedValue | Price data obfuscated |
| EnergyEfficiencyImproved | deviceAddress, savingsPercentage | Efficiency gain recorded |

---

## Error Messages

| Error | Condition |
|-------|-----------|
| "Not authorized" | Caller is not owner |
| "Device not registered" | Caller is not a registered device |
| "Not optimization window" | Outside optimization hours |
| "Power usage out of range" | Value < 1 or > 1,000,000 |
| "Efficiency score out of range" | Value > 1000 |
| "Insufficient gas for safe operation" | Gas < 100,000 |
| "No devices registered" | Empty device list |
| "No decryption requested" | Invalid optimization ID |
| "Already completed" | Analysis already finished |
| "Timeout period not elapsed" | < 1 hour since request |
| "No refund available" | Decryption did not fail |
| "Refund transfer failed" | ETH transfer failed |
| "Array length mismatch" | Batch array sizes differ |
| "Batch size too large" | > 50 devices |
| "HCU usage exceeds safe limit" | > 1,000,000 cycles |
| "No fees to withdraw" | Pool is empty |
| "Invalid recipient" | Zero address |

---

## Usage Examples

### Example 1: Register and Update Device

```javascript
const contract = new ethers.Contract(address, abi, signer);

// Register device
await contract.registerDevice("Smart HVAC System");

// Update consumption
await contract.updateConsumptionData(
    5000,    // 5kW usage
    750      // 75% efficiency
);
```

### Example 2: Start Optimization

```javascript
// Check if in optimization window
const isWindow = await contract.isOptimizationWindow();
if (isWindow) {
    await contract.startOptimizationAnalysis();
}
```

### Example 3: Handle Timeout

```javascript
// After 1+ hours without callback
const status = await contract.getOptimizationStatus(optimizationId);
if (!status.completed && Date.now() > status.requestTime + 3600000) {
    await contract.requestDecryptionRefund(optimizationId);
    await contract.claimDecryptionFailureRefund(optimizationId);
}
```

### Example 4: Batch Update (Admin)

```javascript
await contract.batchUpdateConsumptionData(
    [device1, device2, device3],
    [3000, 4500, 2000],
    [800, 650, 900]
);
```
