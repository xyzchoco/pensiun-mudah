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

export default function DetailModulKaryawanInstansi({
    moduleName = 'Detail Pelatihan',
    memberCount = 0,
    totalMembers = 0,
    employees = { data: [], links: [], from: 0, to: 0, total: 0 },
    backHref = '/instansi/dashboard',
}) {
    return (
        <InstansiLayout
            title={moduleName + ' - Pensiun Mudah'}
            activeNav="dashboard"
            searchPlaceholder="Cari anggota..."
        >
            <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-10">
                <Link
                    href={backHref}
                    className="mb-6 inline-flex items-center gap-2 font-bold text-[#006B32] transition-opacity hover:opacity-80"
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
                            d="M10 19l-7-7m0 0l7-7m-7 7h18"
                        />
                    </svg>
                    Kembali ke Dashboards
                </Link>

                {/* Hero Section (Box Hijau) */}
                <div className="relative overflow-hidden rounded-t-2xl bg-[#006B32] p-8 text-white shadow-sm sm:p-10">
                    <div className="relative z-10">
                        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/90">
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
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                            MODUL DETAIL
                        </p>
                        <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">
                            {moduleName}
                        </h1>
                        <p className="mt-2 text-sm text-white/90">
                            Daftar progres pelatihan karyawan untuk modul{' '}
                            {moduleName}
                        </p>
                        <div className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white/20 px-4 py-2.5 text-sm font-bold backdrop-blur-sm">
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
                                    d="M17 20h5v-1a4 4 0 00-4-4M9 20H4v-1a4 4 0 014-4h2m6-4a3 3 0 11-6 0 3 3 0 016 0zm6 1a2.5 2.5 0 10-3-2.45"
                                />
                            </svg>
                            {memberCount} Anggota
                        </div>
                    </div>

                    {/* Ikon Transparan Besar di Kanan */}
                    <svg
                        className="pointer-events-none absolute -right-4 top-1/2 h-56 w-56 -translate-y-1/2 text-white/10"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h16v12zM8 8h8v2H8zm0 4h8v2H8z" />
                    </svg>
                </div>

                {/* Tabel Daftar Karyawan */}
                <div className="rounded-b-2xl border-x border-b border-[#E4E2E1] bg-white shadow-sm">
                    {/* Table Header */}
                    <div className="hidden grid-cols-3 gap-4 border-b border-[#E4E2E1] bg-[#F9F9F9] px-8 py-4 text-sm font-bold text-[#3D4A3E] sm:grid">
                        <span className="text-center sm:text-left">
                            Nama Karyawan
                        </span>
                        <span className="text-center sm:text-left">
                            Jabatan
                        </span>
                        <span className="text-center sm:text-left">
                            Progres Belajar
                        </span>
                    </div>

                    {/* Table Body */}
                    <div className="divide-y divide-[#E4E2E1]">
                        {employees.data.length > 0 ? (
                            employees.data.map((employee) => {
                                // Logika warna: >= 80% Hijau, sisanya Coklat/Orange
                                const isHighProgress = employee.progress >= 80;
                                const barColor = isHighProgress
                                    ? 'bg-[#006B32]'
                                    : 'bg-[#A8632A]';
                                const textColor = isHighProgress
                                    ? 'text-[#006B32]'
                                    : 'text-[#A8632A]';

                                return (
                                    <div
                                        key={employee.id}
                                        className="grid grid-cols-1 gap-6 px-8 py-5 sm:grid-cols-3 sm:items-center transition-colors hover:bg-[#FBF9F8]"
                                    >
                                        {/* Kolom Nama & Email */}
                                        <div className="flex items-center gap-4">
                                            {employee.photo ? (
                                                <img src={employee.photo} alt={employee.name} className="h-12 w-12 shrink-0 rounded-full object-cover" />
                                            ) : (
                                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#E5F0E9] text-sm font-bold text-[#006B32]">
                                                    {getInitials(employee.name)}
                                                </div>
                                            )}
                                            <div className="min-w-0">
                                                <p className="font-bold text-[#1B1C1C] truncate">
                                                    {employee.name}
                                                </p>
                                                <p className="text-xs text-[#6B7280] truncate">
                                                    {employee.email}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Kolom Jabatan */}
                                        <div className="text-sm text-[#3D4A3E]">
                                            {employee.jabatan || 'Anggota'}
                                        </div>

                                        {/* Kolom Progres */}
                                        <div className="flex items-center gap-4">
                                            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-[#E4E2E1]">
                                                <div
                                                    className={`h-full rounded-full ${barColor}`}
                                                    style={{
                                                        width: `${employee.progress}%`,
                                                    }}
                                                />
                                            </div>
                                            <span
                                                className={`w-12 shrink-0 text-right text-sm font-bold ${textColor}`}
                                            >
                                                {employee.progress}%
                                            </span>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="py-10 text-center">
                                <p className="text-sm font-semibold text-[#6B7280]">
                                    Belum ada anggota yang terdaftar di
                                    pelatihan ini.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Pagination Footer */}
                    {employees.total > 0 && (
                        <div className="flex flex-col items-center justify-between gap-4 border-t border-[#E4E2E1] bg-[#F9F9F9] px-8 py-4 sm:flex-row">
                            <p className="text-sm font-bold text-[#6B7280]">
                                Menampilkan {employees.from}-{employees.to} dari{' '}
                                {employees.total} anggota
                            </p>

                            {/* Tombol Navigasi Pagination */}
                            <div className="flex gap-1">
                                {employees.links.map((link, index) => {
                                    // Bersihkan label bawaan Laravel (&laquo; dan &raquo;)
                                    let label = link.label;
                                    if (label.includes('Previous')) label = '‹';
                                    if (label.includes('Next')) label = '›';

                                    return link.url ? (
                                        <Link
                                            key={index}
                                            href={link.url}
                                            preserveScroll
                                            className={`flex h-8 w-8 items-center justify-center rounded border text-sm font-bold transition-colors ${link.active
                                                ? 'border-[#006B32] bg-[#006B32] text-white'
                                                : 'border-[#E4E2E1] bg-white text-[#3D4A3E] hover:bg-[#F0EDED]'
                                                }`}
                                            dangerouslySetInnerHTML={{
                                                __html: label,
                                            }}
                                        />
                                    ) : (
                                        <span
                                            key={index}
                                            className="flex h-8 w-8 items-center justify-center rounded border border-[#E4E2E1] bg-transparent text-sm font-bold text-[#9AA6A0] opacity-50 cursor-not-allowed"
                                            dangerouslySetInnerHTML={{
                                                __html: label,
                                            }}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Section Baru: Jadwal Hybrid */}
                <div className="mt-10 flex flex-col items-center justify-center text-center">
                    <Link href="/instansi/pilih-jadwal-hybrid" className="flex items-center gap-2 rounded-lg bg-[#FF8928] px-8 py-3.5 font-bold text-white shadow-sm transition-all hover:bg-[#F57F1E] hover:shadow-md">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        Buka Jadwal Hybrid
                    </Link>
                    <p className="mt-4 flex items-center justify-center gap-2 text-sm font-bold text-[#6B7280]">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="16" x2="12" y2="12" />
                            <line x1="12" y1="8" x2="12.01" y2="8" />
                        </svg>
                        <span className="font-semibold">Semua Anggota mencapai 80%</span> Tentukan Jadwal Hybrid Anda Sekarang
                    </p>
                </div>
            </div>
        </InstansiLayout>
    );
}
