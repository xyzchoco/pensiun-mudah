import { Head, Link } from '@inertiajs/react';
import HrdHeader from '@/Components/Korporat/HrdHeader';
import Footer from '@/Components/Footer';

const purchasedCourses = [
    {
        id: 1,
        title: 'Manajemen Keuangan',
        participants: 124,
        slug: 'manajemen-keuangan',
    },
    {
        id: 2,
        title: 'Kesehatan Senior',
        participants: 89,
        slug: 'kesehatan-senior',
    },
    {
        id: 3,
        title: 'Persiapan Mental',
        participants: 210,
        slug: 'persiapan-mental',
    },
    {
        id: 4,
        title: 'Kewirausahaan',
        participants: 56,
        slug: 'kewirausahaan',
    },
    {
        id: 5,
        title: 'Investasi Aman',
        participants: 42,
        slug: 'investasi-aman',
    },
    {
        id: 6,
        title: 'Hukum & Waris',
        participants: 31,
        slug: 'hukum-waris',
    },
    {
        id: 7,
        title: 'Teknologi Dasar',
        participants: 112,
        slug: 'teknologi-dasar',
    },
    {
        id: 8,
        title: 'Hobi Produktif',
        participants: 75,
        slug: 'hobi-produktif',
    },
];

export default function PelatihanDibeli({ backHref = '/korporat/dashboard' }) {
    return (
        <div className="flex min-h-screen flex-col bg-[#FBF9F8] font-['Atkinson_Hyperlegible']">
            <Head title="Daftar Pelatihan Yang Anda Beli - Pensiun Mudah" />
            <HrdHeader />

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
                        Kembali ke Dashboard
                    </Link>

                    <h1 className="mt-6 text-3xl font-bold text-[#1B1C1C]">
                        Daftar Pelatihan Yang Anda Beli
                    </h1>
                    <p className="mt-2 max-w-2xl text-[#3D4A3E]">
                        Kelola seluruh Pelatihan yang telah dibeli untuk program
                        persiapan masa purna Pensiun karyawan Anda.
                    </p>

                    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {purchasedCourses.map((course) => (
                            <div
                                key={course.id}
                                className="flex flex-col overflow-hidden rounded-2xl border border-[#E4E2E1] bg-white shadow-sm"
                            >
                                <div className="relative h-40 bg-gradient-to-br from-[#1B3326] to-[#0C1A12]">
                                    <span className="absolute left-3 top-3 rounded-full bg-[#006B32] px-3 py-1 text-xs font-bold text-white">
                                        Aktif
                                    </span>
                                </div>
                                <div className="flex flex-1 flex-col p-5">
                                    <h3 className="text-lg font-bold leading-snug text-[#1B1C1C]">
                                        {course.title}
                                    </h3>
                                    <hr className="my-4 border-[#E4E2E1]" />
                                    <div className="mt-auto flex items-center justify-between">
                                        <span className="flex items-center gap-1.5 text-sm text-[#3D4A3E]">
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
                                                    d="M17 20h5v-1a4 4 0 00-4-4M9 20H4v-1a4 4 0 014-4h2m6-4a3 3 0 11-6 0 3 3 0 016 0zm6 1a2.5 2.5 0 10-3-2.45"
                                                />
                                            </svg>
                                            {course.participants} Peserta
                                        </span>
                                        <Link
                                            href={`/korporat/modul/${course.slug}`}
                                            className="inline-flex items-center gap-1 text-sm font-bold text-[#006B32] hover:underline"
                                        >
                                            Lihat
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
                                                    d="M9 5l7 7-7 7"
                                                />
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
