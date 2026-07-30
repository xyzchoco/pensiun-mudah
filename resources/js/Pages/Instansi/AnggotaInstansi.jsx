import { Link } from '@inertiajs/react';
import InstansiLayout from '@/Layouts/InstansiLayout';

function getInitials(name) {
    if (!name) return 'U';
    return name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
}

export default function AnggotaInstansi({ members, totalAnggota, rataProgres, pagination }) {
    const pages = Array.from({ length: pagination.last }, (_, i) => i + 1);

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
                            {totalAnggota}
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
                            {rataProgres}%
                        </p>
                        <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-[#E4E2E1]">
                            <div
                                className="h-full rounded-full bg-[#006B32]"
                                style={{ width: `${rataProgres}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Members table */}
                <div className="mt-6 rounded-2xl border border-[#E4E2E1] bg-white shadow-sm">
                    <div className="border-b border-[#E4E2E1] px-6 py-5">
                        <h2 className="text-xl font-bold text-[#1B1C1C]">
                            Anggota Instansi
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
                                {members.length > 0 ? (
                                    members.map((member, index) => (
                                        <tr
                                            key={index}
                                            className="border-t border-[#E4E2E1] align-middle"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {/* [DATA] Foto profil anggota — member.photo (URL penuh dari backend, fallback inisial) */}
                                                    {member.photo ? (
                                                        <img src={member.photo} alt={member.name} className="h-10 w-10 shrink-0 rounded-full object-cover" />
                                                    ) : (
                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#006B32] text-xs font-bold text-white">
                                                            {getInitials(member.name)}
                                                        </div>
                                                    )}
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
                                                {/* [DATA] Rata-rata progres belajar (0-100) */}
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
                                                {/* [DATA] Pelatihan diikuti (member.done) */}
                                                <p className="font-bold text-[#1B1C1C]">
                                                    {member.done}
                                                </p>
                                                <p className="text-sm text-[#6B7280]">
                                                    Pelatihan
                                                </p>
                                            </td>
                                            <td className="px-6 py-4">
                                                {/* [DATA] Nama pelatihan (member.trainings) */}
                                                <p className="max-w-xs text-sm text-[#6B7280]">
                                                    {member.trainings || '-'}
                                                </p>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-10 text-center text-[#6B7280]">
                                            Belum ada anggota yang bergabung.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* [PAGINATION] Navigasi paginasi Laravel */}
                    {pagination.total > 0 && (
                        <div className="flex flex-col gap-4 border-t border-[#E4E2E1] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm text-[#6B7280]">
                                Menampilkan {pagination.from}-{pagination.to} dari {pagination.total} anggota
                            </p>
                            <div className="flex items-center gap-2">
                                <Link
                                    href={route('instansi.anggota', { page: pagination.current - 1 })}
                                    only={['members', 'pagination']}
                                    preserveScroll
                                    disabled={pagination.current === 1}
                                    className={`flex h-9 w-9 items-center justify-center rounded-lg border border-[#E4E2E1] text-[#3D4A3E] transition-colors hover:bg-[#F0EDED] ${pagination.current === 1 ? 'pointer-events-none opacity-50' : ''}`}
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
                                </Link>
                                {pages.map((page) => (
                                    <Link
                                        key={page}
                                        href={route('instansi.anggota', { page })}
                                        only={['members', 'pagination']}
                                        preserveScroll
                                        className={
                                            page === pagination.current
                                                ? 'flex h-9 w-9 items-center justify-center rounded-lg bg-[#006B32] text-sm font-bold text-white'
                                                : 'flex h-9 w-9 items-center justify-center rounded-lg border border-[#E4E2E1] text-sm font-semibold text-[#3D4A3E] transition-colors hover:bg-[#F0EDED]'
                                        }
                                    >
                                        {page}
                                    </Link>
                                ))}
                                <Link
                                    href={route('instansi.anggota', { page: pagination.current + 1 })}
                                    only={['members', 'pagination']}
                                    preserveScroll
                                    disabled={pagination.current === pagination.last}
                                    className={`flex h-9 w-9 items-center justify-center rounded-lg border border-[#E4E2E1] text-[#3D4A3E] transition-colors hover:bg-[#F0EDED] ${pagination.current === pagination.last ? 'pointer-events-none opacity-50' : ''}`}
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
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </InstansiLayout>
    );
}