import { Head, Link } from '@inertiajs/react';
import PaymentHeader from '@/Components/Payment/PaymentHeader';
import Footer from '@/Components/Footer';

const dailyHistory = [
    {
        date: '01 Mei',
        label: '4 Jam',
        heightClass: 'h-[57%]',
        highlight: false,
    },
    {
        date: '02 Mei',
        label: '2 Jam',
        heightClass: 'h-[29%]',
        highlight: false,
    },
    {
        date: '03 Mei',
        label: '5 Jam',
        heightClass: 'h-[71%]',
        highlight: false,
    },
    {
        date: '04 Mei',
        label: '6 Jam',
        heightClass: 'h-[86%]',
        highlight: false,
    },
    {
        date: '05 Mei',
        label: '3 Jam',
        heightClass: 'h-[43%]',
        highlight: false,
    },
    {
        date: '06 Mei',
        label: '7 Jam',
        heightClass: 'h-[100%]',
        highlight: true,
    },
    {
        date: '07 Mei',
        label: '4 Jam',
        heightClass: 'h-[57%]',
        highlight: false,
    },
];

const categoryBreakdown = [
    {
        name: 'Keuangan',
        hours: '20 Jam',
        widthClass: 'w-full',
        barClass: 'bg-[#006B32]',
        textClass: 'text-[#006B32]',
    },
    {
        name: 'Kesehatan',
        hours: '15 Jam',
        widthClass: 'w-[75%]',
        barClass: 'bg-[#006B32]',
        textClass: 'text-[#006B32]',
    },
    {
        name: 'Kewirausahaan',
        hours: '13 Jam',
        widthClass: 'w-[65%]',
        barClass: 'bg-[#FF8928]',
        textClass: 'text-[#FF8928]',
    },
];

export default function StatistikWaktuBelajar() {
    return (
        <div className="flex min-h-screen flex-col bg-[#FBF9F8] font-['Atkinson_Hyperlegible']">
            <Head title="Statistik Waktu Belajar" />
            <PaymentHeader />
            <main className="flex-1">
                <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-10">
                    <h1 className="font-['Atkinson_Hyperlegible'] text-2xl font-bold text-[#1B1C1C] sm:text-3xl">
                        Statistik Waktu Belajar
                    </h1>
                    <p className="mt-2 font-['Atkinson_Hyperlegible'] text-[#3D4A3E]">
                        Pantau perkembangan belajar Anda untuk masa pensiun yang
                        lebih bermakna.
                    </p>
                    <Link
                        href="/dashboard"
                        className="mt-3 inline-flex items-center gap-2 font-['Atkinson_Hyperlegible'] font-bold text-[#006B32] transition-opacity hover:opacity-80"
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

                    <div className="mt-6 rounded-2xl border border-[#E4E2E1] bg-white p-6 shadow-sm">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#E5F0E9]">
                                    <svg
                                        className="h-7 w-7 text-[#006B32]"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M10 2h4M12 14V9"
                                        />
                                        <circle cx="12" cy="14" r="8" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-['Atkinson_Hyperlegible'] text-sm font-semibold text-[#3D4A3E]">
                                        Total Jam Belajar
                                    </p>
                                    <p className="font-['Atkinson_Hyperlegible'] text-3xl font-bold text-[#006B32] sm:text-4xl">
                                        48 Jam Belajar
                                    </p>
                                </div>
                            </div>
                            <span className="inline-flex items-center gap-2 self-start rounded-lg bg-[#FF8928] px-4 py-2 font-['Atkinson_Hyperlegible'] text-sm font-bold text-white sm:self-auto">
                                <svg
                                    className="h-4 w-4"
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
                                +8 jam minggu ini
                            </span>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <div className="rounded-2xl border border-[#E4E2E1] bg-white p-6 shadow-sm lg:col-span-2">
                            <h2 className="font-['Atkinson_Hyperlegible'] text-lg font-bold text-[#1B1C1C]">
                                Riwayat Belajar Harian
                            </h2>
                            <div className="mt-8 flex items-end justify-between gap-2 sm:gap-4">
                                {dailyHistory.map((item) => (
                                    <div
                                        key={item.date}
                                        className="flex flex-1 flex-col items-center gap-2"
                                    >
                                        <span className="font-['Atkinson_Hyperlegible'] text-xs font-semibold text-[#3D4A3E]">
                                            {item.label}
                                        </span>
                                        <div className="flex h-56 w-full items-end justify-center">
                                            <div
                                                className={`w-full max-w-[44px] rounded-t-lg ${item.heightClass} ${item.highlight ? 'bg-[#FF8928]' : 'bg-[#006B32]'}`}
                                            />
                                        </div>
                                        <span className="font-['Atkinson_Hyperlegible'] text-xs text-[#3D4A3E]/70">
                                            {item.date}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col gap-6">
                            <div className="rounded-2xl border border-[#E4E2E1] bg-white p-6 shadow-sm">
                                <h2 className="font-['Atkinson_Hyperlegible'] text-lg font-bold text-[#1B1C1C]">
                                    Breakdown Kategori
                                </h2>
                                <div className="mt-6 space-y-5">
                                    {categoryBreakdown.map((cat) => (
                                        <div key={cat.name}>
                                            <div className="flex items-center justify-between">
                                                <span className="font-['Atkinson_Hyperlegible'] text-sm font-semibold text-[#1B1C1C]">
                                                    {cat.name}
                                                </span>
                                                <span
                                                    className={`font-['Atkinson_Hyperlegible'] text-sm font-bold ${cat.textClass}`}
                                                >
                                                    {cat.hours}
                                                </span>
                                            </div>
                                            <div className="mt-2 h-2 w-full rounded-full bg-[#F0EDED]">
                                                <div
                                                    className={`h-2 rounded-full ${cat.barClass} ${cat.widthClass}`}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="rounded-2xl bg-[#E5F0E9] p-6">
                                <p className="flex items-center gap-2 font-['Atkinson_Hyperlegible'] font-bold text-[#006B32]">
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
                                            d="M9 18h6M10 21h4M12 3a6 6 0 00-4 10c.6.6 1 1.5 1 2.5h6c0-1 .4-1.9 1-2.5A6 6 0 0012 3z"
                                        />
                                    </svg>
                                    Rekomendasi Waktu
                                </p>
                                <p className="mt-3 font-['Atkinson_Hyperlegible'] text-xl font-bold text-[#1B1C1C]">
                                    Waktu Optimal Anda: Pukul 09:00 - 11:00
                                </p>
                                <p className="mt-2 font-['Atkinson_Hyperlegible'] text-sm text-[#3D4A3E]">
                                    Berdasarkan data historis, Anda paling fokus
                                    dan menyelesaikan modul lebih cepat di pagi
                                    hari.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
