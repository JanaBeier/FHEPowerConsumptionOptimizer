import React from 'react';
import type { WalletState } from '../lib/types';

interface WalletConnectProps {
  wallet: WalletState;
  onConnect: () => Promise<void>;
  onDisconnect: () => void;
  isLoading?: boolean;
}

export function WalletConnect({ wallet, onConnect, onDisconnect, isLoading }: WalletConnectProps) {
  const handleConnect = async () => {
    try {
      await onConnect();
    } catch (error: any) {
      console.error('Connection error:', error);
      alert(error.message);
    }
  };

  return (
    <div className="card">
      <h3>Wallet Connection</h3>

      <div className="wallet-status">
        <div className="status-row">
          <span className="label">Status:</span>
          <span className={`status-indicator ${wallet.isConnected ? 'status-connected' : 'status-disconnected'}`}>
            {wallet.isConnected ? 'Connected' : 'Not Connected'}
          </span>
        </div>

        {wallet.isConnected && (
          <>
            <div className="wallet-info">
              <div className="info-row">
                <span className="label">Address:</span>
                <span className="address">{wallet.address}</span>
              </div>
              <div className="info-row">
                <span className="label">Balance:</span>
                <span>{wallet.balance} SEP</span>
              </div>
              <div className="info-row">
                <span className="label">Network:</span>
                <span>Sepolia ({wallet.chainId})</span>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="button-group">
        {!wallet.isConnected ? (
          <button className="btn btn-primary" onClick={handleConnect} disabled={isLoading}>
            {isLoading ? 'Connecting...' : 'Connect Wallet'}
          </button>
        ) : (
          <button className="btn btn-secondary" onClick={onDisconnect}>
            Disconnect
          </button>
        )}
      </div>

      {wallet.isConnected && wallet.chainId !== 11155111 && (
        <div className="alert alert-warning">
          Please switch to Sepolia testnet in MetaMask
        </div>
      )}
    </div>
  );
}
