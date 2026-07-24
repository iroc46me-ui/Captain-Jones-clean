import Image from "next/image";
import BubbleField from "./BubbleField";
import SeaTurtle from "./SeaTurtle";

type UnderwaterLayersProps = {
  showBubbles?: boolean;
  showSeaweed?: boolean;
};

export default function UnderwaterLayers({
  showBubbles = true,
  showSeaweed = true,
}: UnderwaterLayersProps) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Layer 1: Deep-water color and haze */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_bottom,rgba(8,47,73,0.34),rgba(2,6,23,0.18)_45%,rgba(2,6,23,0.72))]" />

      {/* Layer 2: Light filtering down from the surface */}
      <div className="underwater-rays absolute inset-x-0 top-0 z-[1] h-[70%] opacity-40" />

      {/* Layer 3: Soft distant glow */}
      <div className="absolute left-1/2 top-[-12rem] z-[1] h-[30rem] w-[60rem] -translate-x-1/2 rounded-full bg-cyan-300/[0.07] blur-3xl" />

      {/* Layer 4: Seaweed around the edges */}
      {showSeaweed && (
        <>
          <Image
            src="/harbor-watch-seaweed-left.png"
            alt=""
            width={420}
            height={720}
            className="underwater-seaweed absolute bottom-0 left-0 z-[2] h-auto w-40 opacity-55 sm:w-52 lg:w-64"
          />

          <Image
            src="/harbor-watch-seaweed-left.png"
            alt=""
            width={420}
            height={720}
            className="underwater-seaweed-right absolute bottom-0 right-0 z-[2] h-auto w-40 scale-x-[-1] opacity-45 sm:w-52 lg:w-64"
          />
        </>
      )}

      {/* Layer 5: Clam and rising bubbles */}
      <SeaTurtle />
      {showBubbles && <BubbleField />}
    </div>
  );
}