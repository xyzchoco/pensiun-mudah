// Modal konfirmasi reusable (dipakai buat Logout, Hapus, dll lewat props)
export default function ConfirmationModal({
    open,
    onClose,
    onConfirm,
    title,
    description,
    confirmLabel = 'Konfirmasi',
    cancelLabel = 'Batal',
    variant = 'danger',
    icon,
}) {
    if (!open) return null;

    // Style tombol konfirmasi nyesuain variant (danger = merah, primary = hijau)
    const confirmClass =
        variant === 'danger'
            ? 'bg-[#FF4D4F] hover:bg-[#E04345] text-white'
            : 'bg-[#008740] hover:bg-[#006B32] text-white';
    const iconWrapClass =
        variant === 'danger'
            ? 'bg-[#FEECEC] text-[#FF4D4F]'
            : 'bg-[#E5F0E9] text-[#008740]';

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={onClose}
        >
            <div
                className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-xl text-center"
                onClick={(e) => e.stopPropagation()}
            >
                {/* --- IKON --- */}
                <div className="flex justify-center">
                    <div
                        className={`flex items-center justify-center w-16 h-16 rounded-full ${iconWrapClass}`}
                    >
                        {icon || (
                            <svg
                                className="w-8 h-8"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.9"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M16 17l5-5-5-5M21 12H9M12 21H5a2 2 0 01-2-2V5a2 2 0 012-2h7"
                                />
                            </svg>
                        )}
                    </div>
                </div>

                {/* --- JUDUL & DESKRIPSI --- */}
                <h2 className="mt-6 text-xl font-bold text-[#1B1C1C]">
                    {title}
                </h2>
                <p className="mt-3 text-sm text-[#6B7280] leading-relaxed">
                    {description}
                </p>

                {/* --- AKSI --- */}
                <div className="mt-7 flex items-center gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 rounded-xl border border-[#E4E2E1] py-3 font-bold text-[#1B1C1C] hover:bg-[#F0EDED] transition-colors"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className={`flex-1 rounded-xl py-3 font-bold transition-colors ${confirmClass}`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
