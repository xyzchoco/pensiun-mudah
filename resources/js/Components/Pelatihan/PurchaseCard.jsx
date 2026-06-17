import { router } from '@inertiajs/react';

// Fungsi gampang buat format harga ke Rupiah
const formatRupiah = (angka) => {
    if (!angka || angka == 0) return 'GRATIS';
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(angka);
};

export default function PurchaseCard({
    slug,
    price,
    originalPrice,
    features = [],
}) {
    // Pindah ke halaman pembelian pas tombol Beli Sekarang diklik
    const handleBeli = () => {
        router.get(`/pelatihan/${slug}/pembelian`);
    };

    return (
        <div className="sticky top-8 rounded-[24px] border border-[#E4E2E1] bg-white p-6 shadow-sm">
            {/* --- HARGA --- */}
            <div className="flex items-end gap-3">
                <span className="text-3xl font-bold text-[#008740]">
                    {formatRupiah(price)}
                </span>
                {originalPrice && originalPrice > price ? (
                    <span className="mb-1 text-base font-medium text-[#6B7280] line-through">
                        {formatRupiah(originalPrice)}
                    </span>
                ) : null}
            </div>

            {/* --- DAFTAR FITUR --- */}
            <ul className="mt-6 space-y-4">
                {features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#E5F0E9] text-[#008740] shrink-0">
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.2"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </span>
                        <span className="text-sm font-medium text-[#1B1C1C] leading-relaxed">
                            {feature}
                        </span>
                    </li>
                ))}
            </ul>

            {/* --- CTA BELI SEKARANG --- */}
            <button
                type="button"
                onClick={handleBeli}
                className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF8928] py-4 font-bold text-white hover:bg-[#F57F1E] transition-colors"
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
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 4h12m-6 0a1 1 0 11-2 0 1 1 0 012 0zm6 0a1 1 0 11-2 0 1 1 0 012 0z"
                    />
                </svg>
                Beli Sekarang
            </button>

            {/* --- CATATAN AMAN --- */}
            <p className="mt-4 flex items-center justify-center gap-2 text-xs text-[#6B7280]">
                <svg
                    className="w-4 h-4 text-[#008740]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 3l7 3v6c0 4.4-3 8.3-7 9-4-0.7-7-4.6-7-9V6l7-3z"
                    />
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.5 12l1.8 1.8 3.2-3.6"
                    />
                </svg>
                Pembayaran aman & akses selamanya
            </p>
        </div>
    );
}
