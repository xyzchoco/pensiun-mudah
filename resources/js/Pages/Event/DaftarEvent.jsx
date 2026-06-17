import { Head, Link } from '@inertiajs/react';
import PaymentHeader from '@/Components/Payment/PaymentHeader';
import EventInfoGrid from '@/Components/Event/EventInfoGrid';
import EventRegistrationCard from '@/Components/Event/EventRegistrationCard';
import EventFooter from '@/Components/Event/EventFooter';

// Data dummy fallback (dipakai saat backend belum mengirim props event)
const dummyEvent = {
    id: 1,
    slug: 'seminar-strategi-investasi-aman',
    title: 'Seminar: Strategi Investasi Aman untuk Masa Pensiun',
    thumbnail: '/images/event-placeholder.svg',
    description:
        'Pelajari bagaimana cara mengelola aset Anda dengan risiko minimal di masa pensiun. Seminar ini dirancang khusus untuk memberikan wawasan mendalam mengenai instrumen investasi yang aman, stabil, dan memberikan pertumbuhan berkelanjutan bagi Anda yang memprioritaskan ketenangan pikiran.',
    date: '2024-10-15',
    time: '09:00',
    platform: 'Google Meet',
    price: 0,
};

export default function DaftarEvent({ event }) {
    // Gabungkan dummy dengan props supaya selalu lengkap
    const ev = { ...dummyEvent, ...(event || {}) };

    return (
        <div className="min-h-screen flex flex-col bg-[#FBF9F8]">
            <Head title={`Daftar - ${ev.title}`} />

            <PaymentHeader />

            <main className="flex-1">
                <div className="mx-auto max-w-7xl px-6 lg:px-8 py-8">
                    {/* --- 1. TOP NAVIGATION --- */}
                    <Link
                        href={`/event/${ev.slug}`}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[#008740] hover:text-[#006B32] transition-colors"
                    >
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
                                d="M19 12H5M11 18l-6-6 6-6"
                            />
                        </svg>
                        Kembali ke Daftar Event
                    </Link>

                    {/* --- 2. MAIN GRID (60 / 40) --- */}
                    <div className="mt-6 grid grid-cols-1 lg:grid-cols-5 gap-8">
                        {/* LEFT COLUMN */}
                        <div className="lg:col-span-3">
                            {/* Hero Image */}
                            <div className="overflow-hidden rounded-2xl border border-[#E4E2E1] bg-white">
                                <img
                                    src={
                                        ev.thumbnail ||
                                        '/images/event-placeholder.svg'
                                    }
                                    alt={ev.title}
                                    className="aspect-[16/10] w-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.src =
                                            '/images/event-placeholder.svg';
                                    }}
                                />
                            </div>

                            {/* Title */}
                            <h1 className="mt-6 text-3xl lg:text-4xl font-bold text-[#1B1C1C] leading-tight">
                                {ev.title}
                            </h1>

                            {/* Information Grid */}
                            <div className="mt-6">
                                <EventInfoGrid
                                    date={ev.date}
                                    time={ev.time}
                                    platform={ev.platform}
                                    price={ev.price}
                                />
                            </div>

                            {/* Tentang Seminar */}
                            <div className="mt-8">
                                <h2 className="text-xl font-bold text-[#1B1C1C]">
                                    Tentang Seminar
                                </h2>
                                <p className="mt-4 text-[#4B5563] leading-relaxed whitespace-pre-line">
                                    {ev.description}
                                </p>
                            </div>
                        </div>

                        {/* RIGHT COLUMN */}
                        <div className="lg:col-span-2">
                            <div className="lg:sticky lg:top-8">
                                <EventRegistrationCard slug={ev.slug} />
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <EventFooter />
        </div>
    );
}
