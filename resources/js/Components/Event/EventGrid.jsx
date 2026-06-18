import EventCard from '@/Components/Event/EventCard';

// Grid responsif daftar event (3 kolom desktop, 2 tablet, 1 mobile)
export default function EventGrid({ events = [] }) {
    // Kondisi kosong: kasih pesan ramah
    if (!events || events.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-[#E4E2E1] bg-white py-16 text-center">
                <p className="text-[#6B7280]">
                    Belum ada event yang tersedia saat ini.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
                <EventCard key={event.id || event.slug} event={event} />
            ))}
        </div>
    );
}
