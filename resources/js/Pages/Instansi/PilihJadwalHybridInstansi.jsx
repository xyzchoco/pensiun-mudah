import { Head, Link } from '@inertiajs/react';
import InstansiLayout from '@/Layouts/InstansiLayout';

function getInitials(name) {
    return name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
}

const currentUser = { name: 'Budi Santoso', role: 'PREMIUM MEMBER' };

const weekdays = ['MIN', 'SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB'];

const calendarDays = [
    { day: 29, muted: true },
    { day: 30, muted: true },
    { day: 1 },
    { day: 2 },
    { day: 3 },
    { day: 4 },
    { day: 5 },
    { day: 6 },
    { day: 7 },
    { day: 8 },
    { day: 9 },
    { day: 10 },
    { day: 11 },
    { day: 12 },
    { day: 13 },
    { day: 14 },
    { day: 15 },
    { day: 16 },
    { day: 17 },
    { day: 18 },
    { day: 19 },
    { day: 20 },
    { day: 21 },
    { day: 22 },
    { day: 23 },
    { day: 24, selected: true },
    { day: 25 },
    { day: 26 },
    { day: 27 },
    { day: 28 },
    { day: 29 },
    { day: 30 },
    { day: 31 },
    { day: 1, muted: true },
    { day: 2, muted: true },
];

const summary = [
    { label: 'Tanggal', value: '24 Oktober 2024' },
    { label: 'Waktu', value: 'Pagi (08:00 - 12:00)' },
    { label: 'Lokasi', value: 'Hotel Santika, Jakarta' },
];

