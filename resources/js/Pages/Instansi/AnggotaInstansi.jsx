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

const members = [
    {
        name: 'Agus Setiawan',
        email: 'agus.s@korporat.id',
        progress: 95,
        done: '5 dari 5',
        trainings:
            'Manajemen Keuangan, Kesehatan Senior, Investasi Aman, Kesehatan Senior, Gizi Lansia',
    },
    {
        name: 'Ratna Lestari',
        email: 'ratna.l@korporat.id',
        progress: 88,
        done: '4 dari 5',
        trainings:
            'Manajemen Keuangan, Kesehatan Senior, Investasi Aman, Kesehatan Senior',
    },
    {
        name: 'Budi Mansyur',
        email: 'budi.m@korporat.id',
        progress: 72,
        done: '3 dari 5',
        trainings: 'Manajemen Keuangan, Kesehatan Senior, Investasi Aman',
    },
    {
        name: 'Endang Suganda',
        email: 'endang.s@korporat.id',
        progress: 65,
        done: '3 dari 5',
        trainings: 'Manajemen Keuangan, Kesehatan Senior, Investasi Aman',
    },
    {
        name: 'Endang Suganda',
        email: 'endang.s@korporat.id',
        progress: 65,
        done: '3 dari 5',
        trainings: 'Manajemen Keuangan, Kesehatan Senior, Investasi Aman',
    },
];

const pages = [1, 2, 3];



export default function AnggotaInstansi() {
    return (
        <InstansiLayout
            title="Anggota Instansi - Pensiun Mudah"
            activeNav="anggota"
            searchPlaceholder="Cari Anggota..."
        >
                <main className="flex-1 px-4 py-6 sm:px-6 lg:px-10">
                    {/* Stat cards */}
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <div className="rounded-2xl border border-[#E4E2E1] bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#00A553] text-white">
                                    <svg
                                        className="h-5 w-5"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle cx="9" cy="8" r="3" />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M3 20c0-3 3-5 6-5s6 2 6 5M16 6a3 3 0 010 6M19 20c0-2-1-3.5-2.5-4.3"
                                        />
                                    </svg>
                                </span>
                                <span className="text-sm font-semibold text-[#3D4A3E]">
                                    Total Anggota
                                </span>
                            </div>
                            <p className="mt-4 text-4xl font-extrabold text-[#1B1C1C]">
                                50
                            </p>
                            <p className="mt-2 flex items-center gap-1 text-sm font-semibold text-[#00A553]">
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
                                        d="M3 17l6-6 4 4 7-7M14 8h5v5"
                                    />
                                </svg>
                                +5 bulan ini
                            </p>
                        </div>

                        <div className="rounded-2xl border border-[#E4E2E1] bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#FCE9D8] text-[#FF8928]">
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
                                            d="M4 5a2 2 0 012-2h6v16H6a2 2 0 00-2 2V5zM20 5a2 2 0 00-2-2h-6v16h6a2 2 0 012 2V5z"
                                        />
                                    </svg>
                                </span>
                                <span className="text-sm font-semibold text-[#3D4A3E]">
                                    Rata-rata Progres
                                </span>
                            </div>
                            <p className="mt-4 text-4xl font-extrabold text-[#1B1C1C]">
                                78%
                            </p>
                            <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-[#E4E2E1]">
                                <div className="h-full w-[78%] rounded-full bg-[#006B32]" />
                            </div>
                        </div>
                    </div>

                    {/* Members table */}
                    <div className="mt-6 rounded-2xl border border-[#E4E2E1] bg-white shadow-sm">
                        <div className="border-b border-[#E4E2E1] px-6 py-5">
                            <h2 className="text-xl font-bold text-[#1B1C1C]">
                                Anggota Korporat
                            </h2>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[760px] text-left">
                                <thead>
                                    <tr className="text-sm text-[#6B7280]">
                                        <th className="px-6 py-4 font-semibold">
                                            Nama Anggota
                                        </th>
                                        <th className="px-6 py-4 font-semibold">
                                            Progres Belajar Rata-rata
                                        </th>
                                        <th className="px-6 py-4 font-semibold">
                                            Pelatihan Diikuti
                                        </th>
                                        <th className="px-6 py-4 font-semibold">
                                            Daftar Pelatihan
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {members.map((member, index) => (
                                        <tr
                                            key={index}
                                            className="border-t border-[#E4E2E1] align-middle"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#006B32] text-xs font-bold text-white">
                                                        {getInitials(
                                                            member.name,
                                                        )}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-bold text-[#1B1C1C]">
                                                            {member.name}
                                                        </p>
                                                        <p className="text-sm text-[#6B7280]">
                                                            {member.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-2.5 w-28 overflow-hidden rounded-full bg-[#E4E2E1]">
                                                        <div
                                                            className="h-full rounded-full bg-[#006B32]"
                                                            style={{
                                                                width: `${member.progress}%`,
                                                            }}
                                                        />
                                                    </div>
                                                    <span className="text-sm font-bold text-[#1B1C1C]">
                                                        {member.progress}%
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-[#1B1C1C]">
                                                    {member.done}
                                                </p>
                                                <p className="text-sm text-[#6B7280]">
                                                    Pelatihan
                                                </p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="max-w-xs text-sm text-[#6B7280]">
                                                    {member.trainings}
                                                </p>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex flex-col gap-4 border-t border-[#E4E2E1] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm text-[#6B7280]">
                                Menampilkan 1-10 dari 30 anggota
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E4E2E1] text-[#3D4A3E] transition-colors hover:bg-[#F0EDED]"
                                    aria-label="Sebelumnya"
                                >
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
                                            d="M15 6l-6 6 6 6"
                                        />
                                    </svg>
                                </button>
                                {pages.map((page) => (
                                    <button
                                        key={page}
                                        type="button"
                                        className={
                                            page === 1
                                                ? 'flex h-9 w-9 items-center justify-center rounded-lg bg-[#006B32] text-sm font-bold text-white'
                                                : 'flex h-9 w-9 items-center justify-center rounded-lg border border-[#E4E2E1] text-sm font-semibold text-[#3D4A3E] transition-colors hover:bg-[#F0EDED]'
                                        }
                                    >
                                        {page}
                                    </button>
                                ))}
                                <button
                                    type="button"
                                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E4E2E1] text-[#3D4A3E] transition-colors hover:bg-[#F0EDED]"
                                    aria-label="Berikutnya"
                                >
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
                                            d="M9 6l6 6-6 6"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </main>

        </InstansiLayout>
    );
}
