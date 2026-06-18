// Satu baris meta event (ikon + teks), dipakai berulang di EventCard
export default function EventMeta({ icon, children }) {
    return (
        <div className="flex items-start gap-2 text-sm text-[#6B7280]">
            <span className="mt-0.5 shrink-0 text-[#6B7280]">{icon}</span>
            <span className="leading-snug">{children}</span>
        </div>
    );
}
