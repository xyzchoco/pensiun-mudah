import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import InstansiLayout from '@/Layouts/InstansiLayout';

function formatRupiah(value) {
    const n = Number(value) || 0;
    if (n <= 0) return 'Gratis';
    return new Intl.NumberFormat('id-ID', {
        style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
    }).format(n);
}

export default function PembayaranOffline({ request, payHref, backHref = '/instansi/beli-pelatihan' }) {
    const [processing, setProcessing] = useState(false);

    // Proses bayar → backend tandai lunas + generate voucher
    const bayar = () => {
        router.post(payHref, {}, {
            onStart: () => setProcessing(true),
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <InstansiLayout showSidebar={false} title="Pembayaran - Pensiun Mudah" activeNav="beli-pelatihan">
            <Head title="Pembayaran - Pensiun Mudah" />
            <main className="flex-1">
                <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-10">
                    <Link href={backHref} className="inline-flex items-center gap-2 font-bold text-[#006B32] hover:opacity-80">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        Kembali
                    </Link>

                    <h1 className="mt-6 text-2xl font-bold text-[#1B1C1C]">Konfirmasi Pembayaran</h1>
                    {request.is_custom && (
                        <p className="mt-1 text-sm font-semibold text-[#006B32]">
                            Jadwal custom kamu sudah disetujui admin ✓
                        </p>
                    )}

                    <div className="mt-6 rounded-2xl border border-[#E4E2E1] bg-white p-6 shadow-sm">
                        {/* Ringkasan kursus */}
                        <div className="flex items-start gap-4 border-b border-[#E4E2E1] pb-5">
                            {request.thumbnail && (
                                <img src={`/storage/${request.thumbnail}`} alt=""
                                    className="h-20 w-28 shrink-0 rounded-lg object-cover" />
                            )}
                            <div>
                                <h2 className="font-bold text-[#1B1C1C]">{request.course_title}</h2>
                                <p className="mt-1 text-sm text-[#3D4A3E]">Kelas Offline</p>
                            </div>
                        </div>

                        {/* Detail booking */}
                        <dl className="mt-5 space-y-3 text-sm">
                            <div className="flex justify-between">
                                <dt className="text-[#6B7280]">Tanggal</dt>
                                <dd className="font-semibold text-[#1B1C1C]">
                                    {request.tanggal_mulai}
                                    {request.tanggal_selesai !== request.tanggal_mulai && ` — ${request.tanggal_selesai}`}
                                </dd>
                            </div>
                            <div className="flex justify-between gap-4">
                                <dt className="text-[#6B7280]">Lokasi</dt>
                                <dd className="text-right font-semibold text-[#1B1C1C]">{request.lokasi}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-[#6B7280]">Harga per peserta</dt>
                                <dd className="font-semibold text-[#1B1C1C]">{formatRupiah(request.harga_satuan)}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-[#6B7280]">Jumlah peserta</dt>
                                <dd className="font-semibold text-[#1B1C1C]">{request.jumlah_peserta} orang</dd>
                            </div>
                        </dl>

                        {/* Total */}
                        <div className="mt-5 flex items-center justify-between border-t border-[#E4E2E1] pt-5">
                            <span className="font-bold text-[#3D4A3E]">Total Pembayaran</span>
                            <span className="text-2xl font-extrabold text-[#006B32]">{formatRupiah(request.total)}</span>
                        </div>

                        <p className="mt-4 rounded-lg bg-[#E5F0E9] px-3 py-2 text-xs text-[#006B32]">
                            Setelah bayar, kode voucher otomatis dibuat sebanyak {request.jumlah_peserta} pemakaian.
                            Bagikan kode ke peserta untuk klaim kelas.
                        </p>

                        <button
                            type="button"
                            onClick={bayar}
                            disabled={processing}
                            className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-[#FF8928] py-3.5 font-bold text-white transition-colors hover:bg-[#F57F1E] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {processing ? 'Memproses...' : `Bayar ${formatRupiah(request.total)}`}
                        </button>
                    </div>
                </div>
            </main>
        </InstansiLayout>
    );
}