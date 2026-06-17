// Kartu ringkasan event (border hijau, 3 kolom) di halaman sukses
export default function EventSummaryCard({ date, time, platform }) {
    const items = [
        {
            label: 'Tanggal',
            value: date,
            icon: (
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
            ),
        },
        {
            label: 'Waktu',
            value: time,
            icon: (
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
            ),
        },
        {
            label: 'Platform',
            value: platform,
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                >
                    <rect x="3" y="4" width="18" height="12" rx="1.5" />
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 20h8M12 16v4"
                    />
                </svg>
            ),
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 rounded-xl border border-[#008740] bg-white p-5">
            {items.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                    <span className="text-[#008740]">{item.icon}</span>
                    <div className="text-left">
                        <p className="text-xs text-[#6B7280]">{item.label}</p>
                        <p className="font-bold text-[#1B1C1C]">{item.value}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
