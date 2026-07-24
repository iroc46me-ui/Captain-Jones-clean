const bubbles = [
  { x: -24, size: 7, delay: "0.2s", duration: "4.8s" },
  { x: -12, size: 11, delay: "1.4s", duration: "5.6s" },
  { x: 2, size: 6, delay: "2.5s", duration: "4.4s" },
  { x: 16, size: 9, delay: "3.4s", duration: "5.2s" },
  { x: 28, size: 5, delay: "4.1s", duration: "4.7s" },
];

export default function BubbleField() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
      {/* Clam and bubble source */}
      <div className="absolute bottom-5 left-[12%] h-24 w-32">
        <div className="absolute bottom-0 left-1/2 h-7 w-20 -translate-x-1/2 rounded-b-full rounded-t-[70%] border border-cyan-200/20 bg-slate-700/80 shadow-lg" />

        <div className="clam-lid absolute bottom-4 left-1/2 h-7 w-20 -translate-x-1/2 rounded-t-full border border-cyan-200/25 bg-slate-600/90" />

        {bubbles.map((bubble, index) => (
          <span
            key={index}
            className="clam-bubble absolute bottom-12 left-1/2 rounded-full border border-cyan-100/45 bg-cyan-100/10"
            style={{
              width: bubble.size,
              height: bubble.size,
              marginLeft: bubble.x,
              animationDelay: bubble.delay,
              animationDuration: bubble.duration,
            }}
          />
        ))}
      </div>
    </div>
  );
}