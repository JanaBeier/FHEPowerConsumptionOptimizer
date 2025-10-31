import React, { useState } from 'react';

interface DeviceRegistrationProps {
  onRegister: (deviceType: string) => Promise<void>;
  isLoading: boolean;
  disabled: boolean;
}

export function DeviceRegistration({ onRegister, isLoading, disabled }: DeviceRegistrationProps) {
  const [deviceType, setDeviceType] = useState('Smart Thermostat');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deviceType.trim()) {
      alert('Please enter a device type');
      return;
    }
    await onRegister(deviceType);
  };

  return (
    <div className="card">
      <h3>Register Device</h3>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="device-type">Device Type:</label>
          <select
            id="device-type"
            value={deviceType}
            onChange={(e) => setDeviceType(e.target.value)}
            disabled={disabled || isLoading}
            className="input"
          >
            <option value="Smart Thermostat">Smart Thermostat</option>
            <option value="Solar Panel">Solar Panel</option>
            <option value="EV Charger">EV Charger</option>
            <option value="Smart Meter">Smart Meter</option>
            <option value="Heat Pump">Heat Pump</option>
            <option value="Air Conditioner">Air Conditioner</option>
            <option value="Battery Storage">Battery Storage</option>
          </select>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={disabled || isLoading}
        >
          {isLoading ? 'Registering...' : 'Register Device'}
        </button>
      </form>

      <div className="info-box">
        <p>Register your energy device to start tracking consumption with full privacy using FHE.</p>
      </div>
    </div>
  );
}
