import React, { useEffect, useState } from 'react';
import type { SystemStats as SystemStatsType } from '../lib/types';

interface SystemStatsProps {
  getStats: () => Promise<SystemStatsType>;
  getCurrentHour: () => Promise<number>;
  isOptimizationWindow: () => Promise<boolean>;
  isPeakHour: () => Promise<boolean>;
  disabled: boolean;
}

export function SystemStats({
  getStats,
  getCurrentHour,
  isOptimizationWindow,
  isPeakHour,
  disabled,
}: SystemStatsProps) {
  const [stats, setStats] = useState<SystemStatsType | null>(null);
  const [currentHour, setCurrentHour] = useState<number>(0);
  const [optWindow, setOptWindow] = useState<boolean>(false);
  const [peak, setPeak] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const loadStats = async () => {
    if (disabled) return;

    setLoading(true);
    try {
      const [statsData, hour, isOptWindow, isPeak] = await Promise.all([
        getStats(),
        getCurrentHour(),
        isOptimizationWindow(),
        isPeakHour(),
      ]);

      setStats(statsData);
      setCurrentHour(hour);
      setOptWindow(isOptWindow);
      setPeak(isPeak);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!disabled) {
      loadStats();
      const interval = setInterval(loadStats, 30000); // Refresh every 30s
      return () => clearInterval(interval);
    }
  }, [disabled]);

  return (
    <div className="card">
      <h3>System Statistics</h3>

      {loading && !stats ? (
        <div className="loading">Loading statistics...</div>
      ) : stats ? (
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-label">Total Devices</div>
            <div className="stat-value">{stats.totalRegisteredDevices}</div>
          </div>

          <div className="stat-item">
            <div className="stat-label">Current Hour</div>
            <div className="stat-value">{currentHour}</div>
          </div>

          <div className="stat-item">
            <div className="stat-label">Analysis ID</div>
            <div className="stat-value">{stats.currentAnalysisId}</div>
          </div>

          <div className="stat-item">
            <div className="stat-label">Optimization Status</div>
            <div className={`stat-badge ${optWindow ? 'badge-success' : 'badge-info'}`}>
              {optWindow ? 'Window Active' : 'Outside Window'}
            </div>
          </div>

          {peak && (
            <div className="stat-item full-width">
              <div className="alert alert-warning">
                ⚠️ Peak Hours (6 PM - 10 PM) - High energy consumption period
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="alert alert-info">Connect wallet to view statistics</div>
      )}

      <button
        className="btn btn-secondary"
        onClick={loadStats}
        disabled={disabled || loading}
      >
        {loading ? 'Refreshing...' : 'Refresh Stats'}
      </button>
    </div>
  );
}
