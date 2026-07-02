import { Head, Link } from '@inertiajs/react';
import InstansiLayout from '@/Layouts/InstansiLayout';

const features = [
    {
        icon: 'shield-check',
        title: 'Proteksi Aset',
        desc: 'Cara melindungi tabungan dari inflasi dan risiko pasar.',
    },
    {
        icon: 'cash',
        title: 'Arus Kas Pasif',
        desc: 'Menentukan instrumen investasi yang aman untuk pendapatan rutin.',
    },
    {
        icon: 'clipboard',
        title: 'Perencanaan Waris',
        desc: 'Panduan hukum dan praktis untuk distribusi aset keluarga.',
    },
    {
        icon: 'heart',
        title: 'Dana Kesehatan',
        desc: 'Manajemen asuransi dan biaya medis di usia emas.',
    },
];

const benefits = [
    { icon: 'book', label: 'Materi Cetak & Modul Fisik' },
    { icon: 'badge', label: 'Sertifikat Fisik Berstempel' },
    { icon: 'food', label: 'Makan Siang & Coffee Break' },
];

const testimonials = [
    {
        id: 1,
        name: 'Ibu Sulastri',
        role: 'Pensiunan Guru',
        quote: 'Dahulu saya bingung bagaimana mengelola uang pesangon. Setelah ikut kursus ini, saya lebih tenang karena punya rencana yang matang.',
    },
    {
        id: 2,
        name: 'Bpk. Budi Santoso',
        role: 'Mantan Manajer Bank',
        quote: 'Meskipun saya latar belakang perbankan, strategi khusus masa pensiun di sini sangat relevan dengan kondisi ekonomi saat ini.',
    },
    {
        id: 3,
        name: 'Bpk. Gunawan',
        role: 'Wirausaha Pensiunan',
        quote: 'Materi perihal perencanaan waris sangat membantu keluarga kami dalam menyusun masa depan yang adil bagi anak-cucu.',
    },
];

function getInitials(name) {
    return name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
}

function FeatureIcon({ name }) {
    if (name === 'shield-check') {
        return (
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
                    d="M12 3l7 3v6c0 4-3 6.5-7 9-4-2.5-7-5-7-9V6l7-3z"
                />
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4"
                />
            </svg>
        );
    }
    if (name === 'cash') {
        return (
            <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
            >
                <rect x="3" y="6" width="18" height="12" rx="2" />
                <circle cx="12" cy="12" r="2.5" />
            </svg>
        );
    }
    if (name === 'clipboard') {
        return (
            <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
            >
                <rect x="6" y="4" width="12" height="16" rx="2" />
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 4h6v3H9zM9 11h6M9 15h4"
                />
            </svg>
        );
    }
    return (
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
                d="M12 21C7 17.5 4 14.5 4 10.5A4.5 4.5 0 0112 8a4.5 4.5 0 018 2.5c0 4-3 7-8 10.5z"
            />
        </svg>
    );
}

function BenefitIcon({ name }) {
    if (name === 'book') {
        return (
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
                    d="M4 5a2 2 0 012-2h6v16H6a2 2 0 00-2 2V5zM20 5a2 2 0 00-2-2h-6v16h6a2 2 0 012 2V5z"
                />
            </svg>
        );
    }
    if (name === 'badge') {
        return (
            <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
            >
                <circle cx="12" cy="9" r="5" />
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 13.5L8 21l4-2 4 2-1-7.5"
                />
            </svg>
        );
    }
    return (
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
                d="M5 3v8a3 3 0 003 3v7M8 3v6M11 3v6M17 3c-1.5 1-2 3-2 6s.5 4 2 5v7"
            />
        </svg>
    );
}

