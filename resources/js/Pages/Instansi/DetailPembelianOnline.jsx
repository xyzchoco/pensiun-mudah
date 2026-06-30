import { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import InstansiLayout from '@/Layouts/InstansiLayout';
import RingkasanPesananCard from '@/Pages/Payment/RingkasanPesananCard';

function stripHtml(value) {
    return String(value || '').replace(/<[^>]*>?/gm, '');
}

export default function DetailPembelianOnline({
    course = null,
    transaction = null,
    snapToken,
    midtransClientKey,
    badge = 'Kursus Populer',
    title = 'Manajemen Investasi Aman untuk Pensiunan',
    description = 'Mulai bangun portofolio rendah risiko yang stabil untuk masa tua yang tenang.',
    price = 'Rp 199.000',
    total = 'Rp 999.000',
    quantity = 5,
    orderId = 'IND-0001-2025',
    backHref = '/instansi/beli-pelatihan',
}) {
    const courseTitle = course?.title || title;
    const courseDescription = stripHtml(course?.description) || description;
    const thumbnail = course?.thumbnail
        ? `/storage/${String(course.thumbnail).replace(/^public\//, '')}`
        : null;

    const coursePrice = transaction?.harga_per_peserta || course?.price || 199000;
    const coursePriceLabel = new Intl.NumberFormat('id-ID', {
        style: 'currency', currency: 'IDR', maximumFractionDigits: 0,
    }).format(coursePrice);

    const paymentMethods = ['va', 'gopay', 'qris'];

    return (
        <InstansiLayout showSidebar={false} title={`${courseTitle} - Detail Pembelian Instansi`} activeNav="dashboard">
            <main className="flex-1">
                <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
                    <Link
                        href="/instansi/beli-pelatihan"
                        className="inline-flex items-center gap-2 font-bold text-[#006B32] transition-opacity hover:opacity-80"
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        Kembali ke Beli Pelatihan
                    </Link>
                    <h1 className="mt-4 text-3xl font-bold text-[#1B1C1C]">Detail Pembelian Instansi</h1>
                    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Sisi kiri — tidak berubah sama sekali */}
                        <div className="space-y-6 lg:col-span-2">
                            <div className="rounded-2xl border border-[#E4E2E1] bg-white p-5 shadow-sm">
                                <div className="flex flex-col gap-5 sm:flex-row">
                                    <div className="h-44 w-full shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-[#1B3326] to-[#0C1A12] sm:w-64">
                                        {thumbnail && (
                                            <img src={thumbnail} alt={courseTitle} className="h-full w-full object-cover" />
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <span className="inline-block rounded-full bg-[#006B32] px-3 py-1 text-xs font-bold text-white">
                                            {course?.category?.nama || badge}
                                        </span>
                                        <h2 className="mt-3 text-2xl font-bold text-[#1B1C1C]">{courseTitle}</h2>
                                        <p className="mt-2 text-[#3D4A3E]">{courseDescription}</p>
                                        <p className="mt-4 text-2xl font-bold text-[#006B32]">
                                            {coursePriceLabel}{' '}
                                            <span className="text-sm font-normal text-gray-500">/ lisensi karyawan</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-2xl border border-[#E4E2E1] bg-white p-5 shadow-sm">
                                <div className="flex gap-4">
                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E5F0E9] text-[#006B32]">
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 3v6c0 4-3 6.5-7 9-4-2.5-7-5-7-9V6l7-3z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
                                        </svg>
                                    </span>
                                    <div>
                                        <h3 className="font-bold text-[#1B1C1C]">Pembayaran Khusus Instansi via Midtrans</h3>
                                        <p className="mt-1 text-sm leading-relaxed text-[#3D4A3E]">
                                            Setiap perubahan jumlah lisensi karyawan akan memperbarui nominal aman secara real-time ke server Midtrans. Kuota voucher perusahaan Anda otomatis bertambah setelah pembayaran sukses.
                                        </p>
                                        <div className="mt-4 flex flex-wrap gap-3">
                                            {paymentMethods.map((method) => (
                                                <span key={method} className="h-7 w-14 rounded bg-[#F0EDED]" />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sisi kanan — diganti pakai shared component */}
                        <div className="lg:col-span-1">
                            <RingkasanPesananCard
                                course={course}
                                transaction={transaction}
                                snapToken={snapToken}
                                midtransClientKey={midtransClientKey}
                                quantity={quantity}
                                orderId={orderId}
                                updateEndpoint={`/instansi/pelatihan/${course?.slug}/pembelian-online`}
                            />
                        </div>
                    </div>
                </div>
            </main>
        </InstansiLayout>
    );
}