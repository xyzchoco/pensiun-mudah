// Kartu benefit kursus (ikon + judul + deskripsi)
export default function BenefitCard({ icon, title, description }) {
    return (
        <div className="flex items-start gap-4 rounded-2xl border border-[#E4E2E1] bg-white p-5">
            {/* --- IKON --- */}
            <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#E5F0E9] text-[#008740] shrink-0">
                {icon}
            </span>

            {/* --- TEKS --- */}
            <div>
                <h4 className="font-bold text-[#1B1C1C]">{title}</h4>
                <p className="mt-1 text-sm text-[#6B7280] leading-relaxed">
                    {description}
                </p>
            </div>
        </div>
    );
}
