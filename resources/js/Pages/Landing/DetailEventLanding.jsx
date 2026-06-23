import { Head, Link } from '@inertiajs/react';
import LandingHeader from '@/Components/Landing/LandingHeader';
import Footer from '@/Components/Footer';

const infoItems = [
    { id: 'tanggal', label: 'Tanggal', value: '15 Okt 2024', icon: 'calendar' },
    {
        id: 'waktu',
        label: 'Waktu',
        value: '09:00 WIB - Selesai',
        icon: 'clock',
    },
    {
        id: 'lokasi',
        label: 'Lokasi',
        value: 'Online (Google Meet)',
        icon: 'pin',
    },
    {
        id: 'pembicara',
        label: 'Pembicara',
        value: 'Dr. Irwan Santoso, CFP',
        icon: 'user',
    },
];

const benefits = [
    'E-Sertifikat Resmi',
    'Materi PPT & Rekaman',
    'Sesi Konsultasi Grup',
];

const topics = [
    'Memahami profil risiko investasi di usia 45+',
    'Strategi alokasi aset yang defensif namun progresif',
    'Diversifikasi cerdas: Obligasi negara, Reksadana pasar uang, dan Emas',
    'Perencanaan warisan dan proteksi aset keluarga',
];

const relatedEvents = [
    {
        id: 1,
        date: '20 Okt',
        category: 'Kesehatan',
        title: 'Yoga & Meditasi: Menjaga Keseimbangan Masa Tua',
        type: 'Gratis',
        href: '/event/yoga-meditasi',
    },
    {
        id: 2,
        date: '22 Okt',
        category: 'Keuangan',
        title: 'Workshop: Menyusun Portofolio Rendah Risiko',
        type: 'Berbayar',
        href: '/event/workshop-portofolio',
    },
    {
        id: 3,
        date: '25 Okt',
        category: 'Legal',
        title: 'Legal Corner: Memahami Hukum Waris & Hibah',
        type: 'Webinar',
        href: '/event/legal-corner',
    },
];

const heroBars = [
    'h-[35%]',
    'h-[55%]',
    'h-[45%]',
    'h-[70%]',
    'h-[60%]',
    'h-[85%]',
    'h-[72%]',
    'h-[95%]',
    'h-[80%]',
    'h-[65%]',
];

function getInitials(name) {
    return name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
}

function InfoIcon({ name }) {
    if (name === 'calendar') {
        return (
            <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
            >
                <rect x="3" y="5" width="18" height="16" rx="2" />
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 3v4M8 3v4M3 10h18"
                />
            </svg>
        );
    }
    if (name === 'clock') {
        return (
            <svg
                className="h-5 w-5"
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
        );
    }
    if (name === 'pin') {
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
                    d="M12 21s-6-5.686-6-10a6 6 0 1112 0c0 4.314-6 10-6 10z"
                />
                <circle cx="12" cy="11" r="2" />
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
            <circle cx="12" cy="8" r="4" />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 21c0-4 4-6 8-6s8 2 8 6"
            />
        </svg>
    );
}

