import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import type { WalletState } from '../lib/types';

export function useWallet() {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    balance: null,
    chainId: null,
    isConnected: false,
  });
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);

  const updateBalance = useCallback(async (address: string, prov: ethers.providers.Web3Provider) => {
    const balance = await prov.getBalance(address);
    return ethers.utils.formatEther(balance);
  }, []);

  const connectWallet = useCallback(async () => {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('MetaMask is not installed');
    }

    const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

    if (accounts.length === 0) {
      throw new Error('No accounts found');
    }

    const web3Signer = web3Provider.getSigner();
    const address = await web3Signer.getAddress();
    const network = await web3Provider.getNetwork();
    const balance = await updateBalance(address, web3Provider);

    setProvider(web3Provider);
    setSigner(web3Signer);
    setWallet({
      address,
      balance,
      chainId: network.chainId,
      isConnected: true,
    });

    return { address, balance, chainId: network.chainId };
  }, [updateBalance]);

  const disconnectWallet = useCallback(() => {
    setProvider(null);
    setSigner(null);
    setWallet({
      address: null,
      balance: null,
      chainId: null,
      isConnected: false,
    });
  }, []);

  const refreshBalance = useCallback(async () => {
    if (wallet.address && provider) {
      const balance = await updateBalance(wallet.address, provider);
      setWallet((prev) => ({ ...prev, balance }));
    }
  }, [wallet.address, provider, updateBalance]);

  useEffect(() => {
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        connectWallet();
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      // Check if already connected
      window.ethereum.request({ method: 'eth_accounts' }).then((accounts: string[]) => {
        if (accounts.length > 0) {
          connectWallet();
        }
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [connectWallet, disconnectWallet]);

  return {
    wallet,
    provider,
    signer,
    connectWallet,
    disconnectWallet,
    refreshBalance,
  };
}
