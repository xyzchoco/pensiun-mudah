// Modal konfirmasi setelah sertifikat berhasil diunduh
export default function DownloadSuccessModal({ open, onClose, onOpenFile }) {
    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-md rounded-3xl bg-white p-8 shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* --- TOMBOL TUTUP --- */}
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-5 right-5 p-1 text-[#6B7280] hover:text-[#1B1C1C] transition-colors"
                    aria-label="Tutup"
                >
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 6l12 12M18 6L6 18"
                        />
                    </svg>
                </button>

                {/* --- IKON SUKSES --- */}
                <div className="flex justify-center">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#E5F0E9] ring-8 ring-[#ECF7F0]">
                        <svg
                            className="w-8 h-8 text-[#008740]"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                </div>

                {/* --- JUDUL & DESKRIPSI --- */}
                <h2 className="mt-6 text-center text-2xl font-bold text-[#1B1C1C]">
                    Berhasil Diunduh!
                </h2>
                <p className="mt-3 text-center text-sm text-[#6B7280] leading-relaxed">
                    Sertifikat Anda telah tersimpan di perangkat Anda. Anda
                    dapat melihatnya kapan saja di folder unduhan.
                </p>

                {/* --- AKSI --- */}
                <div className="mt-7 space-y-3">
                    <button
                        type="button"
                        onClick={onOpenFile}
                        className="w-full rounded-xl bg-[#FF8928] py-3.5 font-bold text-white hover:bg-[#F57F1E] transition-colors"
                    >
                        Buka File
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full rounded-xl border border-[#008740] py-3.5 font-bold text-[#008740] hover:bg-[#F4FAF6] transition-colors"
                    >
                        Kembali ke Sertifikat
                    </button>
                </div>
            </div>
        </div>
    );
}
