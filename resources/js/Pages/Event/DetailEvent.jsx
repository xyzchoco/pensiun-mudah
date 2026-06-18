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

export default function DetailEvent({ event, relatedEvents }) {
    // Data default biar halaman kerender persis screenshot walau backend cuma kirim slug
    const dummyEvent = {
        id: 1,
        slug: 'seminar-strategi-investasi-aman',
        title: 'Seminar: Strategi Investasi Aman untuk Masa Pensiun',
        description:
            'Memasuki masa pensiun membutuhkan pergeseran paradigma dalam mengelola kekayaan. Seminar ini dirancang khusus untuk membantu para profesional dan senior yang ingin memastikan aset mereka tetap tumbuh secara stabil tanpa risiko tinggi.\n\nKita akan membahas secara mendalam mengenai manajemen aset berisiko rendah (low-risk asset management), pemilihan instrumen investasi yang memberikan arus kas berkelanjutan, serta cara melindungi daya beli dari inflasi di masa mendatang.',
        thumbnail: '/images/event-placeholder.svg',
        type: 'Seminar Online',
        status: 'Akan Datang',
        speaker_name: 'Dr. Irwan Santoso, CFP',
        speaker_title: 'Financial Strategist',
        speaker_photo: '/images/event-placeholder.svg',
        speaker_quote:
            'Keamanan finansial bukan tentang seberapa banyak Anda hasilkan, tapi seberapa tenang Anda saat tidur.',
        capacity: 200,
        registered_count: 150,
        location: 'Online',
        platform: 'Google Meet',
        start_date: '2024-10-15',
        end_date: null,
        start_time: '09:00',
        registration_deadline: '2024-10-13',
        benefits: [
            'E-Sertifikat Resmi',
            'Materi PPT & Rekaman',
            'Sesi Konsultasi Grup',
        ],
        topics: [
            'Memahami profil risiko investasi di usia 45+',
            'Strategi alokasi aset yang defensif namun progresif',
            'Diversifikasi cerdas: Obligasi negara, Reksadana pasar uang, dan Emas',
            'Perencanaan warisan dan proteksi aset keluarga',
        ],
    };

    const dummyRelated = [
        {
            id: 11,
            slug: 'yoga-meditasi-masa-tua',
            title: 'Yoga & Meditasi: Menjaga Keseimbangan Masa Tua',
            thumbnail: '/images/event-placeholder.svg',
            category: 'Kesehatan',
            type: 'Gratis',
            date: '2024-10-20',
        },
        {
            id: 12,
            slug: 'workshop-portofolio-rendah-risiko',
            title: 'Workshop: Menyusun Portofolio Rendah Risiko',
            thumbnail: '/images/event-placeholder.svg',
            category: 'Keuangan',
            type: 'Berbayar',
            date: '2024-10-22',
        },
        {
            id: 13,
            slug: 'legal-corner-hukum-waris',
            title: 'Legal Corner: Memahami Hukum Waris & Hibah',
            thumbnail: '/images/event-placeholder.svg',
            category: 'Legal',
            type: 'Webinar',
            date: '2024-10-25',
        },
    ];

    // Merge: data dummy jadi dasar, ditimpa props backend (slug dari route tetap kepakai)
    const ev = { ...dummyEvent, ...(event || {}) };
    const related =
        relatedEvents && relatedEvents.length ? relatedEvents : dummyRelated;

    // Nilai turunan buat kartu info
    const lokasi = ev.location
        ? `${ev.location}${ev.platform ? ` (${ev.platform})` : ''}`
        : ev.platform || '-';
    const waktu = ev.start_time ? `${formatJam(ev.start_time)} - Selesai` : '-';
    const paragraphs = (ev.description || '').split('\n\n');

    return (
        <div className="min-h-screen flex flex-col bg-[#FBF9F8]">
            <Head title={ev.title} />

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
                                thumbnail={ev.thumbnail}
                                status={ev.status}
                            />

                            {/* JUDUL */}
                            <h1 className="mt-6 text-3xl lg:text-4xl font-bold text-[#1B1C1C] leading-tight">
                                {ev.title}
                            </h1>

                            {/* GRID INFO 4 KARTU */}
                            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <EventInfoCard
                                    label="Tanggal"
                                    value={formatTanggal(ev.start_date)}
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
                                    label="Lokasi"
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
                                    value={ev.speaker_name}
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
                                <div className="mt-4 space-y-4 text-[#4B5563] leading-relaxed">
                                    {paragraphs.map((paragraph, index) => (
                                        <p key={index}>{paragraph}</p>
                                    ))}
                                </div>
                            </div>

                            {/* TOPIK UTAMA */}
                            <div className="mt-6">
                                <p className="font-bold text-[#1B1C1C]">
                                    Topik Utama:
                                </p>
                                <ul className="mt-3 divide-y divide-[#E4E2E1] border-y border-[#E4E2E1]">
                                    {ev.topics.map((topik, index) => (
                                        <li
                                            key={index}
                                            className="flex items-start gap-3 py-3 text-[#1B1C1C]"
                                        >
                                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#008740]"></span>
                                            <span className="leading-relaxed">
                                                {topik}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* EVENT TERKAIT */}
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
                        </div>

                        {/* ===== KOLOM KANAN (30%) ===== */}
                        <div className="lg:col-span-3">
                            <div className="lg:sticky lg:top-8 space-y-6">
                                <RegistrationCard
                                    slug={ev.slug}
                                    capacity={ev.capacity}
                                    registeredCount={ev.registered_count}
                                    benefits={ev.benefits}
                                    registrationDeadline={
                                        ev.registration_deadline
                                    }
                                />
                                <SpeakerCard
                                    name={ev.speaker_name}
                                    title={ev.speaker_title}
                                    photo={ev.speaker_photo}
                                    quote={ev.speaker_quote}
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
