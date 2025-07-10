const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PowerConsumptionOptimizer", function () {
  let powerOptimizer;
  let owner;
  let alice;
  let bob;
  let charlie;
  let contractAddress;

  // Deployment fixture
  async function deployFixture() {
    const [deployer, user1, user2, user3] = await ethers.getSigners();

    const PowerConsumptionOptimizer = await ethers.getContractFactory("PowerConsumptionOptimizer");
    const contract = await PowerConsumptionOptimizer.deploy();
    await contract.deployed();

    const address = contract.address;

    return {
      contract,
      contractAddress: address,
      deployer,
      user1,
      user2,
      user3
    };
  }

  beforeEach(async function () {
    const deployment = await deployFixture();
    powerOptimizer = deployment.contract;
    contractAddress = deployment.contractAddress;
    owner = deployment.deployer;
    alice = deployment.user1;
    bob = deployment.user2;
    charlie = deployment.user3;
  });

  // ========================================
  // 1. DEPLOYMENT TESTS (5 tests)
  // ========================================
  describe("Deployment", function () {
    it("should deploy successfully", async function () {
      expect(powerOptimizer.address).to.be.properAddress;
    });

    it("should set the correct owner", async function () {
      expect(await powerOptimizer.owner()).to.equal(owner.address);
    });

    it("should initialize total devices to zero", async function () {
      expect(await powerOptimizer.totalDevices()).to.equal(0);
    });

    it("should initialize current optimization ID correctly", async function () {
      expect(await powerOptimizer.currentOptimizationId()).to.equal(1);
    });

    it("should set lastOptimizationTime to deployment time", async function () {
      const lastOptTime = await powerOptimizer.lastOptimizationTime();
      expect(lastOptTime).to.be.gt(0);
    });
  });

  // ========================================
  // 2. DEVICE REGISTRATION TESTS (8 tests)
  // ========================================
  describe("Device Registration", function () {
    it("should register a new device successfully", async function () {
      await expect(
        powerOptimizer.connect(alice).registerDevice("Smart Refrigerator")
      ).to.emit(powerOptimizer, "DeviceRegistered")
        .withArgs(alice.address, "Smart Refrigerator");
    });

    it("should increment total devices count", async function () {
      await powerOptimizer.connect(alice).registerDevice("Smart TV");
      expect(await powerOptimizer.totalDevices()).to.equal(1);

      await powerOptimizer.connect(bob).registerDevice("Air Conditioner");
      expect(await powerOptimizer.totalDevices()).to.equal(2);
    });

    it("should prevent duplicate device registration", async function () {
      await powerOptimizer.connect(alice).registerDevice("Smart TV");

      await expect(
        powerOptimizer.connect(alice).registerDevice("Smart TV")
      ).to.be.revertedWith("Device already registered");
    });

    it("should store device information correctly", async function () {
      await powerOptimizer.connect(alice).registerDevice("Washing Machine");

      const deviceInfo = await powerOptimizer.getDeviceInfo(alice.address);
      expect(deviceInfo.isActive).to.be.true;
      expect(deviceInfo.deviceType).to.equal("Washing Machine");
      expect(deviceInfo.lastUpdateTime).to.be.gt(0);
    });

    it("should allow multiple users to register devices", async function () {
      await powerOptimizer.connect(alice).registerDevice("Device A");
      await powerOptimizer.connect(bob).registerDevice("Device B");
      await powerOptimizer.connect(charlie).registerDevice("Device C");

      expect(await powerOptimizer.totalDevices()).to.equal(3);
    });

    it("should add device to registered devices array", async function () {
      await powerOptimizer.connect(alice).registerDevice("Smart Device");

      const devicesCount = await powerOptimizer.getRegisteredDevicesCount();
      expect(devicesCount).to.equal(1);
    });

    it("should register device with empty string type", async function () {
      await expect(
        powerOptimizer.connect(alice).registerDevice("")
      ).to.not.be.reverted;
    });

    it("should register device with long string type", async function () {
      const longType = "A".repeat(100);
      await expect(
        powerOptimizer.connect(alice).registerDevice(longType)
      ).to.not.be.reverted;
    });
  });

  // ========================================
  // 3. CONSUMPTION DATA UPDATE TESTS (8 tests)
  // ========================================
  describe("Consumption Data Update", function () {
    beforeEach(async function () {
      await powerOptimizer.connect(alice).registerDevice("Smart Refrigerator");
    });

    it("should update consumption data successfully", async function () {
      await expect(
        powerOptimizer.connect(alice).updateConsumptionData(1500, 750)
      ).to.emit(powerOptimizer, "ConsumptionDataUpdated")
        .withArgs(alice.address, await ethers.provider.getBlock("latest").then(b => b.timestamp + 1));
    });

    it("should reject zero power usage", async function () {
      await expect(
        powerOptimizer.connect(alice).updateConsumptionData(0, 750)
      ).to.be.revertedWith("Invalid power usage");
    });

    it("should reject efficiency score above 1000", async function () {
      await expect(
        powerOptimizer.connect(alice).updateConsumptionData(1500, 1001)
      ).to.be.revertedWith("Efficiency score out of range");
    });

    it("should reject update from unregistered device", async function () {
      await expect(
        powerOptimizer.connect(bob).updateConsumptionData(1500, 750)
      ).to.be.revertedWith("Device not registered");
    });

    it("should accept minimum valid power usage", async function () {
      await expect(
        powerOptimizer.connect(alice).updateConsumptionData(1, 500)
      ).to.not.be.reverted;
    });

    it("should accept maximum efficiency score", async function () {
      await expect(
        powerOptimizer.connect(alice).updateConsumptionData(1000, 1000)
      ).to.not.be.reverted;
    });

    it("should accept minimum efficiency score", async function () {
      await expect(
        powerOptimizer.connect(alice).updateConsumptionData(1000, 0)
      ).to.not.be.reverted;
    });

    it("should update lastUpdateTime correctly", async function () {
      const tx = await powerOptimizer.connect(alice).updateConsumptionData(1500, 750);
      await tx.wait();

      const deviceInfo = await powerOptimizer.getDeviceInfo(alice.address);
      const block = await ethers.provider.getBlock(tx.blockNumber);
      expect(deviceInfo.lastUpdateTime).to.equal(block.timestamp);
    });
  });

  // ========================================
  // 4. OPTIMIZATION WINDOW TESTS (6 tests)
  // ========================================
  describe("Optimization Window", function () {
    it("should return boolean for optimization window check", async function () {
      const isWindow = await powerOptimizer.isOptimizationWindow();
      expect(typeof isWindow).to.equal("boolean");
    });

    it("should return current hour correctly", async function () {
      const currentHour = await powerOptimizer.getCurrentHour();
      expect(currentHour).to.be.gte(0);
      expect(currentHour).to.be.lt(24);
    });

    it("should check peak hour status", async function () {
      const isPeak = await powerOptimizer.isPeakHour();
      expect(typeof isPeak).to.equal("boolean");
    });

    it("should identify peak hours correctly (18-22)", async function () {
      // This test checks the logic but actual result depends on block timestamp
      const isPeak = await powerOptimizer.isPeakHour();
      const currentHour = await powerOptimizer.getCurrentHour();

      if (currentHour >= 18 && currentHour <= 22) {
        expect(isPeak).to.be.true;
      } else {
        expect(isPeak).to.be.false;
      }
    });

    it("should identify optimization windows (every 4 hours)", async function () {
      const isWindow = await powerOptimizer.isOptimizationWindow();
      const currentHour = await powerOptimizer.getCurrentHour();

      if (currentHour % 4 === 0) {
        expect(isWindow).to.be.true;
      } else {
        expect(isWindow).to.be.false;
      }
    });

    it("should allow time-based queries without gas consumption", async function () {
      const gasEstimate = await powerOptimizer.estimateGas.getCurrentHour();
      expect(gasEstimate).to.be.lt(30000); // Should be very low for view function
    });
  });

  // ========================================
  // 5. SYSTEM STATISTICS TESTS (5 tests)
  // ========================================
  describe("System Statistics", function () {
    it("should return correct system stats", async function () {
      await powerOptimizer.connect(alice).registerDevice("Device A");
      await powerOptimizer.connect(bob).registerDevice("Device B");

      const stats = await powerOptimizer.getSystemStats();
      expect(stats.totalRegisteredDevices).to.equal(2);
      expect(stats.currentAnalysisId).to.equal(1);
    });

    it("should track registered devices count", async function () {
      expect(await powerOptimizer.getRegisteredDevicesCount()).to.equal(0);

      await powerOptimizer.connect(alice).registerDevice("Device A");
      expect(await powerOptimizer.getRegisteredDevicesCount()).to.equal(1);

      await powerOptimizer.connect(bob).registerDevice("Device B");
      expect(await powerOptimizer.getRegisteredDevicesCount()).to.equal(2);
    });

    it("should return device information correctly", async function () {
      await powerOptimizer.connect(alice).registerDevice("Test Device");

      const info = await powerOptimizer.getDeviceInfo(alice.address);
      expect(info.isActive).to.be.true;
      expect(info.deviceType).to.equal("Test Device");
    });

    it("should return false for unregistered device", async function () {
      const info = await powerOptimizer.getDeviceInfo(bob.address);
      expect(info.isActive).to.be.false;
      expect(info.deviceType).to.equal("");
    });

    it("should track lastOptimizationTime", async function () {
      const lastOptTime = await powerOptimizer.lastOptimizationTime();
      expect(lastOptTime).to.be.gt(0);
    });
  });

  // ========================================
  // 6. OWNER FUNCTIONS TESTS (5 tests)
  // ========================================
  describe("Owner Functions", function () {
    beforeEach(async function () {
      await powerOptimizer.connect(alice).registerDevice("Test Device");
    });

    it("should allow owner to deactivate device", async function () {
      await powerOptimizer.connect(owner).deactivateDevice(alice.address);

      const deviceInfo = await powerOptimizer.getDeviceInfo(alice.address);
      expect(deviceInfo.isActive).to.be.false;
    });

    it("should reject non-owner deactivation", async function () {
      await expect(
        powerOptimizer.connect(alice).deactivateDevice(bob.address)
      ).to.be.revertedWith("Not authorized");
    });

    it("should allow owner to update grid load", async function () {
      await expect(
        powerOptimizer.connect(owner).updateGridLoad(5000)
      ).to.not.be.reverted;
    });

    it("should reject non-owner grid load update", async function () {
      await expect(
        powerOptimizer.connect(alice).updateGridLoad(5000)
      ).to.be.revertedWith("Not authorized");
    });

    it("should verify owner address", async function () {
      expect(await powerOptimizer.owner()).to.equal(owner.address);
    });
  });

  // ========================================
  // 7. EDGE CASES TESTS (8 tests)
  // ========================================
  describe("Edge Cases", function () {
    it("should handle maximum uint32 power usage", async function () {
      await powerOptimizer.connect(alice).registerDevice("High Power Device");

      const maxUint32 = ethers.BigNumber.from(2).pow(32).sub(1);
      await expect(
        powerOptimizer.connect(alice).updateConsumptionData(maxUint32, 500)
      ).to.not.be.reverted;
    });

    it("should handle zero efficiency score", async function () {
      await powerOptimizer.connect(alice).registerDevice("Low Efficiency Device");

      await expect(
        powerOptimizer.connect(alice).updateConsumptionData(1000, 0)
      ).to.not.be.reverted;
    });

    it("should handle maximum efficiency score", async function () {
      await powerOptimizer.connect(alice).registerDevice("High Efficiency Device");

      await expect(
        powerOptimizer.connect(alice).updateConsumptionData(1000, 1000)
      ).to.not.be.reverted;
    });

    it("should handle device info query for non-existent device", async function () {
      const info = await powerOptimizer.getDeviceInfo(ethers.constants.AddressZero);
      expect(info.isActive).to.be.false;
    });

    it("should handle deactivation of non-existent device", async function () {
      // Should not revert, just set isActive to false
      await expect(
        powerOptimizer.connect(owner).deactivateDevice(bob.address)
      ).to.not.be.reverted;
    });

    it("should handle optimization recommendation for non-existent ID", async function () {
      const recommendation = await powerOptimizer.getOptimizationRecommendation(999);
      expect(recommendation.analysisCompleted).to.be.false;
    });

    it("should handle grid load with zero value", async function () {
      await expect(
        powerOptimizer.connect(owner).updateGridLoad(0)
      ).to.not.be.reverted;
    });

    it("should handle grid load with maximum value", async function () {
      const maxUint32 = ethers.BigNumber.from(2).pow(32).sub(1);
      await expect(
        powerOptimizer.connect(owner).updateGridLoad(maxUint32)
      ).to.not.be.reverted;
    });
  });

  // ========================================
  // 8. GAS OPTIMIZATION TESTS (3 tests)
  // ========================================
  describe("Gas Optimization", function () {
    it("should have reasonable gas cost for device registration", async function () {
      const tx = await powerOptimizer.connect(alice).registerDevice("Test Device");
      const receipt = await tx.wait();

      expect(receipt.gasUsed).to.be.lt(200000); // Less than 200k gas
    });

    it("should have reasonable gas cost for consumption update", async function () {
      await powerOptimizer.connect(alice).registerDevice("Test Device");

      const tx = await powerOptimizer.connect(alice).updateConsumptionData(1500, 750);
      const receipt = await tx.wait();

      expect(receipt.gasUsed).to.be.lt(150000); // Less than 150k gas
    });

    it("should have low gas cost for view functions", async function () {
      const gasEstimate = await powerOptimizer.estimateGas.getSystemStats();
      expect(gasEstimate).to.be.lt(50000); // View functions should be cheap
    });
  });

  // ========================================
  // 9. EVENT EMISSION TESTS (3 tests)
  // ========================================
  describe("Event Emissions", function () {
    it("should emit DeviceRegistered event", async function () {
      await expect(
        powerOptimizer.connect(alice).registerDevice("Smart TV")
      ).to.emit(powerOptimizer, "DeviceRegistered")
        .withArgs(alice.address, "Smart TV");
    });

    it("should emit ConsumptionDataUpdated event", async function () {
      await powerOptimizer.connect(alice).registerDevice("Smart TV");

      const tx = await powerOptimizer.connect(alice).updateConsumptionData(1500, 750);
      const receipt = await tx.wait();

      const event = receipt.events.find(e => e.event === "ConsumptionDataUpdated");
      expect(event).to.not.be.undefined;
      expect(event.args[0]).to.equal(alice.address);
    });

    it("should not emit events for failed transactions", async function () {
      await expect(
        powerOptimizer.connect(alice).updateConsumptionData(1500, 750)
      ).to.be.reverted;
    });
  });
});
