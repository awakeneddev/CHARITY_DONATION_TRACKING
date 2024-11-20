"use client";

import { useEffect, useState } from "react";
import { ethers, formatEther } from "ethers";
import DonationABI from "../contracts/Donation.json";
import { title } from "process";

export const CampaignList = () => {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!window.ethereum) {
      alert("Please install a wallet extension like MetaMask.");
      return;
    }

    const fetchCampaigns = async () => {
      try {
        // Set up the provider and contract
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(
          `0x${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}`,
          DonationABI.abi,
          provider
        );

        // Fetch campaign count or iterate to get campaigns (depending on contract structure)
        const campaignCount = await contract.campaignCounter();
        const allCampaigns = [];

        for (let i = 1; i <= campaignCount; i++) {
          const campaign = await contract.campaigns(i); // Get campaign by ID
          console.log("cam", campaign.toString());
          allCampaigns.push({
            title: campaign.title,
            id: campaign.id,
            isActive: campaign.isActive,
            description: campaign.description,
            targetAmount: formatEther(campaign.targetAmount),
            raisedAmount: formatEther(campaign.raisedAmount),
          });
        }

        setCampaigns(allCampaigns);
      } catch (err) {
        console.error("Error fetching campaigns:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  if (loading) return <div>Loading campaigns...</div>;

  return (
    <div className="m-4  rounded-md  text-black  py-4 bg-white">
      <p className="text-black text-center underline font-semibold mb-4 text-[24px]">
        Donate to Campaign
      </p>
      <div className="flex gap-4">
        {campaigns.length > 0 ? (
          campaigns.map((v, i) => {
            return (
              <div>
                <p>
                  <span>Campaign : </span> {v.title}{" "}
                </p>
                <p>
                  <span>Description : </span> {v.description}{" "}
                </p>
                <p>
                  <span>Target : </span> {v.targetAmount} ETH{" "}
                </p>
                <p>
                  <span>Raised : </span> {v.raisedAmount}{" "}
                </p>
                <p>
                  <span>Active : </span> {v.isActive}{" "}
                </p>
                <button>Donate Now</button>
              </div>
            );
          })
        ) : (
          <p>No campaigns available</p>
        )}
      </div>
    </div>
  );
};
