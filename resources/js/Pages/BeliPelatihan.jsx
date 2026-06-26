import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link } from '@inertiajs/react';
import { useRef, useState, useEffect } from 'react';

export default function BeliPelatihan({ banners, categories, courses }) {
    const courseScrollRef = useRef(null);
    const bannerScrollRef = useRef(null);

    // State buat filter kategori
    const [activeCategory, setActiveCategory] = useState('Semua Modul');

    // Gabungin 'Semua Modul' sama data kategori dari database
    const categoryList = ['Semua Modul', ...(categories ? categories.map(c => c.nama) : [])];

    // Filter kursus berdasarkan kategori yang lagi diklik
    const filteredCourses = courses ? courses.filter(course => {
        if (activeCategory === 'Semua Modul') return true;
        return course.category && course.category.nama === activeCategory;
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
                <div className="relative group">
                    <div ref={bannerScrollRef} className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] rounded-[24px]">
                        {banners && banners.length > 0 ? (
                            banners.map((banner) => (
                                <div key={banner.id} className="min-w-full shrink-0 snap-center relative h-[280px] md:h-[320px] overflow-hidden">
                                    <img
                                        src={banner.image_path ? `/storage/${banner.image_path.replace(/^public\//, '')}` : "/images/banner-mpp.jpg"}
                                        alt={banner.title}
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-[#008740]/80"></div>

                                    <div className="absolute inset-0 px-8 py-10 lg:px-16 flex flex-col justify-center text-white">
                                        {banner.promo_badge && (
                                            <span className="bg-[#FF8928] text-white text-[10px] font-bold px-2 py-1 rounded w-fit mb-4">
                                                {banner.promo_badge}
                                            </span>
                                        )}
                                        <h1 className="text-3xl md:text-[42px] font-bold leading-tight mb-4 tracking-tight">
                                            {banner.title}
                                        </h1>
                                        <p className="max-w-md text-base md:text-lg leading-relaxed text-white/90 mb-8 line-clamp-2">
                                            {banner.description}
                                        </p>
                                        {banner.button_text && (
                                            <Link href={banner.target_url || '#'} className="w-max rounded-xl bg-[#FF8928] px-8 py-3.5 text-base font-bold text-white shadow-lg transition hover:bg-[#e67a22] active:scale-95">
                                                {banner.button_text}
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="min-w-full shrink-0 relative h-[280px] md:h-[320px] bg-[#008740] flex items-center justify-center text-white rounded-[24px]">
                                <p className="font-bold">Belum ada banner aktif.</p>
                            </div>
                        )}
                    </div>

                    {/* Tombol geser banner manual */}
                    {banners && banners.length > 1 && (
                        <>
                            <button onClick={() => scrollContainerBy(bannerScrollRef, -1)} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                                &lt;
                            </button>
                            <button onClick={() => scrollContainerBy(bannerScrollRef, 1)} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                                &gt;
                            </button>
                        </>
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
                                        <p className="text-sm text-[#6B7280] leading-relaxed mb-6 line-clamp-2">
                                            {course.description ? course.description.replace(/<[^>]*>?/gm, '') : ''}
                                        </p>

                                        <div className="mt-auto mb-6 flex items-center justify-between">
                                            {/* Pakai price BUKAN harga */}
                                            <p className={`text-base font-bold ${course.price == 0 ? 'text-[#008740]' : 'text-[#1B1C1C]'}`}>
                                                {formatRupiah(course.price)}
                                            </p>
                                            <div className="flex items-center gap-1.5 text-xs text-[#1B1C1C]">
                                                <span className="text-[#FF8928]">★</span>
                                                <span className="font-bold">{course.rating_average || '0.0'}</span>
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