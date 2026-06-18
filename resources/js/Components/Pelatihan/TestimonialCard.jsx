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

export default function TestimonialCard({ name, profession, text, avatar }) {
    return (
        <div className="flex flex-col rounded-2xl border border-[#E4E2E1] bg-white p-6">
            {/* --- BINTANG --- */}
            <div className="flex items-center gap-1 text-[#FF8928]">
                {[...Array(5)].map((_, index) => (
                    <svg
                        key={index}
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.05 2.93c.3-.92 1.6-.92 1.9 0l1.36 4.18a1 1 0 00.95.69h4.4c.97 0 1.37 1.24.59 1.81l-3.56 2.59a1 1 0 00-.36 1.12l1.36 4.18c.3.92-.75 1.69-1.54 1.12l-3.56-2.59a1 1 0 00-1.18 0l-3.56 2.59c-.79.57-1.84-.2-1.54-1.12l1.36-4.18a1 1 0 00-.36-1.12L1.4 9.6c-.78-.57-.38-1.81.59-1.81h4.4a1 1 0 00.95-.69l1.36-4.18z" />
                    </svg>
                ))}
            </div>

            {/* --- ISI TESTIMONI --- */}
            <p className="mt-4 text-sm text-[#6B7280] leading-relaxed flex-1">
                "{text}"
            </p>

            {/* --- IDENTITAS --- */}
            <div className="mt-5 flex items-center gap-3">
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
                <div>
                    <p className="font-bold text-[#1B1C1C]">{name}</p>
                    <p className="text-sm text-[#6B7280]">{profession}</p>
                </div>
            </div>
        </div>
    );
}
