import { Link } from '@inertiajs/react';
import KorporatLayout from '@/Layouts/KorporatLayout';

const purchasedCourses = [
    {
        title: 'Manajemen Keuangan',
        desc: 'Strategi pengelolaan dana pensiun dan investasi hari tua.',
        members: 10,
        color: 'bg-[#1A7A47]',
        icon: 'wallet',
    },
    {
        title: 'Kesehatan Senior',
        desc: 'Panduan pola hidup sehat dan pencegahan penyakit usia lanjut.',
        members: 10,
        color: 'bg-[#FF8928]',
        icon: 'shield',
    },
    {
        title: 'Persiapan Mental',
        desc: 'Kesiapan psikologis menghadapi masa transisi purnatugas.',
        members: 13,
        color: 'bg-[#C2255C]',
        icon: 'brain',
    },
];

const memberProgress = [
    ['AS', 'Agus Setiawan', 95, 'bg-[#00A553]', 'text-[#00A553]'],
    ['RL', 'Ratna Lestari', 88, 'bg-[#00A553]', 'text-[#00A553]'],
    ['BM', 'Budi Mansyur', 72, 'bg-[#A8632A]', 'text-[#A8632A]'],
    ['DS', 'Dini Safitri', 84, 'bg-[#00A553]', 'text-[#00A553]'],
    ['EP', 'Eko Prasetyo', 68, 'bg-[#A8632A]', 'text-[#A8632A]'],
];

const events = [
    ['Manajemen Keuangan', '14:00 WIB', 'Seminar Online', 'bg-[#E5F0E9] text-[#006B32]', 'Live Zoom'],
    ['Materi Keuangan', '14:00 WIB', 'Workshop Offline', 'bg-[#FEE2E2] text-[#DC2626]', ''],
    ['Gabung Pelatihan Gratis', '10:00 WIB', 'Workshop Offline', 'bg-[#FEE2E2] text-[#DC2626]', ''],
];

const activities = [
    ['join', 'Budi bergabung ke Pelatihan Anda', '2 menit yang lalu'],
    ['done', 'Dini menyelesaikan Kuis 1', '15 menit yang lalu'],
    ['join', 'Eko bergabung ke Pelatihan Anda', '1 jam yang lalu'],
];

function CourseIcon({ name }) {
    if (name === 'wallet') {
        return (
            <svg className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <rect x="3" y="6" width="18" height="13" rx="2" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M16 14h2" />
            </svg>
        );
    }

    if (name === 'shield') {
        return (
            <svg className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6l7-3z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v6M9 11h6" />
            </svg>
        );
    }

    return (
        <svg className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 3a4 4 0 00-4 4v1a3 3 0 000 6v1a4 4 0 004 4h1V3H9zM15 3a4 4 0 014 4v1a3 3 0 010 6v1a4 4 0 01-4 4h-1V3h1z" />
        </svg>
    );
}

