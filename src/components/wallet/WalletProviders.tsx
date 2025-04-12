
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
  // Using the correct networks property with proper configuration
  networks: {
    [NetworkId.TESTNET]: {
      nodeServer: 'https://testnet-api.algonode.cloud',
      nodeToken: '',
      nodePort: '',
      indexerServer: 'https://testnet-idx.algonode.cloud',
      indexerToken: '',
      indexerPort: '',
    }
  }
});

export function WalletProviders({ children }: { children: React.ReactNode }) {
  return (
    <WalletProvider manager={walletManager}>
      {children}
    </WalletProvider>
  );
}
