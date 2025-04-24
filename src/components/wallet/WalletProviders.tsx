
import { NetworkId, WalletId, WalletManager, WalletProvider } from "@txnlab/use-wallet-react";
import type React from "react";

// Initialize the wallet manager with supported wallets
const walletManager = new WalletManager({
  wallets: [
    WalletId.DEFLY,
    WalletId.PERA,
    WalletId.EXODUS,
    {
      id: WalletId.LUTE,
      options: { siteName: "Authentico" },
    },
  ],
  defaultNetwork: NetworkId.TESTNET,
});

export function WalletProviders({ children }: { children: React.ReactNode }) {
  return (
    <WalletProvider manager={walletManager}>
      {children}
    </WalletProvider>
  );
}
