import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import PaymentHeader from '@/Components/Payment/PaymentHeader';
import Footer from '@/Components/Footer';

const weeklyDuration = [
    { day: 'Sen', heightClass: 'h-[65%]' },
    { day: 'Sel', heightClass: 'h-[90%]' },
    { day: 'Rab', heightClass: 'h-[48%]' },
    { day: 'Kam', heightClass: 'h-[71%]' },
    { day: 'Jum', heightClass: 'h-[100%]' },
    { day: 'Sab', heightClass: 'h-[58%]' },
    { day: 'Min', heightClass: 'h-[35%]' },
];

const learnedMaterials = [
    {
        day: 'Senin',
        course: 'Modul 4: Manajemen Keuangan',
        topic: 'Topik: Diversifikasi Aset Pensiun',
        duration: '2.0 Jam',
        iconBg: 'bg-[#FCE9D8]',
        iconColor: 'text-[#FF8928]',
    },
    {
        day: 'Selasa',
        course: 'Modul 4: Manajemen Keuangan',
        topic: 'Topik: Simulasi Arus Kas',
        duration: '2.8 Jam',
        iconBg: 'bg-[#E5F0E9]',
        iconColor: 'text-[#006B32]',
    },
    {
        day: 'Rabu',
        course: 'Persiapan Mental',
        topic: 'Topik: Transisi Identitas Sosial',
        duration: '1.5 Jam',
        iconBg: 'bg-[#FCE9D8]',
        iconColor: 'text-[#FF8928]',
    },
    {
        day: 'Kamis',
        course: 'Modul 5: Gaya Hidup Sehat',
        topic: 'Topik: Nutrisi untuk Usia 50+',
        duration: '2.2 Jam',
        iconBg: 'bg-[#E5F0E9]',
        iconColor: 'text-[#006B32]',
    },
    {
        day: 'Jumat',
        course: 'Workshop: Kewirausahaan Masa Pensiun',
        topic: 'Topik: Memulai Bisnis Modal Kecil',
        duration: '3.1 Jam',
        iconBg: 'bg-[#FCE9D8]',
        iconColor: 'text-[#FF8928]',
    },
];

