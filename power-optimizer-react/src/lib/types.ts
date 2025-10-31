export interface DeviceInfo {
  isActive: boolean;
  lastUpdateTime: number;
  deviceType: string;
}

export interface SystemStats {
  totalRegisteredDevices: number;
  lastOptimizationTimestamp: number;
  currentAnalysisId: number;
  isOptimizationActive: boolean;
}

export interface OptimizationRecommendation {
  analysisCompleted: boolean;
  analysisTime: number;
  deviceCount: number;
}

export interface WalletState {
  address: string | null;
  balance: string | null;
  chainId: number | null;
  isConnected: boolean;
}

export type AlertType = 'success' | 'error' | 'info' | 'warning';

export interface Alert {
  id: string;
  message: string;
  type: AlertType;
}
