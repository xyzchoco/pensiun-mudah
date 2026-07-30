import { useState, useRef, useEffect } from 'react';
import { Link, router } from '@inertiajs/react';
import InstansiLayout from '@/Layouts/InstansiLayout';

// --- HELPER UTAMA ---
const getClassType = (type) =>
    String(type || '')
        .trim()
        .toLowerCase();

const scrollContainerBy = (containerRef, direction) => {
    const container = containerRef.current;
    if (!container || !container.children[0]) return;
    const scrollAmount = container.children[0].offsetWidth + 24;
    container.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
};

const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(price || 0);
};

const stripHtml = (html, maxLength = 80) => {
    if (!html) return '';
    const plain = html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim();
    return plain.length > maxLength ? plain.slice(0, maxLength).trimEnd() + '...' : plain;
};

// --- HELPER URL (DINAMIS DARI DATABASE) ---
function buildScheduleHref(course, qty) {
    return route('instansi.pilih-jadwal', { course: course.slug, qty });
}

function buildOnlinePurchaseHref(course, qty) {
    return route('instansi.pelatihan.pembelian-online', { slug: course.slug, qty });
}

function buildHybridPurchaseHref(course, qty) {
    return route('instansi.pelatihan-hybrid.pembelian', { slug: course.slug, qty });
}

function buildOfflineDetailHref(course) {
    return route('instansi.pelatihan-offline.detail', { slug: course.slug });
}

function buildOnlineDetailHref(course) {
    return route('instansi.pelatihan.detail-kelas', { slug: course.slug });
}

function buildHybridDetailHref(course) {
    return route('instansi.pelatihan-hybrid.detail', { slug: course.slug });
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
                <p className="mt-1 text-sm text-[#3D4A3E]">
                    {stripHtml(course.description) ||
                        'Deskripsi pelatihan belum tersedia.'}
                </p>

                {/* INFO LOKASI JIKA ADA */}
                {(course.lokasi_default || course.location) && (
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
                        <span className="line-clamp-1">{course.lokasi_default || course.location}</span>
                    </p>
                )}

                {/* INFO WAKTU JIKA ADA */}
                {(course.jadwal_default || course.time) && (
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
                        {course.jadwal_default || course.time}
                    </p>
                )}

                {/* HARGA & RATING */}
                <div className="mt-3 flex items-center justify-between">
                    <span className="text-lg font-bold text-[#006B32]">
                        {totalPrice === 0 ? 'Gratis' : formatPrice(totalPrice)}
                    </span>
                    <span className="flex items-center gap-1 text-sm font-semibold text-[#A8632A]">
                        <div className="flex items-center gap-1 text-[#FF8928]">
                            {[...Array(5)].map((_, index) => {
                                const starFill = index < Math.round(Number(course.rating_average) || 0) ? "currentColor" : "none";
                                const strokeClass = index < Math.round(Number(course.rating_average) || 0) ? "" : "text-[#6D7B6D]/30";
                                return (
                                    <svg
                                        key={index}
                                        className={`w-3 h-3 ${strokeClass}`}
                                        fill={starFill}
                                        stroke="currentColor"
                                        strokeWidth={index < Math.round(course.rating_average || 0) ? 0 : 1.5}
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.05 2.93c.3-.92 1.6-.92 1.9 0l1.36 4.18a1 1 0 00.95.69h4.4c.97 0 1.37 1.24.59 1.81l-3.56 2.59a1 1 0 00-.36 1.12l1.36 4.18c.3.92-.75 1.69-1.54 1.12l-3.56-2.59a1 1 0 00-1.18 0l-3.56 2.59c-.79.57-1.84-.2-1.54-1.12l1.36-4.18a1 1 0 00-.36-1.12L1.4 9.6c-.78-.57-.38-1.81.59-1.81h4.4a1 1 0 00.95-.69l1.36-4.18z" />
                                    </svg>
                                );
                            })}
                        </div>
                        <span className="font-bold">{course.rating_average ? course.rating_average.toFixed(1) : '0.0'}</span>
                        <span className="text-[#6B7280]">({course.total_reviewer || 0})</span>
                    </span>
                </div>

                <div className="mt-4 flex items-center gap-3">
                    {isOfflineClass ? (
                        <Link href={buildScheduleHref(course, qty)} className="flex-1 rounded-lg bg-[#FF8928] px-4 py-2.5 text-center text-sm font-bold leading-tight text-white transition-colors hover:bg-[#F57F1E]">
                            Beli ({qty})
                        </Link>
                    ) : isOnlineClass ? (
                        <Link href={buildOnlinePurchaseHref(course, qty)} className="flex-1 rounded-lg bg-[#FF8928] px-4 py-2.5 text-center text-sm font-bold leading-tight text-white transition-colors hover:bg-[#F57F1E]">
                            Beli ({qty})
                        </Link>
                    ) : isHybridClass ? (
                        <Link href={buildHybridPurchaseHref(course, qty)} className="flex-1 rounded-lg bg-[#FF8928] px-4 py-2.5 text-center text-sm font-bold leading-tight text-white transition-colors hover:bg-[#F57F1E]">
                            Beli ({qty})
                        </Link>
                    ) : (
                        <button type="button" onClick={handleBeli} className="flex-1 rounded-lg bg-[#FF8928] px-4 py-2.5 text-sm font-bold leading-tight text-white transition-colors hover:bg-[#F57F1E]">
                            Beli ({qty})
                        </button>
                    )}

                    <div className="flex items-center gap-2">
                        <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E4E2E1] font-bold text-[#3D4A3E] hover:bg-[#F0EDED]">
                            -
                        </button>
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FF8928] font-bold text-white">
                            {qty}
                        </span>
                        <button type="button" onClick={() => setQty(qty + 1)} className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E4E2E1] font-bold text-[#3D4A3E] hover:bg-[#F0EDED]">
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
                        href={route('instansi.pelatihan.detail', { course: course.slug })}
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
            courses: offlineCourses,
        },
        {
            key: 'hybrid',
            label: 'Kelas Hybrid',
            icon: 'layers',
            courses: hybridCourses,
        },
    ];

    // HANYA TAMPILKAN SECTION YANG ADA ISINYA
    const visibleSections = sections.filter(
        (section) => section.courses.length > 0,
    );

    return (
        <InstansiLayout title="Beli Pelatihan - Pensiun Mudah" activeNav="beli">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-10">
                {/* BANNER SPESIAL KELAS MPP DINAMIS */}
                <div
                    className="relative w-full max-w-none h-[280px] md:h-[320px] rounded-3xl overflow-hidden flex items-center bg-[#008740] shadow-lg mb-6 select-none"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    {banners && banners.length > 0 ? (
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
                                    <h1 className="text-3xl md:text-[42px] font-bold leading-tight mb-4 tracking-tight font-['Public_Sans']">
                                        {banner.title}
                                    </h1>
                                    <p className="max-w-md text-base md:text-lg leading-relaxed text-white/90 mb-8 line-clamp-2 font-['Atkinson_Hyperlegible']">
                                        {banner.description}
                                    </p>
                                    {banner.button_text && (
                                        <Link href={banner.target_url || banner.link_url || '#'} className="w-max rounded-xl bg-[#FF8928] px-8 py-3.5 text-base font-bold text-white shadow-lg transition hover:bg-[#e67a22] active:scale-95 font-['Public_Sans']">
                                            {banner.button_text}
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
                    {banners && banners.length > 1 && (
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
