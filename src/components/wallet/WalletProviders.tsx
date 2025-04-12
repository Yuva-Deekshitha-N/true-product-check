
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
      algod: {
        server: 'https://testnet-api.algonode.cloud',
        port: '',
        token: ''
      },
      indexer: {
        server: 'https://testnet-idx.algonode.cloud',
        port: '',
        token: ''
      }
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
