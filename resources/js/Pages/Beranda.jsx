import { useRef } from 'react';
import MainLayout from '../Layouts/MainLayout';
import { Link } from '@inertiajs/react';

// Pastikan props 'landing' masuk di sini
export default function Beranda({ landing, events, categories }) {
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
                                __html: landing?.hero_title || 'Persiapkan Masa Pensiun Anda dengan <span class="text-[#008740]">PENSIUN</span> <span class="text-[#FF8928]">MUDAH</span>'
                            }}
                        />

                        {/* 3. HERO SUBTITLE */}
                        <p className="font-['Atkinson_Hyperlegible'] text-[#3D4A3E] text-lg md:text-xl leading-[32px] max-w-[500px]">
                            {landing?.hero_subtitle || 'Memberdayakan profesional berpengalaman untuk transisi ke babak kehidupan berikutnya dengan percaya diri, stabilitas keuangan, dan tujuan yang bermakna.'}
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
                                src={landing?.hero_image_path ? `/storage/${landing.hero_image_path}` : "/images/hero-image.png"}
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
                    <h2 className="font-['Public_Sans'] font-bold text-3xl text-[#1B1C1C] mb-2">Layanan Kami</h2>
                    <p className="font-['Atkinson_Hyperlegible'] text-[#3D4A3E] mb-12 text-center">Solusi komprehensif untuk pertumbuhan masa pensiun Anda</p>

                    <div className="flex flex-col md:flex-row gap-6 w-full">
                        <div className="flex-1 bg-white border border-[#E4E2E1] rounded-2xl p-8 flex flex-col md:flex-row gap-8 items-center">
                            <div className="flex-1 flex flex-col items-start">
                                <div className="w-12 h-12 mb-4 flex items-center justify-center bg-white rounded-full shadow-sm">
                                    <span className="text-[#008740] text-xl">🎓</span>
                                </div>
                                <h3 className="font-['Public_Sans'] font-bold text-xl text-[#1B1C1C] mb-3">Learning Management System</h3>
                                <p className="font-['Atkinson_Hyperlegible'] text-[#3D4A3E] text-sm leading-relaxed mb-6">
                                    Akses ke ratusan kursus video, materi bacaan, dan tugas interaktif yang dirancang khusus untuk orang dewasa berusia 45+. Pelajari keterampilan baru mulai dari manajemen keuangan hingga hobi kreatif.
                                </p>
                                <Link href="#" className="text-[#008740] font-bold text-sm flex items-center hover:underline">
                                    Pelajari Selengkapnya &gt;
                                </Link>
                            </div>
                            <div className="w-full md:w-[260px] aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden shadow-sm">
                                <img src="/images/lms-mockup.png" alt="LMS Preview" className="w-full h-full object-cover" />
                            </div>
                        </div>

                        <div className="w-full md:w-[340px] bg-[#006B32] rounded-2xl p-8 flex flex-col justify-center items-start">
                            <div className="w-12 h-12 mb-4 flex items-center justify-center bg-white/20 rounded-full">
                                <span className="text-white text-xl">🤝</span>
                            </div>
                            <h3 className="font-['Public_Sans'] font-bold text-xl text-white mb-3">Membership Eksklusif</h3>
                            <p className="font-['Atkinson_Hyperlegible'] text-white/90 text-sm leading-relaxed mb-8">
                                Bergabunglah dengan komunitas pensiunan aktif. Networking, forum diskusi, dan acara offline rutin.
                            </p>
                            <Link href="/register" className="w-full bg-white text-[#006B32] text-center font-bold py-3 rounded-lg hover:bg-gray-100 transition-colors">
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
                        Semua yang Anda Butuhkan<br />dalam Satu Platform
                    </h2>
                    <p className="font-['Atkinson_Hyperlegible'] text-[#3D4A3E] text-center max-w-[600px] mb-14">
                        Dari persiapan mental, kesehatan, keuangan, hingga kewirausahaan — kami hadir mendampingi perjalanan pensiun Anda.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                        <div className="bg-white border border-[#E4E2E1] rounded-xl p-8 flex flex-col gap-4 text-center items-center hover:shadow-md transition-shadow">
                            <div className="w-14 h-14 bg-[#FFF3E5] rounded-xl flex items-center justify-center text-[#FF8928] text-2xl mb-2">📚</div>
                            <h3 className="font-['Public_Sans'] font-bold text-lg text-[#1B1C1C]">LMS Pelatihan Lengkap</h3>
                            <p className="font-['Atkinson_Hyperlegible'] text-[#3D4A3E] text-sm">250+ kursus video berkualitas tinggi dari instruktur berpengalaman, bisa diakses kapan saja dimana saja.</p>
                        </div>
                        <div className="bg-white border border-[#E4E2E1] rounded-xl p-8 flex flex-col gap-4 text-center items-center hover:shadow-md transition-shadow">
                            <div className="w-14 h-14 bg-[#FFF0F4] rounded-xl flex items-center justify-center text-[#FA4C70] text-2xl mb-2">🎥</div>
                            <h3 className="font-['Public_Sans'] font-bold text-lg text-[#1B1C1C]">Webinar & Event Live</h3>
                            <p className="font-['Atkinson_Hyperlegible'] text-[#3D4A3E] text-sm">Ikuti sesi interaktif bulanan bersama para ahli dan komunitas pensiunan dari seluruh Indonesia.</p>
                        </div>
                        <div className="bg-white border border-[#E4E2E1] rounded-xl p-8 flex flex-col gap-4 text-center items-center hover:shadow-md transition-shadow">
                            <div className="w-14 h-14 bg-[#F8FFEC] rounded-xl flex items-center justify-center text-[#82C823] text-2xl mb-2">🏅</div>
                            <h3 className="font-['Public_Sans'] font-bold text-lg text-[#1B1C1C]">Sertifikat Terverifikasi</h3>
                            <p className="font-['Atkinson_Hyperlegible'] text-[#3D4A3E] text-sm">Dapatkan sertifikat digital resmi yang diakui oleh ratusan perusahaan dan instansi pemerintah.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- EVENT SECTION --- */}
            <section className="bg-white py-12">
                <div className="max-w-[1200px] mx-auto px-6 md:px-10">
                    <h2 className="font-['Public_Sans'] font-bold text-3xl text-[#1B1C1C] mb-8">Event</h2>

                    <div className="relative group">
                        <button
                            onClick={() => scrollContainerBy(eventScrollRef, -1)}
                            className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white border border-[#E4E2E1] shadow-lg flex items-center justify-center hover:bg-gray-50 text-[#1B1C1C] z-10 transition-transform hover:scale-105"
                        >
                            <span className="font-bold text-xl">&lt;</span>
                        </button>

                        <div ref={eventScrollRef} className="flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

                            {/* --- KODINGAN DINAMIS MULAI DARI SINI --- */}
                            {events && events.length > 0 ? (
                                events.map((event) => (
                                    <div key={event.id} className="w-[280px] md:w-[320px] shrink-0 snap-start bg-white border border-[#E4E2E1] rounded-xl overflow-hidden flex flex-col">
                                        <div className="h-40 bg-gray-200 relative shrink-0">
                                            {/* Panggil gambar dari storage, kalau kosong pake default */}
                                            <img
                                                src={event.image_path ? `/storage/${event.image_path}` : "/images/event-1.png"}
                                                alt={event.judul}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute top-3 left-3 flex gap-2">
                                                <span className="bg-[#5266EB] text-white text-[10px] font-bold px-2 py-1 rounded">{event.jenis_event}</span>
                                                <span className="bg-white text-[#1B1C1C] text-[10px] font-bold px-2 py-1 rounded">{event.kategori}</span>
                                            </div>
                                        </div>
                                        <div className="p-5 flex flex-col flex-grow">
                                            <h3 className="font-['Public_Sans'] font-bold text-base text-[#1B1C1C] mb-2 leading-tight">{event.judul}</h3>
                                            <p className="font-['Atkinson_Hyperlegible'] text-[#3D4A3E] text-xs mb-4 line-clamp-2">{event.deskripsi}</p>

                                            <div className="flex flex-col gap-2 text-xs text-[#3D4A3E] mb-6">
                                                {/* Format tanggal biar cantik ala Indonesia */}
                                                <div className="flex items-center gap-2"><span>📅</span> {new Date(event.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
                                                <div className="flex items-center gap-2"><span>🎥</span> {event.lokasi_link}</div>
                                                <div className="flex items-center gap-2"><span>👤</span> {event.narasumber}</div>
                                            </div>

                                            <div className="mt-auto">
                                                <p className="text-xs text-center text-[#3D4A3E] mb-3">Kapasitas {event.kapasitas} | <span className="text-[#008740]">Sisa Kuota: {event.sisa_kuota}</span></p>
                                                <button className="w-full bg-[#FF8928] hover:bg-[#e67a22] text-white font-bold py-2 rounded-lg text-sm transition-colors">
                                                    Lihat Detail
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                // Muncul kalau data event di database lu masih kosong
                                <div className="w-full text-center py-10">
                                    <p className="text-gray-500 italic font-['Atkinson_Hyperlegible']">Belum ada event yang tersedia saat ini boss.</p>
                                </div>
                            )}
                            {/* --- KODINGAN DINAMIS SELESAI --- */}

                        </div>

                        <button
                            onClick={() => scrollContainerBy(eventScrollRef, 1)}
                            className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white border border-[#E4E2E1] shadow-lg flex items-center justify-center hover:bg-gray-50 text-[#1B1C1C] z-10 transition-transform hover:scale-105"
                        >
                            <span className="font-bold text-xl">&gt;</span>
                        </button>
                    </div>
                </div>
            </section>

            {/* --- KATEGORI PROGRAM SECTION --- */}
            <section className="bg-white py-12">
                <div className="max-w-[1200px] mx-auto px-6 md:px-10">
                    <h2 className="font-['Public_Sans'] font-bold text-3xl text-[#1B1C1C] mb-8">Kategori Program</h2>

                    <div className="relative group">
                        {/* Tombol Panah Kiri */}
                        <button
                            onClick={() => scrollContainerBy(kategoriScrollRef, -1)}
                            className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white border border-[#E4E2E1] shadow-lg flex items-center justify-center hover:bg-gray-50 text-[#1B1C1C] z-10 transition-transform hover:scale-105"
                        >
                            <span className="font-bold text-xl">&lt;</span>
                        </button>

                        <div ref={kategoriScrollRef} className="flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

                            {/* --- KODINGAN KATEGORI DINAMIS MULAI DARI SINI --- */}
                            {categories && categories.length > 0 ? (
                                categories.map((kategori, index) => (
                                    <div key={kategori.id} className="w-[260px] md:w-[280px] shrink-0 snap-start bg-white border border-[#E4E2E1] rounded-xl overflow-hidden p-4 flex flex-col shadow-sm hover:shadow-md transition-shadow">
                                        <div className="h-32 bg-gray-200 rounded-lg mb-4 relative overflow-hidden shrink-0">
                                            {/* Gambar sementara pakai bawaan template secara berurutan */}
                                            <img src={kategori.gambar ? `/storage/${kategori.gambar}` : `/images/kat-${(index % 4) + 1}.png`} alt={kategori.nama} className="w-full h-full object-cover" />

                                            {/* Render Label/Badge Icon jika diisi di DB */}
                                            {kategori.icon && (
                                                <div
                                                    className="absolute top-2 left-2 text-xs font-bold px-2 py-1 rounded"
                                                    style={{
                                                        backgroundColor: kategori.warna_bg_icon || '#FFF3E5',
                                                        color: kategori.warna_teks_icon || '#FF8928'
                                                    }}
                                                >
                                                    {kategori.icon}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex justify-between items-center mb-2">
                                            <h3 className="font-['Public_Sans'] font-bold text-base text-[#1B1C1C] line-clamp-1" title={kategori.nama}>
                                                {kategori.nama}
                                            </h3>
                                            {/* Rating hardcode sementara */}
                                            <span className="text-xs font-bold text-[#008740]">⭐ 4.8</span>
                                        </div>

                                        <p className="font-['Atkinson_Hyperlegible'] text-[#3D4A3E] text-xs mb-4 flex-grow line-clamp-2">
                                            {kategori.deskripsi || 'Deskripsi belum tersedia.'}
                                        </p>

                                        {/* Menggunakan courses_count hasil dari withCount() di backend */}
                                        <p className="text-xs font-bold text-[#1B1C1C] mb-4">
                                            {kategori.courses_count || 0} Kursus
                                        </p>

                                        <button className="w-full border border-[#008740] text-[#008740] hover:bg-[#008740] hover:text-white font-bold py-2 rounded-lg text-sm transition-colors">
                                            Lihat Detail
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="w-full text-center py-10">
                                    <p className="text-gray-500 italic font-['Atkinson_Hyperlegible']">Belum ada kategori yang tersedia saat ini boss.</p>
                                </div>
                            )}
                            {/* --- KODINGAN KATEGORI DINAMIS SELESAI --- */}

                        </div>

                        {/* Tombol Panah Kanan */}
                        <button
                            onClick={() => scrollContainerBy(kategoriScrollRef, 1)}
                            className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white border border-[#E4E2E1] shadow-lg flex items-center justify-center hover:bg-gray-50 text-[#1B1C1C] z-10 transition-transform hover:scale-105"
                        >
                            <span className="font-bold text-xl">&gt;</span>
                        </button>
                    </div>
                </div>
            </section>

            {/* --- KISAH SUKSES SECTION --- */}
            <section className="bg-white py-12">
                <div className="max-w-[1200px] mx-auto px-6 md:px-10">
                    <div className="flex justify-between items-end mb-10">
                        <div>
                            <h2 className="font-['Public_Sans'] font-bold text-3xl text-[#1B1C1C] mb-2">Kisah Sukses</h2>
                            <p className="font-['Atkinson_Hyperlegible'] text-[#3D4A3E]">Apa kata mereka yang telah bergabung dengan Pensiun Mudah</p>
                        </div>
                        <div className="hidden md:flex gap-2">
                            <button className="w-10 h-10 rounded-full border border-[#E4E2E1] flex items-center justify-center hover:bg-gray-50">&lt;</button>
                            <button className="w-10 h-10 rounded-full border border-[#E4E2E1] flex items-center justify-center hover:bg-gray-50">&gt;</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white border border-[#E4E2E1] p-8 rounded-xl shadow-sm">
                            <div className="text-[#FF8928] text-sm mb-4">⭐⭐⭐⭐⭐</div>
                            <p className="font-['Atkinson_Hyperlegible'] text-[#3D4A3E] text-sm italic mb-8 min-h-[80px]">
                                "Berkat Pensiun Mudah, saya sekarang mahir mengelola Keuangan Pensiun saya sendiri. Pensiun saya jadi lebih produktif dan menenangkan secara finansial."
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden"><img src="/images/user-1.png" /></div>
                                <div>
                                    <h4 className="font-bold text-[#1B1C1C] text-sm">Budi Santoso</h4>
                                    <p className="text-xs text-[#3D4A3E]">Mantan Manager Operasional</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-[#E4E2E1] p-8 rounded-xl shadow-sm">
                            <div className="text-[#FF8928] text-sm mb-4">⭐⭐⭐⭐⭐</div>
                            <p className="font-['Atkinson_Hyperlegible'] text-[#3D4A3E] text-sm italic mb-8 min-h-[80px]">
                                "Membership di Pensiun Mudah sangat menguntungkan karena dapat pemahaman materi yang jelas dan mudah dimengerti."
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden"><img src="/images/user-2.png" /></div>
                                <div>
                                    <h4 className="font-bold text-[#1B1C1C] text-sm">Susi Wijaya</h4>
                                    <p className="text-xs text-[#3D4A3E]">Pensiunan Guru</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-[#E4E2E1] p-8 rounded-xl shadow-sm">
                            <div className="text-[#FF8928] text-sm mb-4">⭐⭐⭐⭐⭐</div>
                            <p className="font-['Atkinson_Hyperlegible'] text-[#3D4A3E] text-sm italic mb-8 min-h-[80px]">
                                "Saya sangat senang ikut kursus di Pensiun Mudah."
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden"><img src="/images/user-3.png" /></div>
                                <div>
                                    <h4 className="font-bold text-[#1B1C1C] text-sm">Hendrik Pratama</h4>
                                    <p className="text-xs text-[#3D4A3E]">Wirausaha</p>
                                </div>
                            </div>
                        </div>
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
                        Dapatkan akses penuh ke seluruh ekosistem Pensiun Mudah hari ini dan rasakan transisi yang lebih tenang.
                    </p>
                    <Link href="/register" className="mt-4 bg-[#FF8928] hover:bg-[#e67a22] text-white font-['Atkinson_Hyperlegible'] font-bold text-lg px-12 py-4 rounded-lg shadow-md transition-all">
                        Mulai Sekarang
                    </Link>
                </div>
            </section>
        </MainLayout>
    );
}