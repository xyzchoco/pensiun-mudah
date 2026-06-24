import { Head, Link } from '@inertiajs/react';
import PaymentHeader from '@/Components/Payment/PaymentHeader';
import EventGrid from '@/Components/Event/EventGrid';
import EventFooter from '@/Components/Event/EventFooter';

export default function SemuaEvent({ events }) {
    const list = events || [];

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
