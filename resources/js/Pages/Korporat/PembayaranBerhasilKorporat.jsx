import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import PaymentHeader from '@/Components/Payment/PaymentHeader';
import Footer from '@/Components/Footer';

const nextSteps = [
    {
        id: 1,
        title: 'Salin kode atau tautan',
        desc: 'Gunakan tombol salin di samping untuk mendapatkan akses unik kelas Anda.',
    },
    {
        id: 2,
        title: 'Bagikan kepada karyawan',
        desc: 'Kirimkan melalui email internal atau grup komunikasi perusahaan Anda.',
    },
    {
        id: 3,
        title: 'Pantau progres',
        desc: 'Gunakan dashboard untuk melihat siapa saja yang sudah mendaftar dan menyelesaikan kursus.',
    },
];

export default function PembayaranBerhasilKorporat({ course, transaction, voucher }) {
    const [copied, setCopied] = useState(null);

    // Ekstrak data dinamis dari props backend
    const courseName = course?.title || 'Judul Pelatihan Tidak Ditemukan';
    const licenseCount = voucher?.max_uses || 0;
    const accessCode = voucher?.code || 'KODE-ERROR';

    // Bikin link dinamis sesuai domain saat ini yang mengarah ke halaman klaim
    const registrationLink = typeof window !== 'undefined'
        ? `${window.location.origin}/gabung-kelas`
        : '/gabung-kelas';

    const dashboardHref = '/korporat/dashboard';
    const invoiceHref = '#'; // Nanti bisa lu arahin ke rute cetak invoice PDF kalau udah ada

    // Path gambar dinamis
    const imageUrl = course?.thumbnail
        ? `/storage/${course.thumbnail.replace(/^public\//, '')}`
        : '/images/event-placeholder.svg';

    const copyText = async (text, id) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(id);
            setTimeout(() => setCopied(null), 1500);
        } catch (err) {
            // Abaikan bila clipboard tidak tersedia
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-[#FBF9F8] font-['Atkinson_Hyperlegible']">
            <Head title="Pembayaran Berhasil - Pensiun Mudah" />
            <PaymentHeader />

            <main className="flex-1">
                <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-10">
                    <div className="text-center">
                        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#006B32]">
                            <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </span>
                        <h1 className="mt-6 text-3xl font-bold text-[#1B1C1C] sm:text-4xl">
                            Pembayaran Berhasil!
                        </h1>
                        <p className="mx-auto mt-3 max-w-xl text-[#3D4A3E]">
                            Transaksi Anda telah diproses dengan sukses. Kelas kini tersedia untuk didistribusikan kepada karyawan Anda.
                        </p>
                    </div>

                    <div className="mt-10 grid gap-6 lg:grid-cols-2">
                        <div className="space-y-6">
                            {/* Card Info Pelatihan Dinamis */}
                            <div className="rounded-2xl border border-[#E4E2E1] bg-white p-5 shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                                        <img
                                            src={imageUrl}
                                            alt={courseName}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="min-w-0">
                                        <span className="inline-block rounded-full bg-[#FF8928] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                                            Corporate Plan
                                        </span>
                                        <h2 className="mt-2 text-lg font-bold leading-snug text-[#1B1C1C]">
                                            {courseName}
                                        </h2>
                                        <p className="mt-2 flex items-center gap-2 text-sm text-[#3D4A3E]">
                                            <svg className="h-4 w-4 text-[#006B32]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-1a4 4 0 00-4-4M9 20H4v-1a4 4 0 014-4h2m6-4a3 3 0 11-6 0 3 3 0 016 0zm6 1a2.5 2.5 0 10-3-2.45" />
                                            </svg>
                                            {licenseCount} Lisensi Karyawan
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Card Kode Voucher Dinamis */}
                            <div className="relative overflow-hidden rounded-2xl bg-[#006B32] p-6 text-white shadow-sm">
                                <svg className="absolute -right-2 top-4 h-24 w-24 text-white/10" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                    <circle cx="8" cy="15" r="4" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 12.5L20 3m-3 0h3v3" />
                                </svg>
                                <p className="text-sm font-semibold text-white/80">Kode Akses Kelas</p>
                                <p className="mt-2 font-mono text-3xl font-extrabold tracking-widest sm:text-4xl">
                                    {accessCode}
                                </p>
                                <button
                                    type="button"
                                    onClick={() => copyText(accessCode, 'kode')}
                                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-bold text-[#006B32] transition-colors hover:bg-white/90"
                                >
                                    {/* Icon Copy */}
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <rect x="9" y="9" width="11" height="11" rx="2" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15V5a2 2 0 012-2h10" />
                                    </svg>
                                    {copied === 'kode' ? 'Tersalin!' : 'Salin Kode'}
                                </button>
                            </div>

                            {/* Card Link Dinamis */}
                            <div className="rounded-2xl border border-[#E4E2E1] bg-white p-5 shadow-sm">
                                <p className="font-bold text-[#1B1C1C]">Tautan Registrasi Langsung</p>
                                <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                                    <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-[#E4E2E1] bg-[#F6F3F2] px-3 py-2">
                                        <svg className="h-4 w-4 shrink-0 text-[#6B7280]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5a4 4 0 010 5.66l-2.5 2.5a4 4 0 01-5.66-5.66l1.5-1.5m5.66-1.5a4 4 0 000-5.66l2.5-2.5a4 4 0 015.66 5.66l-1.5 1.5" />
                                        </svg>
                                        <span className="truncate text-sm text-[#3D4A3E]">{registrationLink}</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => copyText(registrationLink, 'tautan')}
                                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-[#006B32] px-4 py-2 text-sm font-bold text-[#006B32] transition-colors hover:bg-[#006B32]/5"
                                    >
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.7 10.7a4 4 0 015.66 0M15.3 13.3a4 4 0 01-5.66 0" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 15l6-6" />
                                        </svg>
                                        {copied === 'tautan' ? 'Tersalin!' : 'Salin Tautan'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Kolom Kanan Tetap Sama */}
                        <div className="space-y-6">
                            <div className="rounded-2xl border border-[#E4E2E1] bg-[#F6F3F2] p-6">
                                <h2 className="flex items-center gap-2 text-lg font-bold text-[#1B1C1C]">
                                    <svg className="h-5 w-5 text-[#006B32]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <circle cx="12" cy="12" r="9" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 11v5M12 8h.01" />
                                    </svg>
                                    Langkah Selanjutnya
                                </h2>
                                <ol className="mt-5 space-y-5">
                                    {nextSteps.map((step) => (
                                        <li key={step.id} className="flex gap-3">
                                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#006B32] text-sm font-bold text-white">
                                                {step.id}
                                            </span>
                                            <div>
                                                <p className="font-bold text-[#1B1C1C]">{step.title}</p>
                                                <p className="mt-0.5 text-sm text-[#3D4A3E]">{step.desc}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ol>
                            </div>

                            <Link href={dashboardHref} className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#FF8928] py-3.5 font-bold text-white shadow-sm transition-colors hover:bg-[#F57F1E]">
                                Kembali ke Dashboard
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}