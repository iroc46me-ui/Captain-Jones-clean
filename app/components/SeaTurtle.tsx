import Image from "next/image";

export default function SeaTurtle() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden">
      <Image
        src="/harbor-watch-diver.png"
        alt=""
        width={320}
        height={220}
        className="sea-turtle absolute right-[-12rem] top-[18%] h-auto w-36 opacity-35 sm:w-44 lg:w-52"
      />
    </div>
  );
}