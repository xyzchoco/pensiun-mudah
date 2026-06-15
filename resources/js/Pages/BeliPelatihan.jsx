import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head } from '@inertiajs/react';
import { useRef } from 'react';

const categories = ['Semua Modul', 'Keuangan', 'Kesehatan', 'Psikologi', 'Kewirausahaan'];

const courses = [
    {
        category: 'Keuangan',
        title: 'Manajemen Investasi Aman untuk Pensiunan',
        description: 'Pelajari cara mengelola aset dan dana pensiun agar tetap terjaga dan berkembang.',
        price: 'Rp 199.000',
        badge: 'KEUANGAN',
        badgeColor: 'bg-[#D95371]',
        rating: '4.9',
        students: '120',
        cta: 'Beli Pelatihan',
        image: '/images/course-1.png', 
    },
    {
        category: 'Kesehatan',
        title: 'Pola Hidup Sehat di Usia 50+',
        description: 'Panduan nutrisi dan aktivitas fisik ringan yang dirancang khusus untuk Anda.',
        price: 'GRATIS',
        badge: 'KESEHATAN',
        badgeColor: 'bg-[#008740]',
        rating: '4.8',
        students: '245',
        cta: 'Daftar Sekarang',
        image: '/images/course-2.png',
    },
    {
        category: 'Bisnis',
        title: 'Membangun UMKM dari Hobi',
        description: 'Ubah hobi menjadi penghasilan tambahan dengan strategi yang tepat dan terarah.',
        price: 'Rp 249.000',
        badge: 'BISNIS',
        badgeColor: 'bg-[#C26B22]',
        rating: '5.0',
        students: '89',
        cta: 'Beli Pelatihan',
        image: '/images/course-3.png',
    },
];