export default function DetailAktivitasPelatihan() {
    const [period, setPeriod] = useState('7');
    return (
        <div className="flex min-h-screen flex-col bg-[#FBF9F8] font-['Atkinson_Hyperlegible']">
            <Head title="Detail Aktivitas Pelatihan" />
            <PaymentHeader />
            <main className="flex-1">
                <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-10">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 font-['Atkinson_Hyperlegible'] font-bold text-[#006B32] transition-opacity hover:opacity-80"
                    >
                        <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19 12H5M12 19l-7-7 7-7"
                            />
                        </svg>
                        Kembali ke Dashboard
                    </Link>
                    <h1 className="mt-3 font-['Atkinson_Hyperlegible'] text-3xl font-bold text-[#1B1C1C] sm:text-4xl">
                        Detail Aktivitas Pelatihan
                    </h1>
                    <p className="mt-2 font-['Atkinson_Hyperlegible'] text-[#3D4A3E]">
                        Lacak kemajuan dan kebiasaan belajar Anda dalam 7 hari
                        terakhir.
                    </p>

                    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <div className="rounded-2xl border border-[#E4E2E1] bg-white p-6 shadow-sm lg:col-span-2">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                    <h2 className="font-['Atkinson_Hyperlegible'] text-lg font-bold text-[#1B1C1C]">
                                        Durasi Belajar (Harian)
                                    </h2>
                                    <p className="mt-1 font-['Atkinson_Hyperlegible'] text-sm text-[#3D4A3E]">
                                        Total: 14.5 Jam minggu ini
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 self-start">
                                    <button
                                        type="button"
                                        onClick={() => setPeriod('7')}
                                        className={`rounded-lg px-4 py-1.5 font-['Atkinson_Hyperlegible'] text-sm font-bold transition-colors ${period === '7' ? 'bg-[#006B32] text-white' : 'bg-[#F0EDED] text-[#3D4A3E]'}`}
                                    >
                                        7 Hari
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPeriod('30')}
                                        className={`rounded-lg px-4 py-1.5 font-['Atkinson_Hyperlegible'] text-sm font-bold transition-colors ${period === '30' ? 'bg-[#006B32] text-white' : 'bg-[#F0EDED] text-[#3D4A3E]'}`}
                                    >
                                        30 Hari
                                    </button>
                                </div>
                            </div>
                            <div className="mt-8 flex items-end justify-between gap-2 sm:gap-4">
                                {weeklyDuration.map((item) => (
                                    <div
                                        key={item.day}
                                        className="flex flex-1 flex-col items-center gap-3"
                                    >
                                        <div className="flex h-56 w-full items-end justify-center border-b border-[#E4E2E1]">
                                            <div
                                                className={`w-2.5 rounded-t ${item.heightClass} bg-[#006B32]`}
                                            />
                                        </div>
                                        <span className="font-['Atkinson_Hyperlegible'] text-xs text-[#3D4A3E]">
                                            {item.day}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col gap-6">
                            <div className="rounded-2xl bg-[#006B32] p-6 text-white">
                                <p className="flex items-center gap-2 font-['Atkinson_Hyperlegible'] font-bold">
                                    <svg
                                        className="h-5 w-5"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 3l1.8 5.2L19 11l-5.2 1.8L12 18l-1.8-5.2L5 11l5.2-1.8z"
                                        />
                                    </svg>
                                    Waktu Fokus
                                </p>
                                <p className="mt-2 font-['Atkinson_Hyperlegible'] text-3xl font-bold">
                                    128 Menit
                                </p>
                                <p className="mt-1 font-['Atkinson_Hyperlegible'] text-sm text-white/80">
                                    Rata-rata per sesi belajar
                                </p>
                            </div>
                            <div className="rounded-2xl border border-[#E4E2E1] bg-white p-6 shadow-sm">
                                <p className="flex items-center gap-2 font-['Atkinson_Hyperlegible'] font-bold text-[#1B1C1C]">
                                    <svg
                                        className="h-5 w-5 text-[#006B32]"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M3 17l6-6 4 4 7-7M14 8h7v7"
                                        />
                                    </svg>
                                    Peningkatan
                                </p>
                                <p className="mt-2 font-['Atkinson_Hyperlegible'] text-3xl font-bold text-[#006B32]">
                                    +15%
                                </p>
                                <p className="mt-1 font-['Atkinson_Hyperlegible'] text-sm text-[#3D4A3E]">
                                    Dibandingkan minggu lalu
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 overflow-hidden rounded-2xl border border-[#E4E2E1] bg-[#F6F3F2]">
                        <div className="px-6 py-5">
                            <h2 className="font-['Atkinson_Hyperlegible'] text-lg font-bold text-[#1B1C1C]">
                                Rincian Materi yang Dipelajari
                            </h2>
                        </div>
                        <div className="space-y-px">
                            {learnedMaterials.map((item) => (
                                <div
                                    key={item.day}
                                    className="flex flex-col gap-3 bg-white px-6 py-4 sm:flex-row sm:items-center sm:gap-6"
                                >
                                    <div className="flex items-center gap-3 sm:w-40 sm:shrink-0">
                                        <div
                                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${item.iconBg}`}
                                        >
                                            <svg
                                                className={`h-5 w-5 ${item.iconColor}`}
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                viewBox="0 0 24 24"
                                            >
                                                <rect
                                                    x="3"
                                                    y="4"
                                                    width="18"
                                                    height="18"
                                                    rx="2"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M3 10h18M8 2v4M16 2v4"
                                                />
                                            </svg>
                                        </div>
                                        <span className="font-['Atkinson_Hyperlegible'] font-bold text-[#1B1C1C]">
                                            {item.day}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-['Atkinson_Hyperlegible'] font-semibold text-[#006B32]">
                                            {item.course}
                                        </p>
                                        <p className="font-['Atkinson_Hyperlegible'] text-sm text-[#3D4A3E]">
                                            {item.topic}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 sm:shrink-0">
                                        <svg
                                            className="h-4 w-4 text-[#3D4A3E]/60"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle cx="12" cy="12" r="9" />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M12 7v5l3 2"
                                            />
                                        </svg>
                                        <span className="font-['Atkinson_Hyperlegible'] font-bold text-[#1B1C1C]">
                                            {item.duration}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
