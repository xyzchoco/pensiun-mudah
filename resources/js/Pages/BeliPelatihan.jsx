import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link } from '@inertiajs/react';
import { useRef, useState, useEffect } from 'react';

// Strip HTML tags dan batasi panjang teks
const stripHtml = (html, maxLength = 80) => {
    if (!html) return '';
    const plain = html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim();
    return plain.length > maxLength ? plain.slice(0, maxLength).trimEnd() + '...' : plain;
};

export default function BeliPelatihan({ banners, categories, courses }) {
    const courseScrollRef = useRef(null);
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

    // State buat filter kategori
    const [activeCategory, setActiveCategory] = useState('Semua Modul');

    // Gabungin 'Semua Modul' sama data kategori dari database
    const categoryList = ['Semua Modul', ...(categories ? categories.map(c => c.icon) : [])];

    // Filter kursus berdasarkan kategori yang lagi diklik
    const filteredCourses = courses ? courses.filter(course => {
        if (activeCategory === 'Semua Modul') return true;
        return course.category && (course.category.icon === activeCategory || course.category.nama === activeCategory);
    }) : [];

    // Fungsi gampang buat format harga ke Rupiah
    const formatRupiah = (angka) => {
        if (!angka || angka == 0) return 'GRATIS';
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(angka);
    };

    const scrollContainerBy = (containerRef, direction) => {
        const container = containerRef.current;
        if (!container || !container.children[0]) return;
        const scrollAmount = container.children[0].offsetWidth + 24;
        container.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
    };

    return (
        <DashboardLayout title="Beli Pelatihan">
            <Head title="Beli Pelatihan" />

            <div className="flex flex-col gap-8 pb-10">

                {/* --- 1. BANNER SPESIAL KELAS MPP DINAMIS --- */}
                <div
                    className="relative w-full max-w-none h-[280px] md:h-[320px] rounded-3xl overflow-hidden flex items-center bg-[#008740] shadow-lg select-none"
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

                {/* --- 2. HEADER KATEGORI MODUL DINAMIS --- */}
                <section className="space-y-6 mt-4">
                    <div>
                        <h2 className="text-2xl font-bold text-[#1B1C1C]">Pilih Modul Pembelajaran Anda</h2>
                        <p className="mt-2 text-sm text-[#4B5563] leading-relaxed">
                            Temukan keterampilan baru untuk masa pensiun yang lebih bermakna dan produktif.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {categoryList.map((name) => (
                            <button
                                key={name}
                                onClick={() => setActiveCategory(name)}
                                className={`rounded-full px-5 py-2.5 text-sm font-bold transition-colors ${activeCategory === name
                                    ? 'bg-[#006B32] text-white shadow-md'
                                    : 'bg-[#F3F4F6] text-[#4B5563] hover:bg-gray-200'
                                    }`}
                            >
                                {name}
                            </button>
                        ))}
                    </div>
                </section>

                {/* --- 3. SLIDER KARTU KURSUS DINAMIS --- */}
                <section className="relative group">
                    <button
                        onClick={() => scrollContainerBy(courseScrollRef, -1)}
                        className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white border border-[#E4E2E1] shadow-lg items-center justify-center hover:bg-gray-50 text-[#1B1C1C] z-10 transition-transform hover:scale-105 hidden md:flex pointer-events-auto"
                    >
                        <span className="font-bold text-xl">&lt;</span>
                    </button>

                    <div ref={courseScrollRef} className="flex overflow-x-auto gap-6 snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] py-2 px-1">

                        {filteredCourses && filteredCourses.length > 0 ? (
                            filteredCourses.map((course) => (
                                <article key={course.id} className="w-[280px] md:w-[340px] shrink-0 snap-start flex flex-col overflow-hidden rounded-[24px] border border-[#E4E2E1] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                                    <div className="relative h-48 bg-gray-200 shrink-0">
                                        <img
                                            src={course.thumbnail ? `/storage/${course.thumbnail.replace(/^public\//, '')}` : "/images/course-1.png"}
                                            alt={course.title} // <-- Pakai title
                                            className="w-full h-full object-cover"
                                        />
                                        {course.category && (
                                            <span
                                                className="absolute top-4 left-4 inline-flex items-center rounded px-2.5 py-1 text-[10px] font-bold tracking-wider text-white uppercase"
                                                style={{ backgroundColor: course.category.warna_bg_icon || '#008740' }}
                                            >
                                                {course.category.nama}
                                            </span>
                                        )}
                                    </div>

                                    <div className="p-6 flex flex-col flex-grow">
                                        {/* Pakai title BUKAN judul */}
                                        <h3 className="text-[17px] font-bold text-[#1B1C1C] mb-2 leading-snug line-clamp-2" title={course.title}>
                                            {course.title}
                                        </h3>

                                        {/* Pakai description BUKAN deskripsi */}
                                        <p className="text-sm text-[#6B7280] leading-relaxed mb-6">
                                            {stripHtml(course.description) || 'Deskripsi pelatihan belum tersedia.'}
                                        </p>

                                        <div className="mt-auto mb-6 flex items-center justify-between">
                                            {/* Pakai price BUKAN harga */}
                                            <p className={`text-base font-bold ${course.price == 0 ? 'text-[#008740]' : 'text-[#1B1C1C]'}`}>
                                                {formatRupiah(course.price)}
                                            </p>
                                            <div className="flex items-center gap-1.5 text-xs text-[#1B1C1C]">
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
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-3">
                                            <a
                                                href={`/pelatihan/${course.slug || course.id}/pembelian`}
                                                className="relative z-20 inline-flex w-full cursor-pointer items-center justify-center rounded-lg bg-[#FF8928] px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#e67a22] focus:outline-none focus:ring-2 focus:ring-[#FF8928]/30 pointer-events-auto"
                                            >
                                                Beli Pelatihan
                                            </a>
                                            <Link
                                                href={`/pelatihan/${course.slug || course.id}`}
                                                className="relative z-20 inline-flex w-full cursor-pointer items-center justify-center rounded-lg border-2 border-[#006B32] px-4 py-2.5 text-sm font-bold text-[#006B32] transition hover:bg-[#F0FDF4] focus:outline-none focus:ring-2 focus:ring-[#006B32]/30 pointer-events-auto"
                                            >
                                                Lihat Detail
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            ))
                        ) : (
                            <div className="w-full text-center py-12 border-2 border-dashed border-[#E4E2E1] rounded-[24px]">
                                <p className="text-[#6B7280] font-bold">Belum ada pelatihan untuk kategori ini bos.</p>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => scrollContainerBy(courseScrollRef, 1)}
                        className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white border border-[#E4E2E1] shadow-lg items-center justify-center hover:bg-gray-50 text-[#1B1C1C] z-10 transition-transform hover:scale-105 hidden md:flex pointer-events-auto"
                    >
                        <span className="font-bold text-xl">&gt;</span>
                    </button>
                </section>

            </div>
        </DashboardLayout>
    );
}