export default function BeliPelatihan() {
    const courseScrollRef = useRef(null);

    const scrollContainerBy = (containerRef, direction) => {
        const container = containerRef.current;
        if (!container || !container.children[0]) return;

        const scrollAmount = container.children[0].offsetWidth + 24; 
        container.scrollBy({
            left: direction * scrollAmount,
            behavior: 'smooth',
        });
    };

    return (
        <DashboardLayout title="Beli Pelatihan">
            <Head title="Beli Pelatihan" />

            <div className="flex flex-col gap-8 pb-10">
                
                {/* --- BANNER SPESIAL KELAS MPP (SWIPE MODE) --- */}
                <div className="relative">
                    {/* Container Banner dengan Snap Scroll */}
                    <div className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] rounded-[24px]">
                        {[1, 2, 3].map((item) => (
                            <div key={item} className="min-w-full shrink-0 snap-center relative h-[280px] md:h-[320px] overflow-hidden">
                                {/* Foto Background */}
                                <img 
                                    src="/images/banner-mpp.jpg" 
                                    alt="Spesial Kelas MPP" 
                                    className="absolute inset-0 w-full h-full object-cover" 
                                />
                                {/* Overlay Hijau Emerald sesuai Gambar */}
                                <div className="absolute inset-0 bg-[#008740]/80"></div>
                                
                                {/* Konten Teks */}
                                <div className="absolute inset-0 px-8 py-10 lg:px-16 flex flex-col justify-center text-white">
                                    <h1 className="text-3xl md:text-[42px] font-bold leading-tight mb-4 tracking-tight">
                                        Spesial Kelas MPP
                                    </h1>
                                    <p className="max-w-md text-base md:text-lg leading-relaxed text-white/90 mb-8">
                                        Voucher Potongan 200rb khusus untuk pendaftaran bulan ini.
                                    </p>
                                    <button className="w-max rounded-xl bg-[#FF8928] px-8 py-3.5 text-base font-bold text-white shadow-lg transition hover:bg-[#e67a22] active:scale-95">
                                        Gunakan Kode
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Indikator Titik (Dots) di dalam Banner */}
                    <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
                        <div className="w-6 h-1.5 rounded-full bg-white"></div>
                        <div className="w-2 h-1.5 rounded-full bg-white/40"></div>
                        <div className="w-2 h-1.5 rounded-full bg-white/40"></div>
                    </div>
                </div>

                {/* --- HEADER KATEGORI MODUL --- */}
                <section className="space-y-6 mt-4">
                    <div>
                        <h2 className="text-2xl font-bold text-[#1B1C1C]">Pilih Modul Pembelajaran Anda</h2>
                        <p className="mt-2 text-sm text-[#4B5563] leading-relaxed">
                            Temukan keterampilan baru untuk masa pensiun yang lebih bermakna dan produktif.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {categories.map((name, index) => {
                            const isActive = index === 0; 
                            return (
                                <button 
                                    key={name} 
                                    className={`rounded-full px-5 py-2.5 text-sm font-bold transition-colors ${
                                        isActive 
                                            ? 'bg-[#006B32] text-white' 
                                            : 'bg-[#F3F4F6] text-[#4B5563] hover:bg-gray-200'
                                    }`}
                                >
                                    {name}
                                </button>
                            );
                        })}
                    </div>
                </section>

                {/* --- SLIDER KARTU KURSUS DENGAN TOMBOL PANAH --- */}
                <section className="relative group">
                    {/* Tombol Geser Kiri */}
                    <button 
                        onClick={() => scrollContainerBy(courseScrollRef, -1)}
                        className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white border border-[#E4E2E1] shadow-lg flex items-center justify-center hover:bg-gray-50 text-[#1B1C1C] z-10 transition-transform hover:scale-105 hidden md:flex"
                    >
                        <span className="font-bold text-xl">&lt;</span>
                    </button>

                    {/* Container Kartu Kursus */}
                    <div ref={courseScrollRef} className="flex overflow-x-auto gap-6 snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] py-2 px-1">
                        {courses.map((course, idx) => (
                            <article key={idx} className="w-[280px] md:w-[340px] shrink-0 snap-start flex flex-col overflow-hidden rounded-[24px] border border-[#E4E2E1] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                                
                                <div className="relative h-48 bg-gray-200 shrink-0">
                                    <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                                    <span className={`absolute top-4 left-4 inline-flex items-center rounded px-2.5 py-1 text-[10px] font-bold tracking-wider text-white ${course.badgeColor}`}>
                                        {course.badge}
                                    </span>
                                </div>

                                <div className="p-6 flex flex-col flex-grow">
                                    <h3 className="text-[17px] font-bold text-[#1B1C1C] mb-2 leading-snug">{course.title}</h3>
                                    <p className="text-sm text-[#6B7280] leading-relaxed mb-6 line-clamp-2">{course.description}</p>
                                    
                                    <div className="mt-auto mb-6 flex items-center justify-between">
                                        <p className={`text-base font-bold ${course.price === 'GRATIS' ? 'text-[#008740]' : 'text-[#1B1C1C]'}`}>
                                            {course.price}
                                        </p>
                                        <div className="flex items-center gap-1.5 text-xs text-[#1B1C1C]">
                                            <span className="text-[#FF8928]">★</span>
                                            <span className="font-bold">{course.rating}</span>
                                            <span className="text-[#6B7280]">({course.students})</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <button className="w-full rounded-lg bg-[#FF8928] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#e67a22]">
                                            {course.cta}
                                        </button>
                                        <button className="w-full rounded-lg border-2 border-[#006B32] px-4 py-2.5 text-sm font-bold text-[#006B32] transition hover:bg-[#F0FDF4]">
                                            Lihat Detail
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>

                    {/* Tombol Geser Kanan */}
                    <button 
                        onClick={() => scrollContainerBy(courseScrollRef, 1)}
                        className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white border border-[#E4E2E1] shadow-lg flex items-center justify-center hover:bg-gray-50 text-[#1B1C1C] z-10 transition-transform hover:scale-105 hidden md:flex"
                    >
                        <span className="font-bold text-xl">&gt;</span>
                    </button>
                </section>

                {/* --- TOMBOL TAMPILKAN LEBIH BANYAK --- */}
                <div className="flex justify-center mt-4">
                    <button className="flex items-center gap-2 rounded-lg border border-[#D1D5DB] bg-white px-6 py-3 text-sm font-bold text-[#4B5563] shadow-sm transition hover:bg-gray-50">
                        Tampilkan Lebih Banyak
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                </div>
            </div>
        </DashboardLayout>
    );
}