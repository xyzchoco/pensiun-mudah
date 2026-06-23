import { Head, Link } from '@inertiajs/react';
import LandingHeader from '@/Components/Landing/LandingHeader';
import Footer from '@/Components/Footer';

const categories = [
    'Semua Modul',
    'Keuangan',
    'Kesehatan',
    'Psikologi',
    'Kewirausahaan',
];

const courses = [
    {
        id: 1,
        category: 'Psikologi',
        badgeClass: 'bg-[#C2255C]',
        title: 'Manajemen Investasi Aman untuk Pensiunan',
        desc: 'Pelajari cara mengelola aset dan dana pensiun agar tetap...',
        price: 'Rp 199.000',
        isFree: false,
        rating: '4.9',
        reviews: '120',
    },
    {
        id: 2,
        category: 'keuangan',
        badgeClass: 'bg-[#006B32]',
        title: 'Pola Hidup Sehat di Usia 50+',
        desc: 'Panduan nutrisi dan aktivitas fisik ringan yang dirancang...',
        price: 'GRATIS',
        isFree: true,
        rating: '4.8',
        reviews: '245',
    },
    {
        id: 3,
        category: 'Kesehatan',
        badgeClass: 'bg-[#FF8928]',
        title: 'Membangun UMKM dari Hobi',
        desc: 'Ubah hobi menjadi penghasilan tambahan dengan strategi...',
        price: 'Rp 249.000',
        isFree: false,
        rating: '5.0',
        reviews: '89',
    },
];

const pageNumbers = [1, 2, 3];
const lastPage = 8;

export default function KatalogPelatihan({ backHref = '/' }) {
    return (
        <div className="flex min-h-screen flex-col bg-[#FBF9F8] font-['Atkinson_Hyperlegible']">
            <Head title="Katalog Pelatihan - Pensiun Mudah" />
            <LandingHeader loginHref="/login" registerHref="/register" />

            <main className="flex-1">
                <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-10">
                    <Link
                        href="/"
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
                        Kembali ke Halaman Awal
                    </Link>

                    <div className="relative mt-6 overflow-hidden rounded-3xl bg-gradient-to-r from-[#0A5C2C] to-[#2E9D5B] p-8 sm:p-12">
                        <h2 className="text-3xl font-bold text-white sm:text-4xl">
                            Spesial Kelas MPP
                        </h2>
                        <p className="mt-3 max-w-md text-white/90">
                            Voucher Potongan 200rb khusus untuk pendaftaran
                            bulan ini.
                        </p>
                        <button
                            type="button"
                            className="mt-6 rounded-full bg-[#FF8928] px-6 py-3 font-bold text-white transition-colors hover:bg-[#F57F1E]"
                        >
                            Gunakan Kode
                        </button>
                    </div>
                    <div className="mt-4 flex justify-center gap-2">
                        <span className="h-2 w-6 rounded-full bg-[#006B32]" />
                        <span className="h-2 w-2 rounded-full bg-[#E4E2E1]" />
                    </div>

                    <h1 className="mt-10 text-3xl font-bold text-[#1B1C1C]">
                        Katalog Pelatihan
                    </h1>
                    <p className="mt-3 max-w-2xl text-[#3D4A3E]">
                        Temukan berbagai program pelatihan yang dirancang khusus
                        untuk mempersiapkan masa pensiun Anda dengan lebih
                        percaya diri, produktif, dan bermakna.
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">
                        {categories.map((category, index) => (
                            <button
                                key={category}
                                type="button"
                                className={`rounded-full px-5 py-2.5 text-sm font-bold transition-colors ${index === 0 ? 'bg-[#006B32] text-white' : 'bg-[#F0EDED] text-[#3D4A3E] hover:bg-[#E4E2E1]'}`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {courses.map((course) => (
                            <div
                                key={course.id}
                                className="flex flex-col overflow-hidden rounded-2xl border border-[#E4E2E1] bg-white shadow-sm"
                            >
                                <div className="relative h-44 bg-gradient-to-br from-[#1B3326] to-[#0C1A12]">
                                    <span
                                        className={`absolute left-3 top-3 rounded-md px-3 py-1 text-xs font-bold text-white ${course.badgeClass}`}
                                    >
                                        {course.category}
                                    </span>
                                </div>
                                <div className="flex flex-1 flex-col p-5">
                                    <h3 className="font-bold leading-snug text-[#1B1C1C]">
                                        {course.title}
                                    </h3>
                                    <p className="mt-2 flex-1 text-sm text-[#3D4A3E]">
                                        {course.desc}
                                    </p>
                                    <div className="mt-4 flex items-center justify-between">
                                        <span className="font-bold text-[#006B32]">
                                            {course.isFree
                                                ? 'GRATIS'
                                                : course.price}
                                        </span>
                                        <span className="flex items-center gap-1 text-sm text-[#3D4A3E]">
                                            <svg
                                                className="h-4 w-4 text-[#FF8928]"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M10 1.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L10 15.9 4.7 17.6l1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
                                            </svg>
                                            {course.rating} ({course.reviews})
                                        </span>
                                    </div>
                                    <Link
                                        href="/register"
                                        className="mt-4 block w-full rounded-lg bg-[#FF8928] py-3 font-bold text-white text-center transition-colors hover:bg-[#F57F1E]"
                                    >
                                        Daftar Sekarang
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 flex items-center justify-center gap-2">
                        <button
                            type="button"
                            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#E4E2E1] text-[#3D4A3E] transition-colors hover:bg-[#F0EDED]"
                            aria-label="Halaman sebelumnya"
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
                        {pageNumbers.map((page) => (
                            <button
                                key={page}
                                type="button"
                                className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold transition-colors ${page === 1 ? 'bg-[#006B32] text-white' : 'border border-[#E4E2E1] text-[#3D4A3E] hover:bg-[#F0EDED]'}`}
                            >
                                {page}
                            </button>
                        ))}
                        <span className="px-1 text-[#6B7280]">...</span>
                        <button
                            type="button"
                            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#E4E2E1] text-sm font-bold text-[#3D4A3E] transition-colors hover:bg-[#F0EDED]"
                        >
                            {lastPage}
                        </button>
                        <button
                            type="button"
                            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#E4E2E1] text-[#3D4A3E] transition-colors hover:bg-[#F0EDED]"
                            aria-label="Halaman berikutnya"
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
            </main>

            <Footer />
        </div>
    );
}
