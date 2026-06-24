import { Link } from '@inertiajs/react';
import EventBadge from '@/Components/Event/EventBadge';
import EventMeta from '@/Components/Event/EventMeta';

// Nama bulan singkat (buat format tanggal ke gaya Indonesia)
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

// Format tanggal: '2024-10-15' -> '15 Okt 2024' (fallback: tampilin apa adanya)
const formatTanggal = (tanggal) => {
    if (!tanggal) return '';
    const date = new Date(tanggal);
    if (isNaN(date.getTime())) return tanggal;
    return `${date.getDate()} ${BULAN_SINGKAT[date.getMonth()]} ${date.getFullYear()}`;
};

// Format jam: '09:00:00' -> '09:00 WIB' (fallback: tampilin apa adanya)
const formatJam = (jam) => {
    if (!jam) return '';
    return `${jam.substring(0, 5)} WIB`;
};

const renderLinkedText = (text) => {
    const value = String(text || '');
    const parts = value.split(/(https?:\/\/[^\s<]+)/g);

    return parts.map((part, index) =>
        /^https?:\/\//.test(part) ? (
            <a
                key={`${part}-${index}`}
                href={part}
                target="_blank"
                rel="noopener noreferrer"
                className="break-words text-[#006B32] underline"
            >
                {part}
            </a>
        ) : (
            part
        ),
    );
};

export default function EventCard({ event }) {
    // Normalisasi field: dukung struktur baru (English) & data Webinar lama (Indonesia)
    const slug = event.slug || event.id;
    const detailHref =
        typeof route === 'function' ? route('event.detail', slug) : `/event/${slug}`;
    const registerHref =
        typeof route === 'function'
            ? route('event.daftar', slug)
            : `/event/${slug}/daftar`;
    const title = event.title || event.judul || 'Tanpa Judul';
    const description = event.description || event.deskripsi || '';
    const type =
        event.type ||
        (event.jenis_event === 'Online'
            ? 'Seminar Online'
            : event.jenis_event === 'Offline'
              ? 'Workshop Offline'
              : event.jenis_event) ||
        'Seminar Online';
    const thumbnail =
        event.thumbnail ||
        (event.image_path
            ? `/storage/${event.image_path}`
            : '/images/event-placeholder.svg');
    const speaker = event.speaker || event.narasumber || '-';
    const capacity = event.capacity ?? event.kapasitas;
    const availableSlots = event.available_slots ?? event.sisa;
    const startDate = event.start_date || event.tanggal;
    const startTime = event.start_time || event.jam;
    const isOnline = event.is_online ?? event.jenis_event === 'Online';
    const place =
        event.platform ||
        event.location ||
        event.lokasi ||
        (isOnline ? 'Online' : 'Lokasi menyusul');

    return (
        <div className="flex flex-col overflow-hidden rounded-2xl border border-[#E4E2E1] bg-white shadow-sm hover:shadow-md transition-all">
            {/* --- THUMBNAIL + BADGE --- */}
            <div className="relative">
                <img
                    src={thumbnail}
                    alt={title}
                    className="w-full h-44 object-cover"
                    onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/images/event-placeholder.svg';
                    }}
                />
                <div className="absolute top-3 left-3">
                    <EventBadge type={type} />
                </div>
            </div>

            {/* --- ISI KARTU --- */}
            <div className="flex flex-col flex-1 p-5">
                {/* TANGGAL & JAM */}
                <p className="flex items-center gap-2 text-sm font-bold text-[#FF8928]">
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8 7V3m8 4V3M4 11h16M5 5h14a1 1 0 011 1v13a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1z"
                        />
                    </svg>
                    {formatTanggal(startDate)} • {formatJam(startTime)}
                </p>

                {/* JUDUL */}
                <h3 className="mt-2 text-lg font-bold text-[#1B1C1C] leading-snug line-clamp-2">
                    {title}
                </h3>

                {/* DESKRIPSI SINGKAT */}
                <p className="mt-2 text-sm text-[#6B7280] leading-relaxed line-clamp-2">
                    {renderLinkedText(description)}
                </p>

                {/* META: NARASUMBER, KAPASITAS, LOKASI/PLATFORM */}
                <div className="mt-4 space-y-2">
                    <EventMeta
                        icon={
                            <svg
                                className="w-4 h-4"
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
                    >
                        Narasumber: {speaker}
                    </EventMeta>

                    <EventMeta
                        icon={
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                viewBox="0 0 24 24"
                            >
                                <circle cx="9" cy="8" r="3" />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M2 20a6 6 0 0111-3.3M16 6a3 3 0 010 6m1.5 2.2A6 6 0 0122 20"
                                />
                            </svg>
                        }
                    >
                        Kapasitas: {capacity ?? '-'} • Sisa:{' '}
                        {availableSlots ?? '-'}
                    </EventMeta>

                    <EventMeta
                        icon={
                            isOnline ? (
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    viewBox="0 0 24 24"
                                >
                                    <rect
                                        x="3"
                                        y="4"
                                        width="18"
                                        height="12"
                                        rx="1.5"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M8 20h8M12 16v4"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    className="w-4 h-4"
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
                            )
                        }
                    >
                        {renderLinkedText(place)}
                    </EventMeta>
                </div>

                {/* TOMBOL AKSI */}
                <div className="mt-5 space-y-3">
                    <Link
                        href={detailHref}
                        className="relative z-10 block w-full cursor-pointer rounded-xl border border-[#008740] py-2.5 text-center font-semibold text-[#008740] transition-colors hover:bg-[#F4FAF6] pointer-events-auto"
                    >
                        Lihat Detail
                    </Link>
                    <Link
                        href={registerHref}
                        className="relative z-10 block w-full cursor-pointer rounded-xl bg-[#FF8928] py-2.5 text-center font-bold text-white transition-colors hover:bg-[#F57F1E] pointer-events-auto"
                    >
                        Daftar Sekarang
                    </Link>
                </div>
            </div>
        </div>
    );
}
