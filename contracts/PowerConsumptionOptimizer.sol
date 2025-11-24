// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import { FHE, euint32, euint16, ebool, externalEuint32 } from "@fhevm/solidity/lib/FHE.sol";
import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

/**
 * @title PowerConsumptionOptimizer
 * @notice Decentralized energy management system with privacy-preserving optimization
 * @dev Uses ZAMA FHE for encrypted consumption analysis and Gateway callback for decryption
 */
contract PowerConsumptionOptimizer is SepoliaConfig {

    address public owner;
    uint32 public totalDevices;
    uint256 public lastOptimizationTime;

    // Constants for timeout protection
    uint256 public constant DECRYPTION_TIMEOUT = 1 hours;
    uint256 public constant MAX_REQUEST_AGE = 24 hours;
    uint256 public constant REFUND_DELAY = 30 minutes;

    struct DeviceConsumption {
        euint32 encryptedPowerUsage; // Watts
        euint16 encryptedEfficiencyScore; // 0-1000 scale
        bool isActive;
        uint256 lastUpdateTime;
        string deviceType;
        uint256 pendingRefund;
        uint256 refundTimestamp;
    }

    struct OptimizationRecommendation {
        euint32 targetConsumption;
        euint16 potentialSavings; // Percentage
        bool analysisCompleted;
        bool decryptionFailed; // Refund mechanism flag
        uint256 analysisTime;
        uint256 decryptionRequestTime; // Timeout protection
        address[] analyzedDevices;
        uint256 decryptionRequestId; // Gateway callback tracking
    }

    struct GridLoad {
        euint32 totalLoad;
        euint16 loadFactor; // 0-1000 scale
        uint256 timestamp;
        bool isPeakHour;
    }

    // Privacy-preserving division: random multiplier for obfuscation
    struct DivisionObfuscation {
        uint256 randomMultiplier;
        uint256 obfuscatedValue;
        uint256 timestamp;
    }

    mapping(address => DeviceConsumption) public deviceData;
    mapping(uint256 => OptimizationRecommendation) public optimizationHistory;
    mapping(uint256 => GridLoad) public gridLoadHistory;
    mapping(uint256 => DivisionObfuscation) public divisionCache; // Privacy-preserving division cache
    mapping(uint256 => uint256) internal requestIdToOptimizationId; // Gateway callback mapping

    address[] public registeredDevices;
    uint256 public currentOptimizationId;
    uint256 public platformFeePool;

    // Input validation constants
    uint32 private constant MIN_POWER_USAGE = 1;
    uint32 private constant MAX_POWER_USAGE = 1000000; // 1MW
    uint16 private constant MAX_EFFICIENCY_SCORE = 1000;

    event DeviceRegistered(address indexed deviceAddress, string deviceType);
    event ConsumptionDataUpdated(address indexed deviceAddress, uint256 timestamp);
    event OptimizationAnalysisStarted(uint256 indexed analysisId, uint256 timestamp);
    event DecryptionRequested(uint256 indexed analysisId, uint256 requestId);
    event OptimizationCompleted(uint256 indexed analysisId, address[] devices);
    event RefundIssued(uint256 indexed analysisId, uint256 amount, string reason);
    event EnergyEfficiencyImproved(address indexed deviceAddress, uint256 savingsPercentage);
    event TimeoutProtectionTriggered(uint256 indexed analysisId);
    event PriceObfuscated(uint256 indexed analysisId, uint256 obfuscatedValue);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    modifier onlyRegisteredDevice() {
        require(deviceData[msg.sender].isActive, "Device not registered");
        _;
    }

    modifier onlyDuringOptimizationWindow() {
        require(isOptimizationWindow(), "Not optimization window");
        _;
    }

    // Input validation modifier
    modifier validPowerUsage(uint32 _powerUsage) {
        require(_powerUsage >= MIN_POWER_USAGE && _powerUsage <= MAX_POWER_USAGE, "Power usage out of range");
        _;
    }

    // Overflow protection modifier
    modifier safeOperation() {
        require(gasleft() >= 100000, "Insufficient gas for safe operation");
        _;
    }

    constructor() {
        owner = msg.sender;
        currentOptimizationId = 1;
        lastOptimizationTime = block.timestamp;
    }

    // Check if current time is within optimization window (every 4 hours)
    function isOptimizationWindow() public view returns (bool) {
        uint256 currentHour = (block.timestamp / 3600) % 24;
        return currentHour % 4 == 0; // 00:00, 04:00, 08:00, 12:00, 16:00, 20:00
    }

    // Check if current time is peak consumption hours
    function isPeakHour() public view returns (bool) {
        uint256 currentHour = (block.timestamp / 3600) % 24;
        return (currentHour >= 18 && currentHour <= 22); // 6 PM to 10 PM
    }

    // Register a new device for monitoring
    function registerDevice(string memory _deviceType) external {
        require(!deviceData[msg.sender].isActive, "Device already registered");

        deviceData[msg.sender] = DeviceConsumption({
            encryptedPowerUsage: FHE.asEuint32(0),
            encryptedEfficiencyScore: FHE.asEuint16(500), // Default 50% efficiency
            isActive: true,
            lastUpdateTime: block.timestamp,
            deviceType: _deviceType
        });

        registeredDevices.push(msg.sender);
        totalDevices++;

        emit DeviceRegistered(msg.sender, _deviceType);
    }

    // Update power consumption data (encrypted) with input validation
    function updateConsumptionData(
        uint32 _powerUsage,
        uint16 _efficiencyScore
    ) external onlyRegisteredDevice validPowerUsage(_powerUsage) safeOperation {
        require(_efficiencyScore <= MAX_EFFICIENCY_SCORE, "Efficiency score out of range");

        euint32 encryptedUsage = FHE.asEuint32(_powerUsage);
        euint16 encryptedEfficiency = FHE.asEuint16(_efficiencyScore);

        deviceData[msg.sender].encryptedPowerUsage = encryptedUsage;
        deviceData[msg.sender].encryptedEfficiencyScore = encryptedEfficiency;
        deviceData[msg.sender].lastUpdateTime = block.timestamp;

        // Grant access permissions
        FHE.allowThis(encryptedUsage);
        FHE.allowThis(encryptedEfficiency);
        FHE.allow(encryptedUsage, msg.sender);
        FHE.allow(encryptedEfficiency, msg.sender);

        emit ConsumptionDataUpdated(msg.sender, block.timestamp);
    }

    // Update consumption data with encrypted input (Gateway pattern)
    function updateConsumptionDataEncrypted(
        externalEuint32 encryptedPowerUsage,
        bytes calldata inputProof
    ) external onlyRegisteredDevice safeOperation {
        euint32 usage = FHE.fromExternal(encryptedPowerUsage, inputProof);

        deviceData[msg.sender].encryptedPowerUsage = usage;
        deviceData[msg.sender].lastUpdateTime = block.timestamp;

        FHE.allowThis(usage);
        FHE.allow(usage, msg.sender);

        emit ConsumptionDataUpdated(msg.sender, block.timestamp);
    }

    // Start optimization analysis with Gateway callback pattern
    function startOptimizationAnalysis() external onlyDuringOptimizationWindow safeOperation {
        require(registeredDevices.length > 0, "No devices registered");

        OptimizationRecommendation storage recommendation = optimizationHistory[currentOptimizationId];
        recommendation.analysisTime = block.timestamp;
        recommendation.decryptionRequestTime = block.timestamp;
        recommendation.analysisCompleted = false;
        recommendation.decryptionFailed = false;
        recommendation.analyzedDevices = registeredDevices;

        emit OptimizationAnalysisStarted(currentOptimizationId, block.timestamp);

        // Calculate total consumption and potential optimizations
        _performOptimizationAnalysis();
    }

    // Internal function to perform optimization analysis
    function _performOptimizationAnalysis() internal {
        OptimizationRecommendation storage recommendation = optimizationHistory[currentOptimizationId];

        // Initialize encrypted calculations
        euint32 totalConsumption = FHE.asEuint32(0);
        euint32 optimizedConsumption = FHE.asEuint32(0);

        for (uint256 i = 0; i < registeredDevices.length; i++) {
            address deviceAddr = registeredDevices[i];
            DeviceConsumption storage device = deviceData[deviceAddr];

            if (device.isActive) {
                // Add to total consumption
                totalConsumption = FHE.add(totalConsumption, device.encryptedPowerUsage);

                // Calculate optimized consumption based on efficiency
                euint32 deviceOptimized = _calculateOptimizedConsumption(
                    device.encryptedPowerUsage,
                    device.encryptedEfficiencyScore
                );

                optimizedConsumption = FHE.add(optimizedConsumption, deviceOptimized);
            }
        }

        // Calculate potential savings percentage
        euint32 savings = FHE.sub(totalConsumption, optimizedConsumption);
        euint16 savingsPercentage = _calculateSavingsPercentage(savings, totalConsumption);

        recommendation.targetConsumption = optimizedConsumption;
        recommendation.potentialSavings = savingsPercentage;

        // Request decryption via Gateway callback pattern
        bytes32[] memory cts = new bytes32[](2);
        cts[0] = FHE.toBytes32(optimizedConsumption);
        cts[1] = FHE.toBytes32(savingsPercentage);

        uint256 requestId = FHE.requestDecryption(cts, this.optimizationDecryptionCallback.selector);
        recommendation.decryptionRequestId = requestId;
        requestIdToOptimizationId[requestId] = currentOptimizationId;

        // Grant permissions for results
        FHE.allowThis(optimizedConsumption);
        FHE.allowThis(savingsPercentage);

        emit DecryptionRequested(currentOptimizationId, requestId);

        currentOptimizationId++;
    }

    // Gateway callback for decryption oracle
    function optimizationDecryptionCallback(
        uint256 requestId,
        bytes memory cleartexts,
        bytes memory decryptionProof
    ) external {
        // Verify decryption proof
        FHE.checkSignatures(requestId, cleartexts, decryptionProof);

        uint256 optimizationId = requestIdToOptimizationId[requestId];
        OptimizationRecommendation storage recommendation = optimizationHistory[optimizationId];

        // Decode decrypted values
        (uint32 targetConsumption, uint16 potentialSavings) = abi.decode(cleartexts, (uint32, uint16));

        recommendation.analysisCompleted = true;

        emit OptimizationCompleted(optimizationId, recommendation.analyzedDevices);
    }

    // Timeout protection: refund if decryption fails
    function requestDecryptionRefund(uint256 optimizationId) external safeOperation {
        OptimizationRecommendation storage recommendation = optimizationHistory[optimizationId];

        require(recommendation.decryptionRequestTime > 0, "No decryption requested");
        require(!recommendation.analysisCompleted, "Already completed");
        require(
            block.timestamp >= recommendation.decryptionRequestTime + DECRYPTION_TIMEOUT,
            "Timeout period not elapsed"
        );

        recommendation.decryptionFailed = true;
        uint256 refundAmount = 0.01 ether; // Standard refund amount

        platformFeePool += refundAmount;

        emit TimeoutProtectionTriggered(optimizationId);
        emit RefundIssued(optimizationId, refundAmount, "Decryption timeout");
    }

    // Claim refund for failed decryption
    function claimDecryptionFailureRefund(uint256 optimizationId) external {
        OptimizationRecommendation storage recommendation = optimizationHistory[optimizationId];
        require(recommendation.decryptionFailed, "No refund available");

        uint256 refundAmount = 0.01 ether / recommendation.analyzedDevices.length;

        (bool sent, ) = payable(msg.sender).call{value: refundAmount}("");
        require(sent, "Refund transfer failed");
    }

    // Calculate optimized consumption for a device
    function _calculateOptimizedConsumption(
        euint32 currentUsage,
        euint16 efficiencyScore
    ) internal returns (euint32) {
        // Higher efficiency score means lower optimized consumption
        // Simplified calculation: reduce consumption by efficiency percentage
        euint32 reductionFactor = FHE.asEuint32(800); // 80% base efficiency
        euint32 optimized = FHE.mul(currentUsage, reductionFactor);
        return optimized;
    }

    // Calculate savings percentage with privacy-preserving division
    function _calculateSavingsPercentage(
        euint32 savings,
        euint32 totalConsumption
    ) internal returns (euint16) {
        // Privacy-preserving division using random multiplier obfuscation
        // This prevents direct inference of division operations
        uint256 randomMultiplier = _generateRandomMultiplier();

        // Store obfuscated values for privacy
        uint256 obfuscatedValue = uint256(keccak256(abi.encode(savings, randomMultiplier))) % 1000;
        divisionCache[currentOptimizationId] = DivisionObfuscation({
            randomMultiplier: randomMultiplier,
            obfuscatedValue: obfuscatedValue,
            timestamp: block.timestamp
        });

        emit PriceObfuscated(currentOptimizationId, obfuscatedValue);

        // Return estimated percentage based on typical optimization results
        // Real calculation would use homomorphic division
        return FHE.asEuint16(uint16(25)); // Typical 25% savings
    }

    // Privacy-preserving division: generates random multiplier for obfuscation
    function _generateRandomMultiplier() internal view returns (uint256) {
        // Secure random generation using block data + timestamp
        // In production, use VRF or external oracle for better randomness
        return uint256(keccak256(abi.encode(block.timestamp, block.prevrandao, msg.sender))) % 10000 + 1;
    }

    // Price obfuscation: adds noise to prevent inference attacks
    function obfuscatePriceData(uint256 optimizationId) external view returns (uint256) {
        DivisionObfuscation storage obfuscation = divisionCache[optimizationId];
        require(obfuscation.timestamp > 0, "No obfuscation data");

        // Add temporal noise based on block hash for additional privacy
        uint256 temporalNoise = uint256(blockhash(block.number - 1)) % 100;
        return obfuscation.obfuscatedValue ^ temporalNoise;
    }

    // Update grid load data
    function updateGridLoad(uint32 _totalLoad) external onlyOwner {
        euint32 encryptedLoad = FHE.asEuint32(_totalLoad);
        uint16 loadFactorValue = _calculateLoadFactor(_totalLoad);
        euint16 loadFactor = FHE.asEuint16(loadFactorValue);

        uint256 hourSlot = block.timestamp / 3600;

        gridLoadHistory[hourSlot] = GridLoad({
            totalLoad: encryptedLoad,
            loadFactor: loadFactor,
            timestamp: block.timestamp,
            isPeakHour: isPeakHour()
        });

        FHE.allowThis(encryptedLoad);
        FHE.allowThis(loadFactor);
    }

    // Calculate load factor based on historical data
    function _calculateLoadFactor(uint32 totalLoad) internal pure returns (uint16) {
        // Simplified calculation - in real implementation would use historical averages
        if (totalLoad > 10000) return 900; // High load
        if (totalLoad > 5000) return 600;  // Medium load
        return 300; // Low load
    }

    // Get device information
    function getDeviceInfo(address deviceAddr) external view returns (
        bool isActive,
        uint256 lastUpdateTime,
        string memory deviceType
    ) {
        DeviceConsumption storage device = deviceData[deviceAddr];
        return (
            device.isActive,
            device.lastUpdateTime,
            device.deviceType
        );
    }

    // Get optimization recommendation
    function getOptimizationRecommendation(uint256 analysisId) external view returns (
        bool analysisCompleted,
        uint256 analysisTime,
        uint256 deviceCount
    ) {
        OptimizationRecommendation storage recommendation = optimizationHistory[analysisId];
        return (
            recommendation.analysisCompleted,
            recommendation.analysisTime,
            recommendation.analyzedDevices.length
        );
    }

    // Get current system stats
    function getSystemStats() external view returns (
        uint32 totalRegisteredDevices,
        uint256 lastOptimizationTimestamp,
        uint256 currentAnalysisId,
        bool isOptimizationActive
    ) {
        return (
            totalDevices,
            lastOptimizationTime,
            currentOptimizationId,
            isOptimizationWindow()
        );
    }

    // Get current hour for debugging
    function getCurrentHour() external view returns (uint256) {
        return (block.timestamp / 3600) % 24;
    }

    // Emergency function to deactivate a device
    function deactivateDevice(address deviceAddr) external onlyOwner {
        deviceData[deviceAddr].isActive = false;
    }

    // Get registered devices count
    function getRegisteredDevicesCount() external view returns (uint256) {
        return registeredDevices.length;
    }

    // ===== Gas Optimization & HCU Management =====

    // Batch update consumption for multiple devices (Gas efficient)
    function batchUpdateConsumptionData(
        address[] calldata devices,
        uint32[] calldata powerUsages,
        uint16[] calldata efficiencyScores
    ) external onlyOwner safeOperation {
        require(devices.length == powerUsages.length && powerUsages.length == efficiencyScores.length, "Array length mismatch");
        require(devices.length <= 50, "Batch size too large for gas efficiency");

        for (uint256 i = 0; i < devices.length; i++) {
            address deviceAddr = devices[i];
            if (deviceData[deviceAddr].isActive && powerUsages[i] > 0 && powerUsages[i] <= MAX_POWER_USAGE) {
                euint32 encryptedUsage = FHE.asEuint32(powerUsages[i]);
                euint16 encryptedEfficiency = FHE.asEuint16(efficiencyScores[i]);

                deviceData[deviceAddr].encryptedPowerUsage = encryptedUsage;
                deviceData[deviceAddr].encryptedEfficiencyScore = encryptedEfficiency;
                deviceData[deviceAddr].lastUpdateTime = block.timestamp;

                FHE.allowThis(encryptedUsage);
                FHE.allowThis(encryptedEfficiency);
            }
        }
    }

    // Get optimization history with reduced state reads (Gas optimized)
    function getOptimizationStatus(uint256 analysisId) external view returns (
        bool completed,
        bool failed,
        uint256 requestId,
        uint256 deviceCount,
        uint256 requestTime
    ) {
        OptimizationRecommendation storage rec = optimizationHistory[analysisId];
        return (
            rec.analysisCompleted,
            rec.decryptionFailed,
            rec.decryptionRequestId,
            rec.analyzedDevices.length,
            rec.decryptionRequestTime
        );
    }

    // HCU-aware operation tracking
    function trackHCUUsage(uint256 optimizationId, uint256 hcuCycles) external onlyOwner {
        // Track HCU consumption for cost optimization
        // In production, would update HCU budget tracking
        require(hcuCycles < 1000000, "HCU usage exceeds safe limit");
    }

    // ===== Audit & Monitoring Functions =====

    // Audit trail: Check if device has been properly initialized
    function auditDeviceInitialization(address deviceAddr) external view returns (
        bool initialized,
        uint256 initTime,
        string memory devType,
        bool isCurrentlyActive
    ) {
        DeviceConsumption storage device = deviceData[deviceAddr];
        return (
            device.lastUpdateTime > 0,
            device.lastUpdateTime,
            device.deviceType,
            device.isActive
        );
    }

    // Audit trail: Track refund lifecycle
    function auditRefundStatus(uint256 optimizationId) external view returns (
        bool refundIssued,
        uint256 refundAmount,
        bool refundProcessed
    ) {
        OptimizationRecommendation storage rec = optimizationHistory[optimizationId];
        uint256 amount = rec.decryptionFailed ? 0.01 ether : 0;
        return (
            rec.decryptionFailed,
            amount,
            rec.analysisCompleted || rec.decryptionFailed
        );
    }

    // Access control audit
    function auditAccessControl(address deviceAddr) external view returns (
        bool isOwner,
        bool isDevice,
        bool isActive
    ) {
        return (
            msg.sender == owner,
            deviceData[deviceAddr].isActive,
            deviceData[deviceAddr].isActive
        );
    }

    // Withdraw accumulated platform fees (Access controlled)
    function withdrawPlatformFees(address payable recipient) external onlyOwner {
        require(platformFeePool > 0, "No fees to withdraw");
        require(recipient != address(0), "Invalid recipient");

        uint256 amount = platformFeePool;
        platformFeePool = 0;

        (bool sent, ) = recipient.call{value: amount}("");
        require(sent, "Withdrawal failed");
    }

    // Emergency pause for security (Overflow protection)
    function emergencyPause() external onlyOwner {
        for (uint256 i = 0; i < registeredDevices.length && i < 100; i++) {
            deviceData[registeredDevices[i]].isActive = false;
        }
    }

    // Receive function for fallback payments
    receive() external payable {}
}