import { Head, Link } from '@inertiajs/react';
import PaymentHeader from '@/Components/Payment/PaymentHeader';
import EventGrid from '@/Components/Event/EventGrid';
import EventFooter from '@/Components/Event/EventFooter';

export default function SemuaEvent({ events }) {
    // Data event (anggap dari backend, kasih default biar aman dirender persis screenshot)
    const list =
        events && events.length
            ? events
            : [
                  {
                      id: 1,
                      slug: 'seminar-strategi-investasi-aman',
                      title: 'Seminar: Strategi Investasi Aman untuk Masa Pensiun',
                      description:
                          'Pelajari cara mengelola aset dan memilih instrumen investasi rendah risiko untuk masa pensiun yang tenang.',
                      thumbnail: '/images/event-placeholder.svg',
                      type: 'Seminar Online',
                      speaker: 'Budi Santoso (Financial Planner)',
                      capacity: 100,
                      available_slots: 12,
                      location: null,
                      platform: 'Google Meet',
                      start_date: '2024-10-15',
                      start_time: '09:00',
                      is_online: true,
                  },
                  {
                      id: 2,
                      slug: 'workshop-budidaya-hidroponik',
                      title: 'Workshop: Budidaya Hidroponik Skala Rumah Tangga',
                      description:
                          'Praktik langsung menanam sayuran organik di lahan terbatas untuk hobi sekaligus penghasilan tambahan.',
                      thumbnail: '/images/event-placeholder.svg',
                      type: 'Workshop Offline',
                      speaker: 'Ir. Haryono (Ahli Agronomi)',
                      capacity: 25,
                      available_slots: 5,
                      location: 'Botanical Garden, Jakarta Selatan',
                      platform: null,
                      start_date: '2024-10-20',
                      start_time: '10:00',
                      is_online: false,
                  },
                  {
                      id: 3,
                      slug: 'seminar-bisnis-digital-pensiun',
                      title: 'Seminar: Memulai Bisnis Digital Setelah Pensiun',
                      description:
                          'Strategi praktis membangun toko online dan jasa digital tanpa modal besar bagi para purnabakti.',
                      thumbnail: '/images/event-placeholder.svg',
                      type: 'Seminar Online',
                      speaker: 'Maya Putri (Digital Strategist)',
                      capacity: 200,
                      available_slots: 45,
                      location: null,
                      platform: 'Zoom Webinar',
                      start_date: '2024-10-25',
                      start_time: '14:00',
                      is_online: true,
                  },
                  {
                      id: 4,
                      slug: 'workshop-kesehatan-sendi',
                      title: 'Workshop: Menjaga Kesehatan Sendi di Usia Emas',
                      description:
                          'Latihan fisik ringan dan tips nutrisi untuk menjaga mobilitas tubuh tetap prima di usia senja.',
                      thumbnail: '/images/event-placeholder.svg',
                      type: 'Workshop Offline',
                      speaker: 'dr. Andi Wijaya (Sp.OT)',
                      capacity: 30,
                      available_slots: 8,
                      location: 'Wellness Center, Bandung',
                      platform: null,
                      start_date: '2024-11-02',
                      start_time: '08:00',
                      is_online: false,
                  },
              ];

    return (
        <div className="min-h-screen flex flex-col bg-[#FBF9F8]">
            <Head title="Semua Event" />

            <PaymentHeader />

            <main className="flex-1">
                <div className="mx-auto max-w-7xl px-6 lg:px-8 py-8">
                    {/* --- 1. NAVIGASI KEMBALI --- */}
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[#008740] hover:text-[#006B32] transition-colors"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                        Kembali ke Dashboard
                    </Link>

                    {/* --- 2. GRID EVENT --- */}
                    <div className="mt-6">
                        <EventGrid events={list} />
                    </div>
                </div>
            </main>

            <EventFooter />
        </div>
    );
}
