// Konfigurasi warna + ikon per jenis event (samain pola badge di Dashboard)
const EVENT_TYPES = {
    'Seminar Online': { bg: 'bg-[#008740]', variant: 'online' },
    Webinar: { bg: 'bg-[#2563EB]', variant: 'online' },
    'Workshop Offline': { bg: 'bg-[#E11D48]', variant: 'offline' },
    'Pelatihan Tatap Muka': { bg: 'bg-[#FF8928]', variant: 'offline' },
};

export default function EventBadge({ type }) {
    // Ambil config sesuai tipe, fallback ke hijau kalau tipe nggak dikenal
    const config = EVENT_TYPES[type] || {
        bg: 'bg-[#008740]',
        variant: 'online',
    };

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold text-white ${config.bg}`}
        >
            {config.variant === 'online' ? (
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
                        d="M15 10l4.5-2.5v9L15 14M4 6h9a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z"
                    />
                </svg>
            ) : (
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
                        d="M12 21s7-5.2 7-11a7 7 0 10-14 0c0 5.8 7 11 7 11z"
                    />
                    <circle cx="12" cy="10" r="2.5" />
                </svg>
            )}
            {type}
        </span>
    );
}