export default function DashboardKorporat() {
    return (
        <KorporatLayout
            title="Dashboard HRD - Pensiun Mudah"
            activeNav="dashboard"
            searchPlaceholder="Cari anggota..."
        >
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-10">
                <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1B5036] to-[#10251B] px-6 py-10 text-white sm:px-10 sm:py-14">
                    <h1 className="text-3xl font-extrabold sm:text-4xl">
                        Spesial Kelas MPP
                    </h1>
                    <p className="mt-2 max-w-md text-white/90">
                        Voucher Potongan 200rb khusus untuk pendaftaran bulan ini.
                    </p>
                    <Link
                        href="/korporat/beli-pelatihan"
                        className="mt-6 inline-flex rounded-full bg-[#FF8928] px-6 py-3 font-bold text-white transition-colors hover:bg-[#F57F1E]"
                    >
                        Gunakan Kode
                    </Link>
                </section>

                <div className="mt-8 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-[#1B1C1C]">
                        Pelatihan Yang Pernah Dibeli
                    </h2>
                    <Link
                        href="/korporat/beli-pelatihan"
                        className="text-sm font-bold text-[#006B32]"
                    >
                        Lihat Semua
                    </Link>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {purchasedCourses.map((course) => (
                        <article
                            key={course.title}
                            className="overflow-hidden rounded-2xl border border-[#E4E2E1] bg-white shadow-sm"
                        >
                            <div className={`flex h-32 items-center justify-center text-white ${course.color}`}>
                                <CourseIcon name={course.icon} />
                            </div>
                            <div className="p-5">
                                <h3 className="font-bold text-[#1B1C1C]">{course.title}</h3>
                                <p className="mt-1 text-sm text-[#3D4A3E]">{course.desc}</p>
                                <div className="mt-4 flex items-center justify-between">
                                    <span className="rounded-md bg-[#E5F0E9] px-2.5 py-1 text-xs font-bold text-[#006B32]">
                                        AKTIF
                                    </span>
                                    <span className="text-xs text-[#6B7280]">
                                        {course.members} Anggota
                                    </span>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <section className="rounded-2xl border border-[#E4E2E1] bg-white p-6 shadow-sm lg:col-span-2">
                        <h2 className="max-w-sm text-lg font-bold text-[#1B1C1C]">
                            Progres Pelatihan Manajemen Keuangan Terbaru
                        </h2>
                        <div className="mt-5 flex items-center gap-4 border-b border-[#E4E2E1] pb-3 text-sm font-bold text-[#3D4A3E]">
                            <span className="w-44">Nama Anggota</span>
                            <span>Progres Belajar</span>
                        </div>
                        <div className="divide-y divide-[#F0EDED]">
                            {memberProgress.map(([initials, name, percent, barColor, percentColor]) => (
                                <div key={name} className="flex items-center gap-4 py-3">
                                    <div className="flex w-44 shrink-0 items-center gap-3">
                                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#006B32] text-xs font-bold text-white">
                                            {initials}
                                        </span>
                                        <span className="font-semibold text-[#1B1C1C]">{name}</span>
                                    </div>
                                    <div className="flex flex-1 items-center gap-3">
                                        <div className="h-2.5 flex-1 rounded-full bg-[#F0EDED]">
                                            <div
                                                className={`h-2.5 rounded-full ${barColor}`}
                                                style={{ width: `${percent}%` }}
                                            />
                                        </div>
                                        <span className={`w-12 text-right font-bold ${percentColor}`}>
                                            {percent}%
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <aside className="space-y-6">
                        <section className="rounded-2xl border border-[#E4E2E1] bg-white p-5 shadow-sm">
                            <h2 className="font-bold text-[#1B1C1C]">Event</h2>
                            <div className="mt-4 space-y-4">
                                {events.map(([title, time, tag, tagColor, extra]) => (
                                    <div key={`${title}-${time}`} className="flex gap-3">
                                        <div className="h-12 w-12 shrink-0 rounded-lg bg-[#E5F0E9]" />
                                        <div>
                                            <span className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold ${tagColor}`}>
                                                {tag}
                                            </span>
                                            <p className="mt-1 text-sm font-bold text-[#1B1C1C]">{title}</p>
                                            <p className="text-xs text-[#6B7280]">
                                                {time}{extra ? ` · ${extra}` : ''}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Link
                                href="/event"
                                className="mt-4 block w-full rounded-lg border-2 border-[#006B32] py-2.5 text-center font-bold text-[#006B32] hover:bg-[#006B32]/5"
                            >
                                Lihat Event
                            </Link>
                        </section>

                        <section className="rounded-2xl border border-[#E4E2E1] bg-white p-5 shadow-sm">
                            <h2 className="text-lg font-bold text-[#1B1C1C]">Aktivitas Terbaru</h2>
                            <div className="mt-4 space-y-4">
                                {activities.map(([variant, text, time]) => (
                                    <div key={`${variant}-${text}`} className="flex gap-3">
                                        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                                            variant === 'done'
                                                ? 'bg-[#FCE9D8] text-[#FF8928]'
                                                : 'bg-[#E5F0E9] text-[#006B32]'
                                        }`}>
                                            {variant === 'done' ? '✓' : '+'}
                                        </span>
                                        <div>
                                            <p className="text-sm font-semibold text-[#1B1C1C]">{text}</p>
                                            <p className="text-xs text-[#6B7280]">{time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </aside>
                </div>
            </div>
        </KorporatLayout>
    );
}
