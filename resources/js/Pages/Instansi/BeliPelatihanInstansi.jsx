import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import InstansiLayout from '@/Layouts/InstansiLayout';

// --- HELPER UTAMA ---
const getClassType = (type) =>
    String(type || '')
        .trim()
        .toLowerCase();

const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(price || 0);
};

// --- HELPER URL (DINAMIS DARI DATABASE) ---
function buildScheduleHref(course, qty) {
    const params = new URLSearchParams();
    params.set('course_id', course.id);
    params.set('qty', qty);

    // Tambahan data jika tersedia dari database
    if (course.location) params.set('location', course.location);
    if (course.time) params.set('time', course.time);

    return `/instansi/pilih-jadwal?${params.toString()}`;
}

function buildOnlinePurchaseHref(course, qty) {
    return `/instansi/pelatihan/${course.slug || course.id}/pembelian-online?qty=${qty}`;
}

function buildHybridPurchaseHref(course, qty) {
    return `/instansi/pelatihan-hybrid/${course.slug || course.id}/pembelian?qty=${qty}`;
}

function buildOfflineDetailHref(course) {
    return `/instansi/pelatihan-offline/${course.slug || course.id}`;
}

function buildOnlineDetailHref(course) {
    return `/instansi/pelatihan/${course.slug || course.id}/detail`;
}

function buildHybridDetailHref(course) {
    return `/instansi/pelatihan-hybrid/${course.slug || course.id}`;
}

// --- KOMPONEN IKON ---
function SectionIcon({ name }) {
    if (name === 'laptop') {
        return (
            <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
            >
                <rect x="4" y="5" width="16" height="11" rx="1" />
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2 20h20"
                />
            </svg>
        );
    }
    if (name === 'people') {
        return (
            <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
            >
                <circle cx="8" cy="9" r="3" />
                <circle cx="17" cy="10" r="2" />
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2 20c0-3 3-5 6-5s6 2 6 5M15 20c0-2 1-3 3-3s3 1 4 3"
                />
            </svg>
        );
    }
    return (
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
                d="M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5M3 17l9 5 9-5"
            />
        </svg>
    );
}

