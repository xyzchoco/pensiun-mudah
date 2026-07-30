// Ambil inisial nama buat avatar (fallback kalau foto belum ada)
function getInitials(name) {
    if (!name) return 'PM';
    return name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
}

export default function TestimonialCard({ name, text, avatar }) {
    return (
        <div className="flex flex-col rounded-2xl border border-[#E4E2E1] bg-white p-6">
            {/* --- NAMA + FOTO --- */}
            <div className="flex items-center gap-3">
                {avatar ? (
                    <img
                        src={avatar}
                        alt={name}
                        className="w-11 h-11 rounded-full object-cover"
                    />
                ) : (
                    <div className="flex items-center justify-center w-11 h-11 rounded-full bg-[#008740] text-white font-bold text-sm">
                        {getInitials(name)}
                    </div>
                )}
                <p className="font-bold text-[#1B1C1C]">{name}</p>
            </div>

            {/* --- ISI TESTIMONI --- */}
            <p className="mt-4 text-sm text-[#6B7280] leading-relaxed flex-1">
                "{text}"
            </p>
        </div>
    );
}
