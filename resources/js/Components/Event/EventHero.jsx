// Konfigurasi warna badge status event
const STATUS_STYLE = {
    'Akan Datang': 'bg-[#FF8928]',
    Berlangsung: 'bg-[#008740]',
    Selesai: 'bg-[#6B7280]',
};

export default function EventHero({ thumbnail, status = 'Akan Datang' }) {
    const badge = STATUS_STYLE[status] || 'bg-[#FF8928]';

    return (
        <div className="relative overflow-hidden rounded-2xl border border-[#E4E2E1]">
            <img
                src={thumbnail || '/images/event-placeholder.svg'}
                alt=""
                className="w-full aspect-[16/10] object-cover"
                onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/images/event-placeholder.svg';
                }}
            />
            <span
                className={`absolute top-4 left-4 rounded-full px-4 py-1.5 text-sm font-bold text-white ${badge}`}
            >
                {status}
            </span>
        </div>
    );
}
