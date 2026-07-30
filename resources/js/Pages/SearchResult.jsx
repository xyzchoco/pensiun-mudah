import { useState, useRef } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';

const stripHtml = (html, maxLength = 80) => {
    if (!html) return '';
    const plain = html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>').trim();
    return plain.length > maxLength ? plain.slice(0, maxLength).trimEnd() + '...' : plain;
};

const formatRupiah = (angka) => {
    if (!angka || angka == 0) return 'GRATIS';
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(angka);
};

export default function SearchResult({ query, courses }) {
    const [searchInput, setSearchInput] = useState(query || '');

    const handleSearch = (e) => {
        e.preventDefault();
        const q = searchInput.trim();
        if (!q) return;
        router.get('/search', { q });
    };

    return (
        <DashboardLayout title={`Hasil Pencarian: "${query}"`}>
            <Head title={`Pencarian: ${query} - Pensiun Mudah`} />

            <div className="flex flex-col gap-8 pb-10">
                {/* Search Bar */}
                <form onSubmit={handleSearch} className="relative w-full max-w-2xl">
                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#3D4A3E]/60" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Cari kursus, konsultan, webinar..."
                        className="w-full pl-12 pr-4 py-3 bg-[#F0EDED] rounded-xl text-sm font-['Atkinson_Hyperlegible'] text-[#1B1C1C] outline-none focus:ring-2 focus:ring-[#006B32]/30"
                    />
                </form>

                {/* Hasil Pencarian */}
                <div>
                    <h2 className="text-lg font-bold text-[#1B1C1C] mb-4">
                        {courses.length > 0
                            ? `Ditemukan ${courses.length} pelatihan untuk "${query}"`
                            : `Tidak ditemukan pelatihan untuk "${query}"`
                        }
                    </h2>

                    {courses.length > 0 ? (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {courses.map((course) => (
                                <article key={course.id} className="flex flex-col overflow-hidden rounded-[24px] border border-[#E4E2E1] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                                    <div className="relative h-44 bg-gray-200 shrink-0">
                                        <img
                                            src={course.thumbnail ? `/storage/${course.thumbnail.replace(/^public\//, '')}` : "/images/course-1.png"}
                                            alt={course.title}
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

                                    <div className="p-5 flex flex-col flex-grow">
                                        <h3 className="text-[15px] font-bold text-[#1B1C1C] mb-2 leading-snug line-clamp-2" title={course.title}>
                                            {course.title}
                                        </h3>

                                        <p className="text-sm text-[#6B7280] leading-relaxed mb-4 line-clamp-2">
                                            {stripHtml(course.description) || 'Deskripsi pelatihan belum tersedia.'}
                                        </p>

                                        <div className="mt-auto mb-4 flex items-center justify-between">
                                            <p className={`text-base font-bold ${course.price == 0 ? 'text-[#008740]' : 'text-[#1B1C1C]'}`}>
                                                {formatRupiah(course.price)}
                                            </p>
                                            <div className="flex items-center gap-1 text-xs text-[#1B1C1C]">
                                                <div className="flex items-center gap-1 text-[#FF8928]">
                                                    {[...Array(5)].map((_, index) => {
                                                        const starFill = index < Math.round(Number(course.rating_average) || 0) ? "currentColor" : "none";
                                                        const strokeClass = index < Math.round(Number(course.rating_average) || 0) ? "" : "text-[#6D7B6D]/30";
                                                        return (
                                                            <svg key={index} className={`w-3 h-3 ${strokeClass}`} fill={starFill} stroke="currentColor" strokeWidth={index < Math.round(course.rating_average || 0) ? 0 : 1.5} viewBox="0 0 20 20">
                                                                <path d="M9.05 2.93c.3-.92 1.6-.92 1.9 0l1.36 4.18a1 1 0 00.95.69h4.4c.97 0 1.37 1.24.59 1.81l-3.56 2.59a1 1 0 00-.36 1.12l1.36 4.18c.3.92-.75 1.69-1.54 1.12l-3.56-2.59a1 1 0 00-1.18 0l-3.56 2.59c-.79.57-1.84-.2-1.54-1.12l1.36-4.18a1 1 0 00-.36-1.12L1.4 9.6c-.78-.57-.38-1.81.59-1.81h4.4a1 1 0 00.95-.69l1.36-4.18z" />
                                                            </svg>
                                                        );
                                                    })}
                                                </div>
                                                <span className="font-bold">{course.rating_average ? course.rating_average.toFixed(1) : '0.0'}</span>
                                                <span className="text-[#6B7280]">({course.total_reviewer || 0})</span>
                                            </div>
                                        </div>

                                        <Link
                                            href={`/pelatihan/${course.slug || course.id}/pembelian`}
                                            className="inline-flex w-full items-center justify-center rounded-lg bg-[#FF8928] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#e67a22]"
                                        >
                                            Beli Pelatihan
                                        </Link>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="w-full text-center py-16 border-2 border-dashed border-[#E4E2E1] rounded-[24px]">
                            <p className="text-[#6B7280] font-bold text-lg">Hasil tidak ditemukan</p>
                            <p className="text-[#9CA3AF] mt-2">Coba gunakan kata kunci lain untuk mencari pelatihan.</p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}