export default function PilihJadwalHybrid() {
    return (
        <InstansiLayout showSidebar={false} title="Pilih Jadwal Hybrid - Pensiun Mudah" activeNav="dashboard">
            {/* Header */}
            {/* Main */}
            <main className="flex-1 px-4 py-8 sm:px-6 lg:px-10">
                <div className="mx-auto max-w-6xl">
                    <Link
                        href="/korporat/dashboard"
                        className="inline-flex items-center gap-2 font-bold text-[#006B32]"
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
                                d="M19 12H5M11 6l-6 6 6 6"
                            />
                        </svg>
                        Kembali ke Dashboard
                    </Link>

                    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Calendar card */}
                        <div className="rounded-2xl border border-[#E4E2E1] bg-white p-6 shadow-sm sm:p-8 lg:col-span-2">
                            <div className="flex items-start justify-between gap-4">
                                <h1 className="max-w-[12rem] text-2xl font-bold text-[#1B1C1C] sm:text-3xl">
                                    Pilih Rentang Tanggal
                                </h1>
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#006B32]/40 text-[#006B32] transition-colors hover:bg-[#F0EDED]"
                                        aria-label="Bulan sebelumnya"
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
                                                d="M15 6l-6 6 6 6"
                                            />
                                        </svg>
                                    </button>
                                    <span className="text-lg font-bold text-[#1B1C1C]">
                                        Oktober 2024
                                    </span>
                                    <button
                                        type="button"
                                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#006B32]/40 text-[#006B32] transition-colors hover:bg-[#F0EDED]"
                                        aria-label="Bulan berikutnya"
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
                                                d="M9 6l6 6-6 6"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div className="mt-8 grid grid-cols-7 gap-2 text-center">
                                {weekdays.map((weekday) => (
                                    <div
                                        key={weekday}
                                        className="pb-2 text-xs font-semibold uppercase tracking-wide text-[#3D4A3E]/60"
                                    >
                                        {weekday}
                                    </div>
                                ))}
                                {calendarDays.map((cell, index) => {
                                    if (cell.muted) {
                                        return (
                                            <div
                                                key={index}
                                                className="py-3 text-sm text-[#9AA6A0]"
                                            >
                                                {cell.day}
                                            </div>
                                        );
                                    }
                                    if (cell.selected) {
                                        return (
                                            <div
                                                key={index}
                                                className="rounded-lg bg-[#006B32] py-3 text-sm font-bold text-white"
                                            >
                                                {cell.day}
                                            </div>
                                        );
                                    }
                                    return (
                                        <div
                                            key={index}
                                            className="rounded-lg border border-[#E4E2E1] py-3 text-sm text-[#1B1C1C] transition-colors hover:border-[#006B32]/40"
                                        >
                                            {cell.day}
                                        </div>
                                    );
                                })}
                            </div>

                            <hr className="my-8 border-[#E4E2E1]" />

                            <div className="flex items-center gap-2">
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
                                        d="M12 21s-7-5.5-7-11a7 7 0 1114 0c0 5.5-7 11-7 11z"
                                    />
                                    <circle cx="12" cy="10" r="2.5" />
                                </svg>
                                <h2 className="font-bold text-[#1B1C1C]">
                                    Tuliskan Usulan Lokasi
                                </h2>
                            </div>
                            <input
                                type="text"
                                placeholder="Masukkan alamat atau nama lokasi yang diusulkan..."
                                className="mt-3 w-full rounded-lg border border-[#E4E2E1] bg-[#F0EDED] px-4 py-3 text-sm text-[#6B7280] outline-none focus:ring-2 focus:ring-[#006B32]/30"
                            />
                            <p className="mt-2 text-xs text-[#6B7280]">
                                Lokasi ini akan digunakan sebagai titik temu
                                utama untuk sesi tatap muka.
                            </p>
                        </div>

                        {/* Summary card */}
                        <div className="h-fit rounded-2xl border border-[#E4E2E1] bg-[#F0EDED] p-6">
                            <div className="flex items-center gap-2">
                                <svg
                                    className="h-5 w-5 text-[#006B32]"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <rect
                                        x="3"
                                        y="4"
                                        width="18"
                                        height="17"
                                        rx="2"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M3 9h18M8 2v4M16 2v4"
                                    />
                                </svg>
                                <h2 className="font-bold text-[#1B1C1C]">
                                    Ringkasan Jadwal
                                </h2>
                            </div>

                            <dl className="mt-6 space-y-4">
                                {summary.map((item) => (
                                    <div
                                        key={item.label}
                                        className="flex items-start justify-between gap-4 border-b border-[#E4E2E1] pb-4 last:border-b-0"
                                    >
                                        <dt className="text-sm text-[#3D4A3E]">
                                            {item.label}
                                        </dt>
                                        <dd className="text-right text-sm font-bold text-[#1B1C1C]">
                                            {item.value}
                                        </dd>
                                    </div>
                                ))}
                            </dl>

                            <Link
                                href="/instansi/jadwal-berhasil"
                                className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#FF8928] px-6 py-3.5 font-bold text-white transition-colors hover:bg-[#F57F1E]"
                            >
                                Konfirmasi Jadwal
                                <svg
                                    className="h-5 w-5"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <circle cx="12" cy="12" r="9" />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M8 12l3 3 5-6"
                                    />
                                </svg>
                            </Link>
                            <p className="mt-3 text-center text-xs text-[#6B7280]">
                                Konfirmasi ini akan mengirimkan notifikasi ke
                                seluruh peserta kelas hybrid.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-[#E4E2E1] bg-[#F0EDED] px-4 py-10 sm:px-6 lg:px-10">
                <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 sm:grid-cols-3">
                    <div>
                        <h3 className="font-bold text-[#006B32]">
                            Pensiun Mudah
                        </h3>
                        <p className="mt-3 max-w-xs text-sm leading-relaxed text-[#3D4A3E]">
                            Membimbing profesional berpengalaman menuju masa
                            pensiun yang lebih bermakna, sehat, dan sejahtera
                            melalui ekosistem belajar yang ramah senior.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-bold text-[#1B1C1C]">Kontak</h3>
                        <ul className="mt-3 space-y-2 text-sm text-[#3D4A3E]">
                            <li className="flex items-center gap-2">
                                <svg
                                    className="h-4 w-4 text-[#3D4A3E]/70"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <rect
                                        x="3"
                                        y="5"
                                        width="18"
                                        height="14"
                                        rx="2"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M3 7l9 6 9-6"
                                    />
                                </svg>
                                info@pensiunmudah.id
                            </li>
                            <li className="flex items-center gap-2">
                                <svg
                                    className="h-4 w-4 text-[#3D4A3E]/70"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M3 5l4-1 2 5-2 1a12 12 0 005 5l1-2 5 2-1 4a16 16 0 01-14-14z"
                                    />
                                </svg>
                                +62 21 1234 5678
                            </li>
                            <li className="flex items-center gap-2">
                                <svg
                                    className="h-4 w-4 text-[#3D4A3E]/70"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 21s-7-5.5-7-11a7 7 0 1114 0c0 5.5-7 11-7 11z"
                                    />
                                    <circle cx="12" cy="10" r="2.5" />
                                </svg>
                                Jakarta, Indonesia
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-[#1B1C1C]">Ikuti Kami</h3>
                        <div className="mt-3 flex items-center gap-3">
                            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#3D4A3E] shadow-sm">
                                <svg
                                    className="h-5 w-5"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <circle cx="12" cy="12" r="9" />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"
                                    />
                                </svg>
                            </span>
                            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#3D4A3E] shadow-sm">
                                <svg
                                    className="h-5 w-5"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <circle cx="18" cy="5" r="2" />
                                    <circle cx="6" cy="12" r="2" />
                                    <circle cx="18" cy="19" r="2" />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M8 11l8-5M8 13l8 5"
                                    />
                                </svg>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="mx-auto mt-8 max-w-6xl border-t border-[#E4E2E1] pt-6 text-center text-sm text-[#3D4A3E]">
                    © 2026 Pensiun Mudah. Seluruh hak cipta dilindungi.
                    Investasi Masa Tua yang Bermakna.
                </div>
            </footer>
        </InstansiLayout>
    );
}
