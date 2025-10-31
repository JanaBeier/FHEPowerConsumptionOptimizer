import React from 'react';
import { useWallet } from './hooks/useWallet';
import { usePowerContract } from './hooks/usePowerContract';
import { useAlerts } from './hooks/useAlerts';
import { WalletConnect } from './components/WalletConnect';
import { DeviceRegistration } from './components/DeviceRegistration';
import { ConsumptionUpdate } from './components/ConsumptionUpdate';
import { SystemStats } from './components/SystemStats';
import { DeviceList } from './components/DeviceList';
import { AlertList } from './components/AlertList';
import './styles/App.css';

function App() {
  const { wallet, signer, connectWallet, disconnectWallet, refreshBalance } = useWallet();
  const {
    isLoading,
    registerDevice,
    updateConsumption,
    startOptimization,
    getDeviceInfo,
    getSystemStats,
    getCurrentHour,
    isOptimizationWindow,
    isPeakHour,
  } = usePowerContract(signer);
  const { alerts, addAlert, removeAlert } = useAlerts();

  const handleRegisterDevice = async (deviceType: string) => {
    try {
      await registerDevice(deviceType);
      addAlert('Device registered successfully!', 'success');
      await refreshBalance();
    } catch (error: any) {
      console.error('Registration error:', error);
      addAlert(`Failed to register device: ${error.message}`, 'error');
    }
  };

  const handleUpdateConsumption = async (power: number, efficiency: number) => {
    try {
      await updateConsumption(power, efficiency);
      addAlert('Consumption data updated successfully!', 'success');
      await refreshBalance();
    } catch (error: any) {
      console.error('Update error:', error);
      addAlert(`Failed to update consumption: ${error.message}`, 'error');
    }
  };

  const handleStartOptimization = async () => {
    try {
      await startOptimization();
      addAlert('Optimization analysis started successfully!', 'success');
      await refreshBalance();
    } catch (error: any) {
      console.error('Optimization error:', error);
      addAlert(`Failed to start optimization: ${error.message}`, 'error');
    }
  };

  return (
    <div className="app">
      <AlertList alerts={alerts} onDismiss={removeAlert} />

      <div className="container">
        <header className="header">
          <h1>⚡ Power Consumption Optimizer</h1>
          <p>Privacy-Preserving Energy Analytics with FHEVM</p>
        </header>

        <div className="grid">
          <WalletConnect
            wallet={wallet}
            onConnect={connectWallet}
            onDisconnect={disconnectWallet}
          />

          <SystemStats
            getStats={getSystemStats}
            getCurrentHour={getCurrentHour}
            isOptimizationWindow={isOptimizationWindow}
            isPeakHour={isPeakHour}
            disabled={!wallet.isConnected}
          />
        </div>

        <div className="grid">
          <DeviceRegistration
            onRegister={handleRegisterDevice}
            isLoading={isLoading}
            disabled={!wallet.isConnected || wallet.chainId !== 11155111}
          />

          <ConsumptionUpdate
            onUpdate={handleUpdateConsumption}
            isLoading={isLoading}
            disabled={!wallet.isConnected || wallet.chainId !== 11155111}
          />
        </div>

        <div className="grid">
          <DeviceList
            userAddress={wallet.address}
            getDeviceInfo={getDeviceInfo}
            disabled={!wallet.isConnected}
          />

          <div className="card">
            <h3>Optimization Analysis</h3>
            <p>Start a new optimization analysis to get recommendations for energy savings.</p>
            <button
              className="btn btn-primary"
              onClick={handleStartOptimization}
              disabled={!wallet.isConnected || isLoading || wallet.chainId !== 11155111}
            >
              {isLoading ? 'Starting...' : 'Start Optimization'}
            </button>
            <div className="info-box">
              <p>Analysis can only be started during optimization windows (every 4 hours).</p>
            </div>
          </div>
        </div>

        <footer className="footer">
          <p>
            Powered by{' '}
            <a href="https://www.zama.ai/" target="_blank" rel="noopener noreferrer">
              Zama FHEVM
            </a>
          </p>
          <p>
            Contract:{' '}
            <a
              href="https://sepolia.etherscan.io/address/0x71FA4921E376f40CAD0e122E287F20da8e6AE9B5"
              target="_blank"
              rel="noopener noreferrer"
            >
              0x71FA...9B5
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
