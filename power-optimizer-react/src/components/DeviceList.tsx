import React, { useEffect, useState } from 'react';
import type { DeviceInfo } from '../lib/types';

interface DeviceListProps {
  userAddress: string | null;
  getDeviceInfo: (address: string) => Promise<DeviceInfo>;
  disabled: boolean;
}

export function DeviceList({ userAddress, getDeviceInfo, disabled }: DeviceListProps) {
  const [device, setDevice] = useState<DeviceInfo | null>(null);
  const [loading, setLoading] = useState(false);

  const loadDevice = async () => {
    if (!userAddress || disabled) return;

    setLoading(true);
    try {
      const info = await getDeviceInfo(userAddress);
      setDevice(info);
    } catch (error) {
      console.error('Error loading device:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDevice();
  }, [userAddress, disabled]);

  return (
    <div className="card">
      <h3>Your Devices</h3>

      {loading ? (
        <div className="loading">Loading devices...</div>
      ) : device && device.isActive ? (
        <div className="device-item">
          <div className="device-header">
            <h4>{device.deviceType}</h4>
            <span className="status-badge status-active">Active</span>
          </div>
          <div className="device-details">
            <div className="detail-row">
              <span className="label">Address:</span>
              <span className="value">{userAddress}</span>
            </div>
            <div className="detail-row">
              <span className="label">Last Update:</span>
              <span className="value">
                {new Date(device.lastUpdateTime * 1000).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <p>No devices registered for this address.</p>
          <p>Register a device to get started.</p>
        </div>
      )}

      <button
        className="btn btn-secondary"
        onClick={loadDevice}
        disabled={disabled || loading || !userAddress}
      >
        {loading ? 'Refreshing...' : 'Refresh Devices'}
      </button>
    </div>
  );
}
