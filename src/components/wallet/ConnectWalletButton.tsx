
import { useState } from "react";
import { useWallet } from "@txnlab/use-wallet-react";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import ConnectWalletModal from "./ConnectWalletModal";

const ConnectWalletButton = () => {
  const { wallets, activeAccount } = useWallet();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <Button 
        onClick={openModal}
        variant="outline"
        size="sm"
        className="flex items-center space-x-2"
      >
        <Wallet className="h-4 w-4" />
        <span>
          {activeAccount 
            ? `${activeAccount.address.slice(0, 4)}...${activeAccount.address.slice(-4)}`
            : "Connect Wallet"
          }
        </span>
      </Button>

      <ConnectWalletModal 
        wallets={wallets} 
        isOpen={isModalOpen} 
        onClose={closeModal} 
      />
    </>
  );
};

export default ConnectWalletButton;
