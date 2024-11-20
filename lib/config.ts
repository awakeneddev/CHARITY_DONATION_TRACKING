"use client";

import { Chain, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { cookieStorage, createStorage, http } from "wagmi";
import { bscTestnet, sepolia } from "wagmi/chains";
const projectId = "eec66a74fdee624570b462afbf251669";
const supportedChains: Chain[] = [sepolia, bscTestnet];

export const config = getDefaultConfig({
  appName: "Charity_Donation_Tracking",
  projectId,
  chains: supportedChains as any,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  transports: supportedChains.reduce(
    (obj, chain) => ({ ...obj, [chain.id]: http() }),
    {}
  ),
});