// --- KOMPONEN KARTU KURSUS ---
function CourseCard({ course }) {
    const [qty, setQty] = useState(1);
    const classType = getClassType(course.tipe_kelas);
    const isOfflineClass = classType === 'offline';
    const isOnlineClass = classType === 'online';
    const isHybridClass = classType === 'hybrid';

    const totalPrice = (course.price || 0) * qty;

    const handleBeli = () => {
        router.get(
            route('payment.detail', {
                slug: course.slug || course.id,
                qty: qty,
            }),
        );
    };

    return (
        <div className="flex flex-col overflow-hidden rounded-2xl border border-[#E4E2E1] bg-white shadow-sm">
            {/* THUMBNAIL */}
            <div className="relative flex h-40 items-center justify-center bg-gray-100 overflow-hidden">
                {course.thumbnail ? (
                    <img
                        src={`/storage/${course.thumbnail}`}
                        alt={course.title}
                        className="object-cover w-full h-full"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#3A6B2E] to-[#1F3D17] flex items-center justify-center">
                        <svg
                            className="h-12 w-12 text-white/80"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 21c-4-2-7-5-7-9 4 0 7 3 7 7M12 21c4-2 7-5 7-9-4 0-7 3-7 7M12 21V10"
                            />
                        </svg>
                    </div>
                )}

                {/* LABEL KATEGORI */}
                {course.category && (
                    <span
                        className="absolute left-3 top-3 rounded-md px-2.5 py-1 text-xs font-bold uppercase shadow-md"
                        style={{
                            backgroundColor:
                                course.category.warna_bg_icon || '#C2255C',
                            color: course.category.warna_teks_icon || '#FFFFFF',
                        }}
                    >
                        {course.category.nama}
                    </span>
                )}
            </div>

            {/* KONTEN DETAIL */}
            <div className="flex flex-1 flex-col p-5">
                <h3 className="font-bold text-[#1B1C1C] line-clamp-2">
                    {course.title}
                </h3>
                <p className="mt-1 text-sm text-[#3D4A3E] line-clamp-2">
                    {course.description ||
                        'Deskripsi pelatihan belum tersedia.'}
                </p>

                {/* INFO LOKASI JIKA ADA */}
                {course.location && (
                    <p className="mt-3 flex items-center gap-1.5 text-sm text-[#3D4A3E]">
                        <svg
                            className="h-4 w-4 text-[#006B32] shrink-0"
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
                        <span className="line-clamp-1">{course.location}</span>
                    </p>
                )}

                {/* INFO WAKTU JIKA ADA */}
                {course.time && (
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-[#3D4A3E]">
                        <svg
                            className="h-4 w-4 text-[#006B32] shrink-0"
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
                        {course.time}
                    </p>
                )}

                {/* HARGA & RATING */}
                <div className="mt-3 flex items-center justify-between">
                    <span className="text-lg font-bold text-[#006B32]">
                        {totalPrice === 0 ? 'Gratis' : formatPrice(totalPrice)}
                    </span>
                    <span className="flex items-center gap-1 text-sm font-semibold text-[#A8632A]">
                        <svg
                            className="h-4 w-4"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M12 2l3 6.5 7 .6-5.3 4.6 1.6 6.8L12 17l-6.9 3.5 1.6-6.8L1.4 9.1l7-.6L12 2z" />
                        </svg>
                        {course.rating || '4.9'} ({course.reviews || '120'})
                    </span>
                </div>

                {/* TOMBOL BELI & KUANTITAS */}
                <div className="mt-4 flex items-center gap-3">
                    {isOfflineClass ? (
                        <Link
                            href={buildScheduleHref(course, qty)}
                            className="flex-1 rounded-lg bg-[#FF8928] px-4 py-2.5 text-center text-sm font-bold leading-tight text-white transition-colors hover:bg-[#F57F1E]"
                        >
                            Beli ({qty})
                        </Link>
                    ) : isOnlineClass ? (
                        <Link
                            href={buildOnlinePurchaseHref(course, qty)}
                            className="flex-1 rounded-lg bg-[#FF8928] px-4 py-2.5 text-center text-sm font-bold leading-tight text-white transition-colors hover:bg-[#F57F1E]"
                        >
                            Beli ({qty})
                        </Link>
                    ) : isHybridClass ? (
                        <Link
                            href={buildHybridPurchaseHref(course, qty)}
                            className="flex-1 rounded-lg bg-[#FF8928] px-4 py-2.5 text-center text-sm font-bold leading-tight text-white transition-colors hover:bg-[#F57F1E]"
                        >
                            Beli ({qty})
                        </Link>
                    ) : (
                        <button
                            type="button"
                            onClick={handleBeli}
                            className="flex-1 rounded-lg bg-[#FF8928] px-4 py-2.5 text-sm font-bold leading-tight text-white transition-colors hover:bg-[#F57F1E]"
                        >
                            Beli ({qty})
                        </button>
                    )}

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setQty(Math.max(1, qty - 1))}
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E4E2E1] font-bold text-[#3D4A3E] hover:bg-[#F0EDED]"
                        >
                            -
                        </button>
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FF8928] font-bold text-white">
                            {qty}
                        </span>
                        <button
                            type="button"
                            onClick={() => setQty(qty + 1)}
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E4E2E1] font-bold text-[#3D4A3E] hover:bg-[#F0EDED]"
                        >
                            +
                        </button>
                    </div>
                </div>

                {/* TOMBOL DETAIL KELAS */}
                {isOfflineClass ? (
                    <Link
                        href={buildOfflineDetailHref(course)}
                        className="mt-3 block w-full rounded-lg border-2 border-[#006B32] py-2.5 text-center font-bold text-[#006B32] transition-colors hover:bg-[#006B32]/5"
                    >
                        Lihat Detail
                    </Link>
                ) : isOnlineClass ? (
                    <Link
                        href={buildOnlineDetailHref(course)}
                        className="mt-3 block w-full rounded-lg border-2 border-[#006B32] py-2.5 text-center font-bold text-[#006B32] transition-colors hover:bg-[#006B32]/5"
                    >
                        Lihat Detail
                    </Link>
                ) : isHybridClass ? (
                    <Link
                        href={buildHybridDetailHref(course)}
                        className="mt-3 block w-full rounded-lg border-2 border-[#006B32] py-2.5 text-center font-bold text-[#006B32] transition-colors hover:bg-[#006B32]/5"
                    >
                        Lihat Detail
                    </Link>
                ) : (
                    <Link
                        href={`/instansi/pelatihan/${course.slug || course.id}`}
                        className="mt-3 block w-full rounded-lg border-2 border-[#006B32] py-2.5 text-center font-bold text-[#006B32] transition-colors hover:bg-[#006B32]/5"
                    >
                        Lihat Detail
                    </Link>
                )}
            </div>
        </div>
    );
}

