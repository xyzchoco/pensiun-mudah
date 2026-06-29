import { Link } from '@inertiajs/react';
import InstansiLayout from '@/Layouts/InstansiLayout';

// Mock data: Progress (Biarkan sementara kalau belum ada tabelnya)
const memberProgress = [
    ['AS', 'Agus Setiawan', 95, 'bg-[#00A553]', 'text-[#00A553]'],
    ['RL', 'Ratna Lestari', 88, 'bg-[#00A553]', 'text-[#00A553]'],
    ['BM', 'Budi Mansyur', 72, 'bg-[#A8632A]', 'text-[#A8632A]'],
    ['DS', 'Dini Safitri', 84, 'bg-[#00A553]', 'text-[#00A553]'],
    ['EP', 'Eko Prasetyo', 68, 'bg-[#A8632A]', 'text-[#A8632A]'],
];

// Icon Component
function CourseIcon() {
    // Icon default kalau ga ada gambar
    return (
        <svg
            className="h-10 w-10 opacity-80"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
        </svg>
    );
}

// TAMBAHKAN purchasedCourses SEBAGAI PROPS DARI BACKEND DI SINI BOS
export default function DashboardInstansi({
    banners = [],
    events = [],
    purchasedCourses = [],
    recentActivities = [],
    memberProgressData = [],
}) {
    return (
        <InstansiLayout
            title="Dashboard HRD - Pensiun Mudah"
            activeNav="dashboard"
            searchPlaceholder="Cari anggota..."
        >
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-10">
                {/* Banner Section */}
                {banners.length > 0 ? (
                    banners.map((banner) => (
                        <section
                            key={banner.id}
                            className="relative overflow-hidden rounded-2xl px-6 py-10 text-white sm:px-10 sm:py-14 mb-6 bg-cover bg-center"
                            style={
                                banner.image_path
                                    ? {
                                          backgroundImage: `url(/storage/${banner.image_path})`,
                                      }
                                    : {
                                          backgroundImage:
                                              'linear-gradient(to right, #1B5036, #10251B)',
                                      }
                            }
                        >
                            <div className="absolute inset-0 bg-black/40"></div>

                            <div className="relative z-10">
                                <h1 className="text-3xl font-extrabold sm:text-4xl">
                                    {banner.title || 'Spesial Kelas MPP'}
                                </h1>
                                <p className="mt-2 max-w-md text-white/90">
                                    {banner.description ||
                                        'Voucher Potongan 200rb khusus untuk pendaftaran bulan ini.'}
                                </p>
                                <Link
                                    href={
                                        banner.link_url ||
                                        '/instansi/beli-pelatihan'
                                    }
                                    className="mt-6 inline-flex rounded-full bg-[#FF8928] px-6 py-3 font-bold text-white transition-colors hover:bg-[#F57F1E]"
                                >
                                    Gunakan Kode
                                </Link>
                            </div>
                        </section>
                    ))
                ) : (
                    // Default Fallback Banner
                    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1B5036] to-[#10251B] px-6 py-10 text-white sm:px-10 sm:py-14 mb-6">
                        <h1 className="text-3xl font-extrabold sm:text-4xl">
                            Spesial Kelas MPP
                        </h1>
                        <p className="mt-2 max-w-md text-white/90">
                            Voucher Potongan 200rb khusus untuk pendaftaran
                            bulan ini.
                        </p>
                        <Link
                            href="/instansi/beli-pelatihan"
                            className="mt-6 inline-flex rounded-full bg-[#FF8928] px-6 py-3 font-bold text-white transition-colors hover:bg-[#F57F1E]"
                        >
                            Gunakan Kode
                        </Link>
                    </section>
                )}

                {/* Purchased Courses Header */}
                <div className="mt-8 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-[#1B1C1C]">
                        Pelatihan Yang Pernah Dibeli
                    </h2>
                    <Link
                        href="/instansi/pelatihan-dibeli"
                        className="text-sm font-bold text-[#006B32]"
                    >
                        Lihat Semua
                    </Link>
                </div>

                {/* Purchased Courses Grid (SUDAH DINAMIS) */}
                <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {purchasedCourses.length > 0 ? (
                        purchasedCourses.map((course, index) => (
                            <Link
                                key={index}
                                href={`/instansi/modul/${
                                    course.slug ||
                                    course.title
                                        .toLowerCase()
                                        .replace(/[^a-z0-9]+/g, '-')
                                        .replace(/(^-|-$)+/g, '')
                                }`}
                                className="group flex flex-col overflow-hidden rounded-2xl border border-[#E4E2E1] bg-white shadow-sm hover:shadow-md hover:border-[#006B32] transition-all cursor-pointer"
                            >
                                {/* Nampilin Thumbnail Asli kalau ada */}
                                {course.thumbnail ? (
                                    <img
                                        src={`/storage/${course.thumbnail.replace(/^public\//, '')}`}
                                        alt={course.title}
                                        className="h-32 w-full object-cover"
                                    />
                                ) : (
                                    <div
                                        className="flex h-32 items-center justify-center text-white"
                                        style={{
                                            backgroundColor:
                                                course.category_color ||
                                                '#006B32',
                                        }}
                                    >
                                        <CourseIcon />
                                    </div>
                                )}

                                <div className="flex flex-1 flex-col p-5">
                                    <h3 className="font-bold text-[#1B1C1C] line-clamp-2 group-hover:text-[#006B32] transition-colors">
                                        {course.title}
                                    </h3>
                                    <p className="mt-1 text-sm text-[#3D4A3E] line-clamp-2">
                                        {course.desc}
                                    </p>

                                    <div className="mt-auto pt-4 flex items-center justify-between">
                                        <span className="rounded-md bg-[#E5F0E9] px-2.5 py-1 text-xs font-bold text-[#006B32]">
                                            AKTIF
                                        </span>
                                        <span className="text-xs font-semibold text-[#6B7280]">
                                            {/* Ini yang nge-define member yang udah join! */}
                                            {course.used_count} /{' '}
                                            {course.max_uses} Terpakai
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="col-span-full rounded-2xl border-2 border-dashed border-[#E4E2E1] py-10 text-center">
                            <p className="text-sm font-semibold text-[#6B7280]">
                                Perusahaan Anda belum membeli pelatihan apapun.
                            </p>
                        </div>
                    )}
                </div>

                <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Progress Section */}
                    <section className="rounded-2xl border border-[#E4E2E1] bg-white p-6 shadow-sm lg:col-span-2">
                        <h2 className="max-w-sm text-lg font-bold text-[#1B1C1C]">
                            Progres Belajar Anggota Terbaru
                        </h2>
                        <div className="mt-5 flex items-center gap-4 border-b border-[#E4E2E1] pb-3 text-sm font-bold text-[#3D4A3E]">
                            <span className="w-52">Nama Anggota</span>
                            <span>Progres Belajar</span>
                        </div>
                        <div className="divide-y divide-[#F0EDED]">
                            {memberProgressData &&
                            memberProgressData.length > 0 ? (
                                memberProgressData.map((data, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-4 py-3"
                                    >
                                        <div className="flex w-52 shrink-0 items-center gap-3">
                                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#006B32] text-xs font-bold text-white">
                                                {data.initials}
                                            </span>
                                            <div>
                                                <span className="block font-semibold text-[#1B1C1C]">
                                                    {data.name}
                                                </span>
                                                <span
                                                    className="block text-[10px] text-[#6B7280] line-clamp-1"
                                                    title={data.course}
                                                >
                                                    {data.course}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex flex-1 items-center gap-3">
                                            <div className="h-2.5 flex-1 rounded-full bg-[#F0EDED]">
                                                <div
                                                    className={`h-2.5 rounded-full ${data.barColor}`}
                                                    style={{
                                                        width: `${data.percent}%`,
                                                    }}
                                                />
                                            </div>
                                            <span
                                                className={`w-12 text-right font-bold ${data.percentColor}`}
                                            >
                                                {data.percent}%
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-6 text-center">
                                    <p className="text-sm font-semibold text-[#6B7280]">
                                        Belum ada anggota yang memulai
                                        pelatihan.
                                    </p>
                                </div>
                            )}
                        </div>
                    </section>

                    <aside className="space-y-6">
                        {/* Event Section */}
                        <section className="rounded-2xl border border-[#E4E2E1] bg-white p-5 shadow-sm">
                            <h2 className="font-bold text-[#1B1C1C]">
                                Event Terbaru
                            </h2>
                            <div className="mt-4 space-y-4">
                                {events.length > 0 ? (
                                    events.map((event) => {
                                        const isOnline =
                                            event.jenis_event === 'Online';
                                        const tagColor = isOnline
                                            ? 'bg-[#E5F0E9] text-[#006B32]'
                                            : 'bg-[#FEE2E2] text-[#DC2626]';
                                        const eventTag = isOnline
                                            ? 'Seminar Online'
                                            : 'Workshop Offline';

                                        return (
                                            <div
                                                key={event.id}
                                                className="flex gap-3"
                                            >
                                                {event.image_path ? (
                                                    <img
                                                        src={`/storage/${event.image_path}`}
                                                        alt={event.judul}
                                                        className="h-12 w-12 shrink-0 rounded-lg object-cover"
                                                    />
                                                ) : (
                                                    <div className="h-12 w-12 shrink-0 rounded-lg bg-[#E5F0E9]" />
                                                )}

                                                <div>
                                                    <span
                                                        className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold ${tagColor}`}
                                                    >
                                                        {eventTag}
                                                    </span>
                                                    <p className="mt-1 text-sm font-bold text-[#1B1C1C] line-clamp-1">
                                                        {event.judul}
                                                    </p>
                                                    <p className="text-xs text-[#6B7280]">
                                                        {event.jam || 'TBA'}{' '}
                                                        {isOnline &&
                                                        event.lokasi_link
                                                            ? ` · Live Zoom`
                                                            : ''}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p className="text-sm text-gray-500">
                                        Belum ada event saat ini.
                                    </p>
                                )}
                            </div>
                            <Link
                                href="/event"
                                className="mt-4 block w-full rounded-lg border-2 border-[#006B32] py-2.5 text-center font-bold text-[#006B32] hover:bg-[#006B32]/5"
                            >
                                Lihat Semua Event
                            </Link>
                        </section>

                        {/* Recent Activities Section */}
                        <section className="rounded-2xl border border-[#E4E2E1] bg-white p-5 shadow-sm">
                            <h2 className="text-lg font-bold text-[#1B1C1C]">
                                Aktivitas Terbaru
                            </h2>
                            <div className="mt-4 space-y-4">
                                {/* 2. Cek apakah ada aktivitas, kalau kosong kasih pesan */}
                                {recentActivities.length > 0 ? (
                                    recentActivities.map((activity, index) => (
                                        <div key={index} className="flex gap-3">
                                            <span
                                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                                                    activity.variant === 'done'
                                                        ? 'bg-[#FCE9D8] text-[#FF8928]'
                                                        : 'bg-[#E5F0E9] text-[#006B32]'
                                                }`}
                                            >
                                                {activity.variant === 'done'
                                                    ? '✓'
                                                    : '+'}
                                            </span>
                                            <div>
                                                <p className="text-sm font-semibold text-[#1B1C1C]">
                                                    {activity.text}
                                                </p>
                                                <p className="text-xs text-[#6B7280]">
                                                    {activity.time}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500">
                                        Belum ada aktivitas dari karyawan.
                                    </p>
                                )}
                            </div>
                        </section>
                    </aside>
                </div>
            </div>
        </InstansiLayout>
    );
}
