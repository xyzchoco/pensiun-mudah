import { Link } from '@inertiajs/react';
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

const details = [
    { icon: 'calendar', label: 'TANGGAL', value: '24 Oktober 2024' },
    { icon: 'clock', label: 'WAKTU', value: '08:00 - 12:00 WIB' },
    { icon: 'location', label: 'LOKASI', value: 'Hotel Santika, Jakarta' },
];

function DetailIcon({ name }) {
    if (name === 'calendar') {
        return (
            <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
            >
                <rect x="3" y="4" width="18" height="17" rx="2" />
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 9h18M8 2v4M16 2v4"
                />
            </svg>
        );
    }
    if (name === 'clock') {
        return (
            <svg
                className="h-4 w-4"
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
        );
    }
    return (
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
                d="M12 21s-7-5.5-7-11a7 7 0 1114 0c0 5.5-7 11-7 11z"
            />
            <circle cx="12" cy="10" r="2.5" />
        </svg>
    );
}

export default function JadwalBerhasilInstansi() {
    return (
        <InstansiLayout showSidebar={false} title="Jadwal Berhasil Dikonfirmasi - Pensiun Mudah" activeNav="dashboard">
            {/* Header */}
            {/* Main */}
            <main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-10">
                <div className="w-full max-w-2xl text-center">
                    <div className="flex justify-center">
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#006B32] ring-8 ring-[#006B32]/15">
                            <svg
                                className="h-12 w-12 text-white"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>
                    </div>

                    <h1 className="mt-8 text-2xl font-bold text-[#006B32] sm:text-3xl">
                        Jadwal Berhasil Dikonfirmasi
                    </h1>
                    <p className="mx-auto mt-3 max-w-md text-[#3D4A3E]">
                        Sesi tatap muka kelas hibrida telah dijadwalkan secara
                        resmi di dalam sistem.
                    </p>

                    <div className="mt-8 grid grid-cols-1 divide-y divide-[#E4E2E1] rounded-2xl border border-[#E4E2E1] bg-white text-left shadow-sm sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                        {details.map((detail) => (
                            <div key={detail.label} className="p-6">
                                <div className="flex items-center gap-2 text-[#006B32]">
                                    <DetailIcon name={detail.icon} />
                                    <span className="text-xs font-semibold uppercase tracking-wider">
                                        {detail.label}
                                    </span>
                                </div>
                                <p className="mt-2 text-lg font-bold text-[#1B1C1C]">
                                    {detail.value}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 flex items-start gap-3 rounded-xl bg-[#F0EDED] p-4 text-left">
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#006B32] text-white">
                            <svg
                                className="h-4 w-4"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 11-2 0 1 1 0 012 0zm-1 3a1 1 0 00-1 1v3a1 1 0 102 0v-3a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </span>
                        <p className="text-sm text-[#3D4A3E]">
                            Notifikasi konfirmasi jadwal dan instruksi persiapan
                            telah dikirimkan secara otomatis ke seluruh anggota
                            grup melalui email dan aplikasi.
                        </p>
                    </div>

                    <div className="mt-8 flex justify-center">
                        <Link
                            href="/instansi/dashboard"
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#006B32] px-8 py-3.5 font-bold text-white transition-colors hover:bg-[#005427]"
                        >
                            Kembali ke Dashboard
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
                                    d="M5 12h14M13 6l6 6-6 6"
                                />
                            </svg>
                        </Link>
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
