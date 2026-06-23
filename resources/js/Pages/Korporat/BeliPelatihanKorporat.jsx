import { useState } from 'react';
import { Link } from '@inertiajs/react';
import KorporatLayout from '@/Layouts/KorporatLayout';

const onlineCourses = [
    {
        id: 1,
        title: 'Manajemen Investasi Aman untuk Pensiun',
        desc: 'Pelajari cara mengelola aset dan dana pensiun agar tetap...',
        price: 'Rp 199.000',
        rating: '4.9',
        reviews: '120',
    },
    {
        id: 2,
        title: 'Manajemen Investasi Aman untuk Pensiun',
        desc: 'Pelajari cara mengelola aset dan dana pensiun agar tetap...',
        price: 'Rp 199.000',
        rating: '4.9',
        reviews: '120',
    },
    {
        id: 3,
        title: 'Manajemen Investasi Aman untuk Pensiun',
        desc: 'Pelajari cara mengelola aset dan dana pensiun agar tetap...',
        price: 'Rp 199.000',
        rating: '4.9',
        reviews: '120',
    },
];

const offlineCourses = [
    {
        id: 4,
        title: 'Manajemen Investasi Aman untuk Pensiun',
        desc: 'Pelajari cara mengelola aset dan dana pensiun agar tetap...',
        price: 'Rp 199.000',
        rating: '4.9',
        reviews: '120',
        location: 'Gedung Serbaguna Jakarta',
        time: '09:00 - 15:00 WIB',
    },
    {
        id: 5,
        title: 'Manajemen Investasi Aman untuk Pensiun',
        desc: 'Pelajari cara mengelola aset dan dana pensiun agar tetap...',
        price: 'Rp 199.000',
        rating: '4.9',
        reviews: '120',
        location: 'Gedung Serbaguna Jakarta',
        time: '09:00 - 15:00 WIB',
    },
    {
        id: 6,
        title: 'Manajemen Investasi Aman untuk Pensiun',
        desc: 'Pelajari cara mengelola aset dan dana pensiun agar tetap...',
        price: 'Rp 199.000',
        rating: '4.9',
        reviews: '120',
        location: 'Balai Pertemuan Bandung',
        time: '08:30 - 14:00 WIB',
    },
];

const hybridCourses = [
    {
        id: 7,
        title: 'Manajemen Investasi Aman untuk Pensiun',
        desc: 'Pelajari cara mengelola aset dan dana pensiun agar tetap...',
        price: 'Rp 199.000',
        rating: '4.9',
        reviews: '120',
        location: 'Hotel Santika Surabaya',
        time: '10:00 - 16:00 WIB',
    },
    {
        id: 8,
        title: 'Manajemen Investasi Aman untuk Pensiun',
        desc: 'Pelajari cara mengelola aset dan dana pensiun agar tetap...',
        price: 'Rp 199.000',
        rating: '4.9',
        reviews: '120',
        location: 'Hotel Santika Surabaya',
        time: '10:00 - 16:00 WIB',
    },
    {
        id: 9,
        title: 'Manajemen Investasi Aman untuk Pensiun',
        desc: 'Pelajari cara mengelola aset dan dana pensiun agar tetap...',
        price: 'Rp 199.000',
        rating: '4.9',
        reviews: '120',
        location: 'Hotel Santika Surabaya',
        time: '10:00 - 16:00 WIB',
    },
];

const sections = [
    {
        key: 'online',
        label: 'Kelas Online',
        icon: 'laptop',
        courses: onlineCourses,
    },
    {
        key: 'offline',
        label: 'Kelas Offline',
        icon: 'people',
        courses: offlineCourses,
    },
    {
        key: 'hybrid',
        label: 'Kelas Hybrid',
        icon: 'layers',
        courses: hybridCourses,
    },
];

