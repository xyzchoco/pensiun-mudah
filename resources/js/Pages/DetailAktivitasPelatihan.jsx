import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import PaymentHeader from '@/Components/Payment/PaymentHeader';
import Footer from '@/Components/Footer';
import { Clock3, } from "lucide-react";

export default function DetailAktivitasPelatihan({
    weeklyDuration = [],
    learnedMaterials = [],
    totalHours = 0,
    currentPeriod = '7'
}) {
    console.log("Weekly Duration:", weeklyDuration);
    console.log("Learned Materials:", learnedMaterials);

    // State ngambil dari parameter URL backend biar konsisten
    const [period, setPeriod] = useState(currentPeriod);

    // Fungsi nembak backend buat ganti periode tanpa refresh
    const handlePeriodChange = (newPeriod) => {
        setPeriod(newPeriod);
        router.get('/detail-aktivitas', { period: newPeriod }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

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
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        Kembali ke Dashboard
                    </Link>

                    <h1 className="mt-3 font-['Atkinson_Hyperlegible'] text-3xl font-bold text-[#1B1C1C] sm:text-4xl">
                        Detail Aktivitas Pelatihan
                    </h1>
                    <p className="mt-2 font-['Atkinson_Hyperlegible'] text-[#3D4A3E]">
                        Lacak kemajuan dan kebiasaan belajar Anda dalam {period} hari terakhir.
                    </p>

                    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <div className="rounded-2xl border border-[#E4E2E1] bg-white p-6 shadow-sm lg:col-span-2">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                    <h2 className="font-['Atkinson_Hyperlegible'] text-lg font-bold text-[#1B1C1C]">
                                        Durasi Belajar (Harian)
                                    </h2>
                                    <p className="mt-1 font-['Atkinson_Hyperlegible'] text-sm text-[#3D4A3E]">
                                        Total: {totalHours} Jam di periode ini
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 self-start">
                                    <button
                                        type="button"
                                        onClick={() => handlePeriodChange('7')}
                                        className={`rounded-lg px-4 py-1.5 font-['Atkinson_Hyperlegible'] text-sm font-bold transition-colors ${period === '7' ? 'bg-[#006B32] text-white' : 'bg-[#F0EDED] text-[#3D4A3E]'}`}
                                    >
                                        7 Hari
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handlePeriodChange('30')}
                                        className={`rounded-lg px-4 py-1.5 font-['Atkinson_Hyperlegible'] text-sm font-bold transition-colors ${period === '30' ? 'bg-[#006B32] text-white' : 'bg-[#F0EDED] text-[#3D4A3E]'}`}
                                    >
                                        30 Hari
                                    </button>
                                </div>
                            </div>

                            {/* GRAFIK DINAMIS */}
                            <div className="mt-8 flex items-end justify-between gap-2 sm:gap-4 h-56">
                                {weeklyDuration.length > 0 ? (
                                    weeklyDuration.map((item, index) => (
                                        <div key={index} className="flex flex-1 flex-col items-center gap-3 h-full">
                                            <div className="flex h-full w-full items-end justify-center border-b border-[#E4E2E1]">
                                                <div
                                                    className="w-2.5 rounded-t bg-[#006B32] transition-all duration-500 ease-out"
                                                    // INI BAGIAN PENTING: Pake percentage dari DB
                                                    style={{ height: `${item.percentage}%` }}
                                                />
                                            </div>
                                            <span className="font-['Atkinson_Hyperlegible'] text-xs text-[#3D4A3E]">
                                                {item.day}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="w-full text-center text-sm text-gray-500">Belum ada data</div>
                                )}
                            </div>
                        </div>

                        {/* KOTAK INFO STATISTIK */}
                        <div className="flex flex-col gap-6">
                            {/* WAKTU FOKUS */}
                            <div className="rounded-2xl bg-[#006B32] p-6 text-white shadow-sm">
                                <p className="flex items-center gap-2 font-['Atkinson_Hyperlegible'] font-bold">
                                    {/* GANTI <Clock3 /> DENGAN SVG INI */}
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <circle cx="12" cy="12" r="9" />
                                        <polyline points="12 7 12 12 15 15" />
                                    </svg>
                                    Waktu Fokus
                                </p>
                                <p className="mt-2 font-['Atkinson_Hyperlegible'] text-3xl font-bold">
                                    {totalHours > 0
                                        ? Math.round((totalHours * 60) / (learnedMaterials.length || 1))
                                        : 0} Menit
                                </p>
                                <p className="mt-1 font-['Atkinson_Hyperlegible'] text-sm text-white/80">
                                    Rata-rata per sesi belajar
                                </p>
                            </div>

                            {/* INFO MODE & PENINGKATAN */}
                            <div className="rounded-2xl border border-[#E4E2E1] bg-white p-6 shadow-sm">
                                <p className="flex items-center gap-2 font-['Atkinson_Hyperlegible'] font-bold text-[#1B1C1C]">
                                    <svg className="h-5 w-5 text-[#006B32]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                    Statistik Tren
                                </p>
                                <p className="mt-2 font-['Atkinson_Hyperlegible'] text-xl font-bold text-[#006B32]">
                                    {period} Hari Terakhir
                                </p>
                                <p className="mt-1 font-['Atkinson_Hyperlegible'] text-sm text-[#3D4A3E]">
                                    {totalHours > 0
                                        ? `Aktivitas aktif tercatat`
                                        : 'Belum ada aktivitas tercatat'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* RINCIAN MATERI YANG DIPELAJARI */}
                    <div className="mt-6 overflow-hidden rounded-2xl border border-[#E4E2E1] bg-[#F6F3F2]">
                        <div className="px-6 py-5">
                            <h2 className="font-['Atkinson_Hyperlegible'] text-lg font-bold text-[#1B1C1C]">
                                Rincian Materi yang Dipelajari
                            </h2>
                        </div>
                        <div className="space-y-px">
                            {learnedMaterials.length > 0 ? (
                                learnedMaterials.map((item, index) => (
                                    <div key={index} className="flex flex-col gap-3 bg-white px-6 py-4 sm:flex-row sm:items-center sm:gap-6 hover:bg-[#FBF9F8] transition-colors">
                                        {/* ... bagian ikon ... */}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-['Atkinson_Hyperlegible'] font-semibold text-[#006B32] truncate">
                                                {/* Pastikan kunci 'course' sesuai dengan yang di-map di Controller */}
                                                {item.course}
                                            </p>
                                            <p className="font-['Atkinson_Hyperlegible'] text-sm text-[#3D4A3E] truncate">
                                                {/* Pastikan kunci 'topic' sesuai */}
                                                {item.topic}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2 sm:shrink-0">
                                            <span className="font-['Atkinson_Hyperlegible'] font-bold text-[#1B1C1C]">
                                                {item.duration}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="bg-white px-6 py-12 text-center">
                                    <p className="text-sm font-semibold text-gray-500">
                                        Belum ada aktivitas belajar di periode ini. Yuk, mulai belajar!
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}