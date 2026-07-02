import { Head, Link } from '@inertiajs/react';
import InstansiLayout from '@/Layouts/InstansiLayout';

function formatRupiah(value) {
    const amount = Number(value) || 0;
    if (amount <= 0) return 'Gratis';
    return new Intl.NumberFormat('id-ID', {
        style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
    }).format(amount);
}

export default function RequestDitinjau({ request, payHref, backHref }) {
    const isMenunggu = request.status === 'menunggu_approval';
    const isDitolak = request.status === 'ditolak';
    const isDisetujui = request.status === 'menunggu_bayar';

    return (
        <InstansiLayout showSidebar={false} title="Status Request - Pensiun Mudah" activeNav="dashboard">
            <Head title="Status Request - Pensiun Mudah" />
            <main className="flex-1">
                <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-10">
                    <Link href={backHref} className="inline-flex items-center gap-2 font-bold text-[#006B32] transition-opacity hover:opacity-80">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        Kembali ke Daftar Pelatihan
                    </Link>

                    <div className="mt-8 rounded-2xl border border-[#E4E2E1] bg-white p-6 shadow-sm sm:p-10 text-center">
                        {isMenunggu && (
                            <>
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#E6F3EB]">
                                    <svg className="h-8 w-8 text-[#006B32]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h1 className="mt-6 text-2xl font-bold text-[#1B1C1C]">Menunggu Persetujuan Admin</h1>
                                <p className="mt-2 text-[#3D4A3E]">
                                    Request jadwal untuk kelas <strong>{request.course_title}</strong> sedang ditinjau.
                                    Kami akan mengirimkan notifikasi apabila request disetujui atau ditolak.
                                </p>
                            </>
                        )}

                        {isDitolak && (
                            <>
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                                    <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </div>
                                <h1 className="mt-6 text-2xl font-bold text-[#1B1C1C]">Request Ditolak</h1>
                                <p className="mt-2 text-[#3D4A3E]">
                                    Maaf, request jadwal untuk kelas <strong>{request.course_title}</strong> tidak dapat dipenuhi.
                                </p>
                                {request.alasan_penolakan && (
                                    <div className="mt-4 inline-block rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 text-left">
                                        <strong>Alasan:</strong> {request.alasan_penolakan}
                                    </div>
                                )}
                            </>
                        )}

                        {isDisetujui && (
                            <>
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#E6F3EB]">
                                    <svg className="h-8 w-8 text-[#006B32]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h1 className="mt-6 text-2xl font-bold text-[#1B1C1C]">Request Disetujui!</h1>
                                <p className="mt-2 text-[#3D4A3E]">
                                    Request jadwal untuk kelas <strong>{request.course_title}</strong> telah disetujui admin.
                                    Silakan lanjutkan ke proses pembayaran.
                                </p>
                            </>
                        )}

                        <div className="mt-8 border-t border-[#E4E2E1] pt-8 text-left">
                            <h2 className="text-lg font-bold text-[#1B1C1C]">Detail Request Jadwal</h2>
                            <dl className="mt-4 space-y-4 text-sm text-[#3D4A3E]">
                                <div className="flex justify-between">
                                    <dt className="text-[#6B7280]">Tanggal</dt>
                                    <dd className="font-semibold text-[#1B1C1C]">
                                        {request.tanggal_mulai}
                                        {request.tanggal_selesai !== request.tanggal_mulai && ` — ${request.tanggal_selesai}`}
                                    </dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-[#6B7280]">Lokasi Usulan</dt>
                                    <dd className="font-semibold text-[#1B1C1C] text-right">{request.lokasi}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-[#6B7280]">Jumlah Peserta</dt>
                                    <dd className="font-semibold text-[#1B1C1C]">{request.jumlah_peserta} Orang</dd>
                                </div>
                                <div className="flex justify-between border-t border-dashed border-[#E4E2E1] pt-4">
                                    <dt className="font-bold text-[#1B1C1C]">Estimasi Total Biaya</dt>
                                    <dd className="text-lg font-extrabold text-[#006B32]">{formatRupiah(request.total)}</dd>
                                </div>
                            </dl>
                        </div>

                        <div className="mt-8 flex justify-center gap-4">
                            {isDisetujui ? (
                                <Link
                                    href={payHref}
                                    className="rounded-lg bg-[#FF8928] px-6 py-3 font-bold text-white transition-colors hover:bg-[#F57F1E]"
                                >
                                    Bayar Sekarang
                                </Link>
                            ) : isDitolak ? (
                                <Link
                                    href={backHref}
                                    className="rounded-lg bg-[#FF8928] px-6 py-3 font-bold text-white transition-colors hover:bg-[#F57F1E]"
                                >
                                    Ajukan Ulang
                                </Link>
                            ) : null}
                        </div>
                    </div>
                </div>
            </main>
        </InstansiLayout>
    );
}
