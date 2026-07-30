import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import PaymentHeader from '@/Components/Payment/PaymentHeader';
import PelatihanFooter from '@/Components/Pelatihan/PelatihanFooter';
import CertificateInfo from '@/Components/Certificate/CertificateInfo';
import DownloadSuccessModal from '@/Components/Certificate/DownloadSuccessModal';

export default function DetailSertifikat({ certificate }) {
    // Data sertifikat (anggap dari backend, kasih default biar aman dirender)
    const data = certificate || {
        id: 1,
        title: 'Literasi Keuangan Pensiun',
        image: '/images/cert-sample.png',
        issue_date: '12 Oktober 2023',
        description:
            'Selamat! Anda telah berhasil menyelesaikan pelatihan Literasi Keuangan Pensiun. Sertifikat ini merupakan bukti kompetensi Anda dalam mengelola aset untuk masa purnabakti yang sejahtera.',
        download_url: '#', // Menggunakan download_url dari backend
    };

    // State buat buka/tutup modal sukses unduh
    const [showSuccess, setShowSuccess] = useState(false);

    // Pas tombol unduh diklik: mulai download lalu munculin modal
    const handleDownload = () => {
        if (data.download_url && data.download_url !== '#') {
            window.open(data.download_url, '_blank'); // Buka di tab baru untuk download
        }
        setShowSuccess(true);
    };

    // Buka file PDF di tab baru (sekarang sama dengan handleDownload)
    const handleOpenFile = () => {
        if (data.download_url) window.open(data.download_url, '_blank');
        setShowSuccess(false);
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#FBF9F8]">
            <Head title={data.title} />

            <PaymentHeader />

            <main className="flex-1">
                <div className="mx-auto max-w-4xl px-6 lg:px-8 py-8">
                    {/* --- 1. NAVIGASI KEMBALI --- */}
                    <Link
                        href="/sertifikat"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[#008740] hover:text-[#006B32] transition-colors"
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
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                        Kembali ke Daftar Sertifikat
                    </Link>

                    {/* --- 2. KARTU UTAMA SERTIFIKAT --- */}
                    <div className="mt-6 rounded-[24px] border border-[#E4E2E1] bg-white p-6 sm:p-10 shadow-sm">
                        {/* PREVIEW SERTIFIKAT (BESAR, DI TENGAH) */}
                        <div className="mx-auto max-w-2xl overflow-hidden rounded-2xl border border-[#E4E2E1] bg-[#FBF9F8] p-3">
                            <img
                                src={data.image || '/images/cert-sample.png'}
                                alt={data.title}
                                className="w-full h-auto object-contain rounded-xl"
                            />
                        </div>

                        {/* INFO SERTIFIKAT */}
                        <CertificateInfo
                            title={data.title}
                            issueDate={data.issue_date}
                            description={data.description}
                        />

                        {/* AKSI UNDUH */}
                        <div className="mt-8 flex justify-center">
                            <button
                                type="button"
                                onClick={handleDownload}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF8928] px-8 py-3.5 font-bold text-white hover:bg-[#F57F1E] transition-colors"
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
                                        d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2"
                                    />
                                </svg>
                                Unduh Sertifikat (PDF)
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <PelatihanFooter />

            {/* --- MODAL: BERHASIL DIUNDUH --- */}
            <DownloadSuccessModal
                open={showSuccess}
                onClose={() => setShowSuccess(false)}
                onOpenFile={handleOpenFile}
            />
        </div>
    );
}
