import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../lib/contract';
import type { DeviceInfo, SystemStats, OptimizationRecommendation } from '../lib/types';

export function usePowerContract(signer: ethers.Signer | null) {
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (signer) {
      const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      setContract(contractInstance);
    } else {
      setContract(null);
    }
  }, [signer]);

  const registerDevice = useCallback(async (deviceType: string) => {
    if (!contract) throw new Error('Contract not initialized');

    setIsLoading(true);
    try {
      const tx = await contract.registerDevice(deviceType);
      await tx.wait();
      return tx;
    } finally {
      setIsLoading(false);
    }
  }, [contract]);

  const updateConsumption = useCallback(async (powerUsage: number, efficiencyScore: number) => {
    if (!contract) throw new Error('Contract not initialized');

    setIsLoading(true);
    try {
      const tx = await contract.updateConsumptionData(powerUsage, efficiencyScore);
      await tx.wait();
      return tx;
    } finally {
      setIsLoading(false);
    }
  }, [contract]);

  const startOptimization = useCallback(async () => {
    if (!contract) throw new Error('Contract not initialized');

    setIsLoading(true);
    try {
      const tx = await contract.startOptimizationAnalysis();
      await tx.wait();
      return tx;
    } finally {
      setIsLoading(false);
    }
  }, [contract]);

  const updateGridLoad = useCallback(async (totalLoad: number) => {
    if (!contract) throw new Error('Contract not initialized');

    setIsLoading(true);
    try {
      const tx = await contract.updateGridLoad(totalLoad);
      await tx.wait();
      return tx;
    } finally {
      setIsLoading(false);
    }
  }, [contract]);

  const getDeviceInfo = useCallback(async (address: string): Promise<DeviceInfo> => {
    if (!contract) throw new Error('Contract not initialized');

    const result = await contract.getDeviceInfo(address);
    return {
      isActive: result.isActive,
      lastUpdateTime: result.lastUpdateTime.toNumber(),
      deviceType: result.deviceType,
    };
  }, [contract]);

  const getSystemStats = useCallback(async (): Promise<SystemStats> => {
    if (!contract) throw new Error('Contract not initialized');

    const result = await contract.getSystemStats();
    return {
      totalRegisteredDevices: result.totalRegisteredDevices,
      lastOptimizationTimestamp: result.lastOptimizationTimestamp.toNumber(),
      currentAnalysisId: result.currentAnalysisId.toNumber(),
      isOptimizationActive: result.isOptimizationActive,
    };
  }, [contract]);

  const getOptimizationRecommendation = useCallback(async (analysisId: number): Promise<OptimizationRecommendation> => {
    if (!contract) throw new Error('Contract not initialized');

    const result = await contract.getOptimizationRecommendation(analysisId);
    return {
      analysisCompleted: result.analysisCompleted,
      analysisTime: result.analysisTime.toNumber(),
      deviceCount: result.deviceCount.toNumber(),
    };
  }, [contract]);

  const getCurrentHour = useCallback(async (): Promise<number> => {
    if (!contract) throw new Error('Contract not initialized');

    const result = await contract.getCurrentHour();
    return result.toNumber();
  }, [contract]);

  const isOptimizationWindow = useCallback(async (): Promise<boolean> => {
    if (!contract) throw new Error('Contract not initialized');

    return await contract.isOptimizationWindow();
  }, [contract]);

  const isPeakHour = useCallback(async (): Promise<boolean> => {
    if (!contract) throw new Error('Contract not initialized');

    return await contract.isPeakHour();
  }, [contract]);

  return {
    contract,
    isLoading,
    registerDevice,
    updateConsumption,
    startOptimization,
    updateGridLoad,
    getDeviceInfo,
    getSystemStats,
    getOptimizationRecommendation,
    getCurrentHour,
    isOptimizationWindow,
    isPeakHour,
  };
}
