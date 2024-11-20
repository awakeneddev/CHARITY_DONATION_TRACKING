"use client";

import { useState } from "react";
import { useDonationContract } from "../app/hooks/useBlockChain";
import ethers, { parseEther } from "ethers";

export const CreateCampaign = () => {
  console.log("rp : ", process.env);
  const initialState = {
    title: "",
    description: "",
    amount: "",
    organization: "",
    beneficiary: "0xD9aCc6FEdae2909caDFfC3c43a9cb61b429656aF",
  };

  const [initialData, setInitialData] = useState(initialState);
  const { WalletClient, contract } = useDonationContract();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target; // Get input name and value
    setInitialData({
      ...initialData, // Copy existing state
      [name]: value, // Update the specific field
    });
  };

  const createCampaignHandler = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    // fetch the connected account
    const accounts = await WalletClient.getAddresses();
    const parsedAmt = parseEther(initialData.amount);

    if (accounts.length === 0) {
      throw new Error("No connected wallet found. Please connect your wallet.");
    }
    const account = accounts[0]; // Use the first connected account
    await contract.write.createCampaign(
      [
        initialData.title,
        initialData.description,
        parsedAmt,
        initialData.beneficiary,
      ],
      { account }
    );

    alert("Campaign created successfully!");
    setInitialData(initialState); // Reset
  };

  return (
    <div className="m-4 rounded-md flex flex-col items-center py-4 bg-white">
      <p className="text-black underline font-semibold mb-4 text-[24px]">
        Create Campaign
      </p>
      <form className="flex flex-col gap-2">
        <div className="flex flex-col">
          <label className="text-black text-sm">Organization Name</label>
          <input
            placeholder="Enter Organization name"
            className="border text-sm text-black p-1 rounded-md"
            value={initialData.organization}
            name="organization"
            onChange={handleInputChange}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-black text-sm">Title</label>
          <input
            placeholder="Enter title of the campaign"
            className="border text-black text-sm p-1 rounded-md"
            value={initialData.title}
            name="title"
            onChange={handleInputChange}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-black text-sm">Description</label>
          <input
            value={initialData.description}
            placeholder="Enter description of the campaign"
            className="border text-black text-sm p-1 rounded-md"
            name="description"
            onChange={handleInputChange}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-black text-sm">Amount</label>
          <input
            placeholder="Enter amount of the campaign"
            className="border text-black text-sm p-1 rounded-md"
            value={initialData.amount}
            name="amount"
            onChange={handleInputChange}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-black text-sm">Beneficiary Address</label>
          <input
            placeholder="Enter beneficiary address"
            className="border text-black text-sm p-1 rounded-md"
            value={initialData.beneficiary}
            name="beneficiary"
            onChange={handleInputChange}
          />
        </div>
        <button
          onClick={createCampaignHandler}
          className="bg-[#0E76FD] rounded-md p-2 font-semibold text-white"
        >
          Create Campaign
        </button>
      </form>
    </div>
  );
};
