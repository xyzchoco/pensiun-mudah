// Kartu preview video kursus (thumbnail + overlay + tombol play di tengah)
export default function CoursePreviewCard({ thumbnail, label }) {
    return (
        <div className="group relative overflow-hidden rounded-[24px] border border-[#E4E2E1] bg-[#1B1C1C] cursor-pointer">
            {/* --- THUMBNAIL --- */}
            <img
                src={thumbnail || '/images/course-preview.png'}
                alt={label}
                className="w-full h-[280px] sm:h-[420px] object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* --- OVERLAY GELAP --- */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />

            {/* --- TOMBOL PLAY DI TENGAH --- */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-white/95 text-[#008740] shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_40px_rgba(0,135,64,0.7)]">
                    <svg
                        className="w-8 h-8 ml-1"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path d="M8 5v14l11-7z" />
                    </svg>
                </div>
            </div>

            {/* --- LABEL PREVIEW --- */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="inline-flex items-center gap-2 rounded-full bg-[#FF8928] px-3 py-1 text-xs font-bold text-white">
                    <svg
                        className="w-3.5 h-3.5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path d="M8 5v14l11-7z" />
                    </svg>
                    PREVIEW
                </span>
                <p className="mt-3 text-lg sm:text-xl font-bold text-white leading-snug">
                    {label}
                </p>
            </div>
        </div>
    );
}
