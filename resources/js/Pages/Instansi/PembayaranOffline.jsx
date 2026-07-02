import { Head, Link, router } from '@inertiajs/react';
import InstansiLayout from '@/Layouts/InstansiLayout';

function formatRupiah(value) {
    const amount = Number(value) || 0;
    if (amount <= 0) return 'Gratis';
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
}

export default function PembayaranOffline({ request, payHref, backHref }) {
    const imageUrl = request?.thumbnail
        ? `/storage/${String(request.thumbnail).replace(/^public\//, '')}`
        : '/images/event-placeholder.svg';

    const handlePay = () => {
        router.post(payHref);
    };

    return (
        <InstansiLayout showSidebar={false} title="Pembayaran Offline - Pensiun Mudah" activeNav="dashboard">
            <Head title="Pembayaran Offline - Pensiun Mudah" />
            <main className="flex-1">
                <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-10">
                    <Link href={backHref} className="inline-flex items-center gap-2 font-bold text-[#006B32] transition-opacity hover:opacity-80">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        Kembali ke Daftar Pelatihan
                    </Link>

                    <div className="mt-8 rounded-2xl border border-[#E4E2E1] bg-white p-6 shadow-sm sm:p-8">
                        <h1 className="text-2xl font-bold text-[#1B1C1C]">Konfirmasi Pembayaran</h1>
                        <p className="mt-2 text-[#3D4A3E]">
                            Tinjau detail booking offline sebelum menyelesaikan pembayaran.
                        </p>

                        <div className="mt-6 flex items-start gap-4 rounded-xl border border-[#E4E2E1] bg-[#F6F3F2] p-4">
                            <div className="h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                                <img
                                    src={imageUrl}
                                    alt={request.course_title}
                                    className="h-full w-full object-cover"
                                    onError={(e) => { e.currentTarget.src = '/images/event-placeholder.svg'; }}
                                />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-[#006B32]">Kelas Offline</p>
                                <h2 className="mt-1 text-lg font-bold text-[#1B1C1C]">{request.course_title}</h2>
                                {request.is_custom && (
                                    <p className="mt-2 inline-block rounded-lg bg-[#FFF3E8] px-3 py-1 text-xs font-semibold text-[#B45309]">
                                        Jadwal disetujui admin
                                    </p>
                                )}
                            </div>
                        </div>

                        <dl className="mt-6 space-y-4 text-sm text-[#3D4A3E]">
                            <div className="flex justify-between gap-4">
                                <dt className="text-[#6B7280]">Tanggal</dt>
                                <dd className="text-right font-semibold text-[#1B1C1C]">
                                    {request.tanggal_mulai}
                                    {request.tanggal_selesai !== request.tanggal_mulai && ` — ${request.tanggal_selesai}`}
                                </dd>
                            </div>
                            <div className="flex justify-between gap-4">
                                <dt className="text-[#6B7280]">Lokasi</dt>
                                <dd className="text-right font-semibold text-[#1B1C1C]">{request.lokasi}</dd>
                            </div>
                            <div className="flex justify-between gap-4">
                                <dt className="text-[#6B7280]">Jumlah Peserta</dt>
                                <dd className="font-semibold text-[#1B1C1C]">{request.jumlah_peserta} Orang</dd>
                            </div>
                            <div className="flex justify-between gap-4">
                                <dt className="text-[#6B7280]">Harga per Peserta</dt>
                                <dd className="font-semibold text-[#1B1C1C]">{formatRupiah(request.harga_satuan)}</dd>
                            </div>
                            <div className="flex justify-between gap-4 border-t border-dashed border-[#E4E2E1] pt-4">
                                <dt className="font-bold text-[#1B1C1C]">Total Pembayaran</dt>
                                <dd className="text-xl font-extrabold text-[#006B32]">{formatRupiah(request.total)}</dd>
                            </div>
                        </dl>

                        <button
                            type="button"
                            onClick={handlePay}
                            className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg bg-[#FF8928] py-3.5 font-bold text-white transition-colors hover:bg-[#F57F1E]"
                        >
                            Bayar Sekarang
                        </button>
                    </div>
                </div>
            </main>
        </InstansiLayout>
    );
}
