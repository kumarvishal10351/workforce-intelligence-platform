export default function RiskBadge({ level }) {
  const norm = (level || "low").toLowerCase();

  if (norm === "high") {
    return (
      <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-sm bg-[#450A0A] text-[#FFB4AB] border border-[#FF897D]/30 text-[11px] font-mono font-bold tracking-wider uppercase">
        HIGH
      </span>
    );
  }

  if (norm === "medium") {
    return (
      <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-sm bg-[#451A03] text-[#FFB77D] border border-[#FFB77D]/30 text-[11px] font-mono font-bold tracking-wider uppercase">
        MED
      </span>
    );
  }

  return (
    <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-sm bg-[#064E3B] text-[#6BD8CB] border border-[#6BD8CB]/30 text-[11px] font-mono font-bold tracking-wider uppercase">
      LOW
    </span>
  );
}
