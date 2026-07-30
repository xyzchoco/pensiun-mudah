import { Head, Link, usePage } from '@inertiajs/react';
import PaymentHeader from '@/Components/Payment/PaymentHeader';
import EventFooter from '@/Components/Event/EventFooter';

export default function PendaftaranBerhasil({ message }) {
    const { flash } = usePage().props;
    const infoMessage = message || flash?.success || 'Pendaftaran berhasil!';

    return (
        <div className="min-h-screen flex flex-col bg-[#FBF9F8]">
            <Head title="Pendaftaran Berhasil - Pensiun Mudah" />

            <PaymentHeader />

            <main className="flex-1 flex items-center justify-center px-6 py-16">
                <div className="w-full max-w-md text-center">
                    {/* Ikon sukses */}
                    <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#DCFCE7]">
                        <svg
                            className="h-12 w-12 text-[#16A34A]"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>

                    <h1 className="text-3xl font-bold text-[#1B1C1C]">Pendaftaran Berhasil!</h1>

                    <p className="mt-3 text-[#6B7280]">
                        {infoMessage}
                    </p>

                    <p className="mt-2 text-sm text-[#6B7280]">
                        Notifikasi konfirmasi telah dikirim ke akun Anda. Sampai jumpa di event-nya!
                    </p>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                        <Link
                            href={route('event.index')}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#008740] px-6 py-3 font-bold text-white transition-colors hover:bg-[#006B32]"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3M4 11h16M5 5h14a1 1 0 011 1v13a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1z" />
                            </svg>
                            Lihat Event Saya
                        </Link>

                        <Link
                            href={route('dashboard')}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E4E2E1] bg-white px-6 py-3 font-bold text-[#1B1C1C] transition-colors hover:bg-[#F6F3F2]"
                        >
                            Kembali ke Beranda
                        </Link>
                    </div>
                </div>
            </main>

            <EventFooter />
        </div>
    );
}
