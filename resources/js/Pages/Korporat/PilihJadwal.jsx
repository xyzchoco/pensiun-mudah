import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import PaymentHeader from '@/Components/Payment/PaymentHeader';
import Footer from '@/Components/Footer';

const weekdays = ['MIN', 'SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB'];
const rangeStart = 14;
const rangeEnd = 19;

const calendarDays = [
    { id: 'p29', day: 29, muted: true },
    { id: 'p30', day: 30, muted: true },
    ...Array.from({ length: 31 }, (_, i) => ({ id: `c${i + 1}`, day: i + 1 })),
    { id: 'n1', day: 1, muted: true },
    { id: 'n2', day: 2, muted: true },
];

function dayClasses(item) {
    if (item.muted) {
        return 'text-[#C7CAC8]';
    }
    if (item.day === rangeStart || item.day === rangeEnd) {
        return 'bg-[#006B32] font-bold text-white';
    }
    if (item.day > rangeStart && item.day < rangeEnd) {
        return 'bg-[#E5F0E9] text-[#006B32]';
    }
    return 'text-[#1B1C1C] hover:bg-[#F0EDED]';
}

function formatPrice(value) {
    const amount = Number(value) || 0;

    if (amount <= 0) {
        return 'Gratis';
    }

    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
}

export default function PilihJadwal({
    backHref = '/korporat/beli-pelatihan',
    confirmHref = '/korporat/pembayaran-berhasil',
    title = 'Kelas Offline Korporat',
    location = 'Lokasi akan dikonfirmasi',
    eventTime = 'Jadwal akan dikonfirmasi',
    price = 0,
    quantity = 5,
}) {
    const [peserta, setPeserta] = useState(Math.max(1, Number(quantity) || 1));
    const [lokasi, setLokasi] = useState(location);
    const totalPrice = (Number(price) || 0) * peserta;

    const decrement = () => setPeserta((prev) => (prev > 1 ? prev - 1 : 1));
    const increment = () => setPeserta((prev) => prev + 1);

    return (
        <div className="flex min-h-screen flex-col bg-[#FBF9F8] font-['Atkinson_Hyperlegible']">
            <Head title="Pilih Jadwal - Pensiun Mudah" />
            <PaymentHeader />

            <main className="flex-1">
                <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-10">
                    <Link
                        href={backHref}
                        className="inline-flex items-center gap-2 font-bold text-[#006B32] transition-opacity hover:opacity-80"
                    >
                        <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19 12H5M12 19l-7-7 7-7"
                            />
                        </svg>
                        Kembali ke Beli Kelas
                    </Link>

                    <div className="mt-6 grid gap-6 lg:grid-cols-3">
                        <div className="rounded-2xl border border-[#E4E2E1] bg-white p-6 shadow-sm lg:col-span-2">
                            <div className="flex items-start justify-between gap-4">
                                <h1 className="max-w-[10rem] text-2xl font-bold leading-tight text-[#1B1C1C]">
                                    Pilih Rentang Tanggal
                                </h1>
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#E4E2E1] text-[#006B32] transition-colors hover:bg-[#F0EDED]"
                                        aria-label="Bulan sebelumnya"
                                    >
                                        <svg
                                            className="h-5 w-5"
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
                                    </button>
                                    <span className="w-20 text-center font-bold leading-tight text-[#1B1C1C]">
                                        October 2024
                                    </span>
                                    <button
                                        type="button"
                                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#E4E2E1] text-[#006B32] transition-colors hover:bg-[#F0EDED]"
                                        aria-label="Bulan berikutnya"
                                    >
                                        <svg
                                            className="h-5 w-5"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M9 5l7 7-7 7"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-7 gap-1 text-center">
                                {weekdays.map((w) => (
                                    <div
                                        key={w}
                                        className="py-2 text-xs font-bold text-[#9AA6A0]"
                                    >
                                        {w}
                                    </div>
                                ))}
                                {calendarDays.map((item) => (
                                    <div key={item.id} className="py-1">
                                        <span
                                            className={`mx-auto flex h-10 w-full items-center justify-center rounded-lg text-sm ${dayClasses(item)}`}
                                        >
                                            {item.day}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 border-t border-[#E4E2E1] pt-6">
                                <p className="flex items-center gap-2 font-bold text-[#1B1C1C]">
                                    <svg
                                        className="h-5 w-5 text-[#006B32]"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 21s-6-5.686-6-10a6 6 0 1112 0c0 4.314-6 10-6 10z"
                                        />
                                        <circle cx="12" cy="11" r="2" />
                                    </svg>
                                    Tuliskan Usulan Lokasi
                                </p>
                                <input
                                    type="text"
                                    value={lokasi}
                                    onChange={(e) => setLokasi(e.target.value)}
                                    placeholder="Masukkan alamat atau nama lokasi yang diusulkan..."
                                    className="mt-3 w-full rounded-lg border border-[#E4E2E1] bg-white px-4 py-3 text-sm text-[#1B1C1C] outline-none focus:ring-2 focus:ring-[#006B32]/30"
                                />
                                <p className="mt-2 text-xs text-[#9AA6A0]">
                                    Lokasi ini akan digunakan sebagai titik temu
                                    utama untuk sesi tatap muka.
                                </p>
                            </div>
                        </div>

                        <div className="h-fit rounded-2xl border border-[#E4E2E1] bg-[#F6F3F2] p-6">
                            <h2 className="text-xl font-bold text-[#1B1C1C]">
                                Ringkasan Jadwal
                            </h2>
                            <p className="mt-2 text-sm font-semibold text-[#3D4A3E]">
                                {title}
                            </p>

                            <div className="mt-6 space-y-5">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-[#006B32]">
                                            <svg
                                                className="h-5 w-5"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M17 20h5v-1a4 4 0 00-4-4M9 20H4v-1a4 4 0 014-4h2m6-4a3 3 0 11-6 0 3 3 0 016 0zm6 1a2.5 2.5 0 10-3-2.45"
                                                />
                                            </svg>
                                        </span>
                                        <span className="text-sm font-semibold text-[#3D4A3E]">
                                            Jumlah Peserta
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={decrement}
                                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#006B32] text-[#006B32] transition-colors hover:bg-[#006B32]/5"
                                            aria-label="Kurangi peserta"
                                        >
                                            <svg
                                                className="h-4 w-4"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M5 12h14"
                                                />
                                            </svg>
                                        </button>
                                        <span className="w-6 text-center font-bold text-[#1B1C1C]">
                                            {peserta}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={increment}
                                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#006B32] text-[#006B32] transition-colors hover:bg-[#006B32]/5"
                                            aria-label="Tambah peserta"
                                        >
                                            <svg
                                                className="h-4 w-4"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M12 5v14M5 12h14"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#006B32] text-white">
                                        <svg
                                            className="h-5 w-5"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            viewBox="0 0 24 24"
                                        >
                                            <rect
                                                x="3"
                                                y="5"
                                                width="18"
                                                height="16"
                                                rx="2"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M16 3v4M8 3v4M3 10h18"
                                            />
                                        </svg>
                                    </span>
                                    <div>
                                        <p className="text-sm text-[#6B7280]">
                                            Durasi
                                        </p>
                                        <p className="font-bold text-[#1B1C1C]">
                                            14 Okt — 19 Okt, 2024
                                        </p>
                                        <p className="text-sm font-semibold text-[#006B32]">
                                            Sesi Intensif 6 Hari
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-[#006B32]">
                                        <svg
                                            className="h-5 w-5"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M12 21s-6-5.686-6-10a6 6 0 1112 0c0 4.314-6 10-6 10z"
                                            />
                                            <circle cx="12" cy="11" r="2" />
                                        </svg>
                                    </span>
                                    <div>
                                        <p className="text-sm text-[#6B7280]">
                                            Pusat Pelatihan
                                        </p>
                                        <p className="font-bold text-[#1B1C1C]">
                                            Pusat Komunitas Kota
                                        </p>
                                        <p className="text-sm text-[#3D4A3E]">
                                            Jl. Pertumbuhan 32, Sektor 4
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-[#006B32]">
                                        <svg
                                            className="h-5 w-5"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle cx="12" cy="12" r="9" />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M12 7v5l3 2"
                                            />
                                        </svg>
                                    </span>
                                    <div>
                                        <p className="text-sm text-[#6B7280]">
                                            Jadwal Harian
                                        </p>
                                        <p className="font-bold text-[#1B1C1C]">
                                            09:00 AM — 03:00 PM
                                        </p>
                                        <p className="text-sm text-[#3D4A3E]">
                                            Termasuk istirahat teh dan makan
                                            siang
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 border-t border-[#E4E2E1] pt-5">
                                <div className="flex items-center justify-between">
                                    <span className="text-[#3D4A3E]">
                                        Total Biaya
                                    </span>
                                    <span className="text-2xl font-extrabold text-[#006B32]">
                                        Rp 295.000
                                    </span>
                                </div>
                                <Link
                                    href={confirmHref}
                                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#FF8928] py-3.5 font-bold text-white transition-colors hover:bg-[#F57F1E]"
                                >
                                    <svg
                                        className="h-5 w-5"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle cx="12" cy="12" r="9" />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M8.5 12.5l2.5 2.5 4.5-5"
                                        />
                                    </svg>
                                    Konfirmasi Jadwal
                                </Link>
                                <p className="mt-3 text-center text-xs text-[#9AA6A0]">
                                    Pendaftaran aman melalui Pensiun Mudah
                                </p>
                                <p className="mt-1 flex items-center justify-center gap-1 text-xs font-bold text-[#006B32]">
                                    <svg
                                        className="h-4 w-4"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6l7-3z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M9.5 12l1.8 1.8L15 10"
                                        />
                                    </svg>
                                    PENSIUN MUDAH
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