export default function DetailPelatihanOffline({
    title = 'Kelas Offline',
    rating = null,
    reviewCount = null,
    instructor = 'Instruktur akan diumumkan',
    duration = '-',
    location = 'Lokasi akan dikonfirmasi',
    eventDate = 'Tanggal akan dikonfirmasi',
    eventTime = 'Jadwal akan dikonfirmasi',
    about = '',
    price = 'Gratis',
    oldPrice = null,
    quantity = 1,
    backHref = '/instansi/beli-pelatihan',
    scheduleHref = '#',
}) {
    return (
        <InstansiLayout showSidebar={false} title={title + ' - Pensiun Mudah'} activeNav="dashboard">
            <main className="flex-1">
                <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
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

                    <div className="mt-4 grid grid-cols-1 gap-8 lg:grid-cols-3">
                        <div className="lg:col-span-2">
                            <h1 className="text-3xl font-bold text-[#1B1C1C] sm:text-4xl">
                                {title}
                            </h1>

                            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-[#3D4A3E]">
                                {rating && (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FCE9D8] px-3 py-1 font-bold text-[#1B1C1C]">
                                    <svg
                                        className="h-4 w-4 text-[#FF8928]"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M10 1.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L10 15l-5.3 2.6 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
                                    </svg>
                                    {rating} ({reviewCount} Review)
                                </span>
                                )}
                                <span className="inline-flex items-center gap-2">
                                    <svg
                                        className="h-4 w-4"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle cx="12" cy="8" r="4" />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M4 21c0-4 4-6 8-6s8 2 8 6"
                                        />
                                    </svg>
                                    Instruktur: {instructor}
                                </span>
                                <span className="inline-flex items-center gap-2">
                                    <svg
                                        className="h-4 w-4"
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
                                    Total Durasi: {duration}
                                </span>
                            </div>

                            <div className="mt-6 rounded-2xl border border-[#006B32]/30 bg-[#F2F8F4] p-6">
                                <h2 className="flex items-center gap-2 text-lg font-bold text-[#006B32]">
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
                                            d="M3 9h18M8 3v4M16 3v4"
                                        />
                                    </svg>
                                    Detail Pelaksanaan Offline
                                </h2>
                                <div className="mt-4 grid gap-6 sm:grid-cols-2">
                                    <div className="flex gap-3">
                                        <svg
                                            className="mt-0.5 h-5 w-5 shrink-0 text-[#006B32]"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M12 21s-7-5.5-7-11a7 7 0 1114 0c0 5.5-7 11-7 11z"
                                            />
                                            <circle cx="12" cy="10" r="2.5" />
                                        </svg>
                                        <div>
                                            <p className="font-bold text-[#1B1C1C]">
                                                Lokasi Pelatihan
                                            </p>
                                            <p className="mt-1 text-sm text-[#3D4A3E]">
                                                {location}
                                            </p>
                                            <button
                                                type="button"
                                                className="mt-1 text-sm font-semibold text-[#006B32] underline"
                                            >
                                                Lihat Peta
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <svg
                                            className="mt-0.5 h-5 w-5 shrink-0 text-[#006B32]"
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
                                                d="M3 9h18M8 3v4M16 3v4"
                                            />
                                        </svg>
                                        <div>
                                            <p className="font-bold text-[#1B1C1C]">
                                                Waktu & Tanggal
                                            </p>
                                            <p className="mt-1 text-sm text-[#3D4A3E]">
                                                {eventDate}
                                            </p>
                                            <p className="text-sm font-bold text-[#1B1C1C]">
                                                {eventTime}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 rounded-2xl border border-[#E4E2E1] bg-white p-6 shadow-sm">
                                <h2 className="text-xl font-bold text-[#006B32]">
                                    Tentang Kursus Ini
                                </h2>
                                <p className="mt-4 leading-relaxed text-[#3D4A3E]">
                                    {about}
                                </p>
                                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                                    {features.map((feature) => (
                                        <div
                                            key={feature.title}
                                            className="flex gap-3"
                                        >
                                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#006B32] text-white">
                                                <FeatureIcon
                                                    name={feature.icon}
                                                />
                                            </span>
                                            <div>
                                                <p className="font-bold text-[#1B1C1C]">
                                                    {feature.title}
                                                </p>
                                                <p className="mt-1 text-sm text-[#3D4A3E]">
                                                    {feature.desc}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-1">
                            <div className="rounded-2xl border-2 border-[#006B32]/30 bg-white p-6 shadow-sm lg:sticky lg:top-24">
                                <p className="text-[#3D4A3E]">
                                    Investasi Ilmu:
                                </p>
                                <p className="mt-1 text-4xl font-bold text-[#006B32]">
                                    {price}
                                </p>
                                {oldPrice && (
                                <p className="text-lg font-bold text-[#BA1A1A] line-through">
                                    {oldPrice}
                                </p>
                                )}

                                <div className="mt-5 space-y-4 border-t border-[#E4E2E1] pt-5">
                                    {benefits.map((benefit) => (
                                        <div
                                            key={benefit.label}
                                            className="flex items-center gap-3"
                                        >
                                            <span className="text-[#006B32]">
                                                <BenefitIcon
                                                    name={benefit.icon}
                                                />
                                            </span>
                                            <p className="font-bold text-[#1B1C1C]">
                                                {benefit.label}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                <Link
                                    href={scheduleHref}
                                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF8928] px-6 py-3.5 font-bold text-white transition-colors hover:bg-[#F57F1E]"
                                >
                                    Beli Sekarang
                                    <svg
                                        className="h-5 w-5"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle cx="9" cy="20" r="1" />
                                        <circle cx="18" cy="20" r="1" />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M3 4h2l2.5 12h10l2-8H6"
                                        />
                                    </svg>
                                </Link>

                                <div className="mt-4 flex items-center justify-center gap-3">
                                    <button
                                        type="button"
                                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#006B32] text-xl font-bold text-[#006B32] transition-colors hover:bg-[#F0EDED]"
                                        aria-label="Kurangi jumlah"
                                    >
                                        -
                                    </button>
                                    <span className="flex h-9 w-11 items-center justify-center rounded-lg bg-[#FF8928] text-lg font-bold text-white">
                                        {quantity}
                                    </span>
                                    <button
                                        type="button"
                                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#006B32] text-xl font-bold text-[#006B32] transition-colors hover:bg-[#F0EDED]"
                                        aria-label="Tambah jumlah"
                                    >
                                        +
                                    </button>
                                </div>

                                <p className="mt-3 text-center text-sm text-[#6B7280]">
                                    Akses seumur hidup. Jaminan 7 hari uang
                                    kembali.
                                </p>
                            </div>
                        </div>
                    </div>

                    <section className="mt-12">
                        <h2 className="text-2xl font-bold text-[#006B32]">
                            Apa Kata Mereka?
                        </h2>
                        <div className="mt-6 grid gap-6 md:grid-cols-3">
                            {testimonials.map((testimonial) => (
                                <div
                                    key={testimonial.id}
                                    className="rounded-2xl border border-[#E4E2E1] bg-white p-6 shadow-sm"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#006B32] text-sm font-bold text-white">
                                            {getInitials(testimonial.name)}
                                        </span>
                                        <div>
                                            <p className="font-bold text-[#1B1C1C]">
                                                {testimonial.name}
                                            </p>
                                            <p className="text-sm text-[#6B7280]">
                                                {testimonial.role}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="mt-4 italic leading-relaxed text-[#3D4A3E]">
                                        "{testimonial.quote}"
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </main>

            </InstansiLayout>
    );
}
