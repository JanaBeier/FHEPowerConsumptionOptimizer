import React, { useState } from 'react';

interface ConsumptionUpdateProps {
  onUpdate: (powerUsage: number, efficiency: number) => Promise<void>;
  isLoading: boolean;
  disabled: boolean;
}

export function ConsumptionUpdate({ onUpdate, isLoading, disabled }: ConsumptionUpdateProps) {
  const [powerUsage, setPowerUsage] = useState('1500');
  const [efficiency, setEfficiency] = useState('750');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const power = parseInt(powerUsage);
    const eff = parseInt(efficiency);

    if (isNaN(power) || power < 1 || power > 10000) {
      alert('Power usage must be between 1 and 10000 watts');
      return;
    }

    if (isNaN(eff) || eff < 0 || eff > 1000) {
      alert('Efficiency score must be between 0 and 1000');
      return;
    }

    await onUpdate(power, eff);
  };

  return (
    <div className="card">
      <h3>Update Consumption Data</h3>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="power-usage">Power Usage (Watts):</label>
          <input
            type="number"
            id="power-usage"
            value={powerUsage}
            onChange={(e) => setPowerUsage(e.target.value)}
            placeholder="1500"
            min="1"
            max="10000"
            disabled={disabled || isLoading}
            className="input"
          />
          <small>Range: 1-10000 W</small>
        </div>

        <div className="form-group">
          <label htmlFor="efficiency">Efficiency Score:</label>
          <input
            type="number"
            id="efficiency"
            value={efficiency}
            onChange={(e) => setEfficiency(e.target.value)}
            placeholder="750"
            min="0"
            max="1000"
            disabled={disabled || isLoading}
            className="input"
          />
          <small>Range: 0-1000 (higher is better)</small>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={disabled || isLoading}
        >
          {isLoading ? 'Updating...' : 'Update Consumption'}
        </button>
      </form>

      <div className="info-box">
        <p>All consumption data is encrypted using FHE before being stored on-chain.</p>
      </div>
    </div>
  );
}
