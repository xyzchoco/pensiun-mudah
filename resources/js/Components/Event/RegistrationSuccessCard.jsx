import { Link } from '@inertiajs/react';
import EventSummaryCard from '@/Components/Event/EventSummaryCard';

export default function RegistrationSuccessCard({
    eventTitle,
    date,
    time,
    platform,
}) {
    return (
        <div className="mx-auto max-w-2xl rounded-3xl border border-[#E4E2E1] bg-white p-8 lg:p-12 shadow-sm">
            {/* IKON SUKSES */}
            <div className="flex justify-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#008740] ring-8 ring-[#ECF7F0]">
                    <svg
                        className="w-12 h-12 text-white"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                </div>
            </div>

            {/* JUDUL */}
            <h1 className="mt-6 text-center text-3xl font-bold text-[#008740]">
                Pendaftaran Berhasil!
            </h1>

            {/* DESKRIPSI */}
            <p className="mt-4 text-center text-[#4B5563] leading-relaxed">
                Terima kasih telah mendaftar untuk mengikuti{' '}
                <span className="font-bold text-[#1B1C1C]">{eventTitle}</span>.
                Kami sangat senang Anda mengambil langkah ini untuk pertumbuhan
                masa depan Anda.
            </p>

            {/* RINGKASAN EVENT */}
            <div className="mt-8">
                <EventSummaryCard date={date} time={time} platform={platform} />
            </div>

            {/* NOTICE EMAIL */}
            <div className="mt-6 flex gap-3 rounded-r-xl border-l-4 border-[#FF8928] bg-[#FFF7ED] p-4">
                <svg
                    className="w-5 h-5 shrink-0 text-[#FF8928]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 8l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                </svg>
                <p className="text-sm leading-relaxed text-[#92400E]">
                    Link undangan pertemuan dan detail login telah dikirimkan ke
                    alamat email terdaftar Anda. Mohon periksa folder kotak
                    masuk atau spam Anda.
                </p>
            </div>

            {/* TOMBOL */}
            <div className="mt-8 flex justify-center">
                <Link
                    href="/dashboard"
                    className="rounded-xl border border-[#008740] px-8 py-3 font-semibold text-[#008740] hover:bg-[#F4FAF6] transition-colors"
                >
                    Kembali ke Beranda
                </Link>
            </div>
        </div>
    );
}
