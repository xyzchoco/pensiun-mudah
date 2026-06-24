import { Head, Link } from '@inertiajs/react';
import PaymentHeader from '@/Components/Payment/PaymentHeader';
import EventInfoGrid from '@/Components/Event/EventInfoGrid';
import EventRegistrationCard from '@/Components/Event/EventRegistrationCard';
import EventFooter from '@/Components/Event/EventFooter';

export default function DaftarEvent({ event, eventSlug }) {
    const ev = event || {};
    const description = ev.description || '';
    const descriptionHtml = /<\/?[a-z][\s\S]*>/i.test(description)
        ? description
        : description
            .split(/\n{2,}/)
            .filter(Boolean)
            .map((paragraph) => `<p>${paragraph}</p>`)
            .join('');
    const venueLabel = ev.is_online ? 'Platform' : 'Lokasi';
    const venueValue = ev.is_online
        ? ev.platform || 'Google Meet'
        : ev.location || 'Lokasi menyusul';
    const venueHref = ev.is_online ? ev.platform_url : ev.location_url;
    const backHref = `/event/${ev.slug || eventSlug || ''}`;

    return (
        <div className="min-h-screen flex flex-col bg-[#FBF9F8]">
            <Head title={`Daftar - ${ev.title}`} />

            <PaymentHeader />

            <main className="flex-1">
                <div className="mx-auto max-w-7xl px-6 lg:px-8 py-8">
                    {/* --- 1. TOP NAVIGATION --- */}
                    <Link
                        href={backHref}
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
                        Kembali ke Detail Event
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
                                    isOnline={ev.is_online}
                                    venueLabel={venueLabel}
                                    venueValue={venueValue}
                                    venueHref={venueHref}
                                    price={ev.price}
                                />
                            </div>

                            {/* Tentang Seminar */}
                            <div className="mt-8">
                                <h2 className="text-xl font-bold text-[#1B1C1C]">
                                    Tentang Seminar
                                </h2>
                                <div
                                    className="prose prose-sm sm:prose-base mt-4 max-w-none text-[#4B5563] prose-headings:text-[#1B1C1C] prose-strong:text-[#1B1C1C] prose-a:text-[#008740]"
                                    dangerouslySetInnerHTML={{
                                        __html:
                                            descriptionHtml ||
                                            '<p>Deskripsi event belum tersedia.</p>',
                                    }}
                                />
                            </div>
                        </div>

                        {/* RIGHT COLUMN */}
                        <div className="lg:col-span-2">
                            <div className="lg:sticky lg:top-8">
                                <EventRegistrationCard
                                    slug={ev.slug}
                                    isOnline={ev.is_online}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <EventFooter />
        </div>
    );
}
