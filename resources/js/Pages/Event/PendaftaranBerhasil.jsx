import { Head } from '@inertiajs/react';
import PaymentHeader from '@/Components/Payment/PaymentHeader';
import RegistrationSuccessCard from '@/Components/Event/RegistrationSuccessCard';
import EventFooter from '@/Components/Event/EventFooter';

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

// Data dummy fallback
const dummyEvent = {
    id: 1,
    slug: 'seminar-strategi-investasi-aman',
    title: 'Seminar: Strategi Investasi Aman untuk Masa Pensiun',
    date: '2024-10-15',
    time: '09:00',
    platform: 'Google Meet',
};

export default function PendaftaranBerhasil({ event }) {
    const ev = { ...dummyEvent, ...(event || {}) };

    return (
        <div className="min-h-screen flex flex-col bg-[#FBF9F8]">
            <Head title="Pendaftaran Berhasil" />

            <PaymentHeader />

            <main className="flex-1">
                <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12">
                    <RegistrationSuccessCard
                        eventTitle={ev.title}
                        date={formatTanggal(ev.date)}
                        time={formatJam(ev.time)}
                        platform={ev.platform}
                    />
                </div>
            </main>

            <EventFooter />
        </div>
    );
}
