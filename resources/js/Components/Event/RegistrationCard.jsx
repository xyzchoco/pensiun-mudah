import { Link } from '@inertiajs/react';

// Nama bulan singkat buat format tanggal penutupan
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

export default function RegistrationCard({
    slug,
    capacity = 0,
    registeredCount = 0,
    benefits = [],
    registrationDeadline,
}) {
    // Hitung persentase keterisian & sisa kursi (clamp aman 0-100)
    const percent =
        capacity > 0
            ? Math.min(100, Math.round((registeredCount / capacity) * 100))
            : 0;
    const remaining = Math.max(0, capacity - registeredCount);

    return (
        <div className="rounded-2xl border border-[#E4E2E1] bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-[#1B1C1C]">
                Pendaftaran Peserta
            </h3>

            {/* KAPASITAS */}
            <div className="mt-5 flex items-center justify-between">
                <span className="text-sm text-[#6B7280]">Kapasitas Terisi</span>
                <span className="text-xl font-bold text-[#008740]">
                    {registeredCount}{' '}
                    <span className="font-semibold text-[#6B7280]">
                        / {capacity}
                    </span>
                </span>
            </div>

            {/* PROGRESS BAR */}
            <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-[#E5F0E9]">
                <div
                    className="h-full rounded-full bg-[#008740] transition-all"
                    style={{ width: `${percent}%` }}
                ></div>
            </div>
            <p className="mt-2 text-right text-sm text-[#6B7280]">
                Tersisa {remaining} kursi lagi
            </p>

            {/* BENEFIT */}
            <ul className="mt-5 space-y-3">
                {benefits.map((benefit, index) => (
                    <li
                        key={index}
                        className="flex items-center gap-2.5 text-sm font-semibold text-[#1B1C1C]"
                    >
                        <svg
                            className="w-5 h-5 shrink-0 text-[#22C55E]"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm-1.2 14.2l-4-4 1.4-1.4 2.6 2.6 5.6-5.6 1.4 1.4-7 7z" />
                        </svg>
                        {benefit}
                    </li>
                ))}
            </ul>

            {/* CTA */}
            <Link
                href={`/event/${slug}/daftar`}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF8928] py-3 font-bold text-white hover:bg-[#F57F1E] transition-colors"
            >
                Daftar Sekarang
                <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 12h14M13 6l6 6-6 6"
                    />
                </svg>
            </Link>

            <p className="mt-4 text-center text-sm text-[#6B7280]">
                Pendaftaran ditutup {formatTanggal(registrationDeadline)}
            </p>
        </div>
    );
}
