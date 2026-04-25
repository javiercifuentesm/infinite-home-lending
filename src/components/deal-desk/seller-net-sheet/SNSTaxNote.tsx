type Props = { jurisdictionName: string; jurisdictionNote: string };

export function SNSTaxNote({ jurisdictionName, jurisdictionNote }: Props) {
  return (
    <div
      className="rounded-[10px] border border-[rgba(24,95,165,0.12)] px-4 py-3"
      style={{ background: "rgba(24,95,165,0.04)" }}
    >
      <p className="font-sans text-[11px] leading-[1.6] text-slate-700">
        <span className="font-semibold text-[#185FA5]">Transfer tax note — {jurisdictionName}:</span> {jurisdictionNote}
      </p>
    </div>
  );
}
