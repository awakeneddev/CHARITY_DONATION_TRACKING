import { ConnectButton } from "@rainbow-me/rainbowkit";
import { CreateCampaign } from "../components/createCampaign";
import { CampaignList } from "../components/campaignList";

export default function Home() {
  console.log(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS)
  return (
    <section>
      <nav className="flex justify-between items-center m-4 rounded-md p-2 bg-white">
        <div>
          <h1 className="text-black font-semibold">Change Nepal</h1>
        </div>
        <ConnectButton />
      </nav>
      <CreateCampaign />
      <CampaignList />
    </section>
  );
}
