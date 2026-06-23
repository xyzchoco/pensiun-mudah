import { Link } from '@inertiajs/react';
import KorporatLayout from '@/Layouts/KorporatLayout';

const companyFields = [
    {
        label: 'Nama Perusahaan',
        value: 'PT. Sejahtera Utama',
        highlight: true,
        span: 1,
    },
    {
        label: 'Kategori Bisnis',
        value: 'Manufaktur & Logistik',
        highlight: false,
        span: 1,
    },
    {
        label: 'Website Perusahaan',
        value: 'www.sejahterautama.co.id',
        highlight: false,
        link: true,
        span: 1,
    },
    {
        label: 'Alamat Kantor Pusat',
        value: 'Jl. Sudirman No. 45, Kav. 12, Jakarta Selatan, 12190, Indonesia',
        highlight: true,
        span: 2,
    },
    {
        label: 'Nomor Telepon',
        value: '(021) 555-0123',
        highlight: false,
        span: 1,
    },
    {
        label: 'Email Bisnis',
        value: 'corporate@sejahtera.co.id',
        highlight: false,
        span: 1,
    },
];

export default function ProfilPerusahaan() {
    return (
        <KorporatLayout
            title="Profil Perusahaan - Pensiun Mudah"
            activeNav="profil"
            showHeader={false}
        >
            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-10">
                <h1 className="text-2xl font-bold text-[#1B1C1C] sm:text-3xl">
                    Profil Perusahaan
                </h1>

                <div className="mt-6 rounded-2xl border border-[#E4E2E1] bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-[#3A6B8E] to-[#1F3D55]">
                            <button
                                type="button"
                                className="absolute bottom-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#006B32] text-white"
                                aria-label="Ubah foto"
                            >
                                <svg
                                    className="h-3.5 w-3.5"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M4 20h4l10-10-4-4L4 16v4zM13 6l4 4"
                                    />
                                </svg>
                            </button>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-[#1B1C1C]">
                                PT. Sejahtera Utama
                            </h2>
                            <p className="mt-1 flex items-center gap-1.5 text-sm text-[#3D4A3E]">
                                <svg
                                    className="h-4 w-4"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <rect
                                        x="4"
                                        y="3"
                                        width="16"
                                        height="18"
                                        rx="1"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M8 7h2M8 11h2M8 15h2M14 7h2M14 11h2M14 15h2"
                                    />
                                </svg>
                                Manufaktur & Logistik
                            </p>
                            <div className="mt-3 flex flex-wrap gap-2">
                                <span className="rounded-full bg-[#E5F0E9] px-3 py-1 text-xs font-bold text-[#006B32]">
                                    PREMIUM MEMBER
                                </span>
                                <span className="rounded-full bg-[#F0EDED] px-3 py-1 text-xs font-bold text-[#6B7280]">
                                    250+ KARYAWAN
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 rounded-2xl border border-[#E4E2E1] bg-white p-6 shadow-sm sm:p-8">
                    <h2 className="flex items-center gap-2 text-lg font-bold text-[#1B1C1C]">
                        <svg
                            className="h-5 w-5 text-[#006B32]"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                            <circle cx="12" cy="12" r="9" />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 11v5M12 8h.01"
                            />
                        </svg>
                        Informasi Perusahaan
                    </h2>

                    <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
                        {companyFields.map((field) => (
                            <div
                                key={field.label}
                                className={
                                    field.span === 2 ? 'lg:col-span-2' : ''
                                }
                            >
                                <label
                                    className={`block font-bold ${field.highlight ? 'text-[#006B32]' : 'text-[#1B1C1C]'}`}
                                >
                                    {field.label}
                                </label>
                                <div
                                    className={`mt-2 rounded-lg border px-4 py-3 ${field.highlight ? 'border-[#006B32] bg-white' : 'border-[#E4E2E1] bg-[#FBF9F8]'}`}
                                >
                                    <span
                                        className={
                                            field.link
                                                ? 'font-semibold text-[#006B32]'
                                                : field.highlight
                                                  ? 'font-bold text-[#1B1C1C]'
                                                  : 'text-[#3D4A3E]'
                                        }
                                    >
                                        {field.value}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 flex flex-col gap-3 border-t border-[#E4E2E1] pt-6 sm:flex-row">
                        <button
                            type="button"
                            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#FF8928] px-6 py-3.5 font-bold text-white transition-colors hover:bg-[#F57F1E]"
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
                                    d="M4 20h4l10-10-4-4L4 16v4zM13 6l4 4"
                                />
                            </svg>
                            Edit Profil Perusahaan
                        </button>
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="flex flex-1 items-center justify-center gap-2 rounded-lg border-2 border-[#DC2626] px-6 py-3.5 font-bold text-[#DC2626] transition-colors hover:bg-[#FEE2E2]"
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
                                    d="M15 12H3M9 8l-4 4 4 4M14 4h5a1 1 0 011 1v14a1 1 0 01-1 1h-5"
                                />
                            </svg>
                            Keluar (Logout)
                        </Link>
                    </div>
                </div>
            </div>
        </KorporatLayout>
    );
}
