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
    event,
    sudahDaftar,
    daftarHref,
}) {
    const kapasitas = event.kapasitas ?? 0;
    const registeredCount = event.registered_count ?? 0;
    const sisaKuota = Math.max(0, kapasitas - registeredCount);
    const percent = kapasitas > 0 ? Math.min(100, Math.round((registeredCount / kapasitas) * 100)) : 0;

    const isPast = event.status_label === 'Selesai';
    const isFull = sisaKuota <= 0;
    const isDisabled = sudahDaftar || isPast || isFull;

    return (
        <div className="rounded-2xl border border-[#E4E2E1] bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-[#1B1C1C]">Pendaftaran Peserta</h3>

            <div className="mt-5 flex items-center justify-between">
                <span className="text-sm text-[#6B7280]">Kapasitas Terisi</span>
                <span className="text-xl font-bold text-[#008740]">
                    {registeredCount} <span className="font-semibold text-[#6B7280]">/ {kapasitas}</span>
                </span>
            </div>

            <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-[#E5F0E9]">
                <div className="h-full rounded-full bg-[#008740] transition-all" style={{ width: `${percent}%` }} />
            </div>
            <p className="mt-2 text-right text-sm text-[#6B7280]">Tersisa {sisaKuota} kursi lagi</p>

            <Link
                href={sudahDaftar ? '#' : daftarHref}
                disabled={isDisabled}
                className={`mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-3 font-bold text-white transition-colors ${isDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#FF8928] hover:bg-[#F57F1E]'
                    }`}
            >
                {sudahDaftar ? 'Sudah Terdaftar' : isFull ? 'Kuota Penuh' : isPast ? 'Pendaftaran Ditutup' : 'Daftar Sekarang'}
            </Link>
        </div>
    );
}
