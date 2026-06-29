import { Link } from '@inertiajs/react';
import InstansiLayout from '@/Layouts/InstansiLayout';

// HAPUS DATA DUMMY, TANGKAP DATA DARI PROPS INERTIA
export default function PelatihanDibeli({
    purchasedCourses = [],
    backHref = '/instansi/dashboard',
}) {
    return (
        <InstansiLayout
            title="Daftar Pelatihan Yang Anda Beli - Pensiun Mudah"
            activeNav="dashboard"
            searchPlaceholder="Cari pelatihan..."
        >
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
                    {purchasedCourses.length > 0 ? (
                        purchasedCourses.map((course, index) => (
                            <div
                                key={index}
                                className="flex flex-col overflow-hidden rounded-2xl border border-[#E4E2E1] bg-white shadow-sm"
                            >
                                {/* Bagian Gambar / Thumbnail */}
                                <div className="relative h-40 bg-gradient-to-br from-[#1B3326] to-[#0C1A12]">
                                    {course.thumbnail && (
                                        <img
                                            src={`/storage/${course.thumbnail.replace(/^public\//, '')}`}
                                            alt={course.title}
                                            className="h-full w-full object-cover opacity-90"
                                        />
                                    )}
                                    <span className="absolute left-3 top-3 rounded-full bg-[#006B32] px-3 py-1 text-xs font-bold text-white z-10">
                                        Aktif
                                    </span>
                                </div>

                                {/* Bagian Konten */}
                                <div className="flex flex-1 flex-col p-5">
                                    <h3 className="text-lg font-bold leading-snug text-[#1B1C1C] line-clamp-2">
                                        {course.title}
                                    </h3>
                                    <hr className="my-4 border-[#E4E2E1]" />

                                    <div className="mt-auto flex items-center justify-between">
                                        <span className="flex items-center gap-1.5 text-sm font-semibold text-[#6B7280]">
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
                                            {/* Tampilkan format Terpakai / Total Kuota */}
                                            {course.used_count} /{' '}
                                            {course.max_uses} Peserta
                                        </span>

                                        <Link
                                            href={`/instansi/modul/${course.slug}`}
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
                        ))
                    ) : (
                        <div className="col-span-full rounded-2xl border-2 border-dashed border-[#E4E2E1] py-16 text-center">
                            <p className="text-lg font-bold text-[#1B1C1C]">
                                Belum Ada Pelatihan
                            </p>
                            <p className="mt-1 text-sm text-[#6B7280]">
                                Perusahaan Anda belum memiliki riwayat pembelian
                                pelatihan.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </InstansiLayout>
    );
}
