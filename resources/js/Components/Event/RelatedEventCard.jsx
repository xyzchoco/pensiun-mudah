import { Link } from '@inertiajs/react';

// Nama bulan singkat buat badge tanggal di pojok thumbnail
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

const formatTanggalSingkat = (tanggal) => {
    if (!tanggal) return '';
    const date = new Date(tanggal);
    if (isNaN(date.getTime())) return '';
    return `${date.getDate()} ${BULAN_SINGKAT[date.getMonth()]}`;
};

export default function RelatedEventCard({ event }) {
    const slug = event.slug || event.id;
    const thumbnail = event.thumbnail || event.image_url || '/images/event-placeholder.svg';
    const tanggal = formatTanggalSingkat(event.date || event.tanggal || event.start_date);

    return (
        <div className="flex flex-col overflow-hidden rounded-2xl border border-[#E4E2E1] bg-white hover:shadow-md transition-all">
            {/* THUMBNAIL + BADGE TANGGAL */}
            <div className="relative">
                <img
                    src={thumbnail}
                    alt={event.title}
                    className="w-full h-36 object-cover"
                    onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/images/event-placeholder.svg';
                    }}
                />
                {tanggal && (
                    <span className="absolute top-3 right-3 rounded-md bg-white px-2 py-1 text-xs font-bold text-[#1B1C1C] shadow-sm">
                        {tanggal}
                    </span>
                )}
            </div>

            {/* ISI */}
            <div className="flex flex-1 flex-col p-4">
                <p className="text-sm font-bold text-[#008740]">
                    {event.category || event.kategori}
                </p>
                <h4 className="mt-1 font-bold text-[#1B1C1C] leading-snug line-clamp-2">
                    {event.title || event.judul}
                </h4>

                <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm text-[#6B7280]">{event.type || event.jenis_event}</span>
                    <Link
                        href={`/event/${slug}`}
                        className="inline-flex items-center gap-1 text-sm font-bold text-[#008740] hover:text-[#006B32] transition-colors"
                    >
                        Detail
                        <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M14 5h5v5M19 5l-7 7M12 5H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-5"
                            />
                        </svg>
                    </Link>
                </div>
            </div>
        </div>
    );
}
