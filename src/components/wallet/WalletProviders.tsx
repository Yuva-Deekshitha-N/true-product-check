
import { NetworkId, WalletId, WalletManager, WalletProvider } from "@txnlab/use-wallet-react";
import type React from "react";

// Initialize the wallet manager with supported wallets
const walletManager = new WalletManager({
  wallets: [
    WalletId.DEFLY,
    {
      id: WalletId.PERA,
      options: {
        shouldShowSignTxnToast: false, // Disable default toasts as we have our own
      },
    },
    WalletId.EXODUS,
    {
      id: WalletId.LUTE,
      options: { siteName: "Authentico" },
    },
  ],
  defaultNetwork: NetworkId.TESTNET,
  // Replace nodeConfig with network property which is part of WalletManagerConfig
  network: {
    name: NetworkId.TESTNET,
    algodToken: '', // No token needed for most basic operations
    algodServer: 'https://mainnet-api.algonode.cloud', // Free public API service
    algodPort: ''
  }
});

export function WalletProviders({ children }: { children: React.ReactNode }) {
  return (
    <WalletProvider manager={walletManager}>
      {children}
    </WalletProvider>
  );
}
