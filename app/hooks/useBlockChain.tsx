
"use client"
import { getContract, createWalletClient, custom, Abi, createPublicClient, http } from "viem";
import DonationABI from "../../contracts/Donation.json";
import { sepolia } from "wagmi/chains";
export const useDonationContract = () => {
  console.log("process : ",process);
  const WalletClient = createWalletClient({
    chain: sepolia,
    transport: custom(window.ethereum),
  });
  const publicClient = createPublicClient({ 
    chain: sepolia,
    transport: http()
  })
  const contract = getContract({
    address: `0x${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}`,
    abi: DonationABI.abi as Abi,
    client: { wallet: WalletClient,public: publicClient },
  });
  return { contract, WalletClient,publicClient };
};
