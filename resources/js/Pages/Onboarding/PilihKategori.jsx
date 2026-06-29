import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';

const categories = [
    {
        id: 'publik',
        title: 'Publik',
        desc: 'Untuk individu yang ingin mempersiapkan masa pensiun mandiri.',
        icon: 'user',
    },
    {
        id: 'korporat',
        title: 'Korporat/HRD',
        desc: 'Untuk perusahaan yang mengelola program persiapan pensiun karyawan.',
        icon: 'building',
    },
    {
        id: 'asn',
        title: 'ASN/TNI/Polri',
        desc: 'Untuk anggota TNI dan POLRI yang memasuki masa purna tugas.',
        icon: 'shield',
    },
];

function CategoryIcon({ name }) {
    if (name === 'building') {
        return (
            <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
            >
                <rect x="4" y="3" width="16" height="18" rx="1" />
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 7h2M8 11h2M8 15h2M14 7h2M14 11h2M14 15h2"
                />
            </svg>
        );
    }
    if (name === 'shield') {
        return (
            <svg
                className="h-6 w-6"
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
                    d="M9 12l2 2 4-4"
                />
            </svg>
        );
    }
    return (
        <svg
            className="h-6 w-6"
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
    );
}

export default function PilihKategori() {
    const [selected, setSelected] = useState('publik');

    const selectedCategory = categories.find(
        (category) => category.id === selected,
    );

    // ASN/TNI/Polri langsung diarahkan ke halaman Verifikasi Instansi.
    const goToInstansiVerifikasi = () => {
        router.get('/instansi/verifikasi');
    };

    const handleSelect = (category) => {
        setSelected(category.id);
    };

    const handleSubmit = () => {
        if (!selectedCategory) return;

        if (selected === 'asn') {
            goToInstansiVerifikasi();
            return;
        }

        router.post('/onboarding/kategori', {
            kategori: selected,
        });
    };

    return (
        <div className="flex min-h-screen flex-col bg-[#FBF9F8] font-['Atkinson_Hyperlegible']">
            <Head title="Pilih Kategori Akun - Pensiun Mudah" />
            <header className="border-b border-[#E4E2E1]/60 bg-white px-4 py-4 sm:px-8">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#006B32] text-sm font-extrabold text-white">
                        PM
                    </span>
                    <span className="text-lg font-extrabold">
                        <span className="text-[#006B32]">PENSIUN</span>
                        <span className="text-[#FF8928]">MUDAH</span>
                    </span>
                </Link>
            </header>

            <main className="flex flex-1 items-center justify-center px-4 py-10">
                <div className="w-full max-w-3xl rounded-2xl border border-[#E4E2E1] bg-white p-6 shadow-sm sm:p-10">
                    <h1 className="text-center text-2xl font-bold text-[#1B1C1C] sm:text-3xl">
                        Lengkapi Profil Anda
                    </h1>
                    <p className="mx-auto mt-3 max-w-xl text-center text-[#3D4A3E]">
                        Selamat datang! Silakan pilih kategori akun Anda untuk
                        menyesuaikan pengalaman belajar dan keperluan
                        sertifikat.
                    </p>

                    <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                        {categories.map((category) => {
                            const active = selected === category.id;
                            return (
                                <button
                                    key={category.id}
                                    type="button"
                                    onClick={() => handleSelect(category)}
                                    className={
                                        active
                                            ? 'flex flex-col items-center rounded-2xl border-2 border-[#006B32] bg-white p-6 text-center'
                                            : 'flex flex-col items-center rounded-2xl border border-[#E4E2E1] bg-white p-6 text-center transition-colors hover:border-[#006B32]/40'
                                    }
                                >
                                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F0EDED] text-[#3D4A3E]">
                                        <CategoryIcon name={category.icon} />
                                    </span>
                                    <span className="mt-4 font-bold text-[#006B32]">
                                        {category.title}
                                    </span>
                                    <span className="mt-2 text-sm text-[#3D4A3E]">
                                        {category.desc}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    <div className="mt-8 flex justify-center">
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={!selectedCategory}
                            className="flex w-full max-w-md items-center justify-center gap-2 rounded-lg bg-[#FF8928] px-6 py-3.5 font-bold text-white transition-colors hover:bg-[#F57F1E] disabled:cursor-not-allowed disabled:bg-[#C9C7C5]"
                        >
                            Masuk Sekarang
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
                                    d="M5 12h14M13 6l6 6-6 6"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
