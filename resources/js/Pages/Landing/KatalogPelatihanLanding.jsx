import { useState, useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import LandingHeader from '@/Components/Landing/LandingHeader';
import Footer from '@/Components/Footer';

const ITEMS_PER_PAGE = 6;

export default function KatalogPelatihan({ backHref = '/', categories = [], courses = [], banners = [] }) {
    const { auth } = usePage().props;
    const [selectedCategory, setSelectedCategory] = useState('Semua Modul');
    const [currentPage, setCurrentPage] = useState(1);
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

    const categoryList = ['Semua Modul', ...categories.map(c => c.icon)];

    const filteredCourses = selectedCategory === 'Semua Modul'
        ? courses
        : courses.filter(course => course.category === selectedCategory);

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        setCurrentPage(1);
    };

    const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE) || 1;
    const paginatedCourses = filteredCourses.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div className="flex min-h-screen flex-col bg-[#FBF9F8] font-['Atkinson_Hyperlegible']">
            <Head title="Katalog Pelatihan - Pensiun Mudah" />
            <LandingHeader loginHref="/login" registerHref="/register" />

            <main className="flex-1">
                <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-10">
                    <Link
                        href="/"
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
                        Kembali ke Halaman Awal
                    </Link>

                    <div
                        className="relative mt-6 w-full max-w-none h-[280px] md:h-[320px] rounded-3xl overflow-hidden flex items-center bg-[#008740] shadow-lg select-none"
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

                                        {banner.button_text && (
                                            <Link
                                                href={banner.target_url || '#'}
                                                className="w-max rounded-xl bg-[#FF8928] px-8 py-3.5 text-base font-bold text-white shadow-lg transition hover:bg-[#e67a22] active:scale-95 font-['Public_Sans']"
                                            >
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

                    <h1 className="mt-10 text-3xl font-bold text-[#1B1C1C]">
                        Katalog Pelatihan
                    </h1>
                    <p className="mt-3 max-w-2xl text-[#3D4A3E]">
                        Temukan berbagai program pelatihan yang dirancang khusus
                        untuk mempersiapkan masa pensiun Anda dengan lebih
                        percaya diri, produktif, dan bermakna.
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">
                        {categoryList.map((category) => {
                            const active = selectedCategory === category;
                            return (
                                <button
                                    key={category}
                                    type="button"
                                    onClick={() => handleCategorySelect(category)}
                                    className={`rounded-full px-5 py-2.5 text-sm font-bold transition-colors ${active ? 'bg-[#006B32] text-white' : 'bg-[#F0EDED] text-[#3D4A3E] hover:bg-[#E4E2E1]'}`}
                                >
                                    {category}
                                </button>
                            );
                        })}
                    </div>

                    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {paginatedCourses.length > 0 ? (
                            paginatedCourses.map((course) => (
                                <div
                                    key={course.id}
                                    className="flex flex-col overflow-hidden rounded-2xl border border-[#E4E2E1] bg-white shadow-sm transition hover:shadow-md"
                                >
                                    <div className="relative h-44 bg-gradient-to-br from-[#1B3326] to-[#0C1A12] overflow-hidden">
                                        {course.thumbnail ? (
                                            <img
                                                src={course.thumbnail}
                                                className="w-full h-full object-cover"
                                                alt={course.title}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-white/20 font-bold text-sm">
                                                Pensiun Mudah
                                            </div>
                                        )}
                                        <span
                                            className="absolute left-3 top-3 rounded-md px-3 py-1 text-xs font-bold"
                                            style={{
                                                backgroundColor: course.category_bg,
                                                color: course.category_warna,
                                            }}
                                        >
                                            {course.category}
                                        </span>
                                    </div>
                                    <div className="flex flex-1 flex-col p-5">
                                        <h3 className="font-bold leading-snug text-[#1B1C1C] line-clamp-2" title={course.title}>
                                            {course.title}
                                        </h3>
                                        <p className="mt-2 flex-1 text-sm text-[#3D4A3E] line-clamp-3">
                                            {course.desc}
                                        </p>
                                        <div className="mt-4 flex items-center justify-between">
                                            <span className="font-bold text-[#006B32]">
                                                {course.isFree
                                                    ? 'GRATIS'
                                                    : course.price}
                                            </span>
                                            <span className="flex items-center gap-1 text-sm text-[#3D4A3E]">
                                                <svg
                                                    className="h-4 w-4 text-[#FF8928]"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path d="M10 1.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L10 15.9 4.7 17.6l1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
                                                </svg>
                                                {course.rating} ({course.reviews})
                                            </span>
                                        </div>
                                        {auth?.user ? (
                                            <Link
                                                href={course.daftar_href || `/pelatihan/${course.slug}`}
                                                className="mt-4 block w-full rounded-lg bg-[#FF8928] py-3 font-bold text-white text-center transition-colors hover:bg-[#F57F1E]"
                                            >
                                                Daftar Sekarang
                                            </Link>
                                        ) : (
                                            <Link
                                                href="/login"
                                                className="mt-4 block w-full rounded-lg bg-[#FF8928] py-3 font-bold text-white text-center transition-colors hover:bg-[#F57F1E]"
                                            >
                                                Daftar Sekarang
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-12 text-center">
                                <p className="text-sm font-medium text-[#6B7280]">
                                    Belum ada pelatihan untuk kategori ini.
                                </p>
                            </div>
                        )}
                    </div>

                    {totalPages > 1 && (
                        <div className="mt-10 flex items-center justify-center gap-2">
                            <button
                                type="button"
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#E4E2E1] text-[#3D4A3E] transition-colors hover:bg-[#F0EDED] disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label="Halaman sebelumnya"
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
                                        d="M15 19l-7-7 7-7"
                                    />
                                </svg>
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    type="button"
                                    onClick={() => setCurrentPage(page)}
                                    className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold transition-colors ${page === currentPage ? 'bg-[#006B32] text-white' : 'border border-[#E4E2E1] text-[#3D4A3E] hover:bg-[#F0EDED]'}`}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                type="button"
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#E4E2E1] text-[#3D4A3E] transition-colors hover:bg-[#F0EDED] disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label="Halaman berikutnya"
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
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