function SectionIcon({ name }) {
    if (name === 'laptop') {
        return (
            <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
            >
                <rect x="4" y="5" width="16" height="11" rx="1" />
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2 20h20"
                />
            </svg>
        );
    }
    if (name === 'people') {
        return (
            <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
            >
                <circle cx="8" cy="9" r="3" />
                <circle cx="17" cy="10" r="2" />
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2 20c0-3 3-5 6-5s6 2 6 5M15 20c0-2 1-3 3-3s3 1 4 3"
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
                d="M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5M3 17l9 5 9-5"
            />
        </svg>
    );
}

function CourseCard({ course }) {
    const [qty, setQty] = useState(5);

    return (
        <div className="flex flex-col overflow-hidden rounded-2xl border border-[#E4E2E1] bg-white shadow-sm">
            <div className="relative flex h-40 items-center justify-center bg-gradient-to-br from-[#3A6B2E] to-[#1F3D17]">
                <span className="absolute left-3 top-3 rounded-md bg-[#C2255C] px-2.5 py-1 text-xs font-bold text-white">
                    KEUANGAN
                </span>
                <svg
                    className="h-12 w-12 text-white/80"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 21c-4-2-7-5-7-9 4 0 7 3 7 7M12 21c4-2 7-5 7-9-4 0-7 3-7 7M12 21V10"
                    />
                </svg>
            </div>
            <div className="flex flex-1 flex-col p-5">
                <h3 className="font-bold text-[#1B1C1C]">{course.title}</h3>
                <p className="mt-1 text-sm text-[#3D4A3E]">{course.desc}</p>

                {course.location ? (
                    <p className="mt-3 flex items-center gap-1.5 text-sm text-[#3D4A3E]">
                        <svg
                            className="h-4 w-4 text-[#006B32]"
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
                        {course.location}
                    </p>
                ) : null}
                {course.time ? (
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-[#3D4A3E]">
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
                        {course.time}
                    </p>
                ) : null}

                <div className="mt-3 flex items-center justify-between">
                    <span className="text-lg font-bold text-[#006B32]">
                        {course.price}
                    </span>
                    <span className="flex items-center gap-1 text-sm font-semibold text-[#A8632A]">
                        <svg
                            className="h-4 w-4"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M12 2l3 6.5 7 .6-5.3 4.6 1.6 6.8L12 17l-6.9 3.5 1.6-6.8L1.4 9.1l7-.6L12 2z" />
                        </svg>
                        {course.rating} ({course.reviews})
                    </span>
                </div>

                <div className="mt-4 flex items-center gap-3">
                    <button
                        type="button"
                        className="flex-1 rounded-lg bg-[#FF8928] px-4 py-2.5 text-sm font-bold leading-tight text-white transition-colors hover:bg-[#F57F1E]"
                    >
                        Beli Pelatihan
                    </button>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setQty(Math.max(1, qty - 1))}
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E4E2E1] font-bold text-[#3D4A3E] hover:bg-[#F0EDED]"
                            aria-label="Kurangi"
                        >
                            -
                        </button>
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FF8928] font-bold text-white">
                            {qty}
                        </span>
                        <button
                            type="button"
                            onClick={() => setQty(qty + 1)}
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E4E2E1] font-bold text-[#3D4A3E] hover:bg-[#F0EDED]"
                            aria-label="Tambah"
                        >
                            +
                        </button>
                    </div>
                </div>

                <Link
                    href={`/pelatihan/${course.id}`}
                    className="mt-3 block w-full rounded-lg border-2 border-[#006B32] py-2.5 text-center font-bold text-[#006B32] transition-colors hover:bg-[#006B32]/5"
                >
                    Lihat Detail
                </Link>
            </div>
        </div>
    );
}

export default function BeliPelatihanKorporat() {
    return (
        <KorporatLayout title="Beli Pelatihan - Pensiun Mudah" activeNav="beli">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-10">
                <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1B5036] to-[#10251B] px-6 py-10 text-white sm:px-10 sm:py-14">
                    <h2 className="text-3xl font-extrabold sm:text-4xl">
                        Spesial Kelas MPP
                    </h2>
                    <p className="mt-2 max-w-md text-white/90">
                        Voucher Potongan 200rb khusus untuk pendaftaran bulan
                        ini.
                    </p>
                    <button
                        type="button"
                        className="mt-6 rounded-full bg-[#FF8928] px-6 py-3 font-bold text-white transition-colors hover:bg-[#F57F1E]"
                    >
                        Gunakan Kode
                    </button>
                    <div className="mt-6 flex gap-1.5">
                        <span className="h-1.5 w-6 rounded-full bg-white" />
                        <span className="h-1.5 w-1.5 rounded-full bg-white/50" />
                    </div>
                </section>

                <div className="mt-8">
                    <h1 className="text-2xl font-bold text-[#1B1C1C] sm:text-3xl">
                        Pilih Modul Pembelajaran Anda
                    </h1>
                    <p className="mt-2 text-[#3D4A3E]">
                        Temukan keterampilan baru untuk masa pensiun yang lebih
                        bermakna dan produktif.
                    </p>
                </div>

                {sections.map((section) => (
                    <section key={section.key} className="mt-8">
                        <h2 className="flex items-center gap-2 text-lg font-bold text-[#1B1C1C]">
                            <span className="text-[#006B32]">
                                <SectionIcon name={section.icon} />
                            </span>
                            {section.label}
                        </h2>
                        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {section.courses.map((course) => (
                                <CourseCard key={course.id} course={course} />
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </KorporatLayout>
    );
}
