import { useForm } from '@inertiajs/react';

export default function EventRegistrationCard({ event, sudahDaftar, daftarHref }) {
    const { post, processing } = useForm();
    const kapasitas = event.kapasitas ?? 0;
    const registeredCount = event.registered_count ?? 0;
    const sisaKuota = Math.max(0, kapasitas - registeredCount);
    const percent = kapasitas > 0 ? Math.min(100, Math.round((registeredCount / kapasitas) * 100)) : 0;

    const isPast = event.status_label === 'Selesai';
    const isFull = sisaKuota <= 0;
    const isDisabled = sudahDaftar || isPast || isFull;

    const submit = (e) => {
        e.preventDefault();
        if (!isDisabled) post(daftarHref);
    };

    return (
        <div className="rounded-2xl border border-[#E4E2E1] bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-[#1B1C1C] mb-4">Pendaftaran</h3>
            <div className="mb-4 flex items-center justify-between text-sm">
                <span className="text-[#6B7280]">Kapasitas Terisi</span>
                <span className="font-bold text-[#008740]">{registeredCount} / {kapasitas}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-[#E5F0E9] mb-4">
                <div className="h-full bg-[#008740]" style={{ width: `${percent}%` }} />
            </div>
            <p className="text-sm text-[#6B7280] mb-6">Tersisa {sisaKuota} kursi lagi</p>

            <button
                onClick={submit}
                disabled={isDisabled || processing}
                className={`w-full rounded-xl py-3 font-bold text-white transition-colors ${isDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#FF8928] hover:bg-[#F57F1E]'}`}
            >
                {sudahDaftar ? 'Sudah Terdaftar' : isFull ? 'Kuota Penuh' : isPast ? 'Pendaftaran Ditutup' : 'Daftar Sekarang'}
            </button>
        </div>
    );
}
