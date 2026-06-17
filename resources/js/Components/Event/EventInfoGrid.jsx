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

const formatTanggal = (tanggal) => {
    if (!tanggal) return '';
    const date = new Date(tanggal);
    if (isNaN(date.getTime())) return tanggal;
    return `${date.getDate()} ${BULAN_SINGKAT[date.getMonth()]} ${date.getFullYear()}`;
};

const formatJam = (jam) => {
    if (!jam) return '';
    return /^\d{1,2}:\d{2}/.test(jam) ? `${jam.substring(0, 5)} WIB` : jam;
};

// Tentukan teks biaya: 0 / null / 'GRATIS' => GRATIS, selain itu format Rupiah
const formatBiaya = (price) => {
    const isFree =
        price === 0 ||
        price == null ||
        `${price}`.toUpperCase() === 'GRATIS' ||
        price === '0';
    if (isFree) return 'GRATIS';
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(price);
};

export default function EventInfoGrid({ date, time, platform, price }) {
    const items = [
        {
            label: 'Tanggal',
            value: formatTanggal(date),
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
            value: formatJam(time),
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {items.map((item, index) => (
                <div
                    key={index}
                    className="flex items-center gap-3 rounded-xl border border-[#E4E2E1] bg-white p-4"
                >
                    <span className="text-[#008740]">{item.icon}</span>
                    <div className="min-w-0">
                        <p className="text-xs text-[#6B7280]">{item.label}</p>
                        <p className="font-bold text-[#1B1C1C] truncate">
                            {item.value}
                        </p>
                    </div>
                </div>
            ))}

            {/* KARTU BIAYA (highlight oranye) */}
            <div className="flex items-center gap-3 rounded-xl border border-[#FF8928] bg-[#FFF4EC] p-4">
                <span className="text-[#FF8928]">
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
                            d="M3 8a2 2 0 012-2h14a2 2 0 012 2v2a2 2 0 000 4v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2a2 2 0 000-4V8z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14 6v12"
                            strokeDasharray="2 2"
                        />
                    </svg>
                </span>
                <div className="min-w-0">
                    <p className="text-xs font-semibold text-[#FF8928]">
                        Biaya
                    </p>
                    <p className="font-bold text-[#FF8928]">
                        {formatBiaya(price)}
                    </p>
                </div>
            </div>
        </div>
    );
}
