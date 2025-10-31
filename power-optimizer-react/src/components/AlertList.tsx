import React from 'react';
import type { Alert } from '../lib/types';

interface AlertListProps {
  alerts: Alert[];
  onDismiss: (id: string) => void;
}

export function AlertList({ alerts, onDismiss }: AlertListProps) {
  if (alerts.length === 0) return null;

  return (
    <div className="alerts-container">
      {alerts.map((alert) => (
        <div key={alert.id} className={`alert alert-${alert.type}`}>
          <span className="alert-message">{alert.message}</span>
          <button
            className="alert-close"
            onClick={() => onDismiss(alert.id)}
            aria-label="Dismiss alert"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
