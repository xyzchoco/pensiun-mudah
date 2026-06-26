import { Link } from '@inertiajs/react';
import KorporatLayout from '@/Layouts/KorporatLayout';

const employees = [
    {
        id: 1,
        name: 'Dr. Sarah Wijaya',
        email: 'sarah.w@perusahaan.com',
        jabatan: 'Kepala Departemen HR',
        progress: '100%',
        barWidth: 'w-full',
        barClass: 'bg-[#006B32]',
        textClass: 'text-[#006B32]',
    },
    {
        id: 2,
        name: 'Anita Kusuma',
        email: 'anita.k@perusahaan.com',
        jabatan: 'Kepala Produksi',
        progress: '92%',
        barWidth: 'w-[92%]',
        barClass: 'bg-[#006B32]',
        textClass: 'text-[#006B32]',
    },
    {
        id: 3,
        name: 'Hendra Setiawan',
        email: 'hendra.s@perusahaan.com',
        jabatan: 'Senior Engineer',
        progress: '68%',
        barWidth: 'w-[68%]',
        barClass: 'bg-[#A8632A]',
        textClass: 'text-[#A8632A]',
    },
    {
        id: 4,
        name: 'Bambang Hartono',
        email: 'bambang.h@perusahaan.com',
        jabatan: 'Manajer Operasional',
        progress: '45%',
        barWidth: 'w-[45%]',
        barClass: 'bg-[#A8632A]',
        textClass: 'text-[#A8632A]',
    },
    {
        id: 5,
        name: 'Bambang Hartono',
        email: 'bambang.h@perusahaan.com',
        jabatan: 'Manajer Operasional',
        progress: '45%',
        barWidth: 'w-[45%]',
        barClass: 'bg-[#A8632A]',
        textClass: 'text-[#A8632A]',
    },
    {
        id: 6,
        name: 'Bambang Hartono',
        email: 'bambang.h@perusahaan.com',
        jabatan: 'Manajer Operasional',
        progress: '45%',
        barWidth: 'w-[45%]',
        barClass: 'bg-[#A8632A]',
        textClass: 'text-[#A8632A]',
    },
    {
        id: 7,
        name: 'Bambang Hartono',
        email: 'bambang.h@perusahaan.com',
        jabatan: 'Manajer Operasional',
        progress: '45%',
        barWidth: 'w-[45%]',
        barClass: 'bg-[#A8632A]',
        textClass: 'text-[#A8632A]',
    },
    {
        id: 8,
        name: 'Bambang Hartono',
        email: 'bambang.h@perusahaan.com',
        jabatan: 'Manajer Operasional',
        progress: '45%',
        barWidth: 'w-[45%]',
        barClass: 'bg-[#A8632A]',
        textClass: 'text-[#A8632A]',
    },
    {
        id: 9,
        name: 'Bambang Hartono',
        email: 'bambang.h@perusahaan.com',
        jabatan: 'Manajer Operasional',
        progress: '45%',
        barWidth: 'w-[45%]',
        barClass: 'bg-[#A8632A]',
        textClass: 'text-[#A8632A]',
    },
    {
        id: 10,
        name: 'Bambang Hartono',
        email: 'bambang.h@perusahaan.com',
        jabatan: 'Manajer Operasional',
        progress: '45%',
        barWidth: 'w-[45%]',
        barClass: 'bg-[#A8632A]',
        textClass: 'text-[#A8632A]',
    },
];

function getInitials(name) {
    return name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
}

export default function DetailModulKaryawan({
    moduleName = 'Kesehatan Mental',
    memberCount = 10,
    totalMembers = 10,
    backHref = '/korporat/pelatihan-dibeli',
}) {
    return (
        <KorporatLayout
            title={moduleName + ' - Pensiun Mudah'}
            activeNav="dashboard"
            searchPlaceholder="Cari anggota..."
        >
                <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-10">
                    <Link
                        href={backHref}
                        className="inline-flex items-center gap-2 font-bold text-[#006B32] transition-opacity hover:opacity-80"
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

                    <div className="relative mt-6 overflow-hidden rounded-2xl bg-[#006B32] p-8 text-white">
                        <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-white/80">
                            <svg
                                className="h-5 w-5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <rect
                                    x="4"
                                    y="4"
                                    width="16"
                                    height="16"
                                    rx="2"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9 9h6v6H9z"
                                />
                            </svg>
                            Modul Detail
                        </p>
                        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
                            {moduleName}
                        </h1>
                        <p className="mt-2 text-white/90">
                            Daftar progres pelatihan karyawan untuk modul{' '}
                            {moduleName}
                        </p>
                        <span className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white/15 px-4 py-2 text-sm font-bold">
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
                                    d="M17 20h5v-1a4 4 0 00-4-4M9 20H4v-1a4 4 0 014-4h2m6-4a3 3 0 11-6 0 3 3 0 016 0zm6 1a2.5 2.5 0 10-3-2.45"
                                />
                            </svg>
                            {memberCount} Anggota
                        </span>
                        <svg
                            className="pointer-events-none absolute -right-2 top-1/2 hidden h-40 w-40 -translate-y-1/2 text-white/10 sm:block"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            viewBox="0 0 24 24"
                        >
                            <rect x="2" y="6" width="20" height="12" rx="2" />
                            <circle cx="12" cy="12" r="3" />
                        </svg>
                    </div>

                    <div className="mt-6 overflow-hidden rounded-2xl border border-[#E4E2E1] bg-white shadow-sm">
                        <div className="hidden grid-cols-3 gap-4 border-b border-[#E4E2E1] bg-[#F6F3F2] px-6 py-4 text-sm font-bold text-[#3D4A3E] sm:grid">
                            <span className="text-center">Nama Karyawan</span>
                            <span className="text-center">Jabatan</span>
                            <span className="text-center">Progres Belajar</span>
                        </div>
                        {employees.map((employee) => (
                            <div
                                key={employee.id}
                                className="grid grid-cols-1 gap-4 border-b border-[#E4E2E1] px-6 py-4 sm:grid-cols-3 sm:items-center"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#006B32] text-xs font-bold text-white">
                                        {getInitials(employee.name)}
                                    </span>
                                    <div className="min-w-0">
                                        <p className="font-bold text-[#1B1C1C]">
                                            {employee.name}
                                        </p>
                                        <p className="text-xs text-[#6B7280]">
                                            {employee.email}
                                        </p>
                                    </div>
                                </div>
                                <p className="text-sm text-[#3D4A3E] sm:text-center">
                                    {employee.jabatan}
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#E4E2E1]">
                                        <div
                                            className={`h-full rounded-full ${employee.barWidth} ${employee.barClass}`}
                                        />
                                    </div>
                                    <span
                                        className={`shrink-0 text-sm font-bold ${employee.textClass}`}
                                    >
                                        {employee.progress}
                                    </span>
                                </div>
                            </div>
                        ))}
                        <p className="px-6 py-4 text-sm text-[#3D4A3E]">
                            Jumlah anggota yang bergabung {memberCount} dari{' '}
                            {totalMembers} anggota
                        </p>
                    </div>
                </div>
        </KorporatLayout>
    );
}
