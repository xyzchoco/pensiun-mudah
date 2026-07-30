import { useRef } from 'react';
import MainLayout from '../Layouts/MainLayout';
import { Link } from '@inertiajs/react';

const formatEventDate = (date) => {
    if (!date) return '-';
    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) return date;
    return parsedDate.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
};

// Pastikan props 'landing' masuk di sini
export default function Beranda({ landing, events, categories, reviews }) {
    const eventScrollRef = useRef(null);
    const kategoriScrollRef = useRef(null);
    const mppScrollRef = useRef(null);

    const scrollContainerBy = (containerRef, direction) => {
        const container = containerRef.current;
        if (!container || !container.children[0]) return;
        const firstCard = container.children[0];
        const scrollAmount = firstCard.offsetWidth + 24;
        container.scrollBy({
            left: direction * scrollAmount,
            behavior: 'smooth',
        });
    };

    return (
        <MainLayout>
            {/* --- HERO SECTION (Udah Disambungin ke Database) --- */}
            <section className="bg-white pt-14 pb-12 relative overflow-hidden flex justify-center">
                <div className="max-w-[1200px] w-full px-6 md:px-10 flex flex-col md:flex-row items-center relative z-10">
                    <div className="flex flex-col gap-6 md:w-1/2 justify-center pt-10">
                        {/* 1. HERO BADGE (Muncul kalau diisi di Admin) */}
                        {landing?.hero_badge && (
                            <span className="bg-[#E8F5E9] text-[#008740] text-sm font-bold px-4 py-1 rounded-full w-max border border-[#008740]/20">
                                {landing.hero_badge}
                            </span>
                        )}
                        {/* 2. HERO TITLE (Ambil dari DB, kalau kosong pakai default) */}
                        <h1
                            className="font-['Public_Sans'] font-bold text-4xl md:text-5xl lg:text-[56px] leading-[1.1] text-[#1B1C1C] tracking-tight max-w-[550px]"
                            dangerouslySetInnerHTML={{
                                __html:
                                    landing?.hero_title ||
                                    'Persiapkan Masa Pensiun Anda dengan <span class="text-[#008740]">PENSIUN</span> <span class="text-[#FF8928]">MUDAH</span>',
                            }}
                        />
                        {/* 3. HERO SUBTITLE */}
                        <p className="font-['Atkinson_Hyperlegible'] text-[#3D4A3E] text-lg md:text-xl leading-[32px] max-w-[500px]">
                            {landing?.hero_subtitle ||
                                'Memberdayakan profesional berpengalaman untuk transisi ke babak kehidupan berikutnya dengan percaya diri, stabilitas keuangan, dan tujuan yang bermakna.'}
                        </p>
                        <div className="mt-4">
                            {/* 4. BUTTON TEXT & URL */}
                            <Link
                                href={landing?.hero_button_url || '/register'}
                                className="bg-[#FF8928] hover:bg-[#e67a22] text-white font-['Atkinson_Hyperlegible'] font-bold text-lg px-8 py-4 rounded-lg shadow-sm inline-block transition-all"
                            >
                                {landing?.hero_button_text || 'Mulai Sekarang'}
                            </Link>
                        </div>
                    </div>
                    <div className="md:w-1/2 relative mt-12 md:mt-0 flex justify-end">
                        <div className="w-full max-w-[500px] aspect-square rounded-[24px] overflow-hidden relative shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)]">
                            {/* 5. HERO IMAGE (Cek DB dulu, kalau gada panggil gambar default di public/images) */}
                            <img
                                src={
                                    landing?.hero_image_path
                                        ? `/storage/${landing.hero_image_path}`
                                        : '/images/hero-image.png'
                                }
                                alt="Hero Pensiun Mudah"
                                className="w-full h-full object-cover bg-gray-200"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* --- LAYANAN KAMI SECTION --- */}
            <section className="bg-white py-12 flex justify-center">
                <div className="max-w-[1200px] w-full px-6 md:px-10 flex flex-col items-center">
                    <h2 className="font-['Public_Sans'] font-bold text-3xl text-[#1B1C1C] mb-2">
                        Layanan Kami
                    </h2>
                    <p className="font-['Atkinson_Hyperlegible'] text-[#3D4A3E] mb-12 text-center">
                        Solusi komprehensif untuk pertumbuhan masa pensiun Anda
                    </p>
                    <div className="flex flex-col md:flex-row gap-6 w-full">
                        <div className="flex-1 bg-white border border-[#E4E2E1] rounded-2xl p-8 flex flex-col md:flex-row gap-8 items-center">
                            <div className="flex-1 flex flex-col items-start">
                                <div className="w-12 h-12 mb-4 flex items-center justify-center bg-white rounded-full shadow-sm">
                                    <svg
                                        className="w-6 h-6 text-[#008740]"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M22 10L12 5 2 10l10 5 10-5z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M6 12v5c0 1 3 3 6 3s6-2 6-3v-5"
                                        />
                                    </svg>
                                </div>
                                <h3 className="font-['Public_Sans'] font-bold text-xl text-[#1B1C1C] mb-3">
                                    Learning Management System
                                </h3>
                                <p className="font-['Atkinson_Hyperlegible'] text-[#3D4A3E] text-sm leading-relaxed mb-6">
                                    Akses ke ratusan kursus video, materi
                                    bacaan, dan tugas interaktif yang dirancang
                                    khusus untuk orang dewasa berusia 45+.
                                    Pelajari keterampilan baru mulai dari
                                    manajemen keuangan hingga hobi kreatif.
                                </p>
                                <Link
                                    href="#"
                                    className="text-[#008740] font-bold text-sm flex items-center hover:underline"
                                >
                                    Pelajari Selengkapnya &gt;
                                </Link>
                            </div>
                            <div className="w-full md:w-[260px] aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden shadow-sm">
                                <img
                                    src="/images/lms-mockup.png"
                                    alt="LMS Preview"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                        <div className="w-full md:w-[340px] bg-[#006B32] rounded-2xl p-8 flex flex-col justify-center items-start">
                            <div className="w-12 h-12 mb-4 flex items-center justify-center bg-white/20 rounded-full">
                                <svg
                                    className="w-6 h-6 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M17 20h5v-1a4 4 0 00-4-4M9 20H4v-1a4 4 0 014-4h2m6-4a3 3 0 11-6 0 3 3 0 016 0zm6 1a2.5 2.5 0 10-3-2.45"
                                    />
                                </svg>
                            </div>
                            <h3 className="font-['Public_Sans'] font-bold text-xl text-white mb-3">
                                Membership Eksklusif
                            </h3>
                            <p className="font-['Atkinson_Hyperlegible'] text-white/90 text-sm leading-relaxed mb-8">
                                Bergabunglah dengan komunitas pensiunan aktif.
                                Networking, forum diskusi, dan acara offline
                                rutin.
                            </p>
                            <Link
                                href="/register"
                                className="w-full bg-white text-[#006B32] text-center font-bold py-3 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                Gabung Sekarang
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- SEMUA YANG ANDA BUTUHKAN SECTION --- */}
            <section className="bg-white py-12">
                <div className="max-w-[1200px] mx-auto px-6 md:px-10 flex flex-col items-center">
                    <p className="text-[#008740] font-['Atkinson_Hyperlegible'] font-bold text-sm tracking-widest uppercase mb-4">
                        MENGAPA PENSIUN MUDAH?
                    </p>
                    <h2 className="font-['Public_Sans'] font-bold text-3xl md:text-4xl text-[#1B1C1C] text-center mb-4">
                        Semua yang Anda Butuhkan
                        <br />
                        dalam Satu Platform
                    </h2>
                    <p className="font-['Atkinson_Hyperlegible'] text-[#3D4A3E] text-center max-w-[600px] mb-14">
                        Dari persiapan mental, kesehatan, keuangan, hingga
                        kewirausahaan — kami hadir mendampingi perjalanan
                        pensiun Anda.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                        <div className="bg-white border border-[#E4E2E1] rounded-xl p-8 flex flex-col gap-4 text-center items-center hover:shadow-md transition-shadow">
                            <div className="w-14 h-14 bg-[#FF8928] rounded-xl flex items-center justify-center text-white mb-2">
                                <svg
                                    className="w-7 h-7"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M4 5a2 2 0 012-2h6v16H6a2 2 0 00-2 2V5zM20 5a2 2 0 00-2-2h-6v16h6a2 2 0 012 2V5z"
                                    />
                                </svg>
                            </div>
                            <h3 className="font-['Public_Sans'] font-bold text-lg text-[#1B1C1C]">
                                LMS Pelatihan Lengkap
                            </h3>
                            <p className="font-['Atkinson_Hyperlegible'] text-[#3D4A3E] text-sm">
                                250+ kursus video berkualitas tinggi dari
                                instruktur berpengalaman, bisa diakses kapan
                                saja dimana saja.
                            </p>
                        </div>
                        <div className="bg-white border border-[#E4E2E1] rounded-xl p-8 flex flex-col gap-4 text-center items-center hover:shadow-md transition-shadow">
                            <div className="w-14 h-14 bg-[#3B9ED8] rounded-xl flex items-center justify-center text-white mb-2">
                                <svg
                                    className="w-7 h-7"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <rect
                                        x="3"
                                        y="4"
                                        width="18"
                                        height="12"
                                        rx="2"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M8 20h8M12 16v4"
                                    />
                                </svg>
                            </div>
                            <h3 className="font-['Public_Sans'] font-bold text-lg text-[#1B1C1C]">
                                Webinar & Event Live
                            </h3>
                            <p className="font-['Atkinson_Hyperlegible'] text-[#3D4A3E] text-sm">
                                Ikuti sesi interaktif bulanan bersama para ahli
                                dan komunitas pensiunan dari seluruh Indonesia.
                            </p>
                        </div>
                        <div className="bg-white border border-[#E4E2E1] rounded-xl p-8 flex flex-col gap-4 text-center items-center hover:shadow-md transition-shadow">
                            <div className="w-14 h-14 bg-[#F2B705] rounded-xl flex items-center justify-center text-white mb-2">
                                <svg
                                    className="w-7 h-7"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <circle cx="12" cy="9" r="5" />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M9 13.5L8 21l4-2 4 2-1-7.5"
                                    />
                                </svg>
                            </div>
                            <h3 className="font-['Public_Sans'] font-bold text-lg text-[#1B1C1C]">
                                Sertifikat Terverifikasi
                            </h3>
                            <p className="font-['Atkinson_Hyperlegible'] text-[#3D4A3E] text-sm">
                                Dapatkan sertifikat digital resmi yang diakui
                                oleh ratusan perusahaan dan instansi pemerintah.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- EVENT SECTION --- */}
            <section className="bg-white py-12">
                <div className="max-w-[1200px] mx-auto px-6 md:px-10">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="font-['Public_Sans'] font-bold text-3xl text-[#1B1C1C]">
                            Event
                        </h2>
                        <Link
                            href="/event"
                            className="text-[#008740] font-bold text-sm flex items-center gap-1 hover:underline"
                        >
                            Lihat Semua Event{' '}
                            <span aria-hidden="true">&rarr;</span>
                        </Link>
                    </div>
                    <div className="relative group">
                        <button
                            onClick={() =>
                                scrollContainerBy(eventScrollRef, -1)
                            }
                            className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white border border-[#E4E2E1] shadow-lg flex items-center justify-center hover:bg-gray-50 text-[#1B1C1C] z-10 opacity-0 group-hover:opacity-100 transition-all hover:scale-105"
                        >
                            <span className="font-bold text-xl">&lt;</span>
                        </button>
                        <div
                            ref={eventScrollRef}
                            className="flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                        >
                            {/* --- KODINGAN DINAMIS MULAI DARI SINI --- */}
                            {events && events.length > 0 ? (
                                events.map((event) => (
                                    <div
                                        key={event.id}
                                        className="w-[280px] md:w-[320px] shrink-0 snap-start bg-white border border-[#E4E2E1] rounded-xl overflow-hidden flex flex-col"
                                    >
                                        <div className="h-40 bg-gray-200 relative shrink-0">
                                            {/* Panggil gambar dari storage, kalau kosong pake default */}
                                            <img
                                                src={
                                                    event.image_path
                                                        ? `/storage/${event.image_path}`
                                                        : '/images/event-1.png'
                                                }
                                                alt={event.judul}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute top-3 left-3 flex gap-2">
                                                <span className="bg-[#7C5CFC] text-white text-[10px] font-bold px-2 py-1 rounded">
                                                    {event.jenis_event}
                                                </span>
                                                <span className="bg-white text-[#1B1C1C] text-[10px] font-bold px-2 py-1 rounded">
                                                    {event.kategori}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-5 flex flex-col flex-grow">
                                            <h3 className="font-['Public_Sans'] font-bold text-base text-[#1B1C1C] mb-2 leading-tight">
                                                {event.judul}
                                            </h3>
                                            <p className="font-['Atkinson_Hyperlegible'] text-[#3D4A3E] text-xs mb-4 line-clamp-2">
                                                {event.deskripsi}
                                            </p>
                                            <div className="flex flex-col gap-2 text-xs text-[#3D4A3E] mb-6">
                                                {/* Format tanggal biar cantik ala Indonesia */}
                                                <div className="flex items-center gap-2">
                                                    <svg
                                                        className="w-4 h-4 text-[#008740] shrink-0"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <rect
                                                            x="3"
                                                            y="5"
                                                            width="18"
                                                            height="16"
                                                            rx="2"
                                                        />
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M3 9h18M8 3v4M16 3v4"
                                                        />
                                                    </svg>
                                                    {formatEventDate(
                                                        event.tanggal,
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <svg
                                                        className="w-4 h-4 text-[#008740] shrink-0"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <rect
                                                            x="3"
                                                            y="6"
                                                            width="13"
                                                            height="12"
                                                            rx="2"
                                                        />
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M16 10l5-3v10l-5-3"
                                                        />
                                                    </svg>
                                                    {event.lokasi_link}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <svg
                                                        className="w-4 h-4 text-[#008740] shrink-0"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <circle
                                                            cx="12"
                                                            cy="8"
                                                            r="4"
                                                        />
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M4 21c0-4 4-6 8-6s8 2 8 6"
                                                        />
                                                    </svg>
                                                    {event.narasumber}
                                                </div>
                                            </div>
                                            <div className="mt-auto">
                                                <p className="text-xs text-center text-[#3D4A3E] mb-3 pt-3 border-t border-[#E4E2E1]">
                                                    Kapasitas {event.kapasitas}{' '}
                                                    |{' '}
                                                    <span className="text-[#008740]">
                                                        Sisa Kuota:{' '}
                                                        {event.sisa_kuota}
                                                    </span>
                                                </p>
                                                <Link
                                                    href={`/event-landing/${event.id}`}
                                                    className="block w-full bg-[#FF8928] hover:bg-[#e67a22] text-white font-bold py-2 rounded-lg text-sm text-center transition-colors"
                                                >
                                                    Lihat Detail
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                // Muncul kalau data event di database lu masih kosong
                                <div className="w-full text-center py-10">
                                    <p className="text-gray-500 italic font-['Atkinson_Hyperlegible']">
                                        Belum ada event yang tersedia saat ini
                                        boss.
                                    </p>
                                </div>
                            )}
                            {/* --- KODINGAN DINAMIS SELESAI --- */}
                        </div>
                        <button
                            onClick={() => scrollContainerBy(eventScrollRef, 1)}
                            className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white border border-[#E4E2E1] shadow-lg flex items-center justify-center hover:bg-gray-50 text-[#1B1C1C] z-10 opacity-0 group-hover:opacity-100 transition-all hover:scale-105"
                        >
                            <span className="font-bold text-xl">&gt;</span>
                        </button>
                    </div>
                </div>
            </section>

            {/* --- KATEGORI PROGRAM SECTION --- */}
            <section className="bg-white py-12">
                <div className="max-w-[1200px] mx-auto px-6 md:px-10">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="font-['Public_Sans'] font-bold text-3xl text-[#1B1C1C]">
                            Kategori Program
                        </h2>
                        <Link
                            href="/katalog-pelatihan"
                            className="text-[#008740] font-bold text-sm flex items-center gap-1 hover:underline"
                        >
                            Lihat Semua Kursus{' '}
                            <span aria-hidden="true">&rarr;</span>
                        </Link>
                    </div>
                    <div className="relative group">
                        {/* Tombol Panah Kiri */}
                        <button
                            onClick={() =>
                                scrollContainerBy(kategoriScrollRef, -1)
                            }
                            className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white border border-[#E4E2E1] shadow-lg flex items-center justify-center hover:bg-gray-50 text-[#1B1C1C] z-10 opacity-0 group-hover:opacity-100 transition-all hover:scale-105"
                        >
                            <span className="font-bold text-xl">&lt;</span>
                        </button>
                        <div
                            ref={kategoriScrollRef}
                            className="flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                        >
                            {/* --- KODINGAN KATEGORI DINAMIS MULAI DARI SINI --- */}
                            {categories && categories.length > 0 ? (
                                categories.map((kategori, index) => (
                                    <div
                                        key={kategori.id}
                                        className="w-[260px] md:w-[280px] shrink-0 snap-start bg-white border border-[#E4E2E1] rounded-xl overflow-hidden p-4 flex flex-col shadow-sm hover:shadow-md transition-shadow"
                                    >
                                        <div className="h-32 bg-gray-200 rounded-lg mb-3 overflow-hidden shrink-0">
                                            {/* Gambar sementara pakai bawaan template secara berurutan */}
                                            <img
                                                src={
                                                    kategori.gambar
                                                        ? `/storage/${kategori.gambar}`
                                                        : `/images/kat-${(index % 4) + 1}.png`
                                                }
                                                alt={kategori.nama}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex justify-between items-center mb-2">
                                            {/* Render Label/Badge Icon jika diisi di DB */}
                                            {kategori.icon ? (
                                                <span
                                                    className="text-xs font-bold px-2 py-1 rounded"
                                                    style={{
                                                        backgroundColor:
                                                            kategori.warna_bg_icon ||
                                                            '#FFF3E5',
                                                        color:
                                                            kategori.warna_teks_icon ||
                                                            '#FF8928',
                                                    }}
                                                >
                                                    {kategori.icon}
                                                </span>
                                            ) : (
                                                <span />
                                            )}
                                        </div>
                                        <h3
                                            className="font-['Public_Sans'] font-bold text-base text-[#1B1C1C] line-clamp-1 mb-2"
                                            title={kategori.nama}
                                        >
                                            {kategori.nama}
                                        </h3>
                                        <p className="font-['Atkinson_Hyperlegible'] text-[#3D4A3E] text-xs mb-4 flex-grow line-clamp-2">
                                            {kategori.deskripsi ||
                                                'Deskripsi belum tersedia.'}
                                        </p>
                                        {/* Menggunakan courses_count hasil dari withCount() di backend */}
                                        <p className="text-xs font-bold text-[#1B1C1C] mb-4">
                                            {kategori.courses_count || 0} Kursus
                                        </p>
                                        <Link
                                            href="/katalog-pelatihan"
                                            className="block w-full border border-[#008740] text-[#008740] hover:bg-[#008740] hover:text-white font-bold py-2 rounded-lg text-sm text-center transition-colors"
                                        >
                                            Lihat Detail
                                        </Link>
                                    </div>
                                ))
                            ) : (
                                <div className="w-full text-center py-10">
                                    <p className="text-gray-500 italic font-['Atkinson_Hyperlegible']">
                                        Belum ada kategori yang tersedia saat
                                        ini boss.
                                    </p>
                                </div>
                            )}
                            {/* --- KODINGAN KATEGORI DINAMIS SELESAI --- */}
                        </div>
                        {/* Tombol Panah Kanan */}
                        <button
                            onClick={() =>
                                scrollContainerBy(kategoriScrollRef, 1)
                            }
                            className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white border border-[#E4E2E1] shadow-lg flex items-center justify-center hover:bg-gray-50 text-[#1B1C1C] z-10 opacity-0 group-hover:opacity-100 transition-all hover:scale-105"
                        >
                            <span className="font-bold text-xl">&gt;</span>
                        </button>
                    </div>
                </div>
            </section>

            {/* --- Penilaian Pengguna SECTION --- */}
            <section className="bg-white py-12">
                <div className="max-w-[1200px] mx-auto px-6 md:px-10">
                    <div className="flex justify-between items-end mb-10">
                        <div>
                            <h2 className="font-['Public_Sans'] font-bold text-3xl text-[#1B1C1C] mb-2">
                                Penilaian Pengguna
                            </h2>
                            <p className="font-['Atkinson_Hyperlegible'] text-[#3D4A3E]">
                                Apa kata mereka yang telah bergabung dengan
                                Pensiun Mudah
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {reviews && reviews.length > 0 ? (
                            reviews.map((review, index) => (
                                <div
                                    key={index}
                                    className="bg-white border border-[#E4E2E1] p-8 rounded-xl shadow-sm"
                                >
                                    <div className="flex items-center gap-0.5 mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <svg
                                                key={i}
                                                className={`h-4 w-4 ${i < Math.floor(review.rating) ? 'text-[#FF8928]' : 'text-[#E4E2E1]'}`}
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M10 1.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L10 15l-5.3 2.6 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <p className="font-['Atkinson_Hyperlegible'] text-[#3D4A3E] text-sm mb-8 min-h-[80px]">
                                        &ldquo;{review.text}&rdquo;
                                    </p>
                                    <div className="flex items-center gap-3">
                                        {review.avatar ? (
                                            <img
                                                src={review.avatar}
                                                alt={review.name}
                                                className="w-10 h-10 shrink-0 rounded-full object-cover"
                                            />
                                        ) : (
                                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#006B32] text-sm font-bold text-white">
                                                {review.name
                                                    .split(' ')
                                                    .map((p) => p[0])
                                                    .join('')
                                                    .slice(0, 2)
                                                    .toUpperCase()}
                                            </span>
                                        )}
                                        <div>
                                            <h4 className="font-bold text-[#1B1C1C] text-sm">
                                                {review.name}
                                            </h4>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            // Dummy cards when no reviews exist
                            <>
                                {[
                                    {
                                        name: 'Budi Santoso',
                                        text: 'Berkat Pensiun Mudah, saya sekarang mahir mengelola Keuangan Pensiun saya sendiri. Pensiun saya jadi lebih produktif dan menenangkan secara finansial.',
                                        rating: 5,
                                    },
                                    {
                                        name: 'Susi Wijaya',
                                        text: 'Membership di Pensiun Mudah sangat menguntungkan karena dapat pemahaman materi yang jelas dan mudah dimengerti.',
                                        rating: 5,
                                    },
                                    {
                                        name: 'Hendrik Pratama',
                                        text: 'Saya sangat senang ikut kursus di Pensiun Mudah.',
                                        rating: 5,
                                    },
                                ].map((dummy, index) => (
                                    <div
                                        key={index}
                                        className="bg-white border border-[#E4E2E1] p-8 rounded-xl shadow-sm"
                                    >
                                        <div className="flex items-center gap-0.5 mb-4">
                                            {[...Array(5)].map((_, i) => (
                                                <svg
                                                    key={i}
                                                    className="h-4 w-4 text-[#FF8928]"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path d="M10 1.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L10 15l-5.3 2.6 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
                                                </svg>
                                            ))}
                                        </div>
                                        <p className="font-['Atkinson_Hyperlegible'] text-[#3D4A3E] text-sm mb-8 min-h-[80px]">
                                            &ldquo;{dummy.text}&rdquo;
                                        </p>
                                        <div className="flex items-center gap-3">
                                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#006B32] text-sm font-bold text-white">
                                                {dummy.name
                                                    .split(' ')
                                                    .map((p) => p[0])
                                                    .join('')
                                                    .slice(0, 2)
                                                    .toUpperCase()}
                                            </span>
                                            <div>
                                                <h4 className="font-bold text-[#1B1C1C] text-sm">
                                                    {dummy.name}
                                                </h4>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* --- FINAL CTA SECTION --- */}
            <section className="bg-[#006B32] py-16 px-6 md:px-10 flex justify-center">
                <div className="max-w-[800px] flex flex-col items-center gap-6 text-center">
                    <h2 className="font-['Public_Sans'] font-bold text-3xl md:text-4xl text-white">
                        Siap Memulai Babak Baru Hidup Anda?
                    </h2>
                    <p className="font-['Atkinson_Hyperlegible'] text-lg md:text-xl text-white opacity-90">
                        Dapatkan akses penuh ke seluruh ekosistem Pensiun Mudah
                        hari ini dan rasakan transisi yang lebih tenang.
                    </p>
                    <Link
                        href="/register"
                        className="mt-4 bg-[#FF8928] hover:bg-[#e67a22] text-white font-['Atkinson_Hyperlegible'] font-bold text-lg px-12 py-4 rounded-lg shadow-md transition-all"
                    >
                        Mulai Sekarang
                    </Link>
                </div>
            </section>
        </MainLayout>
    );
}