export default function DetailEvent({
    event,
    title = 'Seminar: Strategi Investasi Aman untuk Masa Pensiun',
    status = 'Akan Datang',
    capacityFilled = 150,
    capacityTotal = 200,
    seatsLeft = 50,
    closeDate = '13 Okt 2024',
    registerHref = '/register',
    backHref = '/',
    speakerName = 'Dr. Irwan Santoso, CFP',
    speakerRole = 'Financial Strategist',
    speakerQuote = 'Keamanan finansial bukan tentang seberapa banyak Anda hasilkan, tapi seberapa tenang Anda saat tidur.',
}) {
    const eventData = event || {};
    const detailTitle = eventData.title || eventData.judul || title;
    const detailDescription =
        eventData.description ||
        eventData.deskripsi ||
        'Memasuki masa pensiun membutuhkan pergeseran paradigma dalam mengelola kekayaan. Seminar ini dirancang khusus untuk membantu para profesional dan senior yang ingin memastikan aset mereka tetap tumbuh secara stabil tanpa risiko tinggi.';
    const detailDate = eventData.start_date
        ? new Date(eventData.start_date).toLocaleDateString('id-ID', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
          })
        : infoItems[0].value;
    const detailTime = eventData.start_time
        ? `${String(eventData.start_time).slice(0, 5)} WIB - Selesai`
        : infoItems[1].value;
    const detailLocation =
        eventData.location || eventData.platform || infoItems[2].value;
    const detailSpeaker =
        eventData.speaker_name || eventData.speaker || speakerName;
    const detailImage =
        eventData.thumbnail ||
        (eventData.image_path ? `/storage/${eventData.image_path}` : null);
    const detailCapacityTotal =
        eventData.capacity || eventData.kapasitas || capacityTotal;
    const detailSeatsLeft =
        eventData.available_slots || eventData.sisa_kuota || seatsLeft;
    const detailCapacityFilled =
        eventData.registered_count ??
        Math.max(Number(detailCapacityTotal) - Number(detailSeatsLeft), 0) ??
        capacityFilled;
    const detailRegisterHref = registerHref || '/register';
    const dynamicInfoItems = [
        { ...infoItems[0], value: detailDate },
        { ...infoItems[1], value: detailTime },
        { ...infoItems[2], value: detailLocation },
        { ...infoItems[3], value: detailSpeaker },
    ];
    const descriptionParagraphs = String(detailDescription)
        .split('\n\n')
        .filter(Boolean);

    return (
        <div className="flex min-h-screen flex-col bg-[#FBF9F8] font-['Atkinson_Hyperlegible']">
            <Head title={detailTitle + ' - Pensiun Mudah'} />
            <LandingHeader loginHref="/login" registerHref={detailRegisterHref} />

            <main className="flex-1">
                <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-10">
                    <Link
                        href={backHref}
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
                        Kembali ke Daftar Event
                    </Link>

                    <div className="mt-6 grid gap-8 lg:grid-cols-3">
                        <div className="space-y-8 lg:col-span-2">
                            <div className="relative flex aspect-video items-end overflow-hidden rounded-2xl bg-gradient-to-br from-[#0E2A3A] to-[#06141C] p-6">
                                <span className="absolute left-5 top-5 rounded-full bg-[#FF8928] px-4 py-1.5 text-sm font-bold text-white">
                                    {status}
                                </span>
                                {detailImage ? (
                                    <img
                                        src={detailImage}
                                        alt={detailTitle}
                                        className="absolute inset-0 h-full w-full object-cover"
                                            onError={(e) => {
                                            e.currentTarget.src = '/images/cuqi.png';
                                        }}
                                    />
                                ) : (
                                    <div className="flex h-1/2 w-full items-end justify-center gap-2 opacity-80">
                                        {heroBars.map((bar, index) => (
                                            <span
                                                key={index}
                                                className={`w-4 rounded-t bg-gradient-to-t from-[#0FB5A8]/30 to-[#5EEAD4] sm:w-6 ${bar}`}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>

                            <h1 className="text-3xl font-bold leading-tight text-[#1B1C1C] sm:text-4xl">
                                {detailTitle}
                            </h1>

                            <div className="grid gap-4 sm:grid-cols-2">
                                {dynamicInfoItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center gap-4 rounded-2xl border border-[#E4E2E1] bg-white p-4 shadow-sm"
                                    >
                                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#22C55E] text-white">
                                            <InfoIcon name={item.icon} />
                                        </span>
                                        <div className="min-w-0">
                                            <p className="text-xs text-[#6B7280]">
                                                {item.label}
                                            </p>
                                            <p className="font-bold text-[#1B1C1C]">
                                                {item.value}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div>
                                <h2 className="border-l-4 border-[#006B32] pl-3 text-xl font-bold text-[#1B1C1C]">
                                    Tentang Seminar Ini
                                </h2>
                                {descriptionParagraphs.map((paragraph, index) => (
                                    <p key={index} className="mt-4 text-[#3D4A3E]">
                                        {paragraph}
                                    </p>
                                ))}
                                <p className="mt-5 font-bold text-[#1B1C1C]">
                                    Topik Utama:
                                </p>
                                <ul className="mt-2 divide-y divide-[#E4E2E1]">
                                    {topics.map((topic, index) => (
                                        <li
                                            key={index}
                                            className="flex items-start gap-3 py-3 text-[#3D4A3E]"
                                        >
                                            <svg
                                                className="mt-1 h-4 w-4 shrink-0 text-[#006B32]"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                            {topic}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-[#1B1C1C]">
                                    Event Terkait Lainnya
                                </h2>
                                <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                    {relatedEvents.map((event) => (
                                        <div
                                            key={event.id}
                                            className="overflow-hidden rounded-2xl border border-[#E4E2E1] bg-white shadow-sm"
                                        >
                                            <div className="relative flex h-32 items-start justify-end bg-gradient-to-br from-[#1B3326] to-[#0C1A12] p-3">
                                                <span className="rounded-md bg-white px-2 py-1 text-xs font-bold text-[#1B1C1C]">
                                                    {event.date}
                                                </span>
                                            </div>
                                            <div className="p-4">
                                                <p className="text-xs font-bold uppercase tracking-wider text-[#006B32]">
                                                    {event.category}
                                                </p>
                                                <h3 className="mt-1 font-bold leading-snug text-[#1B1C1C]">
                                                    {event.title}
                                                </h3>
                                                <div className="mt-3 flex items-center justify-between">
                                                    <span className="text-sm text-[#6B7280]">
                                                        {event.type}
                                                    </span>
                                                    <Link
                                                        href={event.href}
                                                        className="inline-flex items-center gap-1 text-sm font-bold text-[#006B32] hover:underline"
                                                    >
                                                        Detail
                                                        <svg
                                                            className="h-4 w-4"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="M7 17L17 7M9 7h8v8"
                                                            />
                                                        </svg>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="rounded-2xl border border-[#E4E2E1] bg-[#F6F3F2] p-6">
                                <h2 className="text-lg font-bold text-[#1B1C1C]">
                                    Pendaftaran Peserta
                                </h2>
                                <div className="mt-4 flex items-center justify-between">
                                    <span className="text-sm text-[#3D4A3E]">
                                        Kapasitas Terisi
                                    </span>
                                    <span className="text-xl font-extrabold text-[#006B32]">
                                        {detailCapacityFilled} / {detailCapacityTotal}
                                    </span>
                                </div>
                                <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-[#E4E2E1]">
                                    <div className="h-full w-[75%] rounded-full bg-[#006B32]" />
                                </div>
                                <p className="mt-2 text-right text-xs text-[#6B7280]">
                                    Tersisa {detailSeatsLeft} kursi lagi
                                </p>

                                <ul className="mt-5 space-y-3">
                                    {benefits.map((benefit) => (
                                        <li
                                            key={benefit}
                                            className="flex items-center gap-3 text-sm font-semibold text-[#1B1C1C]"
                                        >
                                            <svg
                                                className="h-5 w-5 shrink-0 text-[#22C55E]"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.7-9.3a1 1 0 00-1.4-1.4L9 10.6 7.7 9.3a1 1 0 00-1.4 1.4l2 2a1 1 0 001.4 0l4-4z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            {benefit}
                                        </li>
                                    ))}
                                </ul>

                                <Link
                                    href={detailRegisterHref}
                                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#FF8928] py-3.5 font-bold text-white transition-colors hover:bg-[#F57F1E]"
                                >
                                    Daftar Sekarang
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
                                            d="M5 12h14M12 5l7 7-7 7"
                                        />
                                    </svg>
                                </Link>
                                <p className="mt-3 text-center text-xs text-[#6B7280]">
                                    Pendaftaran ditutup {closeDate}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-dashed border-[#9AA6A0] bg-white p-6">
                                <div className="flex items-center gap-3">
                                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#006B32] font-bold text-white">
                                        {getInitials(detailSpeaker)}
                                    </span>
                                    <div>
                                        <p className="font-bold text-[#1B1C1C]">
                                            {detailSpeaker}
                                        </p>
                                        <p className="text-sm text-[#006B32]">
                                            {speakerRole}
                                        </p>
                                    </div>
                                </div>
                                <p className="mt-4 text-sm italic text-[#3D4A3E]">
                                    "{speakerQuote}"
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
