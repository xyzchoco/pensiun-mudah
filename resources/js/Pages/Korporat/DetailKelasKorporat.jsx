import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import PaymentHeader from '@/Components/Payment/PaymentHeader';
import Footer from '@/Components/Footer';

const benefits = [
    { id: 1, label: '24 Modul Video HD', icon: 'video' },
    { id: 2, label: 'E-Book Perencanaan Keuangan', icon: 'book' },
    { id: 3, label: 'Grup WA Eksklusif Pensiunan', icon: 'group' },
    { id: 4, label: 'Sertifikat Kelulusan Resmi', icon: 'award' },
];

const aboutFeatures = [
    {
        id: 1,
        title: 'Proteksi Aset',
        desc: 'Cara melindungi tabungan dari inflasi dan risiko pasar.',
    },
    {
        id: 2,
        title: 'Arus Kas Pasif',
        desc: 'Menentukan instrumen investasi yang aman untuk pendapatan rutin.',
    },
    {
        id: 3,
        title: 'Perencanaan Waris',
        desc: 'Panduan hukum dan praktis untuk distribusi aset keluarga.',
    },
    {
        id: 4,
        title: 'Dana Kesehatan',
        desc: 'Manajemen asuransi dan biaya medis di usia emas.',
    },
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
        quote: 'Meskipun saya latar belakang perbankan, strategi khusus pensiun di sini sangat relevan dengan kondisi ekonomi saat ini.',
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

function BenefitIcon({ name }) {
    if (name === 'video') {
        return (
            <svg
                className="h-5 w-5 text-[#006B32]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
            >
                <rect x="3" y="5" width="14" height="14" rx="2" />
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 9l4-2v10l-4-2"
                />
            </svg>
        );
    }
    if (name === 'book') {
        return (
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
                    d="M4 5a2 2 0 012-2h12v16H6a2 2 0 00-2 2V5z"
                />
            </svg>
        );
    }
    if (name === 'group') {
        return (
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
                    d="M17 20h5v-1a4 4 0 00-4-4M9 20H4v-1a4 4 0 014-4h2m6-4a3 3 0 11-6 0 3 3 0 016 0zm6 1a2.5 2.5 0 10-3-2.45"
                />
            </svg>
        );
    }
    return (
        <svg
            className="h-5 w-5 text-[#006B32]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
        >
            <circle cx="12" cy="9" r="5" />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 13l-1 8 4-2 4 2-1-8"
            />
        </svg>
    );
}

export default function DetailKelasKorporat({
    course, // Prop untuk menangkap data dari backend
    title = 'Manajemen Keuangan Masa Pensiun',
    rating = '4.8',
    reviewCount = '124',
    duration = '12 Jam',
    price = 'Rp 249.000',
    originalPrice = 'Rp 499.000',
    videoCaption = 'Tonton Cuplikan Kursus: Strategi Alokasi Aset 2024',
    backHref = '/beli-pelatihan',
    scheduleHref = '/korporat/pilih-jadwal',
}) {
    const [qty, setQty] = useState(5);
    const decrement = () => setQty((prev) => (prev > 1 ? prev - 1 : 1));
    const increment = () => setQty((prev) => prev + 1);
    const courseTitle = course?.title || title;
    const coursePrice = course?.price ?? 249000;
    const formattedPrice = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(coursePrice);
    const purchaseHref = `/korporat/pelatihan/${course?.slug || course?.id || ''}/pembelian-online?qty=${qty}`;

    // Mengambil URL video dari lesson pertama (jika datanya ada)
    const videoUrl = course?.lessons?.[0]?.video_url;

    // Helper untuk mengubah URL YouTube biasa menjadi URL Embed agar bisa diputar di iframe
    const getEmbedUrl = (url) => {
        if (!url) return null;
        if (url.includes('youtube.com/watch?v=')) {
            return url.replace('watch?v=', 'embed/');
        }
        if (url.includes('youtu.be/')) {
            return url.replace('youtu.be/', 'youtube.com/embed/');
        }
        return url;
    };

    const embedUrl = getEmbedUrl(videoUrl);

    return (
        <div className="flex min-h-screen flex-col bg-[#FBF9F8] font-['Atkinson_Hyperlegible']">
            <Head title={courseTitle + ' - Pensiun Mudah'} />
            <PaymentHeader />

            <main className="flex-1">
                <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-10">
                    <Link
                        href="/korporat/beli-pelatihan"
                        className="inline-flex items-center gap-2 font-bold text-[#006B32]"
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
                        Kembali ke Beli Pelatihan
                    </Link>

                    <h1 className="mt-6 text-3xl font-bold text-[#1B1C1C] sm:text-4xl">
                        {courseTitle}
                    </h1>
                    <div className="mt-3 flex flex-wrap items-center gap-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FCE9D8] px-3 py-1 text-sm font-bold text-[#1B1C1C]">
                            <svg
                                className="h-4 w-4 text-[#FF8928]"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path d="M10 1.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L10 15.9 4.7 17.6l1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
                            </svg>
                            {rating} ({reviewCount} Review)
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-sm text-[#3D4A3E]">
                            <svg
                                className="h-4 w-4 text-[#006B32]"
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

                    <div className="mt-6 grid gap-6 lg:grid-cols-3">
                        <div className="lg:col-span-2">
                            <div className="relative flex aspect-video items-end overflow-hidden rounded-2xl bg-gradient-to-br from-[#1B3326] to-[#0C1A12] p-6">
                                {embedUrl ? (
                                    <iframe
                                        src={embedUrl}
                                        title="Course Video"
                                        className="absolute inset-0 h-full w-full border-0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                ) : (
                                    <>
                                        <span className="absolute inset-0 flex items-center justify-center">
                                            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#006B32] text-white shadow-lg">
                                                <svg
                                                    className="h-7 w-7"
                                                    fill="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path d="M8 5v14l11-7z" />
                                                </svg>
                                            </span>
                                        </span>
                                        <p className="relative z-10 font-bold text-white">
                                            {videoCaption}
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="rounded-2xl border-2 border-[#006B32] bg-white p-6 shadow-sm">
                            <p className="text-sm text-[#6B7280]">
                                Investasi Ilmu:
                            </p>
                            <p className="mt-1 text-4xl font-extrabold text-[#006B32]">
                                {course ? formattedPrice : price}
                            </p>
                            <p className="text-sm text-[#9AA6A0] line-through">
                                {originalPrice}
                            </p>

                            <ul className="mt-5 space-y-3">
                                {benefits.map((item) => (
                                    <li
                                        key={item.id}
                                        className="flex items-center gap-3 text-sm font-semibold text-[#3D4A3E]"
                                    >
                                        <BenefitIcon name={item.icon} />
                                        {item.label}
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-6 flex items-center justify-center gap-3">
                                <button
                                    type="button"
                                    onClick={decrement}
                                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E4E2E1] text-[#3D4A3E] transition-colors hover:bg-[#F0EDED]"
                                    aria-label="Kurangi jumlah"
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
                                <span className="flex h-9 w-12 items-center justify-center rounded-lg bg-[#FF8928] font-bold text-white">
                                    {qty}
                                </span>
                                <button
                                    type="button"
                                    onClick={increment}
                                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E4E2E1] text-[#3D4A3E] transition-colors hover:bg-[#F0EDED]"
                                    aria-label="Tambah jumlah"
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

                            <Link
                                href={purchaseHref}
                                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-[#FF8928] py-3.5 font-bold text-white transition-colors hover:bg-[#F57F1E]"
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
                                        d="M2 3h3l2.4 12.4a1 1 0 001 .8h8.7a1 1 0 001-.8L21 7H6"
                                    />
                                </svg>
                            </Link>

                            <p className="mt-3 text-center text-xs text-[#9AA6A0]">
                                Akses seumur hidup. Jaminan 7 hari uang kembali.
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 rounded-2xl border border-[#E4E2E1] bg-white p-6 shadow-sm sm:p-8">
                        <h2 className="text-xl font-bold text-[#006B32]">
                            Tentang Kursus Ini
                        </h2>
                        <p className="mt-4 text-[#3D4A3E]">
                            Masa pensiun bukanlah akhir dari produktivitas
                            finansial, melainkan awal dari fase pengelolaan
                            kekayaan yang baru. Kursus ini dirancang khusus
                            untuk membantu Anda memahami cara menjaga nilai
                            aset, mengelola pengeluaran pasca-pensiun, dan
                            memastikan dana Anda cukup untuk gaya hidup impian
                            selamanya.
                        </p>
                        <div className="mt-6 grid gap-5 sm:grid-cols-2">
                            {aboutFeatures.map((item) => (
                                <div key={item.id} className="flex gap-3">
                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#E5F0E9] text-[#006B32]">
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
                                                d="M9 12l2 2 4-4"
                                            />
                                        </svg>
                                    </span>
                                    <div>
                                        <p className="font-bold text-[#1B1C1C]">
                                            {item.title}
                                        </p>
                                        <p className="mt-1 text-sm text-[#3D4A3E]">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8">
                        <h2 className="text-xl font-bold text-[#006B32]">
                            Apa Kata Mereka?
                        </h2>
                        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {testimonials.map((item) => (
                                <div
                                    key={item.id}
                                    className="rounded-2xl border border-[#E4E2E1] bg-[#F6F3F2] p-5"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#006B32] text-sm font-bold text-white">
                                            {getInitials(item.name)}
                                        </span>
                                        <div>
                                            <p className="font-bold text-[#1B1C1C]">
                                                {item.name}
                                            </p>
                                            <p className="text-xs text-[#6B7280]">
                                                {item.role}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="mt-3 text-sm italic text-[#3D4A3E]">
                                        "{item.quote}"
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
