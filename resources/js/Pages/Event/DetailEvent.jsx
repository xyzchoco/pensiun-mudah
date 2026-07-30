import { Head, Link } from '@inertiajs/react';
import PaymentHeader from '@/Components/Payment/PaymentHeader';
import EventHero from '@/Components/Event/EventHero';
import EventInfoCard from '@/Components/Event/EventInfoCard';
import RegistrationCard from '@/Components/Event/RegistrationCard';
import SpeakerCard from '@/Components/Event/SpeakerCard';
import RelatedEventCard from '@/Components/Event/RelatedEventCard';
import EventFooter from '@/Components/Event/EventFooter';

// Nama bulan singkat (format tanggal gaya Indonesia)
const BULAN_SINGKAT = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'Mei',
    'Jun',
    'Jul',
    'Agu',
    'Sep',
    'Okt',
    'Nov',
    'Des',
];

// Format tanggal: '2024-10-15' -> '15 Okt 2024'
const formatTanggal = (tanggal) => {
    if (!tanggal) return '';
    const date = new Date(tanggal);
    if (isNaN(date.getTime())) return tanggal;
    return `${date.getDate()} ${BULAN_SINGKAT[date.getMonth()]} ${date.getFullYear()}`;
};

// Format jam: '09:00:00' -> '09:00 WIB'
const formatJam = (jam) => {
    if (!jam) return '';
    return `${jam.substring(0, 5)} WIB`;
};

export default function DetailEvent({ event, relatedEvents, sudahDaftar, daftarHref }) {
    const ev = event;
    const related = relatedEvents || [];
    const description = ev.deskripsi || '';
    const descriptionHtml = description
        .split(/\n{2,}/)
        .filter(Boolean)
        .map((paragraph) => `<p>${paragraph}</p>`)
        .join('');

    const waktu = ev.jam ? `${formatJam(ev.jam)} - Selesai` : '-';
    const lokasiLabel = ev.jenis_event === 'Online' ? 'Platform / Link' : 'Lokasi';
    const lokasi = ev.lokasi_link || '-';

    return (
        <div className="min-h-screen flex flex-col bg-[#FBF9F8]">
            <Head title={ev.judul} />

            <PaymentHeader />

            <main className="flex-1">
                <div className="mx-auto max-w-7xl px-6 lg:px-8 py-8">
                    {/* --- NAVIGASI KEMBALI --- */}
                    <Link
                        href="/event"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[#008740] hover:text-[#006B32] transition-colors"
                    >
                        <svg
                            className="w-5 h-5"
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
                        Kembali ke Daftar Event
                    </Link>

                    {/* --- GRID UTAMA 70/30 --- */}
                    <div className="mt-6 grid grid-cols-1 lg:grid-cols-10 gap-8">
                        {/* ===== KOLOM KIRI (70%) ===== */}
                        <div className="lg:col-span-7">
                            {/* HERO */}
                            <EventHero
                                thumbnail={ev.image_url}
                                status={ev.status_label}
                            />

                            {/* JUDUL */}
                            <h1 className="mt-6 text-3xl lg:text-4xl font-bold text-[#1B1C1C] leading-tight">
                                {ev.judul}
                            </h1>

                            {/* GRID INFO 4 KARTU */}
                            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <EventInfoCard
                                    label="Tanggal"
                                    value={formatTanggal(ev.tanggal)}
                                    icon={
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M8 7V3m8 4V3M4 11h16M5 5h14a1 1 0 011 1v13a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1z"
                                            />
                                        </svg>
                                    }
                                />
                                <EventInfoCard
                                    label="Waktu"
                                    value={waktu}
                                    icon={
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle cx="12" cy="12" r="9" />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M12 7v5l3 2"
                                            />
                                        </svg>
                                    }
                                />
                                <EventInfoCard
                                    label={lokasiLabel}
                                    value={lokasi}
                                    icon={
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M12 21s7-5.2 7-11a7 7 0 10-14 0c0 5.8 7 11 7 11z"
                                            />
                                            <circle cx="12" cy="10" r="2.5" />
                                        </svg>
                                    }
                                />
                                <EventInfoCard
                                    label="Pembicara"
                                    value={ev.narasumber}
                                    icon={
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle cx="12" cy="8" r="3.2" />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M5 20a7 7 0 0114 0"
                                            />
                                        </svg>
                                    }
                                />
                            </div>

                            {/* TENTANG SEMINAR */}
                            <div className="mt-10">
                                <div className="flex items-center gap-3">
                                    <span className="h-6 w-1.5 rounded-full bg-[#008740]"></span>
                                    <h2 className="text-xl font-bold text-[#1B1C1C]">
                                        Tentang Seminar Ini
                                    </h2>
                                </div>
                                <div
                                    className="prose prose-sm sm:prose-base mt-4 max-w-none text-[#4B5563] prose-headings:text-[#1B1C1C] prose-strong:text-[#1B1C1C] prose-a:text-[#008740]"
                                    dangerouslySetInnerHTML={{
                                        __html:
                                            descriptionHtml ||
                                            '<p>Deskripsi event belum tersedia.</p>',
                                    }}
                                />
                            </div>


                            {/* EVENT TERKAIT */}
                            {related.length > 0 && (
                                <div className="mt-10">
                                    <h2 className="text-2xl font-bold text-[#1B1C1C]">
                                        Event Terkait Lainnya
                                    </h2>
                                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                        {related.map((item) => (
                                            <RelatedEventCard
                                                key={item.id || item.slug}
                                                event={item}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ===== KOLOM KANAN (30%) ===== */}
                        <div className="lg:col-span-3">
                            <div className="lg:sticky lg:top-8 space-y-6">
                                <RegistrationCard
                                    event={ev}
                                    sudahDaftar={sudahDaftar}
                                    daftarHref={daftarHref}
                                />
                                <SpeakerCard
                                    name={ev.narasumber}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <EventFooter />
        </div>
    );
}
