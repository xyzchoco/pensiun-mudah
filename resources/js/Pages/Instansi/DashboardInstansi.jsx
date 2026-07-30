import { useState, useEffect } from 'react';
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

function getProgressColor(percent) {
    if (percent >= 80) return { bar: 'bg-[#00A553]', text: 'text-[#00A553]' };
    if (percent >= 40) return { bar: 'bg-[#FF8928]', text: 'text-[#FF8928]' };
    return { bar: 'bg-[#A8632A]', text: 'text-[#A8632A]' };
}

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

export default function DashboardInstansi({
    banners = [],
    events = [],
    purchasedCourses = [],
    recentActivities = [],
    memberProgressData = [],
}) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);

    useEffect(() => {
        if (!banners || banners.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [banners]);

    const handleTouchStart = (e) => {
        setTouchStart(e.targetTouches[0].clientX);
        setTouchEnd(null);
    };

    const handleTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        if (distance > 50) {
            setCurrentIndex((prev) => (prev + 1) % banners.length);
        } else if (distance < -50) {
            setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
        }
    };

    return (
        <InstansiLayout
            title="Dashboard HRD - Pensiun Mudah"
            activeNav="dashboard"
            searchPlaceholder="Cari anggota..."
        >
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-10">
                {/* Banner Section */}
                <div
                    className="relative w-full max-w-none h-[280px] md:h-[320px] rounded-3xl overflow-hidden flex items-center bg-[#008740] shadow-lg mb-6 select-none"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    {banners.length > 0 ? (
                        banners.map((banner, index) => (
                            <div
                                key={banner.id}
                                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out flex items-center ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                            >
                                <div
                                    className="absolute inset-0 bg-cover bg-center"
                                    style={{
                                        backgroundImage: banner.image_path
                                            ? `url('/storage/${banner.image_path.replace(/^public\//, '')}')`
                                            : "url('/images/banner-mpp.jpg')",
                                    }}
                                />
                                <div className="absolute inset-0 bg-[#008740]/80" />

                                <div className="relative z-20 px-8 py-10 lg:px-16 flex flex-col justify-center items-start text-white">
                                    {banner.promo_badge && (
                                        <span className="bg-[#FF8928] text-white text-[10px] font-bold px-2 py-1 rounded w-fit mb-4">
                                            {banner.promo_badge}
                                        </span>
                                    )}

                                    <h2 className="text-3xl md:text-[42px] font-bold leading-tight mb-4 tracking-tight font-['Public_Sans']">
                                        {banner.title}
                                    </h2>

                                    <p className="max-w-md text-base md:text-lg leading-relaxed text-white/90 mb-8 line-clamp-2 font-['Atkinson_Hyperlegible']">
                                        {banner.description}
                                    </p>

                                    {banner.button_text ? (
                                        <Link
                                            href={banner.target_url || '/instansi/beli-pelatihan'}
                                            className="w-max rounded-xl bg-[#FF8928] px-8 py-3.5 text-base font-bold text-white shadow-lg transition hover:bg-[#e67a22] active:scale-95 font-['Public_Sans']"
                                        >
                                            {banner.button_text}
                                        </Link>
                                    ) : (
                                        <Link
                                            href="/instansi/beli-pelatihan"
                                            className="w-max rounded-xl bg-[#FF8928] px-8 py-3.5 text-base font-bold text-white shadow-lg transition hover:bg-[#e67a22] active:scale-95 font-['Public_Sans']"
                                        >
                                            Gunakan Kode
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-white z-10 px-10">
                            <p className="font-bold">Belum ada banner aktif.</p>
                        </div>
                    )}

                    {/* Banner Indicators */}
                    {banners.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-30 items-center">
                            {banners.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`transition-all duration-300 rounded-full ${index === currentIndex
                                        ? 'w-8 h-1.5 bg-white'
                                        : 'w-2 h-2 bg-white/40 hover:bg-white/80'
                                        }`}
                                />
                            ))}
                        </div>
                    )}
                </div>

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
                                href={`/instansi/modul/${course.slug ||
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
                    {/* [DATA] Progres belajar anggota terbaru — maks 4 */}
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
                                memberProgressData.slice(0, 4).map((data, index) => {
                                    const color = getProgressColor(data.progress);
                                    return (
                                        <div
                                            key={index}
                                            className="flex items-center gap-4 py-3"
                                        >
                                            <div className="flex w-52 shrink-0 items-center gap-3">
                                                {/* [DATA] Foto profil anggota — member.photo (URL penuh, fallback inisial) */}
                                                {data.photo ? (
                                                    <img src={data.photo} alt={data.name} className="h-9 w-9 shrink-0 rounded-full object-cover" />
                                                ) : (
                                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#006B32] text-xs font-bold text-white">
                                                        {getInitials(data.name)}
                                                    </span>
                                                )}
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
                                                        className={`h-2.5 rounded-full ${color.bar}`}
                                                        style={{
                                                            width: `${data.progress}%`,
                                                        }}
                                                    />
                                                </div>
                                                <span
                                                    className={`w-12 text-right font-bold ${color.text}`}
                                                >
                                                    {data.progress}%
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })
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

                        {/* [DATA] Aktivitas terbaru — maks 4, dari voucher_redemptions (scoped corporate_user_id) */}
                        <section className="rounded-2xl border border-[#E4E2E1] bg-white p-5 shadow-sm">
                            <h2 className="text-lg font-bold text-[#1B1C1C]">
                                Aktivitas Terbaru
                            </h2>
                            <div className="mt-4 space-y-4">
                                {recentActivities.length > 0 ? (
                                    recentActivities.slice(0, 4).map((activity, index) => (
                                        <div key={index} className="flex gap-3">
                                            <span
                                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${activity.variant === 'done'
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
                                        Belum ada aktivitas terbaru.
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
