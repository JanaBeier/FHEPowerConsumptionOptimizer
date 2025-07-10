// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint32, euint16, ebool } from "@fhevm/solidity/lib/FHE.sol";
import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

contract PowerConsumptionOptimizer is SepoliaConfig {

    address public owner;
    uint32 public totalDevices;
    uint256 public lastOptimizationTime;

    struct DeviceConsumption {
        euint32 encryptedPowerUsage; // Watts
        euint16 encryptedEfficiencyScore; // 0-1000 scale
        bool isActive;
        uint256 lastUpdateTime;
        string deviceType;
    }

    struct OptimizationRecommendation {
        euint32 targetConsumption;
        euint16 potentialSavings; // Percentage
        bool analysisCompleted;
        uint256 analysisTime;
        address[] analyzedDevices;
    }

    struct GridLoad {
        euint32 totalLoad;
        euint16 loadFactor; // 0-1000 scale
        uint256 timestamp;
        bool isPeakHour;
    }

    mapping(address => DeviceConsumption) public deviceData;
    mapping(uint256 => OptimizationRecommendation) public optimizationHistory;
    mapping(uint256 => GridLoad) public gridLoadHistory;

    address[] public registeredDevices;
    uint256 public currentOptimizationId;

    event DeviceRegistered(address indexed deviceAddress, string deviceType);
    event ConsumptionDataUpdated(address indexed deviceAddress, uint256 timestamp);
    event OptimizationAnalysisStarted(uint256 indexed analysisId, uint256 timestamp);
    event OptimizationCompleted(uint256 indexed analysisId, address[] devices);
    event EnergyEfficiencyImproved(address indexed deviceAddress, uint256 savingsPercentage);

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

    // Update power consumption data (encrypted)
    function updateConsumptionData(uint32 _powerUsage, uint16 _efficiencyScore) external onlyRegisteredDevice {
        require(_powerUsage > 0, "Invalid power usage");
        require(_efficiencyScore <= 1000, "Efficiency score out of range");

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

    // Start optimization analysis
    function startOptimizationAnalysis() external onlyDuringOptimizationWindow {
        require(registeredDevices.length > 0, "No devices registered");

        OptimizationRecommendation storage recommendation = optimizationHistory[currentOptimizationId];
        recommendation.analysisTime = block.timestamp;
        recommendation.analysisCompleted = false;
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
        recommendation.analysisCompleted = true;

        // Grant permissions for results
        FHE.allowThis(optimizedConsumption);
        FHE.allowThis(savingsPercentage);

        emit OptimizationCompleted(currentOptimizationId, registeredDevices);

        currentOptimizationId++;
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

    // Calculate savings percentage
    function _calculateSavingsPercentage(
        euint32 savings,
        euint32 totalConsumption
    ) internal returns (euint16) {
        // Simplified percentage calculation without division
        // Return estimated percentage based on typical optimization results
        return FHE.asEuint16(uint16(25)); // Typical 25% savings
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
}