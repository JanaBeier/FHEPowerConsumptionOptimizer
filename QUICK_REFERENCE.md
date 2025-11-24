# PowerConsumptionOptimizer - Quick Reference Guide

## 🎯 At a Glance

**What:** Privacy-preserving energy management using FHE and Gateway callbacks
**Why:** Secure, encrypted optimization without exposing consumption data
**How:** Homomorphic encryption + ZAMA oracle + automatic refund protection

---

## 🚀 Quick Start

### Deploy
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

### Register Device
```javascript
await contract.registerDevice("Smart HVAC System");
```

### Update Consumption
```javascript
await contract.updateConsumptionData(
    5000,    // Watts (1-1,000,000)
    750      // Efficiency (0-1000)
);
```

### Start Analysis
```javascript
// Only during optimization windows (00:00, 04:00, 08:00, 12:00, 16:00, 20:00 UTC)
await contract.startOptimizationAnalysis();
```

### Check Status
```javascript
const status = await contract.getOptimizationStatus(analysisId);
console.log(status.completed);  // true if callback executed
console.log(status.failed);     // true if timeout occurred
```

### Claim Refund (If Failed)
```javascript
// After 1+ hour without callback
await contract.requestDecryptionRefund(analysisId);
await contract.claimDecryptionFailureRefund(analysisId);
```

---

## 📋 Constants

| Constant | Value | Purpose |
|----------|-------|---------|
| DECRYPTION_TIMEOUT | 1 hour | Max wait for oracle |
| MAX_REQUEST_AGE | 24 hours | Cleanup deadline |
| REFUND_DELAY | 30 min | Grace period |
| MIN_POWER_USAGE | 1 W | Validation floor |
| MAX_POWER_USAGE | 1,000,000 W | Safety ceiling |
| MAX_EFFICIENCY_SCORE | 1000 | Range ceiling (100%) |

---

## 🔐 Security Checklist

### Before Deployment
- [ ] Test timeout refund mechanism
- [ ] Verify access control modifiers
- [ ] Check input validation ranges
- [ ] Test batch operations (≤50 devices)
- [ ] Verify emergency pause works
- [ ] Check platform fee withdrawal

### During Operation
- [ ] Monitor DecryptionRequested events
- [ ] Track TimeoutProtectionTriggered events
- [ ] Verify RefundIssued amounts
- [ ] Check OptimizationCompleted counts
- [ ] Audit AccessControl for suspicious calls

---

## 📊 Key Functions Map

### Device Management
```
registerDevice() → updateConsumptionData() → startOptimizationAnalysis()
                ↓
         (Encrypted data stored)
```

### Optimization Flow
```
startOptimizationAnalysis()
    ↓
FHE.requestDecryption() [Gateway invoked]
    ↓
optimizationDecryptionCallback() [Oracle returns]
    ↓
Results available / Refund if timeout
```

### Refund Path
```
requestDecryptionRefund() [After 1 hour]
    ↓
claimDecryptionFailureRefund() [Individual claim]
    ↓
Refund = 0.01 ETH / device count
```

---

## 🎨 Event Monitoring

### Critical Events
```javascript
// Listen for analysis start
contract.on("OptimizationAnalysisStarted", (analysisId, timestamp) => {
    console.log(`Analysis ${analysisId} started at ${timestamp}`);
});

// Listen for decryption request
contract.on("DecryptionRequested", (analysisId, requestId) => {
    console.log(`Decryption requested for analysis ${analysisId}`);
});

// Listen for completion
contract.on("OptimizationCompleted", (analysisId, devices) => {
    console.log(`Analysis ${analysisId} completed for ${devices.length} devices`);
});

// Listen for timeout
contract.on("TimeoutProtectionTriggered", (analysisId) => {
    console.log(`Timeout triggered for analysis ${analysisId}`);
});

// Listen for refund
contract.on("RefundIssued", (analysisId, amount, reason) => {
    console.log(`Refund ${amount} issued: ${reason}`);
});
```

---

## 🔍 Debugging Tips

### Check Device Status
```javascript
const [active, lastUpdate, type] = await contract.getDeviceInfo(address);
console.log(`Device active: ${active}, Last update: ${new Date(lastUpdate * 1000)}`);
```

### Check Analysis Status
```javascript
const status = await contract.getOptimizationStatus(analysisId);
if (status.completed) {
    console.log("✅ Analysis completed");
} else if (status.failed) {
    console.log("❌ Analysis failed, refund available");
} else {
    console.log("⏳ Pending...", status.requestTime);
}
```

### Check System Health
```javascript
const stats = await contract.getSystemStats();
console.log(`Devices: ${stats.totalRegisteredDevices}`);
console.log(`Current ID: ${stats.currentAnalysisId}`);
console.log(`In optimization window: ${stats.isOptimizationActive}`);
```

### Check Time to Optimization Window
```javascript
const currentHour = await contract.getCurrentHour();
const optimizationHours = [0, 4, 8, 12, 16, 20];
const nextWindow = Math.min(
    ...optimizationHours.map(h => (h > currentHour ? h : h + 24))
);
console.log(`Next window in ${nextWindow - currentHour} hours`);
```

---

