import Link from "next/link";
import Marketplace from "../components/Marketplace";
import OceanFloorAmbience from "../components/OceanFloorAmbience";
export default function TreasureDeckPage() {
  return (
   
    <main className="relative min-h-screen overflow-hidden bg-[#071116] text-stone-100">
<OceanFloorAmbience
  showDiver={true}
  showBubbles={true}
  density="light"
/>

      

      <Marketplace />
    </main>
  );
}