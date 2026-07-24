export default function HarborDivider() {
  return (
    <div className="relative overflow-hidden py-10">
      <div className="mx-auto flex max-w-6xl items-center">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-500/50 to-amber-500/20" />

        <div className="mx-6 text-amber-400 text-xl">
          ⚓
        </div>

        <div className="h-px flex-1 bg-gradient-to-l from-transparent via-amber-500/50 to-amber-500/20" />
      </div>
    </div>
  );
}