// --- HALAMAN UTAMA ---
export default function BeliPelatihanInstansi({ banners = [], courses = [] }) {
    // PEMISAHAN KURSUS BERDASARKAN TIPE KELAS DINAMIS
    const onlineCourses = courses.filter(
        (c) => getClassType(c.tipe_kelas) === 'online',
    );
    const offlineCourses = courses.filter(
        (c) => getClassType(c.tipe_kelas) === 'offline',
    );
    const hybridCourses = courses.filter(
        (c) => getClassType(c.tipe_kelas) === 'hybrid',
    );

    // KONFIGURASI SECTION RENDER
    const sections = [
        {
            key: 'online',
            label: 'Kelas Online',
            icon: 'laptop',
            courses: onlineCourses,
        },
        {
            key: 'offline',
            label: 'Kelas Offline',
            icon: 'people',
            courses: offlineCourses, // Sekarang full dinamis dari DB
        },
        {
            key: 'hybrid',
            label: 'Kelas Hybrid',
            icon: 'layers',
            courses: hybridCourses, // Sekarang full dinamis dari DB
        },
    ];

    // HANYA TAMPILKAN SECTION YANG ADA ISINYA
    const visibleSections = sections.filter(
        (section) => section.courses.length > 0,
    );

    return (
        <InstansiLayout title="Beli Pelatihan - Pensiun Mudah" activeNav="beli">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-10">
                {/* BANNER DINAMIS */}
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
                                <h2 className="text-3xl font-extrabold sm:text-4xl">
                                    {banner.title || 'Spesial Kelas MPP'}
                                </h2>
                                <p className="mt-2 max-w-md text-white/90">
                                    {banner.description ||
                                        'Voucher Potongan 200rb khusus untuk pendaftaran bulan ini.'}
                                </p>
                                <Link
                                    href={banner.link_url || '#'}
                                    className="mt-6 inline-flex rounded-full bg-[#FF8928] px-6 py-3 font-bold text-white transition-colors hover:bg-[#F57F1E]"
                                >
                                    Gunakan Kode
                                </Link>
                            </div>
                        </section>
                    ))
                ) : (
                    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1B5036] to-[#10251B] px-6 py-10 text-white sm:px-10 sm:py-14 mb-6">
                        <h2 className="text-3xl font-extrabold sm:text-4xl">
                            Spesial Kelas MPP
                        </h2>
                        <p className="mt-2 max-w-md text-white/90">
                            Voucher Potongan 200rb khusus untuk pendaftaran
                            bulan ini.
                        </p>
                        <button
                            type="button"
                            className="mt-6 rounded-full bg-[#FF8928] px-6 py-3 font-bold text-white transition-colors hover:bg-[#F57F1E]"
                        >
                            Gunakan Kode
                        </button>
                    </section>
                )}

                <div className="mt-8">
                    <h1 className="text-2xl font-bold text-[#1B1C1C] sm:text-3xl">
                        Pilih Modul Pembelajaran Anda
                    </h1>
                    <p className="mt-2 text-[#3D4A3E]">
                        Temukan keterampilan baru untuk masa pensiun yang lebih
                        bermakna dan produktif.
                    </p>
                </div>

                {/* RENDER KARTU KURSUS BERDASARKAN KATEGORI */}
                {visibleSections.map((section) => (
                    <section key={section.key} className="mt-8">
                        <h2 className="flex items-center gap-2 text-lg font-bold text-[#1B1C1C]">
                            <span className="text-[#006B32]">
                                <SectionIcon name={section.icon} />
                            </span>
                            {section.label}
                        </h2>
                        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {section.courses.map((course) => (
                                <CourseCard key={course.id} course={course} />
                            ))}
                        </div>
                    </section>
                ))}

                {/* FALLBACK JIKA KOSONG */}
                {visibleSections.length === 0 && (
                    <div className="mt-12 text-center py-10 border-2 border-dashed border-[#E4E2E1] rounded-2xl">
                        <p className="text-[#6B7280] font-semibold text-lg">
                            Belum ada kelas online, offline, atau hybrid yang
                            tersedia saat ini.
                        </p>
                    </div>
                )}
            </div>
        </InstansiLayout>
    );
}