## ⚠️ Error Messages & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| "Device not registered" | Not registered yet | Call `registerDevice()` first |
| "Power usage out of range" | < 1 or > 1,000,000 | Use value in valid range |
| "Not optimization window" | Wrong time | Wait for next 4-hour window |
| "No devices registered" | Empty contract | Register at least one device |
| "Timeout period not elapsed" | < 1 hour passed | Wait 1+ hour after request |
| "No refund available" | Not failed | Check if `decryptionFailed` is true |

---

## 💰 Cost Analysis

### Gas Estimates (Sepolia)

| Operation | Gas | USD (at 20 Gwei) |
|-----------|-----|------------------|
| registerDevice | ~35,000 | $1.40 |
| updateConsumptionData | ~25,000 | $1.00 |
| startOptimizationAnalysis | ~200,000 | $8.00 |
| optimizationDecryptionCallback | ~150,000 | $6.00 |
| requestDecryptionRefund | ~50,000 | $2.00 |
| batchUpdateConsumptionData (50 devices) | ~80,000 | $3.20 |

**Savings Example:**
- 50 individual updates: 50 × 25,000 = 1,250,000 gas
- 1 batch update: 80,000 gas
- **Savings: 93.6%**

---

## 🔗 Smart Contract Addresses

### Sepolia Testnet
```
PowerConsumptionOptimizer: 0x[contract-address]
```

(Update after deployment)

---

## 📖 Documentation Map

| Document | Purpose | Read When |
|----------|---------|-----------|
| README.md | Project overview | First time |
| QUICK_REFERENCE.md | This guide | Daily operations |
| API.md | Function details | Need specific info |
| ARCHITECTURE.md | System design | Understanding code |
| FEATURES.md | Feature breakdown | Learning capabilities |
| IMPLEMENTATION_SUMMARY.md | Changes made | Project history |

---

## 🧪 Testing Template

```javascript
describe("PowerConsumptionOptimizer", () => {
    // Device registration
    it("should register device", async () => {
        await contract.registerDevice("HVAC");
        const [active] = await contract.getDeviceInfo(owner.address);
        expect(active).to.be.true;
    });

    // Consumption update
    it("should update consumption", async () => {
        await contract.registerDevice("HVAC");
        await contract.updateConsumptionData(5000, 750);
        // Verify event emitted
    });

    // Timeout protection
    it("should trigger refund on timeout", async () => {
        await contract.startOptimizationAnalysis();
        await time.increase(3601); // 1 hour + 1 second
        await contract.requestDecryptionRefund(1);
        // Verify decryptionFailed = true
    });

    // Batch operations
    it("should batch update 50 devices", async () => {
        // Register 50 devices
        // Batch update
        // Verify gas savings
    });
});
```

---

## 🎯 Use Cases

### Home Energy Management
```
1. Register smart home devices
2. Update usage every hour
3. Get optimization suggestions
4. Adjust consumption patterns
```

### Commercial Facility Optimization
```
1. Register 20+ building systems
2. Batch update during night
3. Run analysis at optimization window
4. Review privacy-preserved results
```

### Demand Response Programs
```
1. Multiple devices register
2. Continuous monitoring
3. Scheduled optimizations
4. Transparent refund for failures
```

---

## 📞 Troubleshooting

### Contract Won't Deploy
- ✅ Check Solidity version (^0.8.24)
- ✅ Verify FHE imports available
- ✅ Confirm Sepolia testnet selection
- ✅ Check account has test ETH

### Transaction Fails
- ✅ Check error message for details
- ✅ Verify caller has required role
- ✅ Check input parameters in range
- ✅ Ensure sufficient gas

### Events Not Emitting
- ✅ Verify transaction succeeded (receipt)
- ✅ Check event name spelling
- ✅ Confirm contract address correct
- ✅ Review event filters

### Results Never Come
- ✅ Check if in optimization window
- ✅ Wait for callback execution
- ✅ Check DecryptionRequested event
- ✅ Wait 1+ hour for refund eligibility

---

## 🚀 Next Steps

1. **Deploy to Sepolia**
   - Update hardhat config
   - Run deployment script
   - Save contract address

2. **Write Tests**
   - Use testing template above
   - Cover all functions
   - Test timeout scenarios

3. **Monitor Operations**
   - Set up event watchers
   - Log DecryptionRequested
   - Track TimeoutProtectionTriggered

4. **Plan Maintenance**
   - Regular fee withdrawals
   - Device deactivation as needed
   - Emergency pause readiness

---

## 📋 Checklists

### Pre-Deployment
- [ ] Contract compiles without errors
- [ ] All tests pass
- [ ] Gas estimates reasonable
- [ ] Security audit completed
- [ ] Network set to Sepolia
- [ ] Account funded with test ETH

### Post-Deployment
- [ ] Contract address saved
- [ ] ABI saved for frontend
- [ ] Events being logged
- [ ] Device registration working
- [ ] Optimization windows confirmed
- [ ] Refund mechanism tested

### Weekly Operations
- [ ] Check DecryptionRequested events
- [ ] Monitor TimeoutProtectionTriggered
- [ ] Verify RefundIssued amounts
- [ ] Review audit functions
- [ ] Withdraw platform fees if any

---

**Last Updated:** November 2024
**Status:** Ready for Production
**Support:** See ARCHITECTURE.md for detailed explanations
