// Kartu info event (ikon bulat hijau + label + nilai), dipakai 4x di grid
export default function EventInfoCard({ icon, label, value }) {
    return (
        <div className="flex items-center gap-3 rounded-xl border border-[#E4E2E1] bg-white p-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E5F0E9] text-[#008740]">
                {icon}
            </span>
            <div className="min-w-0">
                <p className="text-xs text-[#6B7280]">{label}</p>
                <p className="font-bold text-[#1B1C1C] truncate">{value}</p>
            </div>
        </div>
    );
}
