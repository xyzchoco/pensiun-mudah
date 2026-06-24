import { Link, usePage } from '@inertiajs/react';
import KorporatLayout from '@/Layouts/KorporatLayout';

const categoryOptions = [
    'Teknologi & Informasi',
    'Keuangan & Perbankan',
    'Kesehatan',
    'Pendidikan',
    'Manufaktur',
    'Lainnya',
];

export default function EditProfilPerusahaan({ profile = {} }) {
    const { auth } = usePage().props;
    const corporateProfile = profile || auth.user.corporate_profile || {};

    const namaPerusahaan = corporateProfile.nama_perusahaan || '';
    const kategori = corporateProfile.kategori_bisnis || '';
    const website = corporateProfile.website || '';
    const email = corporateProfile.email_bisnis || '';
    const telepon = corporateProfile.no_telepon || '';
    const alamat = corporateProfile.alamat_kantor || '';
    const emailPerusahaan = corporateProfile.email_perusahaan || '';
    return (
        <KorporatLayout title="Edit Profil Perusahaan" activeNav="profil">
            <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-10">
                <nav className="flex flex-wrap items-center gap-2 text-sm font-semibold text-[#3D4A3E]">
                    <span>Pengaturan</span>
                    <span className="text-[#9AA6A0]">&rsaquo;</span>
                    <span>Profil Perusahaan</span>
                    <span className="text-[#9AA6A0]">&rsaquo;</span>
                    <span className="text-[#006B32]">Edit</span>
                </nav>

                <h1 className="mt-3 text-3xl font-bold text-[#1B1C1C]">
                    Edit Profil Perusahaan
                </h1>
                <p className="mt-2 text-[#3D4A3E]">
                    Perbarui informasi entitas bisnis Anda untuk keperluan
                    administrasi dan laporan.
                </p>

                <div className="mt-6 rounded-2xl border border-[#E4E2E1] bg-white p-6 shadow-sm sm:p-8">
                    <div className="flex flex-col items-center gap-5 sm:flex-row">
                        <div className="relative shrink-0">
                            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#0E3A2E] text-white">
                                <svg
                                    className="h-9 w-9 text-[#FF8928]"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" />
                                </svg>
                            </div>
                            <span className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-[#006B32] text-white">
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
                                        d="M16.5 3.5a2.1 2.1 0 013 3L8 18l-4 1 1-4 11.5-11.5z"
                                    />
                                </svg>
                            </span>
                        </div>
                        <div className="text-center sm:text-left">
                            <h2 className="text-xl font-bold text-[#1B1C1C]">
                                Logo Perusahaan
                            </h2>
                            <p className="mt-1 text-sm text-[#3D4A3E]">
                                Gunakan logo dengan format PNG atau JPG, minimal
                                400x400px.
                            </p>
                            <button
                                type="button"
                                className="mt-3 rounded-lg border border-[#006B32] px-5 py-2.5 font-bold text-[#006B32] transition-colors hover:bg-[#F0EDED]"
                            >
                                Ubah Foto
                            </button>
                        </div>
                    </div>

                    <hr className="my-8 border-[#E4E2E1]" />

                    <div className="grid gap-6 sm:grid-cols-2">
                        <div>
                            <label
                                className="text-sm font-bold text-[#1B1C1C]"
                                htmlFor="nama"
                            >
                                Nama Perusahaan
                            </label>
                            <input
                                id="nama"
                                type="text"
                                defaultValue={namaPerusahaan}
                                className="mt-2 w-full rounded-lg border border-[#E4E2E1] bg-white px-4 py-3 text-[#1B1C1C] outline-none focus:border-[#006B32] focus:ring-2 focus:ring-[#006B32]/20"
                            />
                        </div>
                        <div>
                            <label
                                className="text-sm font-bold text-[#1B1C1C]"
                                htmlFor="kategori"
                            >
                                Kategori Bisnis
                            </label>
                            <div className="relative mt-2">
                                <select
                                    id="kategori"
                                    defaultValue={kategori}
                                    className="w-full appearance-none rounded-lg border border-[#E4E2E1] bg-white px-4 py-3 pr-10 text-[#1B1C1C] outline-none focus:border-[#006B32] focus:ring-2 focus:ring-[#006B32]/20"
                                >
                                    {categoryOptions.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                                <svg
                                    className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#3D4A3E]"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M8 9l4 4 4-4"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div>
                            <label
                                className="text-sm font-bold text-[#1B1C1C]"
                                htmlFor="website"
                            >
                                Website Perusahaan
                            </label>
                            <input
                                id="website"
                                type="url"
                                defaultValue={website}
                                className="mt-2 w-full rounded-lg border border-[#E4E2E1] bg-white px-4 py-3 text-[#1B1C1C] outline-none focus:border-[#006B32] focus:ring-2 focus:ring-[#006B32]/20"
                            />
                        </div>
                        <div>
                            <label
                                className="text-sm font-bold text-[#1B1C1C]"
                                htmlFor="email"
                            >
                                Email Bisnis
                            </label>
                            <input
                                id="email"
                                type="email"
                                defaultValue={email}
                                className="mt-2 w-full rounded-lg border border-[#E4E2E1] bg-white px-4 py-3 text-[#1B1C1C] outline-none focus:border-[#006B32] focus:ring-2 focus:ring-[#006B32]/20"
                            />
                        </div>
                        <div>
                            <label
                                className="text-sm font-bold text-[#1B1C1C]"
                                htmlFor="telepon"
                            >
                                Nomor Telepon
                            </label>
                            <input
                                id="telepon"
                                type="tel"
                                defaultValue={telepon}
                                className="mt-2 w-full rounded-lg border border-[#E4E2E1] bg-white px-4 py-3 text-[#1B1C1C] outline-none focus:border-[#006B32] focus:ring-2 focus:ring-[#006B32]/20"
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label
                                className="text-sm font-bold text-[#1B1C1C]"
                                htmlFor="alamat"
                            >
                                Alamat Kantor Pusat
                            </label>
                            <textarea
                                id="alamat"
                                rows={4}
                                defaultValue={alamat}
                                className="mt-2 w-full resize-none rounded-lg border border-[#E4E2E1] bg-white px-4 py-3 text-[#1B1C1C] outline-none focus:border-[#006B32] focus:ring-2 focus:ring-[#006B32]/20"
                            />
                        </div>
                    </div>

                    <hr className="my-8 border-[#E4E2E1]" />

                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                        <Link
                            href="/korporat/profil-perusahaan"
                            className="rounded-lg border border-[#006B32] px-6 py-3 text-center font-bold text-[#006B32] transition-colors hover:bg-[#F0EDED]"
                        >
                            Batal
                        </Link>
                        <button
                            type="button"
                            className="rounded-lg bg-[#FF8928] px-6 py-3 font-bold text-white transition-colors hover:bg-[#F57F1E]"
                        >
                            Simpan Perubahan
                        </button>
                    </div>
                </div>
            </div>
        </KorporatLayout>
    );
}
